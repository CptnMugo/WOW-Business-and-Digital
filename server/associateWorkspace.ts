import type { Express, Request, Response, NextFunction } from "express";
import fs from "node:fs";
import path from "node:path";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { sendOutboundEmail } from "./admissionsService.js";
import { businessSender } from "./websiteEnquiries.js";
import {
  assessBidEligibility,
  countWords,
  validateOpportunityDates,
} from "./associatePortalRules.js";
import { catalogue, commercialTerms } from "../src/associate/catalogue.js";
import type {
  Member,
  Work,
  Proposal,
  Assignment,
  Notice,
} from "../src/associate/model.js";
type Store = {
  version: 1;
  members: Member[];
  work: Work[];
  proposals: Proposal[];
  assignments: Assignment[];
  notices: Notice[];
  audit: { at: string; actor: string; action: string; resource: string }[];
};
const folder = () => path.join(process.cwd(), "data");
const filename = () => path.join(folder(), "associate-workspace.json");
const now = () => new Date().toISOString();
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const id = () => randomUUID();
export function readAssociateWorkspace(): Store {
  if (!fs.existsSync(filename()))
    return {
      version: 1,
      members: [],
      work: [],
      proposals: [],
      assignments: [],
      notices: [],
      audit: [],
    };
  const s = JSON.parse(fs.readFileSync(filename(), "utf8"));
  if (
    s.version !== 1 ||
    !["members", "work", "proposals", "assignments", "notices", "audit"].every(
      (k) => Array.isArray(s[k]),
    )
  )
    throw new Error("Portal store needs recovery");
  return s;
}
function write(s: Store) {
  fs.mkdirSync(folder(), { recursive: true, mode: 0o700 });
  const tmp = filename() + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(s), { mode: 0o600 });
  fs.renameSync(tmp, filename());
}
function change<T>(
  actor: string,
  action: string,
  resource: string,
  fn: (s: Store) => T,
) {
  const s = readAssociateWorkspace();
  const result = fn(s);
  s.audit.push({ at: now(), actor, action, resource });
  write(s);
  return result;
}
function text(value: unknown, max = 5000) {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new Error("Check the required text and length");
  return value.trim();
}
const emailHtml = (s: string) =>
  s
    .replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c]!,
    )
    .replace(/\n/g, "<br>");
function notice(
  s: Store,
  memberId: string,
  subject: string,
  message: string,
  key: string,
) {
  if (s.notices.some((n) => n.key === key)) return;
  s.notices.push({
    id: id(),
    memberId,
    subject,
    text: message,
    createdAt: now(),
    key,
    email: "queued",
    attempts: 0,
  });
}
const invited = (m: Member) =>
  !["revoked", "suspended"].includes(m.eligibility.status);
