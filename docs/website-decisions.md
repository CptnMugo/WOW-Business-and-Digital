# Current website decisions - 3 October 2026

Later explicit user corrections override earlier plans, previews and memory. This is a maintained decision baseline, not proof of live deployment.

- Application -> requested 10-minute confirmation call -> agreed call -> acceptance email and agreed payment schedule -> payment. Never demand payment in the application acknowledgement.
- Call preference fields sit at the bottom of the application. Show a reference after submission. Clear submitted browser form data.
- Standard tuition £1,000; early full settlement £900 by 31 October 2026; £500 + £500 instalments by 31 October / 30 November. £50 after-acceptance deposit is credited against tuition, including the first instalment. Start 14 November 2026, six months.
- Executive mentorship is an OPTIONAL ADDITIONAL service, three private 60-minute sessions. No public price; discuss fee and payment arrangements. Preserve old agreed records without advertising legacy prices.
- Public Payments must never send an existing applicant back to the application form. Show an explicit Stripe payment action and explain any unmet prerequisite. Private links associate payment with a saved application. Recovery must not reveal private details or send a payment request before acceptance.
- Admissions dashboard uses private staff accounts and the existing server register. Review status changes alone do not send acceptance emails. Staff must record Accepted after the call before payment-link recovery can email the applicant. Resend sends email; IONOS hosts the inbox. Provider acceptance is not inbox delivery.
- Preserve approved transparent WBD logo, navy/gold/cream branding, sharp text, compact footer, working routes and forms.
- Four services: Programme and Project Delivery; Digital Transformation; Change and Adoption; PMO and Governance. Preserve multidisciplinary associates positioning.
- Genuine live WOW projects, including products and concepts, remain part of the programme. Do not substitute simulations for real work or promise third-party client work. No Zimbabwe marketing wording for now.
- Preserve private request-and-login simulation access, 3-hour and 5-day experiences, WOW agent, and honest scripted/device-voice labelling.

## Findings on 3 October, evening

Compared GitHub main bca7658 with the approved morning dashboard commit. Preserved Mugo's later Stripe configuration and wording changes before editing. Live assets contain the same payment-to-application button found in source. Live Stripe status reports live mode and webhookConfigured=false. No real charge or private applicant data was accessed in this review.

The public payment page previously omitted the Stripe submit button when reference/token were absent and offered an application button instead. Initial application emails correctly omit payment links, but the public page offered no link recovery. That combination left accepted applicants stuck. The correction removes the application detour, keeps a visible payment button with an explanation when locked, and provides email-link recovery only for an application recorded as Accepted.

A Namecheap deployment is still required for code changes. The Stripe webhook must separately be configured and verified: without it, payments abandoned before browser return may not be recorded reliably. Do not describe the live payment journey as fully verified until an authorised end-to-end test confirms it.

## 4 October: separate Career Accelerator enquiries

- User confirms a successful live payment. Preserve payment, application, Resend and Google Sheets handlers.
- Separate taster/adviser and corporate enquiry routes. Main programme CTA remains application; no payment is taken on application. November start remains 14 November 2026; limited places, no invented remaining-place count or filling-up claim.
- Taster dates: Saturday 10 and Friday 16 October, 10am to 2pm UK time. Calls: Thursday 8 and Friday 9 October, 15-minute predefined starts from 11am through 1:45pm. Separate from the existing 10-minute application confirmation call and private 3-hour/5-day simulations.
- New forms are request-only pending Outlook configuration. Never claim time reservation, automatic calendar entry or joining details before connected. Requests appear in a separate authenticated dashboard register, not the application Google Sheet.
- Confirmed Outlook address: wowdigital@wowbusinessanddigital.com. No credentials or Bookings service links supplied. See career-engagement-setup.md for activation steps and current limitations.
