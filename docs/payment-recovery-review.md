# Payment correction review - 3 October 2026

Status: reviewed and approved by Rennie for GitHub on 4 October 2026. Namecheap deployment remains outstanding.

## Baseline and preservation

Compared against Mugo's GitHub main commit bca7658a007f2717516672de7e9cdcebb0d28789, tree 770952245b5255d1342c09a9ff6fbdf5bb52dfa9. This includes his optional-webhook checkout configuration and bespoke-payment wording changes. Recheck main before any push. No access to the VPS filesystem or environment was available, so server-only differences are not verified.

The only production files changed by this correction are `src/components/PaymentsSection.tsx` and `server/payments.ts`. The existing email-sending function is reused without changing its implementation or configuration. Application submission, registration email templates, Google Sheets synchronisation, saved records, staff dashboard, simulation, branding and other pages are unchanged. No credentials or real applicant data are included.

## Result

Public Payments shows all existing payment choices and a visible Stripe action. With no private link it explains why payment is locked and offers reference/email recovery. It no longer offers an application button. A valid private link loads the saved payment balance and enables checkout. Deposit credit, instalments, bespoke amounts and Stripe success/cancellation handling remain.

Recovery sends only to the saved email address when the saved admissions review status is Accepted. It does not update the application, send an acceptance decision, or submit anything to Google Sheets. Unmatched/pending applications receive the same generic response and no payment email. Requests are rate-limited. No private payment URL is returned in the public API response.

## Required operating step

After the confirmation call, staff record Accepted in the existing private dashboard and communicate the acceptance and payment schedule. Payment-link recovery then works. Merely changing a Google Sheet row does not change dashboard status. Confirm staff access is available before deploying this flow. Existing private payment links retain their current behaviour; this patch does not introduce a new global checkout-approval gate.

## Deployment

Preserve existing VPS environment settings, data directory, Resend configuration, Google Sheets integration and Stripe keys. Apply the narrow changes onto the current server code, inspecting any local/server-only differences first. Do not replace the entire project from an older archive. Build and restart the existing service after approval.

The public Stripe status previously reported webhookConfigured=false. Configure and verify the webhook separately with Mugo; this patch does not change his decision to allow checkout without it. Without webhook delivery, a payment may rely on the browser returning for it to be recorded.

## Verification

TypeScript and production build pass. Local payment tests cover accepted/pending/wrong-email recovery, private tokens, balance credits, quote amounts, cancellation/duplicate sessions and webhook signatures using mocks. Form and private simulation checks passed in the preceding review. Rendering assertions cover the public Payments route without credentials and the retained application/form wording.

The interactive file uses the actual payment component with preview-only mocked requests and checkout interception. Its demo data never reaches the website or Stripe. It is not evidence of a successful live transaction. Real inbox delivery, browser/device validation on the deployment and a live Stripe transaction remain unverified.