export function queueAssociateReminders(clock = Date.now()) {
  const s = readAssociateWorkspace();
  for (const w of s.work.filter((w) => w.status === "open"))
    for (const m of s.members.filter(
      (m) => invited(m) && m.onboardingApproved,
    )) {
      const remaining = Date.parse(w.bidsCloseAt) - clock;
      if (
        remaining > 0 &&
        remaining <= 48 * 3600000 &&
        !s.proposals.some(
          (p) => p.memberId === m.id && p.workId === w.id && p.kind === "bid",
        ) &&
        assessBidEligibility(
          m.eligibility,
          w,
          "Reminder",
          new Date(clock).toISOString(),
        ).allowed
      )
        notice(
          s,
          m.id,
          "Bid deadline approaching",
          `${w.title}: ${w.fee}. Bids close ${w.bidsCloseAt} (UTC).`,
          "close:" + w.id + ":" + m.id,
        );
    }
  for (const a of s.assignments.filter((a) => a.status !== "completed"))
    for (const [kind, date] of [
      ["start", a.startsAt],
      ["finish", a.finishesAt],
    ]) {
      const remaining = Date.parse(date) - clock;
      if (remaining > 0 && remaining <= 48 * 3600000)
        notice(
          s,
          a.memberId,
          `Assignment ${kind} reminder`,
          `${a.title}: ${kind} ${date} (UTC).`,
          kind + ":" + a.id,
        );
    }
  write(s);
}
let delivering = false;
export async function deliverAssociateNotices() {
  if (delivering) return;
  delivering = true;
  try {
    for (const item of readAssociateWorkspace()
      .notices.filter(
        (n) =>
          (n.email === "queued" || n.email === "failed") &&
          n.attempts < 3 &&
          (!n.lastAttempt || Date.now() - n.lastAttempt > 15 * 60000),
      )
      .slice(0, 20)) {
      const m = readAssociateWorkspace().members.find(
        (m) => m.id === item.memberId,
      );
      const directorEmail = item.memberId.startsWith("director:")
        ? item.memberId.slice(9)
        : "";
      const authorisedDirector =
        directorEmail &&
        (process.env.ASSOCIATE_DIRECTOR_EMAILS || "")
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .includes(directorEmail);
      if (!authorisedDirector && (!m || !invited(m))) continue;
      const recipient = authorisedDirector ? directorEmail : m!.email;
      const portalLink = authorisedDirector
        ? "https://www.wowbusinessanddigital.com/?page=manage-applications"
        : "https://www.wowbusinessanddigital.com/?page=associate-portal";
      change("system", "email-attempt", item.id, (s) => {
        const n = s.notices.find((n) => n.id === item.id)!;
        n.email = "sending";
        n.attempts++;
        n.lastAttempt = Date.now();
      });
      let ok = false;
      try {
        const result = await sendOutboundEmail(
          recipient,
          item.subject,
          `<p>${emailHtml(item.text)}</p><p><a href="${portalLink}">Sign in to WOW</a></p>`,
          item.text + "\n\nSign in: " + portalLink,
          businessSender(),
        );
        ok = result.success && result.method !== "simulated-preview";
      } catch {
        /* In-app notice remains available. */
      }
      change("system", "email-result", item.id, (s) => {
        s.notices.find((n) => n.id === item.id)!.email = ok
          ? "accepted"
          : "failed";
      });
    }
  } finally {
    delivering = false;
  }
}
export function installAssociateWorkspace(app: Express) {
  const base = "/api/associate-portal";
  const sessions = new Map<
    string,
    { memberId: string; accessVersion: number; expires: number }
  >();
  const codes = new Map<
    string,
    { memberId: string; accessVersion: number; hash: string; expires: number }
  >();
  const attempts = new Map<string, { n: number; until: number }>();
  const token = (req: Request) =>
    req.headers.cookie
      ?.split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("wbd_associate="))
      ?.slice(14) || "";
  const cookie = (res: Response, value: string, age: number) =>
    res.cookie("wbd_associate", value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: age,
    });
  const limit = (key: string, max: number) => {
    for (const [k, v] of attempts) if (v.until < Date.now()) attempts.delete(k);
    const a = attempts.get(key) || { n: 0, until: Date.now() + 15 * 60000 };
    if (a.n >= max || attempts.size > 5000)
      throw new Error("Too many attempts. Try again in 15 minutes.");
    a.n++;
    attempts.set(key, a);
  };
  const current = (req: Request) => {
    const key = hash(token(req)),
      session = sessions.get(key);
    if (!session || session.expires < Date.now()) {
      sessions.delete(key);
      return null;
    }
    const m = readAssociateWorkspace().members.find(
      (m) =>
        m.id === session.memberId &&
        invited(m) &&
        (m.accessVersion || 0) === session.accessVersion,
    );
    if (!m) sessions.delete(key);
    return m || null;
  };
  app.use(base, (req, res, next) => {
    res.set({
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    });
    if (!["GET", "HEAD"].includes(req.method)) {
      const origins = new Set([
        new URL(process.env.APP_URL || "https://www.wowbusinessanddigital.com")
          .origin,
      ]);
      if (process.env.NODE_ENV === "production")
        origins.add("https://wowbusinessanddigital.com");
      if (
        !origins.has(req.get("origin") || "") ||
        !req.is("application/json")
      ) {
        res.status(403).json({ error: "Use the portal on the website." });
        return;
      }
    }
    next();
  });
  const route =
    (fn: (req: Request, res: Response) => unknown) =>
    async (req: Request, res: Response) => {
      try {
        await fn(req, res);
      } catch (e) {
        res.status(400).json({
          error: e instanceof Error ? e.message : "Request unavailable",
        });
      }
    };
  app.get(
    base + "/session",
    route((req, res) => {
      const m = current(req);
      res.json({ member: m ? { id: m.id, name: m.name } : null });
    }),
  );
  app.post(
    base + "/request-code",
    route(async (req, res) => {
      limit("request:" + req.ip, 5);
      const email = text(req.body.email, 254).toLowerCase();
      const m = readAssociateWorkspace().members.find(
        (m) => m.email === email && invited(m),
      );
      if (m) {
        const code = randomBytes(24).toString("hex");
        codes.set(email, {
          memberId: m.id,
          accessVersion: m.accessVersion || 0,
          hash: hash(code),
          expires: Date.now() + 30 * 60000,
        });
        try {
          const r = await sendOutboundEmail(
            email,
            "Your WOW Associate sign-in code",
            `<p>Your single-use code, valid for 30 minutes:</p><p>${code}</p><p>Enter it on the WOW Associate portal. If you did not request it, ignore this email.</p>`,
            `Your single-use WOW Associate code (30 minutes): ${code}`,
            businessSender(),
          );
          if (!r.success) codes.delete(email);
        } catch {
          codes.delete(email);
        }
      }
      res.json({
        message:
          "If your registration has been invited, a sign-in code will be sent. Check your inbox and spam folder or contact WOW.",
      });
    }),
  );
  app.post(
    base + "/login",
    route((req, res) => {
      limit("login:" + req.ip, 10);
      const email = text(req.body.email, 254).toLowerCase(),
        code = text(req.body.code, 100),
        pending = codes.get(email);
      if (
        !pending ||
        pending.expires < Date.now() ||
        pending.hash !== hash(code)
      )
        throw new Error("Code invalid or expired. Request a new code.");
      const m = readAssociateWorkspace().members.find(
        (m) =>
          m.id === pending.memberId &&
          invited(m) &&
          (m.accessVersion || 0) === pending.accessVersion,
      );
      if (!m) throw new Error("Access unavailable. Contact WOW.");
      codes.delete(email);
      for (const [k, v] of sessions)
        if (v.expires < Date.now()) sessions.delete(k);
      if (sessions.size >= 1000) throw new Error("Please try later");
      sessions.delete(hash(token(req)));
      const value = randomBytes(32).toString("hex");
      sessions.set(hash(value), {
        memberId: m.id,
        accessVersion: m.accessVersion || 0,
        expires: Date.now() + 8 * 3600000,
      });
      cookie(res, value, 8 * 3600000);
      res.json({ success: true });
    }),
  );
  app.post(
    base + "/logout",
    route((req, res) => {
      sessions.delete(hash(token(req)));
      cookie(res, "", 0);
      res.json({ success: true });
    }),
  );
  const guard = (req: Request, res: Response, next: NextFunction) => {
    try {
      const m = current(req);
      if (!m) {
        res.status(401).json({ error: "Please sign in." });
        return;
      }
      res.locals.member = m;
      next();
    } catch {
      res.status(503).json({ error: "Portal temporarily unavailable" });
    }
  };
  app.use(base, guard);
  app.get(
    base + "/dashboard",
    route((_req, res) => {
      const m = res.locals.member as Member,
        s = readAssociateWorkspace();
      res.json({
        member: m,
        catalogue,
        commercialTerms,
        work: s.work.filter(
          (w) =>
            w.status !== "draft" &&
            m.eligibility.status === "approved" &&
            m.eligibility.approvedCategories.includes(w.category) &&
            (w.kind === "internal" ||
              m.eligibility.clientAccreditation === "approved"),
        ),
        proposals: s.proposals.filter((p) => p.memberId === m.id),
        assignments: s.assignments
          .filter((a) => a.memberId === m.id)
          .map((a) => ({
            ...a,
            files: a.files.map(({ storageName, ...f }) => f),
          })),
        notices: s.notices.filter((n) => n.memberId === m.id),
      });
    }),
  );
  app.post(
    base + "/profile",
    route((req, res) => {
      const m = res.locals.member as Member;
      change(m.id, "profile", m.id, (s) => {
        const saved = s.members.find((x) => x.id === m.id)!;
        saved.profile = text(req.body.profile, 5000);
        saved.version++;
      });
      res.json({ success: true });
    }),
  );
  app.post(
    base + "/induction",
    route((req, res) => {
      if (
        req.body.read !== true ||
        !["attending", "next-session", "unsure"].includes(req.body.rsvp)
      )
        throw new Error("Confirm the induction material and RSVP");
      const m = res.locals.member as Member;
      change(m.id, "induction-read", m.id, (s) => {
        const saved = s.members.find((x) => x.id === m.id)!;
        saved.inductionRead = true;
        saved.inductionRsvp = req.body.rsvp;
        if (saved.eligibility.induction !== "passed")
          saved.eligibility.induction = "in-progress";
        saved.version++;
      });
      res.json({ success: true });
    }),
  );
  app.post(
    base + "/proposals",
    route((req, res) => {
      const m = res.locals.member as Member;
      const kind = req.body.kind;
      if (!["eoi", "bid"].includes(kind)) throw new Error("Select EOI or bid");
      const proposal = text(req.body.text, 50000);
      if (countWords(proposal) > 5000) throw new Error("Maximum 5,000 words");
      const workId = text(req.body.workId, 100);
      change(m.id, kind, workId, (s) => {
        const member = s.members.find((x) => x.id === m.id)!;
        if (kind === "eoi") {
          if (!catalogue.some((c) => c.id === workId))
            throw new Error("Unknown package");
        } else {
          const w = s.work.find((w) => w.id === workId);
          if (!w) throw new Error("Work unavailable");
          if (
            !s.proposals.some(
              (p) =>
                p.memberId === m.id &&
                p.kind === "eoi" &&
                p.workId === w.category,
            )
          )
            throw new Error(
              "Submit an expression of interest in this package first",
            );
          if (!member.onboardingApproved)
            throw new Error("Director onboarding approval required");
          const eligible = assessBidEligibility(
            member.eligibility,
            w,
            proposal,
            now(),
          );
          if (eligible.allowed === false) throw new Error(eligible.reason);
        }
        if (
          s.proposals.some(
            (p) =>
              p.memberId === m.id &&
              p.workId === workId &&
              p.kind === kind &&
              p.status !== "withdrawn",
          )
        )
          throw new Error("Already submitted. Contact WOW to discuss changes.");
        for (const email of (process.env.ASSOCIATE_DIRECTOR_EMAILS || "")
          .split(",")
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean))
          notice(
            s,
            "director:" + email,
            "Associate " + kind.toUpperCase() + " received",
            `${m.name} submitted a ${kind.toUpperCase()} for ${workId}. Review the private submission in the staff dashboard.`,
            "director-" +
              kind +
              ":" +
              m.id +
              ":" +
              workId +
              ":" +
              s.proposals.length,
          );
        s.proposals.push({
          id: id(),
          memberId: m.id,
          workId,
          kind,
          text: proposal,
          createdAt: now(),
          status: "submitted",
        });
        notice(
          s,
          m.id,
          "Submission received",
          `${kind.toUpperCase()} received for ${workId}. This is not an award.`,
          kind + ":" + m.id + ":" + workId,
        );
      });
      res.json({ success: true });
    }),
  );
  app.post(
    base + "/proposals/:id/withdraw",
    route((req, res) => {
      const m = res.locals.member as Member;
      change(m.id, "withdraw-bid", req.params.id, (s) => {
        const p = s.proposals.find(
          (p) =>
            p.id === req.params.id &&
            p.memberId === m.id &&
            p.kind === "bid" &&
            p.status === "submitted",
        );
        const w = s.work.find((w) => w.id === p?.workId);
        if (
          !p ||
          !w ||
          w.status !== "open" ||
          Date.now() >= Date.parse(w.bidsCloseAt)
        )
          throw new Error("Withdrawal is only available before bidding closes");
        p.status = "withdrawn";
      });
      res.json({ success: true });
    }),
  );
  app.post(
    base + "/assignments/:id/action",
    route((req, res) => {
      const m = res.locals.member as Member;
      change(m.id, "assignment-" + req.body.action, req.params.id, (s) => {
        const a = s.assignments.find(
          (a) => a.id === req.params.id && a.memberId === m.id,
        );
        if (!a) throw new Error("Assignment unavailable");
        if (a.version !== req.body.version)
          throw new Error("Assignment changed. Refresh before retrying.");
        const action = req.body.action;
        if (action === "message")
          a.messages.push({
            id: id(),
            actor: m.name,
            text: text(req.body.text, 10000),
            createdAt: now(),
          });
        else if (action === "deliverable") {
          if (a.status === "completed")
            throw new Error("Assignment already completed");
          a.deliverables.push({
            id: id(),
            actor: m.name,
            text: text(req.body.text, 10000),
            createdAt: now(),
          });
          a.status = "submitted";
        } else if (action === "task") {
          const t = a.tasks.find((t) => t.id === req.body.taskId);
          if (!t || typeof req.body.done !== "boolean")
            throw new Error("Task unavailable");
          t.done = req.body.done;
        } else if (action === "invoice") {
          if (a.status !== "completed" || a.invoice)
            throw new Error(
              "Invoice at assignment end, after completion is recorded",
            );
          const amount = text(req.body.amount, 30);
          if (!/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0)
            throw new Error("Enter a positive USD invoice amount");
          a.invoice = {
            number: text(req.body.number, 100),
            amount,
            submittedAt: now(),
            status: "submitted",
            note: "",
          };
        } else throw new Error("Unknown action");
        a.version++;
      });
      res.json({ success: true });
    }),
  );
  app.post(
    base + "/assignments/:id/file",
    route((req, res) => {
      const m = res.locals.member as Member;
      const name = text(req.body.name, 200),
        encoded = text(req.body.base64, 8 * 1024 * 1024);
      if (
        !/\.(pdf|docx|xlsx|pptx|txt|csv|png|jpe?g)$/i.test(name) ||
        !/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
          encoded,
        )
      )
        throw new Error("Use a supported document or image, up to 5 MB");
      const bytes = Buffer.from(encoded, "base64");
      if (!bytes.length || bytes.length > 5 * 1024 * 1024)
        throw new Error("File must be 1 byte to 5 MB");
      const fileId = id();
      const storageName = fileId + ".bin";
      const dir = path.join(folder(), "associate-files");
      fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
      try {
        change(m.id, "file-upload", req.params.id, (s) => {
          const a = s.assignments.find(
            (a) => a.id === req.params.id && a.memberId === m.id,
          );
          if (!a) throw new Error("Assignment unavailable");
          if (a.version !== req.body.version)
            throw new Error("Assignment changed. Refresh.");
          fs.writeFileSync(path.join(dir, storageName), bytes, {
            mode: 0o600,
            flag: "wx",
          });
          a.files.push({
            id: fileId,
            name: path.basename(name),
            storageName,
            size: bytes.length,
            actor: m.name,
            createdAt: now(),
          });
          a.version++;
        });
      } catch (e) {
        if (fs.existsSync(path.join(dir, storageName)))
          fs.unlinkSync(path.join(dir, storageName));
        throw e;
      }
      res.json({ success: true });
    }),
  );
  app.get(
    base + "/assignments/:id/files/:fileId",
    route((req, res) => {
      const m = res.locals.member as Member,
        a = readAssociateWorkspace().assignments.find(
          (a) => a.id === req.params.id && a.memberId === m.id,
        ),
        file = a?.files.find((f) => f.id === req.params.fileId);
      if (!file) {
        res.status(404).json({ error: "File unavailable" });
        return;
      }
      res
        .set({
          "Content-Type": "application/octet-stream",
          "X-Content-Type-Options": "nosniff",
        })
        .download(
          path.join(
            folder(),
            "associate-files",
            path.basename(file.storageName),
          ),
          file.name,
        );
    }),
  );
  if (process.env.ASSOCIATE_NOTIFICATIONS_ENABLED === "true") {
    const timer = setInterval(() => {
      try {
        queueAssociateReminders();
        void deliverAssociateNotices().catch(() => {});
      } catch {
        /* Preserve saved work if email checks fail. */
      }
    }, 60000);
    timer.unref();
  }
}

