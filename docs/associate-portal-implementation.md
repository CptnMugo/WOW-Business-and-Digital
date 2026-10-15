> Superseded implementation status (15 October 2026): the integrated source release and actual entry points are documented in [January and Associate release](january-and-associate-release-2026-10-15.md). The original design below is retained for context; it is not a statement that the portal is live.

# WBD Associate Portal — implementation plan (not yet live)

## Goal
Build professional associate capacity for WBD internal work now and client services later. Reuse existing associate registration and existing admin data; do not replace the live applications, payment, or enquiry workflows.

## Intended links (only enable after authentication is live)
- Public entry: https://www.wowbusinessanddigital.com/?page=associates (existing registration; confirm current live behaviour)
- Associate sign-in: https://www.wowbusinessanddigital.com/associate/login
- Approved member area: https://www.wowbusinessanddigital.com/associate/dashboard
- Director console: https://www.wowbusinessanddigital.com/admin/associates

Do not present the latter three URLs as live until deployed and smoke-tested. A route URL does NOT confer authorization.

## Entry and access flow
1. Applicant registers via existing form. Keep current records and identifiers.
2. Admin reviews application and confirms identity, confidentiality acceptance, and induction status.
3. Admin approves membership. System sends single-use, short-expiry invitation to the verified email.
4. Associate activates account through an established identity service (passwordless emailed sign-in code or passkey; MFA for admin accounts).
5. Server verifies authenticated session and approved status for EVERY protected API endpoint.
6. Show only assignments open to that associate's approved skill categories. Applicants can see status but not private opportunities.
7. Revocation immediately disables access and terminates sessions.
8. All staff/associate/client permissions must be enforced server-side; never rely on a hidden React tab or URL parameter.

## Pages
- Dashboard: welcome, status, deadlines, alerts
- Open opportunities: assignment, eligibility, fee, bid closes, starts, finishes
- Bid details: deliverables, attachments, submission, version/history, withdraw before close
- My bids: draft/submitted/shortlisted/awarded/declined
- My work: milestones, deliverables, handover, QA, completion
- Induction & specialist accreditation: category-specific competence status
- Profile & email settings
- Director console: create/revise/close assignment, designate categories, review bidders, approve award, complete, audit log, revoke access

## Suggested data objects
associates (existing_id, email, status, consent_version, approved_at)
credentials (identity_provider_subject; no plaintext password)
competencies (associate_id, category, evidence, status, assessor, review_date)
opportunities (reference, title, public_summary, scope, fee_currency, fee, opens_at, bids_close_at, starts_on, finishes_on, required_competencies, status, version)
bids (opportunity_id, associate_id, proposal, bid_fee, submitted_at, status)
awards (opportunity_id, associate_id, milestones, due_dates, accepted_at, status)
notifications (template, recipient, opportunity_id, trigger, sent_at, delivery_state, dedupe_key)
audit_events (actor, action, resource_id, timestamp)

## Date handling
Store deadlines in UTC timestamps and present Africa/Harare or Europe/London explicitly. Bid close strictly at exact timestamp (not arbitrary end of day). Validate start <= finish, open < bid close <= start, reasonable durations and fee. Avoid sending notices for cancelled or filled work.

## Automatic email triggers
- On publication: all active, opted-in, eligible associates. Never expose recipients to one another.
- 48h before bidding close: eligible non-bidders, once per opportunity and user.
- Bid submitted: acknowledgement; director notification.
- Decision: awarded / unsuccessful / on hold.
- 2 days before start: awarded associate.
- 3 days before finish: awarded associate, if not completed.
Each email includes reference, title, currency/fee, bid deadline, start, finish and authenticated deep link. Use queued, idempotent deliveries, retry with logging, bounce handling and email opt-out only for non-essential marketing; transactional messages follow account settings.

## Security and compliance gates
- DO NOT expose bids, associate contact information, client materials, test secrets, or internal documents in static files or browser code.
- All forms and uploads validated on backend. CSRF protection/rate limiting/secure sessions.
- Private files accessible only through scoped authorization and time-limited signed downloads.
- Separate internal WBD work and client projects in access rules.
- Check UK GDPR / international transfers and appropriate client contractual authorization before Zimbabwe-based associates access personal/client data.
- Keep payment and existing Resend/email infrastructure intact; do not send test emails to real applicants.
- Provide preview/staging environment, backups, rollback instructions and regression tests.

## Deployment sequence
A. Inspect current production registration tables/storage, mail integration, server routes and deployments.
B. Create schema migration with backups and preserve historical registrations.
C. Integrate identity and approved-invite flow; test denial of unauthorized access.
D. Build assignment and bid APIs with per-associate authorization.
E. Implement UI in React matching WBD branding, mobile friendly.
F. Implement email queue and dry-run, with fake recipient addresses in test.
G. Test existing enquiry, career accelerator, payments, admin submissions, and website navigation.
H. Director approves preview, then deploy and smoke-test public URLs.
I. Invite a small pilot cohort, monitor logs, then send wider invitations.

## Acceptance tests
- Existing associate registrants preserved.
- Unapproved user cannot view opportunities, even with guessed link or API URL.
- Associate A cannot see Associate B's bids or private data.
- Only qualified approved users can bid, and no late bid is accepted.
- Start, finish and deadline appear consistently on opportunity cards, bid form, director view and notifications.
- Exactly one relevant invitation per associate per published opportunity.
- Admin revocation immediately removes access.
- No regressions in payments, enquiry forms or admissions dashboard.
- Full audit trail, tested rollback and backup.

**Status:** implementation specification only. Portal authentication, data migration, bids, notifications and live URLs are not yet implemented by this document.
