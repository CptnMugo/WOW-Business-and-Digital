import { AssociateFileUpload } from "./AssociateFileUpload";
import React, { useEffect, useState } from "react";
import { portalApi } from "./AssociateWorkspace";
import { catalogue, commercialTerms } from "../associate/catalogue";
import type { Member, Assignment } from "../associate/model";
const base = "/api/admissions-dashboard/associate-portal";
export function AssociateWorkspaceDirector() {
  const [data, setData] = useState<any>(null),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function refresh() {
    setData(await portalApi(base));
  }
  useEffect(() => {
    refresh().catch((e) => setError(e.message));
  }, []);
  async function save(body: any) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await portalApi(base + "/action", body);
      await refresh();
      setMessage("Saved.");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <h2>Associate portal administration</h2>
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <button
        disabled={busy}
        onClick={() => refresh().catch((e) => setError(e.message))}
      >
        Refresh portal
      </button>
      {data && (
        <>
          <p>{commercialTerms}</p>
          <h3>Invite existing registrants</h3>
          <p>
            Invitations enable sign-in and EOIs. Formal bidding remains locked
            until induction and onboarding are approved.
          </p>
          {data.registrations
            .filter(
              (r: any) => !data.members.some((m: Member) => m.id === r.id),
            )
            .map((r: any) => (
              <p key={r.id}>
                {r.name} · {r.email} · {r.expertise}{" "}
                <button
                  disabled={busy}
                  onClick={() => save({ action: "invite", id: r.id })}
                >
                  Invite to portal
                </button>
              </p>
            ))}
          <h3>Membership, induction and onboarding</h3>
          {data.members.map((m: Member) => (
            <details key={m.id}>
              <summary>
                {m.name} · {m.eligibility.status} · {m.eligibility.induction}
              </summary>
              <p>
                {m.email} · RSVP: {m.inductionRsvp || "Not recorded"} · Read
                induction: {m.inductionRead ? "Yes" : "No"}
              </p>
              <p>{m.profile}</p>
              <form
                key={m.version}
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  save({
                    action: "member",
                    id: m.id,
                    version: m.version,
                    status: f.get("status"),
                    categories: f.getAll("category"),
                    inductionPassed: f.get("induction") === "on",
                    onboardingApproved: f.get("onboarding") === "on",
                    clientApproved: f.get("client") === "on",
                    evidence: f.get("evidence"),
                  });
                }}
              >
                <label>
                  Membership
                  <select name="status" defaultValue={m.eligibility.status}>
                    {["applicant", "approved", "suspended", "revoked"].map(
                      (s) => (
                        <option key={s}>{s}</option>
                      ),
                    )}
                  </select>
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="induction"
                    defaultChecked={m.eligibility.induction === "passed"}
                  />
                  Verified induction passed
                </label>
                <label>
                  Attendance and induction approval evidence
                  <textarea
                    name="evidence"
                    defaultValue={m.inductionEvidence}
                    maxLength={2000}
                  />
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="onboarding"
                    defaultChecked={m.onboardingApproved}
                  />
                  Onboarding approved (identity, confidentiality and relevant
                  checks completed)
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="client"
                    defaultChecked={
                      m.eligibility.clientAccreditation === "approved"
                    }
                  />
                  Additional client accreditation approved
                </label>
                <fieldset>
                  <legend>Approved work categories</legend>
                  {catalogue.map((c) => (
                    <label key={c.id}>
                      <input
                        type="checkbox"
                        name="category"
                        value={c.id}
                        defaultChecked={m.eligibility.approvedCategories.includes(
                          c.id,
                        )}
                      />
                      {c.id} {c.title}
                    </label>
                  ))}
                </fieldset>
                <button disabled={busy}>Save member approval</button>
              </form>
            </details>
          ))}
          <h3>Create a work opportunity</h3>
          <p>
            Dates below use UTC. Confirm scope, hours, fee and deliverables
            before publishing. A published opportunity becomes visible only to
            approved categories.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              save({
                action: "work",
                ...Object.fromEntries(f),
                ...Object.fromEntries(
                  ["openAt", "bidsCloseAt", "startsAt", "finishesAt"].map(
                    (k) => [k, new Date(String(f.get(k)) + "Z").toISOString()],
                  ),
                ),
              });
            }}
          >
            <label>
              Package
              <select name="category">
                {catalogue.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} {c.title}
                  </option>
                ))}
              </select>
            </label>
            {["title", "summary", "outputs", "hours", "duration", "fee"].map(
              (k) => (
                <label key={k}>
                  {k}
                  <textarea
                    name={k}
                    required
                    maxLength={
                      k === "title" ||
                      k === "hours" ||
                      k === "duration" ||
                      k === "fee"
                        ? 200
                        : 5000
                    }
                  />
                </label>
              ),
            )}
            <label>
              Work type
              <select name="kind">
                <option value="internal">Internal WBD</option>
                <option value="client">Client (accreditation required)</option>
              </select>
            </label>
            {["openAt", "bidsCloseAt", "startsAt", "finishesAt"].map((k) => (
              <label key={k}>
                {k} (UTC)
                <input type="datetime-local" name={k} required />
              </label>
            ))}
            <label>
              Status
              <select name="status">
                <option value="draft">Draft</option>
                <option value="open">Open for bids</option>
              </select>
            </label>
            <button disabled={busy}>Create opportunity</button>
          </form>
          <h3>Opportunities</h3>
          {data.work.map((w: any) => (
            <article key={w.id}>
              <h4>
                {w.title} · {w.status}
              </h4>
              <p>
                {w.id} · {w.fee} · {w.hours} · {w.duration}
              </p>
              <p>
                {w.summary}
                <br />
                {w.outputs}
              </p>
              <p>
                Close {w.bidsCloseAt} · Start {w.startsAt} · Finish{" "}
                {w.finishesAt} (UTC)
              </p>
              {w.status !== "awarded" && (
                <details>
                  <summary>Revise scope and dates</summary>
                  <form
                    key={w.version}
                    onSubmit={(e) => {
                      e.preventDefault();
                      const f = new FormData(e.currentTarget);
                      save({
                        ...w,
                        ...Object.fromEntries(f),
                        ...Object.fromEntries(
                          [
                            "openAt",
                            "bidsCloseAt",
                            "startsAt",
                            "finishesAt",
                          ].map((k) => [
                            k,
                            new Date(String(f.get(k)) + "Z").toISOString(),
                          ]),
                        ),
                        action: "work",
                      });
                    }}
                  >
                    {[
                      "title",
                      "summary",
                      "outputs",
                      "hours",
                      "duration",
                      "fee",
                    ].map((k) => (
                      <label key={k}>
                        {k}
                        <textarea
                          name={k}
                          required
                          maxLength={
                            ["summary", "outputs"].includes(k) ? 5000 : 200
                          }
                          defaultValue={w[k]}
                        />
                      </label>
                    ))}
                    {["openAt", "bidsCloseAt", "startsAt", "finishesAt"].map(
                      (k) => (
                        <label key={k}>
                          {k} (UTC)
                          <input
                            type="datetime-local"
                            name={k}
                            required
                            defaultValue={w[k].slice(0, 16)}
                          />
                        </label>
                      ),
                    )}
                    <button disabled={busy}>Save revised scope</button>
                  </form>
                </details>
              )}
              {w.status !== "awarded" &&
                ["open", "closed", "cancelled"].map((status) => (
                  <button
                    key={status}
                    disabled={busy}
                    onClick={() => save({ ...w, action: "work", status })}
                  >
                    {status}
                  </button>
                ))}
            </article>
          ))}
          <h3>Private EOIs and bids</h3>
          {data.proposals.map((p: any) => (
            <details key={p.id}>
              <summary>
                {data.members.find((m: Member) => m.id === p.memberId)?.name} ·{" "}
                {p.kind.toUpperCase()} · {p.workId} · {p.status}
              </summary>
              <p style={{ whiteSpace: "pre-wrap" }}>{p.text}</p>
              {p.kind === "bid" && p.status === "submitted" && (
                <button
                  disabled={busy}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Award this assignment to this associate? Other bids will be marked unsuccessful.",
                      )
                    )
                      save({ action: "award", id: p.id });
                  }}
                >
                  Award assignment
                </button>
              )}
            </details>
          ))}
          <h3>Private assignment workspaces</h3>
          {data.assignments.map((a: Assignment) => (
            <details key={a.id}>
              <summary>
                {a.title} ·{" "}
                {data.members.find((m: Member) => m.id === a.memberId)?.name} ·{" "}
                {a.status}
              </summary>
              <p>
                {a.fee} · Start {a.startsAt} · Finish {a.finishesAt}
              </p>
              {a.messages.map((m) => (
                <p key={m.id}>
                  <strong>{m.actor}</strong>: {m.text}
                </p>
              ))}
              <h4>Deliverables</h4>
              {a.deliverables.map((d) => (
                <p key={d.id}>{d.text}</p>
              ))}
              <h4>Tasks</h4>
              {a.tasks.map((t) => (
                <p key={t.id}>
                  {t.done ? "Complete" : "Open"} · {t.title} · {t.due}
                </p>
              ))}
              <h4>Files</h4>
              {a.files.map((f) => (
                <p key={f.id}>
                  <a href={base + "/assignments/" + a.id + "/files/" + f.id}>
                    {f.name}
                  </a>
                </p>
              ))}
              <AssociateFileUpload
                busy={busy}
                upload={async (file) => {
                  setBusy(true);
                  setError("");
                  try {
                    await portalApi(base + "/assignments/" + a.id + "/file", {
                      version: a.version,
                      ...file,
                    });
                    await refresh();
                    setMessage("File uploaded.");
                  } catch (e: any) {
                    setError(e.message);
                  } finally {
                    setBusy(false);
                  }
                }}
              />
              <form key={'workspace-'+a.version}
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  save({
                    action: "assignment",
                    id: a.id,
                    version: a.version,
                    message: f.get("message"),
                    task: f.get("task"),
                    due: f.get("due"),
                    status: f.get("status"),
                  });
                }}
              >
                <label>
                  Private message
                  <textarea name="message" maxLength={10000} />
                </label>
                <label>
                  Add task
                  <input name="task" maxLength={500} />
                </label>
                <label>
                  Task due date
                  <input name="due" type="date" />
                </label>
                <label>
                  Assignment status
                  <select name="status" defaultValue={a.status}>
                    {["assigned", "in-progress", "submitted", "completed"].map(
                      (s) => (
                        <option key={s}>{s}</option>
                      ),
                    )}
                  </select>
                </label>
                <button disabled={busy}>Save workspace update</button>
              </form>
              {a.invoice && (
                <>
                  <p>
                    Invoice {a.invoice.number} · USD {a.invoice.amount} ·{" "}
                    {a.invoice.status} · Due{" "}
                    {a.invoice.dueAt || "after acceptance"}
                  </p>
                  <form key={'invoice-'+a.version}
                    onSubmit={(e) => {
                      e.preventDefault();
                      const f = new FormData(e.currentTarget);
                      save({
                        action: "assignment",
                        id: a.id,
                        version: a.version,
                        invoiceStatus: f.get("invoiceStatus"),
                        note: f.get("note"),
                      });
                    }}
                  >
                    <label>
                      Invoice status
                      <select name="invoiceStatus">
                        <option value="accepted">Accepted</option>
                        <option value="disputed">Disputed</option>
                        <option value="paid">Paid (record only)</option>
                      </select>
                    </label>
                    <label>
                      Acceptance / dispute / payment reference note
                      <textarea name="note" required maxLength={2000} />
                    </label>
                    <button disabled={busy}>Record invoice status</button>
                  </form>
                </>
              )}
            </details>
          ))}
          <h3>Notification delivery</h3>
          <p>
            Provider acceptance is not proof of inbox delivery. In-app
            notifications remain available. The server notification worker must
            be enabled by technical support.
          </p>
          {data.notices
            .slice(-30)
            .reverse()
            .map((n: any) => (
              <p key={n.id}>
                {n.subject} · {n.email} · attempts {n.attempts}
              </p>
            ))}
          <details>
            <summary>Audit trail</summary>
            {data.audit
              .slice(-100)
              .reverse()
              .map((a: any, i: number) => (
                <p key={i}>
                  {a.at} · {a.actor} · {a.action} · {a.resource}
                </p>
              ))}
          </details>
        </>
      )}
    </div>
  );
}