/** Installed behind the existing verified staff guard; a separate Director allowlist is mandatory. */
export function installAssociateWorkspaceDirector(app: Express) {
  const base = "/api/admissions-dashboard/associate-portal";
  app.use(base, (_req, res, next) => {
    const allowed = (process.env.ASSOCIATE_DIRECTOR_EMAILS || "")
      .split(",")
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean);
    if (!allowed.includes(res.locals.user?.email)) {
      res.status(403).json({
        error:
          "Director permission required. Ask technical support to configure your authorised Director account.",
      });
      return;
    }
    next();
  });
  const route =
    (fn: (req: Request, res: Response) => unknown) =>
    async (req: Request, res: Response) => {
      try {
        await fn(req, res);
      } catch (e) {
        res.status(400).json({
          error: e instanceof Error ? e.message : "Request unavailable",
        });
      }
    };
  app.get(
    base,
    route((_req, res) => {
      const s = readAssociateWorkspace();
      const file = path.join(folder(), "enquiries.jsonl");
      const registrations = fs.existsSync(file)
        ? fs
            .readFileSync(file, "utf8")
            .split("\n")
            .filter(Boolean)
            .map((l) => JSON.parse(l))
            .filter((r) => r.category === "associate")
            .map((r) => ({
              id: r.id,
              name: r.contact.firstName,
              email: r.contact.email,
              expertise: r.details?.expertise,
            }))
        : [];
      res.json({
        ...s,
        assignments: s.assignments.map((a) => ({
          ...a,
          files: a.files.map(({ storageName, ...f }) => f),
        })),
        registrations,
        catalogue,
        commercialTerms,
      });
    }),
  );
  app.post(
    base + "/action",
    route((req, res) => {
      const b = req.body,
        actor = res.locals.user.email;
      change(actor, "director-" + b.action, String(b.id || ""), (s) => {
        if (b.action === "invite") {
          const file = path.join(folder(), "enquiries.jsonl");
          const r = fs
            .readFileSync(file, "utf8")
            .split("\n")
            .filter(Boolean)
            .map((l) => JSON.parse(l))
            .find((r) => r.id === b.id && r.category === "associate");
          if (!r) throw new Error("Registration not found");
          const email = text(r.contact.email, 254).toLowerCase();
          if (s.members.some((m) => m.id === r.id || m.email === email))
            throw new Error("Already invited");
          s.members.push({
            id: r.id,
            name: r.contact.firstName,
            email,
            eligibility: {
              status: "applicant",
              induction: "not-started",
              approvedCategories: [],
              clientAccreditation: "not-assessed",
            },
            onboardingApproved: false,
            inductionRead: false,
            inductionEvidence: "",
            inductionRsvp: "",
            profile: "",
            invitedAt: now(),
            version: 0,
          });
          notice(
            s,
            r.id,
            "Invitation to the WOW Associate portal",
            "WOW has invited you to access the Associate portal. Use your registered email and request a single-use sign-in code. Read the induction material and express interest in work packages. Onboarding approval is required before formal bids.",
            "invite:" + r.id,
          );
        } else if (b.action === "member") {
          const m = s.members.find((m) => m.id === b.id);
          if (!m || m.version !== b.version)
            throw new Error("Member changed. Refresh.");
          if (
            !["applicant", "approved", "suspended", "revoked"].includes(
              b.status,
            ) ||
            !Array.isArray(b.categories) ||
            !b.categories.every((c: unknown) =>
              catalogue.some((p) => p.id === c),
            ) ||
            typeof b.onboardingApproved !== "boolean" ||
            typeof b.clientApproved !== "boolean"
          )
            throw new Error("Invalid member settings");
          if (["revoked", "suspended"].includes(b.status))
            m.accessVersion = (m.accessVersion || 0) + 1;
          m.eligibility.status = b.status;
          m.eligibility.approvedCategories = [...new Set<string>(b.categories)];
          m.onboardingApproved = b.onboardingApproved;
          m.eligibility.clientAccreditation = b.clientApproved
            ? "approved"
            : "not-assessed";
          if (b.inductionPassed === true) {
            if (!m.inductionRead)
              throw new Error("Associate must read the induction first");
            m.inductionEvidence = text(b.evidence, 2000);
            m.eligibility.induction = "passed";
          } else {
            m.eligibility.induction = m.inductionRead
              ? "in-progress"
              : "not-started";
            m.inductionEvidence = "";
          }
          m.version++;
        } else if (b.action === "work") {
          const w: Work = {
            id: b.id || id(),
            title: text(b.title, 200),
            summary: text(b.summary, 5000),
            outputs: text(b.outputs, 5000),
            hours: text(b.hours, 200),
            duration: text(b.duration, 200),
            fee: text(b.fee, 200),
            category: text(b.category, 100),
            kind: b.kind,
            openAt: b.openAt,
            bidsCloseAt: b.bidsCloseAt,
            startsAt: b.startsAt,
            finishesAt: b.finishesAt,
            status: b.status,
            version: 0,
          };
          if (
            !catalogue.some((p) => p.id === w.category) ||
            !["internal", "client"].includes(w.kind) ||
            !["draft", "open", "closed", "cancelled"].includes(w.status) ||
            validateOpportunityDates(w).length
          )
            throw new Error(
              "Check category, status and UTC dates: opening < close <= start < finish",
            );
          const old = s.work.find((x) => x.id === w.id);
          if (old && (old.version !== b.version || old.status === "awarded"))
            throw new Error("Work changed or already awarded");
          w.version = old ? old.version + 1 : 0;
          s.work = [...s.work.filter((x) => x.id !== w.id), w];
          if (w.status === "open")
            for (const m of s.members.filter((m) => m.onboardingApproved))
              if (
                assessBidEligibility(
                  m.eligibility,
                  w,
                  "Opportunity notice",
                  new Date(
                    Math.max(Date.now(), Date.parse(w.openAt)),
                  ).toISOString(),
                ).allowed
              )
                notice(
                  s,
                  m.id,
                  "New WOW work opportunity",
                  `${w.title}\n${w.fee}\n${w.hours}; ${w.duration}\nBids close ${w.bidsCloseAt} (UTC). Starts ${w.startsAt}; finishes ${w.finishesAt}.`,
                  "open:" + w.id + ":" + m.id,
                );
        } else if (b.action === "award") {
          const p = s.proposals.find(
              (p) =>
                p.id === b.id && p.kind === "bid" && p.status === "submitted",
            ),
            w = s.work.find((w) => w.id === p?.workId),
            m = s.members.find((m) => m.id === p?.memberId);
          if (
            !p ||
            !w ||
            !m ||
            !["open", "closed"].includes(w.status) ||
            !m.onboardingApproved ||
            m.eligibility.status !== "approved" ||
            m.eligibility.induction !== "passed" ||
            !m.eligibility.approvedCategories.includes(w.category) ||
            (w.kind === "client" &&
              m.eligibility.clientAccreditation !== "approved")
          )
            throw new Error("Bid no longer eligible for award");
          w.status = "awarded";
          w.version++;
          for (const other of s.proposals.filter(
            (x) =>
              x.workId === w.id && x.kind === "bid" && x.status === "submitted",
          )) {
            other.status = other.id === p.id ? "awarded" : "unsuccessful";
            notice(
              s,
              other.memberId,
              "WOW bid decision",
              `${w.title}: ${other.status}.`,
              "decision:" + other.id,
            );
          }
          s.assignments.push({
            id: id(),
            workId: w.id,
            memberId: m.id,
            title: w.title,
            fee: w.fee,
            startsAt: w.startsAt,
            finishesAt: w.finishesAt,
            status: "assigned",
            messages: [],
            files: [],
            tasks: [],
            deliverables: [],
            version: 0,
          });
        } else if (b.action === "assignment") {
          const a = s.assignments.find((a) => a.id === b.id);
          if (!a || a.version !== b.version)
            throw new Error("Assignment changed. Refresh.");
          if (b.message)
            a.messages.push({
              id: id(),
              actor: res.locals.user.name,
              text: text(b.message, 10000),
              createdAt: now(),
            });
          if (b.task) {
            const due = text(b.due, 30);
            if (
              !/^\d{4}-\d{2}-\d{2}$/.test(due) ||
              !Number.isFinite(Date.parse(due))
            )
              throw new Error("Task needs a valid due date");
            a.tasks.push({
              id: id(),
              title: text(b.task, 500),
              due,
              done: false,
            });
          }
          if (b.status) {
            if (
              !["assigned", "in-progress", "submitted", "completed"].includes(
                b.status,
              )
            )
              throw new Error("Invalid status");
            a.status = b.status;
          }
          if (b.invoiceStatus) {
            if (
              !a.invoice ||
              !["accepted", "disputed", "paid"].includes(b.invoiceStatus)
            )
              throw new Error("Invoice unavailable");
            if (b.invoiceStatus === "paid" && a.invoice.status !== "accepted")
              throw new Error("Accept the invoice before marking paid");
            if (b.invoiceStatus === "accepted" && !a.invoice.dueAt)
              a.invoice.dueAt = new Date(
                Date.now() + 7 * 86400000,
              ).toISOString();
            a.invoice.status = b.invoiceStatus;
            a.invoice.note = text(b.note, 2000);
          }
          a.version++;
          notice(
            s,
            a.memberId,
            "Assignment update",
            `An update is available in your private workspace for ${a.title}.`,
            "update:" + a.id + ":" + a.version,
          );
        } else throw new Error("Unknown action");
      });
      res.json({ success: true });
    }),
  );
  app.post(
    base + "/assignments/:id/file",
    route((req, res) => {
      const actor = res.locals.user;
      const name = text(req.body.name, 200),
        encoded = text(req.body.base64, 8 * 1024 * 1024);
      if (
        !/\.(pdf|docx|xlsx|pptx|txt|csv|png|jpe?g)$/i.test(name) ||
        !/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
          encoded,
        )
      )
        throw new Error("Use a supported document or image, up to 5 MB");
      const bytes = Buffer.from(encoded, "base64");
      if (!bytes.length || bytes.length > 5 * 1024 * 1024)
        throw new Error("File must be 1 byte to 5 MB");
      const fileId = id(),
        storageName = fileId + ".bin",
        dir = path.join(folder(), "associate-files");
      fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
      try {
        change(actor.email, "director-file-upload", req.params.id, (s) => {
          const a = s.assignments.find((a) => a.id === req.params.id);
          if (!a || a.version !== req.body.version)
            throw new Error("Assignment unavailable or changed. Refresh.");
          fs.writeFileSync(path.join(dir, storageName), bytes, {
            mode: 0o600,
            flag: "wx",
          });
          a.files.push({
            id: fileId,
            name: path.basename(name),
            storageName,
            size: bytes.length,
            actor: actor.name,
            createdAt: now(),
          });
          a.version++;
          notice(
            s,
            a.memberId,
            "Assignment file available",
            `WBD has added a file to your private workspace for ${a.title}.`,
            "file:" + fileId,
          );
        });
      } catch (e) {
        if (fs.existsSync(path.join(dir, storageName)))
          fs.unlinkSync(path.join(dir, storageName));
        throw e;
      }
      res.json({ success: true });
    }),
  );
  app.get(
    base + "/assignments/:id/files/:fileId",
    route((req, res) => {
      const a = readAssociateWorkspace().assignments.find(
          (a) => a.id === req.params.id,
        ),
        file = a?.files.find((f) => f.id === req.params.fileId);
      if (!file) {
        res.status(404).json({ error: "File unavailable" });
        return;
      }
      res
        .set({
          "Content-Type": "application/octet-stream",
          "X-Content-Type-Options": "nosniff",
        })
        .download(
          path.join(
            folder(),
            "associate-files",
            path.basename(file.storageName),
          ),
          file.name,
        );
    }),
  );
}
