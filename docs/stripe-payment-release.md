# Stripe payment journey - preview release, 2 October 2026

Approved for GitHub release on 2 October 2026. Namecheap deployment and connected Stripe tests remain. Preserve the 14 November intake and private simulation.

## Pricing for review

- £50 registration deposit is credited towards tuition, not an additional fee.
- Standard programme: £900 total when paid in full by 31 October 2026, otherwise £1,000.
- Instalments: £500 by 31 October and £500 by 30 November. A prior £50 payment reduces the first instalment to £450.
- Mentorship: £1,250; no standard early discount.
- Bespoke amount: £1 minimum, no more than the programme balance. This is an agreed programme part payment, not a general business invoice checkout. A live small payment is a real charge; use test mode for tests.
- Rennie confirmed £900 early settlement or £500 + £500 instalments. There is no separate £500 full-fee offer.

Submission saves an application. A verified live net payment of at least £50 reserves a place subject to admissions review. Payment does not approve eligibility or grant simulation access. Sponsorship requires written agreement. Review the cancellation terms before release, including handling applications declined after payment.

New references use WOW-CA-YY-XXXXXX, excluding visually ambiguous characters. Existing references are preserved. Private payment links use a separate HMAC token, not the public reference as authentication.

## Server setup after preview approval

1. Back up the private `data` directory. Deploy only the reviewed commit and run `npm ci` and `npm run build`.
2. Configure server environment variables, never browser VITE variables:
   - `APP_URL=https://www.wowbusinessanddigital.com` (choose the canonical origin)
   - `STRIPE_SECRET_KEY`: Stripe test secret initially
   - `STRIPE_WEBHOOK_SECRET`: secret for this endpoint and mode
   - `PAYMENT_LINK_SECRET`: persistent randomly generated secret, at least 32 characters. Generate with `openssl rand -hex 32`. Do not paste it into GitHub/chat. Rotating this invalidates emailed links.
3. Register the Stripe webhook `https://www.wowbusinessanddigital.com/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `charge.refunded`. Preserve the raw request body; do not pre-parse it at a proxy. Match test/live secrets.
4. Restart the Node process with updated environment. Run exactly one PM2 instance: this release uses the existing single-process JSON storage and process-local checkout locks. Do not enable cluster mode without transactional shared storage.
5. Keep `data/registrations.json`, `data/payments.json` and `data/payment-customers.json` private, writable by the app and included in backups. Never serve `data` as static assets or delete it during deployment. Google Sheets remains the application tracker; the signed payment ledger is the payment record, not a Sheets success flag.
6. Enable successful payment receipt emails and staff payment notifications in Stripe. Confirm actual receipt delivery. Existing application email now includes the private payment link; no new bespoke payment email dispatch is claimed.
7. In Stripe test mode, submit a dummy application. Verify the short reference and received email link. Use Stripe's documented test card 4242 4242 4242 4242 with a future expiry and test CVC. Test £50, then the £850 early balance or £450 first-instalment remainder; use separate applications for separate paths. Also test cancellation, declined cards and £1 bespoke test payment. No test payment should reserve a real place.
8. Verify webhook deliveries return HTTP 200, refresh the return page, and confirm payment is recorded only once. Test payment where the browser never returns. Test a refund and confirm net balance reduces. Review the protected GET `/api/stripe/ledger` using the existing admissions bearer token. GET `/api/registrations` includes livePaymentTotal (pounds) and recovered private payment links for existing applicants. The ledger stores amounts in pence. Do not publish either response.
9. After approval and successful test-mode checks, replace the key and webhook secret with live-mode values, restart and check `/api/stripe/status`. It should report configured:true, mode:live. Perform an explicitly authorised small real payment and refund before opening applications. Never use Stripe test cards in live mode.

The server rejects missing configuration, forged tokens, client-supplied fixed prices and unverified callbacks. It records signed webhooks even without a browser return, expires old open sessions before replacement checkout and separates live/test balances. Refund webhooks subtract refunded amounts; disputes/chargebacks still require operator review in Stripe. No payment key is bundled in the frontend.

## Verification

Local production build, TypeScript, page rendering, 63 form HTTP checks, 20 private workspace checks and 51 payment checks passed. Payment tests use a mock Stripe client and genuine local signature verification; no real Stripe connection, charge or email delivery has been verified. Offline preview uses explicitly labelled demonstration data and never contacts Stripe.
