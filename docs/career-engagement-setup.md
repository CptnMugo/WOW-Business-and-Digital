# Taster, adviser-call and corporate enquiries

Separate public links after deployment:
- `https://www.wowbusinessanddigital.com/?page=career-explore`
- `https://www.wowbusinessanddigital.com/?page=corporate-career`

This release collects REQUESTS, not confirmed bookings. Outlook is not connected. It does not reserve a time, prevent duplicate time requests, create invitations or send joining links. Staff must check availability and email confirmation separately. The page and acknowledgement explicitly explain this limitation. Do not promote it as automatic booking.

Records are saved privately in `data/career-enquiries.json`, separately from applications. Preserve the existing data directory when deploying; back it up and ensure Node can write to it. Staff sign into the existing admissions dashboard and open the new enquiries register. They can review details, record status/notes, and see provider acceptance status. No Google Sheets changes or automatic sync for these new enquiries. No changes to Stripe or registration email handlers.

Staff alerts reuse the current Resend configuration and ADMISSIONS_EMAIL. An email failure does not discard the request. Check Resend delivery logs; provider acceptance is not proof of inbox delivery. Status changes do not send emails.

## Outlook setup still required

User confirmed Microsoft 365 account: wowdigital@wowbusinessanddigital.com (the earlier reversed domain was withdrawn). Verify the account is the intended calendar owner; do not change existing website sender settings.

Suggested next implementation: Microsoft Bookings shared booking page, linked from the new explore page once its public service URLs have been supplied and tested. This is NOT connected in this commit. A Microsoft Bookings route stores bookings in Microsoft 365; synchronisation into the website register would be a separate integration, not automatic.

1. Sign in to Microsoft 365, open Bookings and create/select a shared booking page for WOW Career Accelerator.
2. Add the actual adviser as staff. Configure availability using their Outlook calendar. Confirm the required Bookings/Teams licence and availability with the Microsoft 365 administrator.
3. Create a free adviser-call service: 15-minute duration and intervals; one attendee; only 8 and 9 October 2026, 11:00 to 14:00 Europe/London. Last start is 13:45. Exclude all other dates.
4. Create a free group taster service: four hours; only 10 and 16 October 2026, 10:00 to 14:00 Europe/London. Set a real capacity agreed by WOW; do not invent one.
5. Require name and email. Enable online meetings if Teams is licensed, confirmation emails and reminders. Verify joining details appear in the participant invitation.
6. Test an external visitor booking, calendar entry, time-zone display, cancellation and simultaneous slot booking. Test group privacy and confirm participants cannot see other participants' contact details.
7. Supply the public service links for the website connection. Do not share passwords or client secrets in chat.

An existing named/shared Outlook calendar may differ from the Bookings mailbox and staff calendars. Confirm where WOW wants events visible before claiming the exact Artroom calendar is integrated.

## Deployment checks

Run lint/build, new enquiry tests and existing payments/forms/admissions checks. Deploy via Mugo's existing procedure; do not replace data or .env. Submit an authorised dummy corporate enquiry and session request after deployment; verify the private register and actual inbox delivery. Remove test data only after identifying exact records. Existing payment and application journeys must still pass a browser smoke test.
