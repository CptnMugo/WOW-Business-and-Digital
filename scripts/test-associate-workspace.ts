import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";
import type { AddressInfo } from "node:net";
const previous = process.cwd(),
  temp = fs.mkdtempSync(path.join(os.tmpdir(), "wbd-portal-"));
process.chdir(temp);
process.env.APP_URL = "http://localhost:3000";
process.env.MAIL_PROVIDER = "resend";
process.env.RESEND_API_KEY = "test";
process.env.RESEND_FROM = "test@example.com";
process.env.ASSOCIATE_DIRECTOR_EMAILS = "director@example.com";
const nativeFetch = globalThis.fetch;
const mails: any[] = [];
globalThis.fetch = (async (url: any, options: any) => {
  if (String(url) === "https://api.resend.com/emails") {
    mails.push(JSON.parse(options.body));
    return new Response(JSON.stringify({ id: "fake" }), { status: 200 });
  }
  if (!String(url).startsWith("http://127.0.0.1:"))
    throw new Error("External network denied");
  return nativeFetch(url, options);
}) as typeof fetch;
const {
  installAssociateWorkspace,
  readAssociateWorkspace,
  deliverAssociateNotices,
  queueAssociateReminders,
} = await import("../server/associateWorkspace.js");
const { installAdmissionsDashboard, createAdmissionsUser } =
  await import("../server/admissionsDashboard.js");
const app = express();
app.use(express.json({ limit: "7mb" }));
installAssociateWorkspace(app);
installAdmissionsDashboard(app);
const server = app.listen(0, "127.0.0.1");
await new Promise<void>((r) => server.once("listening", r));
const root = "http://127.0.0.1:" + (server.address() as AddressInfo).port;
const base = "/api/associate-portal",
  admin = "/api/admissions-dashboard/associate-portal";
