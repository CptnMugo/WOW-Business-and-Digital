import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export interface RegistrationData {
  referenceNumber: string;
  paymentUrl?: string;
  submittedAt: string;
  submissionType: 'APPLICATION' | 'SUBMIT_AND_PAY' | 'FREE_TESTER';
  submissionId?: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: string;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  employmentStatus?: string;
  currentJobTitle?: string;
  currentCompany?: string;
  experienceLevel?: string;
  highestQualification?: string;
  linkedInUrl?: string;
  careerGoals?: string;
  programTitle?: string;
  cohortDate?: string;
  learningMode?: string;
  paymentPreference?: string;
  confirmationCallDate?: string;
  confirmationCallTime?: string;
  confirmationCallTimeZone?: string;
  confirmationCallAlternative?: string;
  packageSelection?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  specialRequirements?: string;
  emailDelivery?: {
    staffAlert: { sent: boolean; method: string; timestamp: string; previewHtml?: string };
    delegateWelcome: { sent: boolean; method: string; timestamp: string; previewHtml?: string };
  };
  sheetsSync?: {
    synced: boolean;
    timestamp: string;
    targetUrl?: string;
    error?: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');

// Saving failures must reach the API; never replace an unreadable register with an empty one.
function ensureDataFile() {
  fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
  if (!fs.existsSync(REGISTRATIONS_FILE)) fs.writeFileSync(REGISTRATIONS_FILE, '[]', { mode: 0o600 });
}
export function getAllRegistrations(): RegistrationData[] {
  ensureDataFile();
  const records = JSON.parse(fs.readFileSync(REGISTRATIONS_FILE, 'utf-8'));
  if (!Array.isArray(records)) throw new Error('Admissions register is not an array');
  return records;
}
export function saveRegistration(record: RegistrationData): RegistrationData {
  const existing = getAllRegistrations();
  const index = existing.findIndex(r => r.referenceNumber === record.referenceNumber);
  if (index >= 0) existing[index] = record; else existing.unshift(record);
  const temporary = REGISTRATIONS_FILE + '.tmp';
  fs.writeFileSync(temporary, JSON.stringify(existing, null, 2), { mode: 0o600 });
  fs.renameSync(temporary, REGISTRATIONS_FILE);
  return record;
}

// Generate Google Apps Script snippet for 1-click Google Sheet integration
export function getGoogleAppsScriptSnippet(): string {
  return `/**
 * Google Apps Script for WOW Academy Delegate Registrations
 * Instructions:
 * 1. In your Google Sheet, click Extensions > Apps Script
 * 2. Paste this code and click Save
 * 3. Click Deploy > New Deployment > Web App
 * 4. Execute as: "Me" | Who has access: "Anyone"
 * 5. Copy the Web App URL and set it as GOOGLE_SHEETS_WEBHOOK_URL
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Reference",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Country",
        "Program",
        "Cohort Date",
        "Payment Tier",
        "Experience Level",
        "Qualification",
        "Employment Status",
        "Job Title",
        "Company",
        "LinkedIn",
        "Emergency Contact",
        "Emergency Phone",
        "Special Requirements",
        "Status"
      ]);
      sheet.getRange(1, 1, 1, 20).setFontWeight("bold").setBackground("#EEF2FF");
    }
    
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.referenceNumber || "",
      data.firstName || "",
      data.lastName || "",
      data.email || "",
      data.phone || "",
      data.country || "",
      data.programTitle || "Project Management Career Accelerator",
      data.cohortDate || "",
      data.paymentPreference || "",
      data.experienceLevel || "",
      data.highestQualification || "",
      data.employmentStatus || "",
      data.currentJobTitle || "",
      data.currentCompany || "",
      data.linkedInUrl || "",
      data.emergencyContactName || "",
      data.emergencyContactPhone || "",
      data.specialRequirements || "",
      data.status || "Registered"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
}

// OPTION B: Real-Time Google Sheets Sync
export async function syncToGoogleSheets(reg: RegistrationData): Promise<{ synced: boolean; destination?: string; error?: string }> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log(`[Google Sheets Sync] No GOOGLE_SHEETS_WEBHOOK_URL set. Candidate safely stored in local register for ref: ${reg.referenceNumber}`);
    return {
      synced: false,
      destination: 'local-register',
      error: 'Google Sheets webhook URL not configured. Form stored safely in local admissions register.',
    };
  }

  try {
    const payload = {
      ...reg,
      source: 'WOW Business and Digital Ltd Web Portal',
      event: 'delegate_registration_submitted',
    };

    const response = await fetch(webhookUrl, {
      signal: AbortSignal.timeout(10000),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const webhookResult = await response.json().catch(() => null);
    if (response.ok && webhookResult?.result === 'success') {
      console.log(`[Spreadsheet Sync] Successfully dispatched ref: ${reg.referenceNumber} to webhook: ${webhookUrl}`);
      return { synced: true, destination: webhookUrl };
    } else {
      const text = JSON.stringify(webhookResult) || 'Webhook did not confirm success';
      console.warn(`[Spreadsheet Sync] Webhook responded with status ${response.status}: ${text}`);
      return { synced: false, destination: webhookUrl, error: `HTTP ${response.status}: ${text}` };
    }
  } catch (err: any) {
    console.error('[Spreadsheet Sync] Failed to dispatch webhook:', err);
    return { synced: false, destination: webhookUrl, error: err.message || 'Network error' };
  }
}

// OPTION 2: Email Templates and Dispatch

const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]!));
export function generateStaffAlertEmail(reg: RegistrationData): { subject: string; text: string; html: string } {
  const subject = `Application received: ${reg.referenceNumber} — Career Accelerator`;
  const publicRecord = { ...reg };
  delete publicRecord.emailDelivery; delete publicRecord.sheetsSync;
  const text = `Application awaiting review. No payment has been taken.\n\n${JSON.stringify(publicRecord, null, 2)}`;
  return { subject, text, html: `<h1>Application awaiting review</h1><p>No payment has been taken.</p><pre>${escape(JSON.stringify(publicRecord, null, 2))}</pre>` };
}
export function generateDelegateWelcomeEmail(reg: RegistrationData): { subject: string; text: string; html: string } {
  const subject = `Application received — ${reg.referenceNumber}`;
  const text = `Hello ${reg.firstName},\n\nThank you for applying to the six-month Project Management Career Accelerator, starting 14 November 2026.\n\nReference: ${reg.referenceNumber}\nPayment preference: ${reg.paymentPreference || 'To discuss'}\n\nYour application is awaiting review. We will contact you to arrange your 10-minute confirmation call before acceptance and payment. Requested slot: ${reg.confirmationCallDate || "To agree"} at ${reg.confirmationCallTime || "To agree"} (${reg.confirmationCallTimeZone || "Time zone to confirm"}). This is a request, not a confirmed booking.\n\nNo payment is required at this stage and this acknowledgement is not confirmation of acceptance. After the call, if accepted, you will receive an email confirming your acceptance, agreed payment schedule and payment instructions. Please make payment promptly once you receive that email.\n\nOnce accepted, you can pay £50 to reserve your place. This deposit is credited towards your total programme fee, including the first instalment where applicable. Employer sponsorship arrangements will be confirmed separately.\n\nFor updates, email wowdigital@wowbusinessanddigital.com and quote your reference.\n\nWOW Business and Digital Ltd`;
  return { subject, text, html: `<div style="font-family:Arial,sans-serif;max-width:650px"><h1>Application received</h1><p>${escape(text).replace(/\n/g, '<br>')}</p></div>` };
}

export function sanitizeResendFromAddress(rawInput?: string): string {
  if (!rawInput) {
    return 'WOW Academy Admissions <WowAcademy@contact.wowbusinessanddigital.com>';
  }

  // 1. Strip surrounding quotes (double, single, backticks) and extra whitespace
  let clean = rawInput.trim();
  clean = clean.replace(/^["'`]+|["'`]+$/g, '').trim();

  if (!clean) {
    return 'WOW Academy Admissions <WowAcademy@contact.wowbusinessanddigital.com>';
  }

  // 2. Check if formatted as `Name <email@domain.com>` or `"Name" <email@domain.com>`
  const bracketMatch = clean.match(/^(.+?)\s*<([^\s<>@]+@[^\s<>@]+)>$/);
  if (bracketMatch) {
    const senderName = bracketMatch[1].replace(/^["'`]+|["'`]+$/g, '').trim();
    let senderEmail = bracketMatch[2].trim();
    if (senderEmail.includes('@wowbusinessanddigital.com') && !senderEmail.includes('@contact.wowbusinessanddigital.com')) {
      senderEmail = senderEmail.replace('@wowbusinessanddigital.com', '@contact.wowbusinessanddigital.com');
    }
    return `${senderName || 'WOW Academy Admissions'} <${senderEmail}>`;
  }

  // 3. Check if plain email `user@domain.com`
  const emailOnlyMatch = clean.match(/^([^\s<>@]+@[^\s<>@]+)$/);
  if (emailOnlyMatch) {
    let email = emailOnlyMatch[1];
    if (email.includes('@wowbusinessanddigital.com') && !email.includes('@contact.wowbusinessanddigital.com')) {
      email = email.replace('@wowbusinessanddigital.com', '@contact.wowbusinessanddigital.com');
    }
    return `WOW Academy Admissions <${email}>`;
  }

  // 4. If someone entered only a name with no email (e.g. "WOW Academy")
  if (!clean.includes('@')) {
    return `${clean} <WowAcademy@contact.wowbusinessanddigital.com>`;
  }

  return clean;
}

// Send email via Resend API or SMTP or fallback to simulated delivery
export async function sendOutboundEmail(
  to: string, 
  subject: string, 
  html: string, 
  text: string,
  overrideFrom?: string
): Promise<{ success: boolean; method: string; error?: string }> {
  // 1. Try Resend API if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    try {
      let fromAddress = sanitizeResendFromAddress(overrideFrom || process.env.RESEND_FROM || process.env.SMTP_FROM);
      const replyTo = process.env.REPLY_TO_EMAIL || 'wowdigital@wowbusinessanddigital.com';

      let res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        signal: AbortSignal.timeout(10000),
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [to],
          subject,
          html,
          text,
          reply_to: replyTo,
          headers: {
            'X-Entity-Ref-ID': `wow-${Date.now()}`,
          },
        }),
      });

      if (res.ok) {
        console.log(`[Email Service] Successfully sent email via Resend API from "${fromAddress}" to "${to}": ${subject}`);
        return { success: true, method: 'resend' };
      } else {
        const errJson = await res.json().catch(() => null);
        const errDetail = errJson?.message || errJson?.error || (await res.text().catch(() => '')) || `HTTP ${res.status}`;
        console.warn(`[Email Service] Resend API rejected dispatch (${res.status}): ${errDetail}`);

        // If the root domain wowbusinessanddigital.com is unverified, but the user verified the subdomain contact.wowbusinessanddigital.com:
        if (
          fromAddress.includes('@wowbusinessanddigital.com') &&
          !fromAddress.includes('@contact.wowbusinessanddigital.com') &&
          (res.status === 403 || errDetail.toLowerCase().includes('not verified') || errDetail.toLowerCase().includes('domain'))
        ) {
          const subdomainFrom = fromAddress.replace('@wowbusinessanddigital.com', '@contact.wowbusinessanddigital.com');
          console.log(`[Email Service] Detected verified subdomain contact.wowbusinessanddigital.com. Retrying dispatch from: ${subdomainFrom}...`);
          
          const retryRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY.trim()}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: subdomainFrom,
              to: [to],
              subject,
              html,
              text,
              reply_to: replyTo,
            }),
          });

          if (retryRes.ok) {
            console.log(`[Email Service] Successfully delivered email via Resend using verified subdomain "${subdomainFrom}" to "${to}"`);
            process.env.RESEND_FROM = subdomainFrom;
            return { success: true, method: 'resend (verified subdomain contact.wowbusinessanddigital.com)' };
          }
        }
        
        return { 
          success: false, 
          method: 'resend', 
          error: `Resend API (${res.status}): ${errDetail}. (Sender used: "${fromAddress}")` 
        };
      }
    } catch (err: any) {
      console.error('[Email Service] Failed sending via Resend:', err);
      return { success: false, method: 'resend', error: err?.message || 'Network error communicating with Resend' };
    }
  }

  // 2. Try Standard SMTP
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const port = Number(process.env.SMTP_PORT) || 587;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        requireTLS: port === 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 4000,
        greetingTimeout: 4000,
        socketTimeout: 5000,
        tls: { rejectUnauthorized: true }
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"WOW Academy Admissions" <${process.env.SMTP_USER}>`,
        to,
        replyTo: process.env.REPLY_TO_EMAIL || 'wowdigital@wowbusinessanddigital.com',
        subject,
        text,
        html,
      });

      console.log(`[Email Service] Sent email via SMTP (${process.env.SMTP_HOST}) to ${to}: ${subject}`);
      return { success: true, method: 'smtp' };
    } catch (err: any) {
      console.error('[Email Service] Failed sending via SMTP:', err);
    }
  }

  // 3. Graceful Simulation / Local Queue Mode
  // Preview records are not email deliveries.
  console.log(`[Email Service - Preview Mode] Outbound email recorded for ${to}: "${subject}"`);
  return {
    success: false,
    method: 'simulated-preview',
  };
}

export async function processRegistrationSubmission(rawReg: RegistrationData): Promise<RegistrationData> {
  const reg: RegistrationData = { ...rawReg };

  // Normalize fields if originating from TrainingFormData
  if (!reg.firstName && (reg as any).fullName) {
    const parts = String((reg as any).fullName).trim().split(' ');
    reg.firstName = parts[0] || 'Delegate';
    reg.lastName = parts.slice(1).join(' ') || '';
  }
  if (!reg.phone && (reg as any).mobileWhatsapp) {
    reg.phone = (reg as any).mobileWhatsapp;
  }
  if (!reg.city && (reg as any).townCity) {
    reg.city = (reg as any).townCity;
  }
  if (!reg.programTitle) {
    reg.programTitle = 'Project Management Career Accelerator (6-Month)';
  }
  if (!reg.cohortDate) {
    reg.cohortDate = '14 November 2026';
  }

  // Persist first: notification failure must not lose an application.
  saveRegistration(reg);

  const staffEmail = process.env.ADMISSIONS_EMAIL || 'wowdigital@wowbusinessanddigital.com';
  const staffContent = generateStaffAlertEmail(reg);
  const delegateContent = generateDelegateWelcomeEmail(reg);

  // Send Staff Alert
  const staffResult = await sendOutboundEmail(staffEmail, staffContent.subject, staffContent.html, staffContent.text);

  // Send Delegate Welcome
  const delegateResult = await sendOutboundEmail(reg.email, delegateContent.subject, delegateContent.html, delegateContent.text);

  // Sync to Google Sheets / CRM Webhook
  const sheetsResult = await syncToGoogleSheets(reg);

  const updatedRecord: RegistrationData = {
    ...reg,
    emailDelivery: {
      staffAlert: {
        sent: staffResult.success,
        method: staffResult.method,
        timestamp: new Date().toISOString(),
        previewHtml: staffContent.html,
      },
      delegateWelcome: {
        sent: delegateResult.success,
        method: delegateResult.method,
        timestamp: new Date().toISOString(),
        previewHtml: delegateContent.html,
      },
    },
    sheetsSync: {
      synced: sheetsResult.synced,
      timestamp: new Date().toISOString(),
      targetUrl: sheetsResult.destination,
      error: sheetsResult.error,
    },
  };

  saveRegistration(updatedRecord);
  return updatedRecord;
}
