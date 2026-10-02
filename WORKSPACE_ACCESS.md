# Simulation workspace access

This workspace is used during the Project Management Career Accelerator training programme, including approved 3-hour tasters and 5-day simulations. Requests do not create access automatically.

## Review and approve

The project manager reviews the saved queue with Mugove or an authorised server operator. No public administration endpoint exists.

1. On the website server, from the repository root, run `node --import tsx scripts/workspace-access.ts list` to review names, reasons and request references. The queue must be checked regularly; this version does not email notifications automatically.
2. Confirm the participant's identity and arranged session or programme membership. Requests alone do not verify the email address.
3. Run `node --import tsx scripts/workspace-access.ts approve participant@example.com 210`. Choose the access duration for the agreed programme or taster (1–365 days). This creates a random, one-use sign-in code valid for 24 hours. Existing sessions are invalidated.
4. Share the code privately with the confirmed applicant at the requested email, and direct them to `https://www.wowbusinessanddigital.com/?page=project-simulation`. Do not post codes in public channels. No message is sent automatically by this command.
5. The participant selects Sign in, supplies email and code, then enters the simulation. Sessions last at most eight hours, or until the access end date. Sign-out ends the session. The participant needs a newly issued code for their next sign-in; a durable account or automated email-code service is not implemented in this version.
6. To withdraw access immediately, run `node --import tsx scripts/workspace-access.ts revoke participant@example.com`.

## Deployment and checks

Deploy the complete repository, including `server/workspaces/simulation.html`, the access service and operator script. Use HTTPS. `PUBLIC_ORIGIN` defaults to `https://www.wowbusinessanddigital.com`; configure it to the actual canonical origin if different. Only a local reverse proxy is trusted for client address forwarding. Protect `DATA_DIR` and back it up; it defaults to the repository's `data` directory. This version assumes one Node server instance and a local filesystem; multiple independent instances need a shared access store and limiter.

Before launch, verify a real request, manually review and approve it, deliver its code to the confirmed participant, check successful sign-in, expired/reused code rejection, logout and revocation. Confirm that unauthenticated requests to `/api/workspace/content` are rejected and that HTTPS sets the secure session cookie. The standalone offline HTML preview cannot perform authentication or submit requests.

Simulation interactions remain scripted. Login does not add live AI, shared task boards or automatic assessment. Notes remain on the device rather than being stored per participant on the server. On shared devices, participants should download and reset their notes before signing out.