let checks = 0;
async function request(
  url: string,
  body?: any,
  cookie = "",
  origin = "http://localhost:3000",
) {
  return fetch(root + url, {
    method: body ? "POST" : "GET",
    headers: {
      ...(body ? { "Content-Type": "application/json", Origin: origin } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}
async function expect(url: string, body: any, cookie: string, status: number) {
  const r = await request(url, body, cookie);
  assert.equal(r.status, status, await r.clone().text());
  checks++;
  return r;
}
async function staff(email: string) {
  await createAdmissionsUser(email, "Test Staff", "test-password-long-12345");
  const r = await expect(
    "/api/admissions-dashboard/login",
    { email, password: "test-password-long-12345" },
    "",
    200,
  );
  return r.headers.get("set-cookie")!.split(";")[0];
}
async function login(email: string) {
  await expect(base + "/request-code", { email }, "", 200);
  const mail = mails
    .filter((m) => m.to.includes(email) && m.subject.includes("sign-in"))
    .at(-1);
  assert.ok(mail);
  const code = mail.text.match(/[a-f0-9]{48}/)[0];
  const r = await expect(base + "/login", { email, code }, "", 200);
  await expect(base + "/login", { email, code }, "", 400);
  return r.headers.get("set-cookie")!.split(";")[0];
}
try {
  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(
    "data/enquiries.jsonl",
    ["a", "b"]
      .map((id) =>
        JSON.stringify({
          id,
          category: "associate",
          contact: { firstName: id, email: id + "@example.com" },
          details: { expertise: "QA" },
        }),
      )
      .join("\n"),
  );
  await expect(base + "/dashboard", undefined, "", 401);
  await expect(admin, undefined, "", 401);
  const director = await staff("director@example.com"),
    otherStaff = await staff("staff@example.com");
  await expect(admin, undefined, otherStaff, 403);
  assert.equal(
    (
      await request(
        admin + "/action",
        { action: "invite", id: "a" },
        director,
        "https://evil.example",
      )
    ).status,
    403,
  );
  checks++;
  await expect(admin + "/action", { action: "invite", id: "a" }, director, 200);
  await expect(admin + "/action", { action: "invite", id: "b" }, director, 200);
  await expect(
    admin + "/action",
    { action: "invite", id: "invented" },
    director,
    400,
  );
  const a = await login("a@example.com"),
    b = await login("b@example.com");
  assert.equal(
    (
      await request(
        base + "/profile",
        { profile: "test" },
        a,
        "https://evil.example",
      )
    ).status,
    403,
  );
  checks++;
  await expect(
    base + "/proposals",
    {
      kind: "eoi",
      workId: "WBD-001",
      text: "I can deliver QA and provide evidence.",
    },
    a,
    200,
  );
  await expect(
    base + "/proposals",
    { kind: "eoi", workId: "WBD-002", text: "word ".repeat(5001) },
    a,
    400,
  );
  const t = Date.now();
  const work = {
    action: "work",
    title: "Test QA",
    summary: "Test scope",
    outputs: "Test report",
    hours: "5–8/week",
    duration: "4 weeks",
    fee: "USD 50/week",
    category: "WBD-001",
    kind: "internal",
    openAt: new Date(t - 60000).toISOString(),
    bidsCloseAt: new Date(t + 60000).toISOString(),
    startsAt: new Date(t + 3600000).toISOString(),
    finishesAt: new Date(t + 28 * 86400000).toISOString(),
    status: "open",
  };
  await expect(admin + "/action", work, director, 200);
  const workId = readAssociateWorkspace().work[0].id;
  await expect(
    base + "/proposals",
    { kind: "bid", workId, text: "QA approach." },
    a,
    400,
  );
  const approval = {
    action: "member",
    id: "a",
    version: 0,
    status: "approved",
    categories: ["WBD-001"],
    inductionPassed: true,
    onboardingApproved: true,
    clientApproved: false,
    evidence: "Verified attendance and assessment",
  };
  await expect(admin + "/action", approval, director, 400);
  await expect(base + "/induction", { read: true, rsvp: "attending" }, a, 200);
  await expect(admin + "/action", { ...approval, version: 1 }, director, 200);
  await expect(
    base + "/proposals",
    { kind: "bid", workId, text: "QA approach, evidence and availability." },
    a,
    200,
  );
  const bid = readAssociateWorkspace().proposals.find((p) => p.kind === "bid")!;
  await expect(
    admin + "/action",
    { action: "award", id: bid.id },
    otherStaff,
    403,
  );
  await expect(
    admin + "/action",
    { action: "award", id: bid.id },
    director,
    200,
  );
  await expect(
    admin + "/action",
    { action: "award", id: bid.id },
    director,
    400,
  );
  let assignment = readAssociateWorkspace().assignments[0];
  const action = base + "/assignments/" + assignment.id + "/action";
  await expect(
    action,
    { action: "message", version: 0, text: "B tries private access" },
    b,
    400,
  );
  await expect(
    action,
    { action: "message", version: 0, text: "Private QA question" },
    a,
    200,
  );
  await expect(
    action,
    { action: "message", version: 0, text: "Stale overwrite" },
    a,
    400,
  );
  let view = await (
    await expect(base + "/dashboard", undefined, b, 200)
  ).json();
  assert.equal(view.assignments.length, 0);
  assert.equal(view.proposals.length, 0);
  checks += 2;
  await expect(
    base + "/assignments/" + assignment.id + "/file",
    {
      name: "qa.txt",
      base64: Buffer.from("test QA content").toString("base64"),
      version: 1,
    },
    a,
    200,
  );
  assignment = readAssociateWorkspace().assignments[0];
  const fileUrl =
    base + "/assignments/" + assignment.id + "/files/" + assignment.files[0].id;
  await expect(fileUrl, undefined, b, 404);
  await expect(fileUrl, undefined, "", 401);
  await expect(fileUrl, undefined, a, 200);
  view = await (await request(base + "/dashboard", undefined, a)).json();
  assert.equal("storageName" in view.assignments[0].files[0], false);
  checks++;
  await expect(
    action,
    { action: "invoice", version: 2, number: "INV-1", amount: "200" },
    a,
    400,
  );
  await expect(
    action,
    { action: "deliverable", version: 2, text: "QA completed; see qa.txt" },
    a,
    200,
  );
  await expect(
    admin + "/action",
    {
      action: "assignment",
      id: assignment.id,
      version: 3,
      status: "completed",
      message: "Accepted QA outputs",
    },
    director,
    200,
  );
  await expect(
    action,
    { action: "invoice", version: 4, number: "INV-1", amount: "200" },
    a,
    200,
  );
  await expect(
    admin + "/action",
    {
      action: "assignment",
      id: assignment.id,
      version: 5,
      invoiceStatus: "paid",
      note: "Invalid early payment status",
    },
    director,
    400,
  );
  await expect(
    admin + "/action",
    {
      action: "assignment",
      id: assignment.id,
      version: 5,
      invoiceStatus: "accepted",
      note: "Work and invoice accepted",
    },
    director,
    200,
  );
  const invoice = readAssociateWorkspace().assignments[0].invoice!;
  assert.ok(
    Math.abs(Date.parse(invoice.dueAt!) - Date.now() - 7 * 86400000) < 5000,
  );
  checks++;
  await expect(
    admin + "/action",
    { ...work, title: "Client assignment", kind: "client" },
    director,
    200,
  );
  const clientId = readAssociateWorkspace().work[1].id;
  await expect(
    base + "/proposals",
    { kind: "bid", workId: clientId, text: "Try without accreditation" },
    a,
    400,
  );
  await expect(
    admin + "/action",
    {
      ...work,
      title: "Closed assignment",
      bidsCloseAt: new Date(t - 1000).toISOString(),
    },
    director,
    200,
  );
  const closedId = readAssociateWorkspace().work[2].id;
  await expect(
    base + "/proposals",
    { kind: "bid", workId: closedId, text: "Try after close" },
    a,
    400,
  );
  const existingAssignment = readAssociateWorkspace().assignments[0];
  await expect(
    admin + "/assignments/" + existingAssignment.id + "/file",
    {
      version: existingAssignment.version,
      name: "brief.txt",
      base64: Buffer.from("Private Director brief").toString("base64"),
    },
    director,
    200,
  );
  const directorFile = readAssociateWorkspace().assignments[0].files.at(-1)!;
  await expect(
    base +
      "/assignments/" +
      existingAssignment.id +
      "/files/" +
      directorFile.id,
    undefined,
    a,
    200,
  );
  await expect(
    base +
      "/assignments/" +
      existingAssignment.id +
      "/files/" +
      directorFile.id,
    undefined,
    b,
    404,
  );
  await expect(
    admin +
      "/assignments/" +
      existingAssignment.id +
      "/files/" +
      directorFile.id,
    undefined,
    otherStaff,
    403,
  );
  await expect(
    admin + "/action",
    { ...work, title: "Withdrawal check" },
    director,
    200,
  );
  const withdrawalWork = readAssociateWorkspace().work.at(-1)!;
  await expect(
    base + "/proposals",
    { kind: "bid", workId: withdrawalWork.id, text: "Withdrawal check" },
    a,
    200,
  );
  const withdrawBid = readAssociateWorkspace().proposals.at(-1)!;
  await expect(base + "/proposals/" + withdrawBid.id + "/withdraw", {}, b, 400);
  await expect(base + "/proposals/" + withdrawBid.id + "/withdraw", {}, a, 200);
  await expect(
    base + "/proposals",
    {
      kind: "bid",
      workId: withdrawalWork.id,
      text: "Revised proposal after withdrawal",
    },
    a,
    200,
  );
  const before = readAssociateWorkspace().notices.length;
  queueAssociateReminders();
  const after = readAssociateWorkspace().notices.length;
  queueAssociateReminders();
  assert.equal(readAssociateWorkspace().notices.length, after);
  assert.ok(after >= before);
  checks += 2;
  await deliverAssociateNotices();
  assert.ok(
    readAssociateWorkspace().notices.every((n) => n.email === "accepted"),
  );
  checks++;
  const untouchedSession = await login("a@example.com");
  const member = readAssociateWorkspace().members.find((m) => m.id === "a")!;
  await expect(
    admin + "/action",
    { ...approval, version: member.version, status: "revoked" },
    director,
    200,
  );
  await expect(base + "/dashboard", undefined, a, 401);
  await expect(fileUrl, undefined, a, 401);
  await expect(
    admin + "/action",
    { ...approval, version: member.version + 1, status: "approved" },
    director,
    200,
  );
  await expect(base + "/dashboard", undefined, untouchedSession, 401);
  assert.ok(readAssociateWorkspace().audit.length > 10);
  assert.equal(
    JSON.parse(fs.readFileSync("data/enquiries.jsonl", "utf8").split("\n")[0])
      .id,
    "a",
  );
  checks += 2;
  console.log(
    `PASS: ${checks} portal checks; invitation login, code replay, Director permissions, CSRF, EOI/bid gates, client accreditation, deadlines, private records/files, invoice timing, reminders, revocation and historical record preservation. All email mocked.`,
  );
} finally {
  server.close();
  process.chdir(previous);
  fs.rmSync(temp, { recursive: true, force: true });
}
