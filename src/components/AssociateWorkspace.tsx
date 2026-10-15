import { AssociateFileUpload } from "./AssociateFileUpload";
import React, { useEffect, useState } from "react";
import { readApiJson } from "../utils/readApiJson";
import type {
  Member,
  Work,
  Proposal,
  Assignment,
  Notice,
} from "../associate/model";
import { catalogue, commercialTerms } from "../associate/catalogue";
import { assessBidEligibility } from "../../server/associatePortalRules";
import "../admissions/dashboard.css";
type Data = {
  member: Member;
  work: Work[];
  proposals: Proposal[];
  assignments: Assignment[];
  notices: Notice[];
};
const date = (s: string) =>
  new Date(s).toLocaleString("en-GB", {
    timeZone: "Europe/London",
    dateStyle: "medium",
    timeStyle: "short",
  }) + " UK";
export async function portalApi(url: string, body?: unknown) {
  return readApiJson<any>(
    await fetch(url, {
      method: body ? "POST" : "GET",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    }),
    "Your request could not be confirmed.",
  );
}
export function AssociateWorkspace() {
  const [member, setMember] = useState<{ name: string } | null>(null),
    [data, setData] = useState<Data | null>(null),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [checking, setChecking] = useState(true);
  const [email, setEmail] = useState(""),
    [code, setCode] = useState(""),
    [section, setSection] = useState("Dashboard");
  async function refresh() {
    const session = await portalApi("/api/associate-portal/session");
    setMember(session.member);
    if (session.member)
      setData(await portalApi("/api/associate-portal/dashboard"));
    else setData(null);
  }
  useEffect(() => {
    refresh()
      .catch((e) => setError(e.message))
      .finally(() => setChecking(false));
  }, []);
  async function act(url: string, body: unknown, success = "Saved.") {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const r = await portalApi(url, body);
      setMessage(r.message || success);
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const base = "/api/associate-portal";
  return (
    <div className="admissions">
      <header className="ad-header">
        <a href="/">WOW Business &amp; Digital</a>
        <span>Associate portal</span>
        {member && (
          <button disabled={busy} onClick={() => act(base + "/logout", {})}>
            Sign out
          </button>
        )}
      </header>
      <main className="ad-main">
        <p>Evidence | Transformation | Impact</p>
        <h1>Associate delivery network</h1>
        <p>Private work, practical delivery and professional development.</p>
        {error && (
          <p role="alert" className="ad-error">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="ad-card">
            {message}
          </p>
        )}
        {checking ? (
          <p>Checking your access…</p>
        ) : !member ? (
          <section className="ad-card">
            <h2>Invited associates: sign in</h2>
            <p>
              Register your interest first. Once WOW invites your registered
              email, request a single-use code here.
            </p>
            <a href="?page=associates">Register as an associate</a>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                act(base + "/request-code", { email });
              }}
            >
              <label>
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <button disabled={busy}>Email a sign-in code</button>
            </form>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                act(base + "/login", { email, code }, "Signed in.");
              }}
            >
              <label>
                Code from your email
                <input
                  required
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </label>
              <button className="ad-primary" disabled={busy}>
                Sign in
              </button>
            </form>
            <p>
              Codes expire after 30 minutes and work once. Contact
              wowdigital@wowbusinessanddigital.com if you need help.
            </p>
          </section>
        ) : (
          data && (
            <>
              <nav aria-label="Associate sections" className="ad-toolbar">
                {[
                  "Dashboard",
                  "Induction",
                  "Work packages",
                  "Open work",
                  "My submissions",
                  "My assignments",
                  "Profile",
                ].map((s) => (
                  <button
                    key={s}
                    aria-pressed={s === section}
                    onClick={() => setSection(s)}
                  >
                    {s}
                  </button>
                ))}
                <button
                  disabled={busy}
                  onClick={() => {
                    refresh().catch((e) => setError(e.message));
                  }}
                >
                  Refresh
                </button>
              </nav>
              {section === "Dashboard" && (
                <>
                  <section className="ad-card">
                    <h2>Hello {data.member.name}</h2>
                    <p>
                      Membership: {data.member.eligibility.status} · Induction:{" "}
                      {data.member.eligibility.induction} · Onboarding:{" "}
                      {data.member.onboardingApproved
                        ? "approved"
                        : "awaiting Director approval"}
                    </p>
                    <p>
                      Client accreditation:{" "}
                      {data.member.eligibility.clientAccreditation}
                    </p>
                    <p>
                      Read induction and express interest in catalogue packages.
                      Formal bidding requires verified induction, approved
                      onboarding and approval for the relevant work category.
                    </p>
                  </section>
                  <section className="ad-card">
                    <h2>Notifications and deadlines</h2>
                    {data.notices
                      .slice()
                      .reverse()
                      .map((n) => (
                        <article key={n.id}>
                          <h3>{n.subject}</h3>
                          <p style={{ whiteSpace: "pre-wrap" }}>{n.text}</p>
                          <small>{date(n.createdAt)}</small>
                        </article>
                      ))}
                    {!data.notices.length && <p>No notifications yet.</p>}
                    {data.assignments.map((a) => (
                      <p key={a.id}>
                        {a.title}: starts {date(a.startsAt)}, finishes{" "}
                        {date(a.finishesAt)}.
                      </p>
                    ))}
                  </section>
                </>
              )}
              {section === "Induction" && (
                <section className="ad-card">
                  <h2>WBD induction</h2>
                  <p>
                    WBD turns evidence into practical transformation and
                    measurable impact. We agree scope and outcomes, plan
                    delivery, involve the people affected, track progress and
                    hand over sustainable improvements.
                  </p>
                  <h3>How we work</h3>
                  <ul>
                    <li>
                      Use the agreed brief, outputs, hours, deadlines and
                      quality standards for each assignment.
                    </li>
                    <li>
                      Keep client and associate information confidential. Use
                      only approved systems; never put personal or confidential
                      client data into unapproved AI tools.
                    </li>
                    <li>
                      Use AI to support research and drafting responsibly. Check
                      accuracy, sources, ownership and quality before submitting
                      work.
                    </li>
                    <li>
                      Use your private assignment workspace for questions,
                      progress, tasks, files and deliverables. Flag risks and
                      delays early.
                    </li>
                    <li>
                      Do not contact clients, publish material or commit WBD to
                      costs without approval. Client work requires additional
                      accreditation.
                    </li>
                  </ul>
                  <p>{commercialTerms}</p>
                  <h3>Induction attendance</h3>
                  <p>
                    Saturday 17 October 2026, 12:00–14:00 Zimbabwe time
                    (11:00–13:00 UK BST), on Zoom. Joining details are sent
                    separately.
                  </p>
                  <p>
                    Reading this page does not verify attendance or approve
                    onboarding. The Director records induction evidence and
                    approval separately.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const f = new FormData(e.currentTarget);
                      act(base + "/induction", {
                        read: f.get("read") === "on",
                        rsvp: f.get("rsvp"),
                      });
                    }}
                  >
                    <label>
                      Attendance
                      <select
                        name="rsvp"
                        required
                        defaultValue={data.member.inductionRsvp || ""}
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="attending">I can attend</option>
                        <option value="next-session">
                          I cannot attend; request another session
                        </option>
                        <option value="unsure">I need to confirm</option>
                      </select>
                    </label>
                    <label>
                      <input name="read" type="checkbox" required /> I have read
                      the induction material and understand the working
                      requirements.
                    </label>
                    <button disabled={busy}>
                      Save induction acknowledgement
                    </button>
                  </form>
                </section>
              )}
              {section === "Work packages" && (
                <>
                  <p>{commercialTerms}</p>
                  {catalogue.map((c) => (
                    <section className="ad-card" key={c.id}>
                      <h2>
                        {c.id} · {c.title}
                      </h2>
                      <p>
                        {c.hours} · {c.duration} · {c.fee} USD
                      </p>
                      <p>{c.outputs}</p>
                      <details>
                        <summary>Express interest</summary>
                        <p>
                          Tell us why you are suitable, what you know about WOW,
                          your approach, expected outputs and quality checks,
                          evidence and availability. Maximum 5,000 words. An EOI
                          can be submitted before induction and is not a formal
                          bid.
                        </p>
                        <ProposalForm
                          disabled={
                            busy ||
                            data.proposals.some(
                              (p) => p.kind === "eoi" && p.workId === c.id,
                            )
                          }
                          submit={(text) =>
                            act(base + "/proposals", {
                              workId: c.id,
                              kind: "eoi",
                              text,
                            })
                          }
                        />
                      </details>
                    </section>
                  ))}
                </>
              )}
              {section === "Open work" && (
                <>
                  {!data.work.length && (
                    <p>
                      No published work is currently available for your approved
                      categories.
                    </p>
                  )}
                  {data.work.map((w) => {
                    const eligible = assessBidEligibility(
                      data.member.eligibility,
                      w,
                      "Eligibility check",
                      new Date().toISOString(),
                    );
                    return (
                      <section className="ad-card" key={w.id}>
                        <h2>{w.title}</h2>
                        <p>
                          {w.kind} · {w.status} · {w.category}
                        </p>
                        <p>{w.summary}</p>
                        <p>Outputs: {w.outputs}</p>
                        <p>
                          {w.fee} · {w.hours} · {w.duration}
                        </p>
                        <p>
                          Bids close {date(w.bidsCloseAt)} · Start{" "}
                          {date(w.startsAt)} · Finish {date(w.finishesAt)}
                        </p>
                        {!data.member.onboardingApproved ? (
                          <p>Onboarding approval required before bidding.</p>
                        ) : eligible.allowed === false ? (
                          <p>{eligible.reason}</p>
                        ) : (
                          <ProposalForm
                            disabled={
                              busy ||
                              data.proposals.some(
                                (p) =>
                                  p.workId === w.id &&
                                  p.kind === "bid" &&
                                  p.status !== "withdrawn",
                              )
                            }
                            submit={(text) =>
                              act(base + "/proposals", {
                                workId: w.id,
                                kind: "bid",
                                text,
                              })
                            }
                          />
                        )}
                      </section>
                    );
                  })}
                </>
              )}
              {section === "My submissions" && (
                <section className="ad-card">
                  <h2>My expressions of interest and bids</h2>
                  {data.proposals.map((p) => (
                    <details key={p.id}>
                      <summary>
                        {p.kind.toUpperCase()} · {p.workId} · {p.status}
                      </summary>
                      <p style={{ whiteSpace: "pre-wrap" }}>{p.text}</p>
                      <p>{date(p.createdAt)}</p>
                      {p.kind === "bid" && p.status === "submitted" && (
                        <button
                          disabled={busy}
                          onClick={() =>
                            act(base + "/proposals/" + p.id + "/withdraw", {})
                          }
                        >
                          Withdraw bid before close
                        </button>
                      )}
                    </details>
                  ))}
                  {!data.proposals.length && <p>No submissions yet.</p>}
                </section>
              )}
              {section === "My assignments" && (
                <>
                  {!data.assignments.length && (
                    <p>No assignments have been awarded to you.</p>
                  )}
                  {data.assignments.map((a) => (
                    <div key={a.id}>
                      <AssignmentPanel a={a} busy={busy} act={act} />
                    </div>
                  ))}
                </>
              )}
              {section === "Profile" && (
                <section className="ad-card">
                  <h2>Skills and availability</h2>
                  <p>
                    Original registration answers remain in the secure staff
                    register. Add updates here. These do not change your
                    approved work categories.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      act(base + "/profile", {
                        profile: new FormData(e.currentTarget).get("profile"),
                      });
                    }}
                  >
                    <label>
                      Skills, evidence links, location and availability
                      <textarea
                        name="profile"
                        required
                        maxLength={5000}
                        defaultValue={data.member.profile}
                      />
                    </label>
                    <button disabled={busy}>Save profile update</button>
                  </form>
                </section>
              )}
            </>
          )
        )}
      </main>
      <footer className="ad-footer">
        WOW Business &amp; Digital Ltd · Sign out when finished. Files are
        private; upload only material authorised for this assignment.
      </footer>
    </div>
  );
}
function ProposalForm({
  disabled,
  submit,
}: {
  disabled: boolean;
  submit: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(text);
      }}
    >
      <label>
        Your proposal
        <textarea
          required
          rows={6}
          maxLength={50000}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <p>{words} / 5,000 words</p>
      <button disabled={disabled || words > 5000 || words === 0}>
        Submit privately to WBD
      </button>
    </form>
  );
}
function AssignmentPanel({
  a,
  busy,
  act,
}: {
  a: Assignment;
  busy: boolean;
  act: (url: string, body: any, success?: string) => Promise<void>;
}) {
  const base = "/api/associate-portal/assignments/" + a.id;
  return (
    <section className="ad-card">
      <h2>{a.title}</h2>
      <p>
        {a.status} · {a.fee}
      </p>
      <p>
        Start {date(a.startsAt)} · Finish {date(a.finishesAt)}
      </p>
      <h3>Tasks</h3>
      {a.tasks.map((t) => (
        <label key={t.id}>
          <input
            type="checkbox"
            checked={t.done}
            disabled={busy}
            onChange={(e) =>
              act(base + "/action", {
                version: a.version,
                action: "task",
                taskId: t.id,
                done: e.target.checked,
              })
            }
          />
          {t.title} — due {t.due}
        </label>
      ))}
      <h3>Private messages and progress</h3>
      {a.messages.map((m) => (
        <p key={m.id}>
          <strong>{m.actor}</strong> · {date(m.createdAt)}
          <br />
          {m.text}
        </p>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          act(base + "/action", {
            version: a.version,
            action: "message",
            text: new FormData(e.currentTarget).get("text"),
          });
        }}
      >
        <label>
          Message to WBD
          <textarea name="text" required maxLength={10000} />
        </label>
        <button disabled={busy}>Send private message</button>
      </form>
      <h3>Files</h3>
      {a.files.map((f) => (
        <p key={f.id}>
          <a href={base + "/files/" + f.id}>{f.name}</a> · {f.actor}
        </p>
      ))}
      <AssociateFileUpload
        busy={busy}
        upload={(file) => act(base + "/file", { version: a.version, ...file })}
      />
      <h3>Deliverables</h3>
      {a.deliverables.map((d) => (
        <p key={d.id}>
          {date(d.createdAt)} · {d.text}
        </p>
      ))}
      {a.status !== "completed" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            act(base + "/action", {
              version: a.version,
              action: "deliverable",
              text: new FormData(e.currentTarget).get("text"),
            });
          }}
        >
          <label>
            Deliverable summary and file references
            <textarea name="text" required maxLength={10000} />
          </label>
          <button disabled={busy}>Submit for WBD review</button>
        </form>
      )}
      <h3>Invoice</h3>
      {a.invoice ? (
        <>
          <p>
            {a.invoice.number} · USD {a.invoice.amount} · {a.invoice.status}
          </p>
          {a.invoice.dueAt && <p>Payment due {date(a.invoice.dueAt)}</p>}
          <p>{a.invoice.note}</p>
        </>
      ) : a.status === "completed" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            act(base + "/action", {
              version: a.version,
              action: "invoice",
              number: f.get("number"),
              amount: f.get("amount"),
            });
          }}
        >
          <p>
            Invoice WOW Business &amp; Digital at assignment end. Accepted,
            undisputed invoices are payable within seven calendar days of
            receipt and acceptance of work.
          </p>
          <label>
            Invoice number
            <input name="number" required maxLength={100} />
          </label>
          <label>
            Agreed amount (USD)
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
            />
          </label>
          <button disabled={busy}>Submit invoice record</button>
        </form>
      ) : (
        <p>
          Available once WBD records assignment completion. Upload the invoice
          document using private files; do not put bank details into messages.
        </p>
      )}
    </section>
  );
}
