# IONOS application email - setup for Mugo

The website saves each application in `data/registrations.json` before attempting emails. Google Sheets is optional and independent of these emails. Back up the private data directory before deployment. Do not delete records or ask existing applicants to reapply.

## Server settings

Pull the current GitHub main branch and edit the private server `.env` file. Preserve the existing Stripe and application settings. For an ordinary IONOS UK Mail mailbox, use:

```dotenv
MAIL_PROVIDER=smtp
SMTP_HOST=smtp.ionos.co.uk
SMTP_PORT=465
SMTP_USER=wowdigital@wowbusinessanddigital.com
SMTP_PASS="ENTER_THE_MAILBOX_PASSWORD_PRIVATELY_ON_THE_SERVER"
SMTP_FROM="WOW Admissions <wowdigital@wowbusinessanddigital.com>"
ADMISSIONS_EMAIL=wowdigital@wowbusinessanddigital.com
ENQUIRIES_EMAIL=wowdigital@wowbusinessanddigital.com
REPLY_TO_EMAIL=wowdigital@wowbusinessanddigital.com
```

Use the mailbox password, not the main IONOS account password. Never commit this file, paste the password into chat or expose it in screenshots. Port 465 uses implicit TLS; if the host blocks it, use port 587, for which the code requires STARTTLS. These settings are for IONOS UK Mail, not IONOS Hosted Exchange.

Explicit MAIL_PROVIDER=smtp bypasses leftover Resend settings. Google Sheets can remain configured; an unsuccessful Sheets sync does not undo the saved application or email attempts. If abandoning Sheets, remove GOOGLE_SHEETS_WEBHOOK_URL from the server configuration without deleting its historical sheet.

Run npm ci and npm run build, then restart the existing PM2 website process with updated environment (normally `pm2 restart wow-portal --update-env`). Keep one server instance and preserve data during updates.

## Check and test

From the website repository root, using the same private environment and data directory as the running website:

```bash
node --import tsx scripts/admissions-email.ts verify
node --import tsx scripts/admissions-email.ts test --send
node --import tsx scripts/admissions-email.ts list
```

Verify checks SMTP login without sending. Test sends one email to ADMISSIONS_EMAIL. Confirm it arrives in the real IONOS inbox, including spam filtering; provider acceptance alone is not proof of inbox delivery. List shows references and notification results without printing full applications or passwords.

Submit one labelled dummy application with a call preference and an email address you control. Check both the staff details email and applicant acknowledgement, and verify the saved call date/time. The acknowledgement must not request payment before acceptance. Do not repeat applications to recover missing notifications.

## Recover existing staff notifications

Review references in list, then resend each required record:

```bash
node --import tsx scripts/admissions-email.ts resend WOW-CA-26-9ZYDHQ --send
```

This sends only the staff copy, to the configured admissions inbox. It does not send an acceptance, contact the applicant or append another Google Sheets row. It skips records already marked accepted by the email provider. If the provider previously accepted a message but it never reached the inbox, review it first, then use `--force-send` instead of `--send` to intentionally send another copy. Run recovery serially, not in parallel. Confirm arrivals before recovering the remaining records.

New SMTP failures are recorded with a diagnostic code in the registration's emailDelivery entry. EAUTH typically means authentication failure; connection/time-out errors require checking the VPS outbound SMTP access. Saved email state records sending-provider acceptance, not mailbox delivery or read receipt. Application records remain available even when notification delivery fails. There is no automatic retry scheduler in this change.

The server operator must enter credentials and verify actual delivery. Local tests use mocked SMTP and do not prove that the Namecheap-to-IONOS connection works.

IONOS reference (checked 3 October 2026): https://www.ionos.co.uk/help/email/general-topics/ionos-mail-server-details-for-imap-pop3-and-smtp/
