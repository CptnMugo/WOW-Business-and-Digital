# Application email: Resend sends, IONOS receives

Updated 3 October 2026 for Mugo. This replaces the earlier suggestion to switch to IONOS SMTP. The existing Resend integration should be retained. The filename is unchanged so previously shared links continue to work.

## What each service does

- Resend sends the website's staff application notifications and applicant acknowledgements.
- IONOS hosts the receiving inbox: wowdigital@wowbusinessanddigital.com.
- The website saves applications in its private data/registrations.json register before attempting email delivery.
- Google Sheets is an optional, separate tracking connection. It does not need to work for application emails to be sent.

Do not migrate the sender to IONOS SMTP or enter an IONOS mailbox password for this setup. Preserve existing application data and Stripe settings. Applicants must not need to reapply to recover a missed notification.

## 1. Check the website server settings

On Namecheap, in the website's private server environment, check:

```dotenv
MAIL_PROVIDER=resend
RESEND_API_KEY="EXISTING_VALID_RESEND_API_KEY"
RESEND_FROM="SENDER_ADDRESS_ON_THE_VERIFIED_RESEND_DOMAIN"
ADMISSIONS_EMAIL=wowdigital@wowbusinessanddigital.com
ENQUIRIES_EMAIL=wowdigital@wowbusinessanddigital.com
REPLY_TO_EMAIL=wowdigital@wowbusinessanddigital.com
```

The two quoted placeholder values above must be replaced privately on the server. Keep the existing valid Resend API key and verified sender where possible. Never commit secrets to GitHub or paste them into chat, email or screenshots. If MAIL_PROVIDER was set to smtp while following the earlier guide, change it to resend. IONOS SMTP credentials are not required.

Check the actual sender used by the running application: the existing code can map a root-domain Resend sender to contact.wowbusinessanddigital.com. Ensure that the actual sending domain is verified in Resend rather than assuming the configured From text alone proves it is correct.

Use the approved current website release. If updating code, back up the private data directory, pull main, run npm ci and npm run build, and restart the existing website process with updated environment (normally `pm2 restart wow-portal --update-env`). Keep one server instance and do not remove the data directory.

## 2. Trace the missing notifications

First confirm that the existing applications are in the register. Run from the website repository root, using the same environment and working directory as the running server:

```bash
node --import tsx scripts/admissions-email.ts list
```

The list shows references and stored staff-notification results without displaying the full applications or passwords. Find WOW-CA-26-9ZYDHQ and the other expected applications.

In Resend's email logs, look for the application reference in the subject and confirm the recipient is wowdigital@wowbusinessanddigital.com. Check the delivery outcome and any rejection or bounce details. If there is no corresponding Resend entry, inspect the website server logs and the saved record's emailDelivery result for an API/configuration error or a simulated-preview result.

Provider acceptance is not proof that a message reached the inbox. For messages reported delivered, check the IONOS inbox, spam and filtering rules. Do not treat a successful application screen or Google Sheets row as proof that the email was received.

## 3. Send and confirm one test

```bash
node --import tsx scripts/admissions-email.ts test --send
```

This sends one test email to ADMISSIONS_EMAIL using the configured sender. Confirm it appears in Resend's logs and actually arrives in the IONOS inbox. The `verify` command in this script is SMTP-only: do not use it for Resend.

Then submit one clearly labelled dummy application using an applicant inbox you control. Check both the staff email containing the application details and requested call slot, and the applicant acknowledgement. The acknowledgement should explain that payment is requested after the confirmation call and acceptance. Check the real inboxes, not only command output.

## 4. Recover missed staff notifications

Once delivery works, resend the required existing record:

```bash
node --import tsx scripts/admissions-email.ts resend WOW-CA-26-9ZYDHQ --send
```

Repeat with each reviewed application reference. This sends only the staff copy to the configured admissions inbox. It does not contact the applicant, issue acceptance, create another application or append another Google Sheets row.

The command skips records already marked accepted by the sending provider. If such a notification is confirmed missing after investigation, deliberately resend a copy with:

```bash
node --import tsx scripts/admissions-email.ts resend WOW-CA-26-9ZYDHQ --force-send
```

Run recovery serially, not in parallel, and confirm receipt before processing the remaining references. Duplicate emails are possible when intentionally forcing a resend. There is no automatic retry scheduler in this change.

## Completion checklist

- Existing applications are present and backed up.
- MAIL_PROVIDER selects Resend and the running process has a valid API key and verified sender.
- A staff test email reaches the IONOS inbox.
- A new dummy application sends both the staff notification and applicant acknowledgement.
- Missing earlier staff notifications are recovered without duplicate applications.
- Google Sheets is repaired separately if it is still wanted; its historical data is preserved.

This is a documentation correction. It does not switch providers, change live server settings or send emails. Actual delivery must be checked on the deployed Namecheap-to-Resend-to-IONOS route.
