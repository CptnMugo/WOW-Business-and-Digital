# January intake and integrated Associate portal — 15 October 2026

## Status

Prepared on `feature/january-cohort-associate-portal`, starting from current main `da30fe0` and retaining the earlier Phase 1 rules branch `2887f58`. This document is not proof of Namecheap deployment or live operation. No real registrants have been invited or emailed by this implementation work.

## Career Accelerator

- November applications are visibly struck through and closed. New applications are for January 2027, exact start date to be confirmed. Existing records are retained unchanged. A stale November application is rejected with a reload message rather than silently moving its applicant to January.
- Saturday 28 November 2026, 10:00–14:00 UK GMT is the new request-only taster. October sessions are removed; adviser calls are arranged by contacting WOW until new slots are agreed. Calendar integration is not claimed.
- £1,000 tuition, two £500 instalments and £50 credited deposit retained. No January discount or deadlines invented. Existing November payments and private recovery routes retained. January accounts cannot select the November £900 offer.

## Associate journeys implemented

1. Existing public registration continues to store the original enquiry and optional CV. It now links to Associate sign-in; the footer and site directory also link there.
2. Director opens **Staff dashboard → Associate portal administration**, reviews an existing registrant and invites that registration. No arbitrary email identity is created. An invitation does not approve membership or bidding.
3. Invited associate requests a single-use emailed code, valid 30 minutes. An HttpOnly SameSite Strict cookie authorises an eight-hour session. Revocation/suspension is checked on every protected request. Codes and sessions are memory-only, so a server restart requires a fresh code.
4. Associate reads induction, records RSVP, updates skills/availability and submits private EOIs of up to 5,000 words against the 12-package catalogue before induction approval. The 17 October induction time follows the latest instruction: 12:00–14:00 Zimbabwe / 11:00–13:00 UK BST; Zoom details are sent separately.
5. Director verifies attendance/induction evidence, onboarding and approved work categories. Client accreditation is a separate Director control. An EOI in the work category is required first. Only eligible members can formally bid on open work within its UTC deadline.
6. Director creates, revises, publishes/closes/cancels opportunities and awards a submitted bid. Each opportunity has scope, outputs, fee, hours, duration and bid/start/finish dates. No packages are automatically commissioned or awarded from the catalogue.
7. Awarded member and Director have a private assignment workspace: messages, tasks, files, deliverables and status. Associates cannot read other members' submissions, assignments or files. Director uploads files through the same private workspace; public URL guessing does not provide access.
8. Associate records an invoice at assignment completion. Director records acceptance/dispute/payment status and reference notes. Acceptance establishes the seven-calendar-day due date; the software records payment status and does not transfer money. Private files can carry the invoice document.
9. In-app notices and an email queue cover invitations, opportunities, submissions, decisions and workspace updates. The enabled worker checks bid/start/finish reminders every minute (48 hours before deadlines) and deduplicates notices. Provider acceptance is recorded separately from inbox delivery. Failed notices retry at most three times, 15 minutes apart; a crash leaving `sending` requires operator review before retry to avoid duplicates.

## Mugo: deployment configuration and preservation

- Keep current `data/` intact; do not copy repository sample registrations over production records. Back up the complete persistent folder before deployment and retain the rollback build.
- New private storage: `data/associate-workspace.json` and `data/associate-files/`. The separate historical prototype `associate-portal.json` is not mounted or used by the integrated portal. No migration or deletion of enquiries/CVs/admissions data is performed.
- Use **one Node process** for this file-backed release. Do not run multiple workers/containers against these JSON files. Move to a transactional shared database before scaling beyond one writer.
- Set `NODE_ENV=production`, `APP_URL=https://www.wowbusinessanddigital.com`, and `ASSOCIATE_DIRECTOR_EMAILS` to the approved Director's existing staff email(s). Empty means deny all Director operations. This does not create or reset staff credentials.
- Set `ASSOCIATE_NOTIFICATIONS_ENABLED=true` only after staging verifies the existing mail configuration. Until enabled, notices remain visible in-app; explicit sign-in-code requests still use the configured sender.
- Reverse proxy all `/api/*` to Node. Allow at least 7 MiB JSON on the two `/api/.../associate-portal/.../file` and `/api/associate-portal/.../file` upload routes, in addition to the existing Associate registration CV route. Keep private `data/` outside static hosting and backups access-controlled.
- Files are limited to 5 MiB and downloaded as attachments. No automatic malware scanner, ID-document intake, electronic NDA-signature service, calendar integration or banking integration is claimed. Director onboarding approval records checks completed through the agreed external process.
- Public entry after deployment: `/?page=associates`; invited login `/?page=associate-portal` (also `/associate/login` and `/associate/dashboard`); Director controls stay inside existing authenticated staff dashboard. Do not announce these as live before checking the deployed build.

## Validation

- TypeScript and production client/server build.
- 71 isolated HTTP form checks, persisted registration assertions and cohort metadata checks; stale November applications rejected.
- 65 mocked payment checks, including January offer rejection, private links, credit calculations, recovery, return/cancellation verification, webhook and live/test separation.
- 71 integrated portal checks: invitations, single-use code replay, Director allowlist, origin guards, private data/file isolation, EOI and induction/bid gates, client accreditation, deadline enforcement, award, optimistic versions, invoices, reminders, revocation and old-record preservation.
- Existing 42 admissions checks, website enquiry checks, updated taster checks and retained Phase 1 domain/storage/security tests.
- Static React rendering checks for closure strike-through, January wording, GMT taster, current form options and discovery links.

No browser interaction against the new build, real email arrival, production login, production file upload or live payment was tested. Before Mugo publishes, exercise two staging associate accounts and the Director UI end to end, including both-direction file exchange, bid withdrawal/resubmission and the invoice lifecycle. Check public and private payment journeys and Stripe return/cancellation on staging. Then deploy with rollback available and verify the actual live build. This source release does not itself deploy Namecheap.
