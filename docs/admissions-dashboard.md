# Private applications dashboard (approved, awaiting Namecheap deployment)

## For Rennie

After deployment, open `https://www.wowbusinessanddigital.com/?page=manage-applications` and sign in using the staff credentials Mugo supplies privately. This page is not added to the public menu.

Use **Open application** to see the original answers. The applicant's requested call time is not a confirmed booking. Contact them, then enter the agreed date, time and time zone. Save review notes and the status. The dashboard records these changes; it does not send appointment invitations, acceptance/rejection emails or payment requests. Send those separately. Payment is requested only after acceptance and according to the agreed schedule.

**Email checks** shows whether the provider accepted each message for sending. It cannot prove inbox delivery. If an acknowledgement is missing, check Resend's delivery log and spam folder. An explicit resend button can send the acknowledgement again, or send the application to admissions. A confirmation warns about duplicates. An awaiting-review acknowledgement cannot be resent after an acceptance/rejection is recorded.

**Export spreadsheet** downloads a CSV for Excel or Google Sheets. It contains personal data and internal notes: keep it private. **Payments recorded** only includes live Stripe payments in this website's ledger, matched to the application reference, less recorded refunds. It does not include test transactions or necessarily include bank transfers.

The standalone preview uses fictional records. Actions remain in memory; reopening resets it. It does not connect to real applications, Resend or Stripe.

## Mugo: before deployment

Rennie approved the dashboard preview and GitHub update on 3 October 2026. Namecheap deployment and staff account setup remain outstanding.

1. Back up the existing private `data` directory, especially `registrations.json` and `payments.json`. Confirm the running process's working directory. These files must remain present across code deployments. Do not use a new empty data directory or replace the real register with demo records. The dashboard reads the same `process.cwd()/data/registrations.json` as the existing submission endpoint. No Google Sheets reconfiguration is needed for this dashboard.
2. Configure `NODE_ENV=production` and `APP_URL=https://www.wowbusinessanddigital.com`. Redirect other hostnames to this canonical origin. Serve over HTTPS; the staff cookie is Secure in production. Retain the loopback reverse proxy and existing Stripe webhook configuration.
3. Keep Resend configured server-side: `MAIL_PROVIDER=resend`, `RESEND_API_KEY`, verified `RESEND_FROM`, and `ADMISSIONS_EMAIL=wowdigital@wowbusinessanddigital.com`. IONOS remains the inbox host. Do not put any keys or the existing admin bearer token in the browser.
4. In the same working directory as the server, create individual staff access:
   `node --import tsx scripts/admissions-user.ts create STAFF_EMAIL "DISPLAY NAME"`
   It prints a randomly generated password once in the operator's terminal. Share it privately through a password manager. Do not put passwords in email, GitHub, screenshots or this document. Re-running create resets the password and invalidates existing sessions. Revoke access with `node --import tsx scripts/admissions-user.ts revoke STAFF_EMAIL`.
5. New private files: `data/admissions-users.json` (salted scrypt password hashes) and `data/admissions-reviews.json` (internal notes, status, confirmed call details and last editor). Add them to the same restricted backup and retention arrangements as applications. Never serve or commit the data directory. Only authorised staff should get accounts. Sessions expire after one hour and on server restart. Accounts require administrator-assisted password resets.
6. Run one Node application instance. Current JSON persistence and in-memory sessions/rate limits are designed for one process; a shared transactional database and session store are required before multiple instances or PM2 cluster mode.
7. Pull the approved GitHub update, run `npm ci` and `npm run build`, then restart the existing Node service using its current process manager. Staff open `/?page=manage-applications`; public forms, payments and simulation retain their existing routes.
8. In staging, confirm unauthorised API access fails; sign in; check existing known application references and full answers; edit a dummy record; export; sign out. Verify on an actual phone. With permission, send a clearly labelled test application to controlled inboxes; check both Resend delivery events and actual inbox receipt. Do not treat an accepted API response as delivery confirmation.

## Known boundaries

This dashboard cannot reconstruct applications that were never saved or were stored on another server. If the register is empty, inspect the previous deployment and backups. Do not assume email failure means no saved application.

Review metadata is separate from original submission data, avoiding overwrite of applicant answers or payment state. Optimistic versions stop one reviewer silently overwriting another. Decision changes do not enforce payment eligibility in the existing checkout endpoint; acceptance-gated payment links and automatic decision emails are a separate change.

This first version has no mailbox reader, appointment/calendar integration, role hierarchy, MFA, full historical audit log or automatic acceptance/payment messages. The last editor and update time are recorded. The existing legacy bearer-token admissions API remains unchanged; keep its token private.

## Local checks

`npm run lint`
`npm run build`
`node --import tsx scripts/test-admissions-dashboard.ts`
`node --import tsx scripts/build-admissions-preview.ts`

Integration tests create an isolated temporary register and fake email provider; they never use real recipients, payment keys or the production data directory.
