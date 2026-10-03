# Confirmation call and payment wording - 3 October 2026

Applications request a preferred date, time, time zone/city and optional alternative availability for a 10-minute confirmation call. The request is saved in the admissions register and included in the staff notification; the applicant acknowledgement repeats the preferred slot without confirming a booking.

The application confirmation and acknowledgement no longer ask for payment or show a payment link. Payment is requested after the call and acceptance. The £50 reservation deposit is available after acceptance and remains credited towards the programme fee. Related programme, payment and terms wording follows this sequence.

This is a wording and form-data update, not an automated calendar or admissions decision workflow. WOW must confirm the call, review the application and issue the acceptance email with the agreed payment schedule and private payment instructions. The existing checkout API has not gained an acceptance-status enforcement gate in this change; previously issued links require operational care until that workflow is implemented.

Namecheap deployment remains required. Missing email delivery and Stripe configuration are separate unresolved server tasks. Check existing registrations and their recorded email delivery results before asking anyone to reapply. Preserve all existing data files during deployment.

Verified: TypeScript, production build, rendered-page checks, and 66 isolated HTTP form checks including persistence of call preferences and rejection of invalid date/time or missing time zone. No external emails, bookings or payments were made.
