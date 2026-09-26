import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export interface RegistrationData {
  referenceNumber: string;
  submittedAt: string;
  submissionType: 'SUBMIT_AND_PAY' | 'FREE_TESTER';
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

// Ensure data folder and file exist
function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(REGISTRATIONS_FILE)) {
      fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify([], null, 2));
    }
  } catch (err) {
    console.warn('[Admissions] Could not ensure data file:', err);
  }
}

export function getAllRegistrations(): RegistrationData[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(REGISTRATIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Admissions] Error reading registrations:', err);
    return [];
  }
}

export function saveRegistration(record: RegistrationData): RegistrationData {
  ensureDataFile();
  try {
    const existing = getAllRegistrations();
    const index = existing.findIndex((r) => r.referenceNumber === record.referenceNumber);
    if (index >= 0) {
      existing[index] = record;
    } else {
      existing.unshift(record);
    }
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(existing, null, 2));
    return record;
  } catch (err) {
    console.error('[Admissions] Error saving registration:', err);
    return record;
  }
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`[Spreadsheet Sync] Successfully dispatched ref: ${reg.referenceNumber} to webhook: ${webhookUrl}`);
      return { synced: true, destination: webhookUrl };
    } else {
      const text = await response.text();
      console.warn(`[Spreadsheet Sync] Webhook responded with status ${response.status}: ${text}`);
      return { synced: false, destination: webhookUrl, error: `HTTP ${response.status}: ${text}` };
    }
  } catch (err: any) {
    console.error('[Spreadsheet Sync] Failed to dispatch webhook:', err);
    return { synced: false, destination: webhookUrl, error: err.message || 'Network error' };
  }
}

// OPTION 2: Email Templates and Dispatch

