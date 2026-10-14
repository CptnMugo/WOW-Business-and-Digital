# Urgent website forms and staff access hotfix – 14 October 2026

## Observed
- Associate CV submission displayed `Unexpected token '<' ... is not valid JSON`. This means an HTML response reached a client expecting JSON; it does **not** prove whether the application was stored.
- Staff dashboard login displayed `Please use the dashboard on the website.` The server's origin guard required an exact configured origin and would reject the other public domain spelling.

## Code changes
- Staff login now permits only the canonical WOW `www` and bare production origins (plus configured APP_URL), rather than treating a legitimate public hostname as foreign.
- Customer-facing Associate, Contact, Career Accelerator and career/taster forms now distinguish HTML/server errors, large payloads and rate limits; entered data is retained when confirmation fails.
- Staff dashboard API and website/career enquiry registers report user-friendly API routing errors rather than raw JSON parser text.
- Dashboard messages direct staff to technical support instead of naming an individual.
- Changes were staged in a branch for review; **no Namecheap deployment or live end-to-end transaction is asserted**.

## Required deployment verification (technical support)
1. Back up persistent `data` including `enquiries.jsonl`, `associate-cvs`, `registrations.json`, `career-enquiries.json`, `admissions-users.json`, `admissions-reviews.json` and payments. Do not overwrite data with source repository examples.
2. Verify Node process is running the current built `dist/server.cjs` from the expected working directory; confirm reverse proxy forwards **all** `/api/*` routes to Node (localhost:3000), not frontend HTML. Keep upstream errors visible as JSON where possible.
3. Confirm reverse proxy and any WAF permit a JSON request of at least 7 MiB at `/api/associate-enquiries` (a 5 MiB CV grows with Base64 encoding). Node's dedicated parser allows 7 MiB. Set proxy upload limit high enough, keeping all other security controls.
4. Set `APP_URL=https://www.wowbusinessanddigital.com`; redirect bare domain to canonical when feasible. Production must use HTTPS. Confirm staff account exists in persistent `data/admissions-users.json`, without exposing passwords.
5. Verify both production hostnames reach `/api/health` as JSON. Inspect POST response headers/status and server logs for failed associate request; a 413, 404, 502 or HTML fallback points to a deployment/proxy issue.
6. Run isolated `npm run lint`, `npm run build`, `python3 scripts/test-forms.py` (after build), `node --import tsx scripts/test-admissions-dashboard.ts`, and `node --import tsx scripts/test-career-enquiries.ts` in staging. Check other payments-specific tests before production release. These were **not run** as part of this remote GitHub-only edit.
7. In staging, use controlled test identities and check submission, saved record, attachments and email provider logs for: general enquiry, health/social care, Associate (no CV, valid PDF, valid DOCX, near 5 MiB, invalid/oversize), Career Accelerator application and its requested call, taster/adviser and corporate requests, workspace request, staff login under both origins, website enquiries, CV download. Confirm Stripe/recovery unmodified.
8. Deploy only after signoff, with rollback and downtime plan. Validate live end-to-end, including actual inbox arrival, and reconcile Kudzai's missing enquiry against the private register before asking for resubmission. Never submit her CV as test data.

## Limits
A fallback error is not proof a request was not saved, and client-side changes cannot fix a reverse proxy routing API requests to HTML. The website remains **unverified in production** until these checks pass.