export function generateStaffAlertEmail(reg: RegistrationData): { subject: string; text: string; html: string } {
  const subject = `[New Application Ref: ${reg.referenceNumber}] ${reg.firstName} ${reg.lastName} - PM Career Accelerator`;
  
  const text = `
NEW DELEGATE REGISTRATION RECEIVED
Reference: ${reg.referenceNumber}
Submission Time: ${new Date(reg.submittedAt).toLocaleString('en-GB')}
Status: ${reg.status}

APPLICANT DETAILS:
- Full Name: ${reg.firstName} ${reg.lastName}
- Email: ${reg.email}
- Phone: ${reg.phone}
- Country/City: ${reg.country || 'N/A'}, ${reg.city || 'N/A'}
- LinkedIn: ${reg.linkedInUrl || 'N/A'}

PROGRAMME & PAYMENT:
- Selected Programme: ${reg.programTitle || 'Project Management Career Accelerator (6-Month)'}
- Cohort: ${reg.cohortDate || 'Next Available'}
- Payment Preference: ${reg.paymentPreference || 'Standard'}
- Submission Type: ${reg.submissionType}

BACKGROUND:
- Employment: ${reg.employmentStatus || 'N/A'} (${reg.currentJobTitle || 'N/A'} at ${reg.currentCompany || 'N/A'})
- Experience: ${reg.experienceLevel || 'N/A'}
- Highest Qualification: ${reg.highestQualification || 'N/A'}
- Motivation/Goals: ${reg.careerGoals || 'N/A'}

EMERGENCY CONTACT:
- Name: ${reg.emergencyContactName || 'N/A'} (${reg.emergencyContactRelationship || 'N/A'})
- Phone: ${reg.emergencyContactPhone || 'N/A'}

Special Requirements: ${reg.specialRequirements || 'None'}
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #1e3a8a, #2563eb); color: #ffffff; padding: 28px; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .title { margin: 0; font-size: 20px; font-weight: 800; }
    .content { padding: 28px; }
    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px; }
    .grid { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .grid td { padding: 8px 4px; font-size: 13px; vertical-align: top; }
    .label { font-weight: 700; color: #64748b; width: 35%; }
    .val { color: #0f172a; font-weight: 500; }
    .highlight-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px; margin: 16px 0; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 28px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Admissions Notification</div>
      <h1 class="title">New Delegate Application Received</h1>
      <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 13px;">Reference: <strong>${reg.referenceNumber}</strong></p>
    </div>
    
    <div class="content">
      <div class="highlight-box">
        <strong style="color: #1e3a8a; font-size: 14px;">${reg.firstName} ${reg.lastName}</strong><br>
        <span style="font-size: 13px; color: #3b82f6;">${reg.email} • ${reg.phone}</span><br>
        <span style="font-size: 12px; color: #64748b;">Selected Tier: <strong>${reg.paymentPreference || 'Standard'}</strong></span>
      </div>

      <div class="section-title">Candidate Profile</div>
      <table class="grid">
        <tr><td class="label">Full Name</td><td class="val"><strong>${reg.firstName} ${reg.lastName}</strong></td></tr>
        <tr><td class="label">Email Address</td><td class="val"><a href="mailto:${reg.email}">${reg.email}</a></td></tr>
        <tr><td class="label">Phone</td><td class="val"><a href="tel:${reg.phone}">${reg.phone}</a></td></tr>
        <tr><td class="label">Location</td><td class="val">${reg.city || 'N/A'}, ${reg.country || 'N/A'}</td></tr>
        <tr><td class="label">LinkedIn</td><td class="val">${reg.linkedInUrl ? `<a href="${reg.linkedInUrl}" target="_blank">${reg.linkedInUrl}</a>` : 'Not provided'}</td></tr>
      </table>

      <div class="section-title">Programme Selection &amp; Payment</div>
      <table class="grid">
        <tr><td class="label">Programme</td><td class="val"><strong>${reg.programTitle || 'Project Management Career Accelerator'}</strong></td></tr>
        <tr><td class="label">Cohort Date</td><td class="val">${reg.cohortDate || 'Next Available'}</td></tr>
        <tr><td class="label">Payment Plan</td><td class="val"><strong>${reg.paymentPreference || 'Standard'}</strong></td></tr>
        <tr><td class="label">Status</td><td class="val">${reg.status}</td></tr>
      </table>

      <div class="section-title">Career Background &amp; Motivation</div>
      <table class="grid">
        <tr><td class="label">Employment</td><td class="val">${reg.employmentStatus || 'N/A'}</td></tr>
        <tr><td class="label">Current Role</td><td class="val">${reg.currentJobTitle || 'N/A'} (${reg.currentCompany || 'N/A'})</td></tr>
        <tr><td class="label">Experience Level</td><td class="val">${reg.experienceLevel || 'N/A'}</td></tr>
        <tr><td class="label">Highest Qualification</td><td class="val">${reg.highestQualification || 'N/A'}</td></tr>
      </table>

      ${reg.careerGoals ? `
        <div style="font-size: 12px; color: #64748b; font-weight: 700; margin-top: 8px;">Career Goals &amp; Objectives:</div>
        <div style="background: #f8fafc; border-left: 3px solid #2563eb; padding: 8px 12px; font-size: 12px; color: #334155; margin-top: 4px; font-style: italic;">
          "${reg.careerGoals}"
        </div>
      ` : ''}

      <div class="section-title">Emergency Contact &amp; Requirements</div>
      <table class="grid">
        <tr><td class="label">Emergency Contact</td><td class="val">${reg.emergencyContactName || 'N/A'} (${reg.emergencyContactRelationship || 'N/A'})</td></tr>
        <tr><td class="label">Contact Phone</td><td class="val">${reg.emergencyContactPhone || 'N/A'}</td></tr>
        <tr><td class="label">Accessibility/Needs</td><td class="val">${reg.specialRequirements || 'None specified'}</td></tr>
      </table>
    </div>

    <div class="footer">
      WOW Business and Digital Ltd • Birmingham, United Kingdom<br>
      Admissions Team Hotline: +44121 296 9549 • info@wowdigital.co.uk
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, text, html };
}

export function generateDelegateWelcomeEmail(reg: RegistrationData): { subject: string; text: string; html: string } {
  const subject = `Welcome to WOW Academy: Project Management Career Accelerator (Ref: ${reg.referenceNumber})`;
  
  const text = `
Dear ${reg.firstName},

Congratulations on taking this significant step toward accelerating your project management career!

We have successfully received your official application and registration dossier for the Project Management Career Accelerator (6-Month Practical Work Experience Programme).

APPLICATION SUMMARY:
- Application Reference: ${reg.referenceNumber}
- Registered Programme: ${reg.programTitle || 'Project Management Career Accelerator'}
- Selected Cohort: ${reg.cohortDate || 'Next Available Session'}
- Payment Preference: ${reg.paymentPreference || 'Standard Tuition'}

WHAT HAPPENS NEXT:
1. Admissions Review: Our academic PM board reviews your candidate profile and confirms your place.
2. Orientation & Onboarding Pack: You will receive access to your learning portal, induction schedule, and project team assignment.
3. Live Interactive Kickoff: Meet your senior PM mentors and cohort delegates for your first live session.
4. Real Client Projects: Begin hands-on PMO governance, stakeholder management, Agile sprints, and work experience delivery.

If you have any questions or require assistance with payment settlement or onboarding, contact our admissions office directly at +44121 296 9549 or info@wowdigital.co.uk.

Kind regards,

Admissions & Academic Directorate
WOW Academy • WOW Business and Digital Ltd
Birmingham, United Kingdom
Hotline: +44121 296 9549
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #0f172a, #1e3a8a); color: #ffffff; padding: 32px 28px; text-align: center; }
    .logo-text { font-size: 22px; font-weight: 900; letter-spacing: -0.02em; color: #ffffff; margin-bottom: 6px; }
    .logo-sub { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #93c5fd; font-weight: 700; }
    .content { padding: 32px 28px; line-height: 1.6; }
    .ref-badge { display: inline-block; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 12px; font-weight: 800; padding: 6px 14px; border-radius: 9999px; margin: 12px 0 20px 0; }
    .step-card { display: flex; gap: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-bottom: 10px; }
    .step-num { width: 28px; height: 28px; border-radius: 50%; background: #2563eb; color: #ffffff; font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; shrink: 0; }
    .step-text { font-size: 13px; color: #334155; }
    .step-title { font-weight: 800; color: #0f172a; margin-bottom: 2px; }
    .cta-box { background: linear-gradient(to right, #1e3a8a, #2563eb); border-radius: 12px; padding: 20px; color: #ffffff; text-align: center; margin: 24px 0; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">WOW ACADEMY</div>
      <div class="logo-sub">WOW Business and Digital Ltd</div>
      <h1 style="font-size: 20px; font-weight: 800; margin: 16px 0 4px 0;">Welcome to Your Career Accelerator</h1>
      <p style="margin: 0; font-size: 13px; opacity: 0.85;">Learn • Work • Earn — 6-Month Practical Programme</p>
    </div>

    <div class="content">
      <p style="font-size: 15px; margin-top: 0;">Dear <strong>${reg.firstName}</strong>,</p>
      
      <p style="font-size: 14px; color: #334155;">
        Congratulations on submitting your application for the <strong>Project Management Career Accelerator</strong>. We are delighted to welcome you to our professional development community.
      </p>

      <div style="text-align: center;">
        <span class="ref-badge">Application Reference: ${reg.referenceNumber}</span>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 13px;">
        <div style="font-weight: 800; color: #0f172a; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Your Registration Summary:</div>
        <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e2e8f0;">
          <span style="color: #64748b;">Selected Cohort:</span>
          <span style="font-weight: 700; color: #0f172a;">${reg.cohortDate || 'Next Available Session'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #e2e8f0;">
          <span style="color: #64748b;">Payment Option:</span>
          <span style="font-weight: 700; color: #0f172a;">${reg.paymentPreference || 'Standard Tuition'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 4px 0;">
          <span style="color: #64748b;">Programme Duration:</span>
          <span style="font-weight: 700; color: #2563eb;">6 Months Comprehensive</span>
        </div>
      </div>

      <div style="font-weight: 800; color: #0f172a; font-size: 14px; margin-bottom: 12px;">Next Steps in Your Onboarding:</div>

      <div class="step-card">
        <div class="step-num">1</div>
        <div class="step-text">
          <div class="step-title">Admissions &amp; Profile Verification</div>
          Our academic board is reviewing your candidate dossier to finalize cohort placement and team assignments.
        </div>
      </div>

      <div class="step-card">
        <div class="step-num">2</div>
        <div class="step-text">
          <div class="step-title">Learning Portal &amp; Welcome Pack Access</div>
          You will receive your student login credentials, syllabus roadmap, and tool setup guides (Jira, Confluence, Slack, MS Project).
        </div>
      </div>

      <div class="step-card">
        <div class="step-num">3</div>
        <div class="step-text">
          <div class="step-title">Live Interactive Orientation Kickoff</div>
          Meet your assigned PM Mentor, project teams, and enterprise clients during our live induction session.
        </div>
      </div>

      <div class="cta-box">
        <div style="font-weight: 800; font-size: 15px; margin-bottom: 4px;">Need Assistance or Have Questions?</div>
        <p style="margin: 0 0 12px 0; font-size: 12px; opacity: 0.9;">Our admissions advisors are here to support your transition every step of the way.</p>
        <div style="font-size: 14px; font-weight: 800;">Call Us: +44121 296 9549</div>
      </div>
    </div>

    <div class="footer">
      <strong>WOW Business and Digital Ltd</strong><br>
      Birmingham, United Kingdom • Registration No: 12345678<br>
      Admissions Email: info@wowdigital.co.uk • Contact: +44121 296 9549
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, text, html };
}

// Clean and sanitize the Resend 'from' address to strictly comply with Resend format rules:
// Either "email@example.com" or "Name <email@example.com>" (without stray quotes or invalid brackets)
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
        tls: {
          rejectUnauthorized: false
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"WOW Academy Admissions" <${process.env.SMTP_USER}>`,
        to,
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
    reg.cohortDate = 'October 2026 Intake';
  }

  const staffEmail = process.env.ADMISSIONS_EMAIL || 'admissions@wowdigital.co.uk';
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
