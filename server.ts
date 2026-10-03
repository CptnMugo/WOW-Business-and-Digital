import { installPaymentWebhook, installPaymentRoutes, paymentLink, readPayments } from './server/payments.js';
import express from "express";
import { installWorkspaceAccess } from "./server/workspaceAccess.js";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import { randomUUID, randomBytes } from "crypto";
import {
  getAllRegistrations,
  processRegistrationSubmission,
  getGoogleAppsScriptSnippet,
  sendOutboundEmail,
  RegistrationData,
} from "./server/admissionsService.js";

dotenv.config();

// If RESEND_FROM was configured with the unverified root domain, map it to the verified subdomain contact.wowbusinessanddigital.com
if (
  process.env.RESEND_FROM &&
  process.env.RESEND_FROM.includes('@wowbusinessanddigital.com') &&
  !process.env.RESEND_FROM.includes('@contact.wowbusinessanddigital.com')
) {
  process.env.RESEND_FROM = process.env.RESEND_FROM.replace('@wowbusinessanddigital.com', '@contact.wowbusinessanddigital.com');
  console.log(`[Email Config] Auto-mapped RESEND_FROM to verified Resend subdomain: ${process.env.RESEND_FROM}`);
}

const app = express();
const PORT = 3000;
app.set("trust proxy", "loopback");
app.use((_req, res, next) => { res.set("Referrer-Policy", "no-referrer"); next(); });

installPaymentWebhook(app);
app.use(express.json({ limit: "100kb" }));
installWorkspaceAccess(app);

const ENQUIRY_CATEGORIES = new Set(['general', 'business-consultancy', 'staffing', 'training', 'ai-solutions', 'career-coaching', 'partnership', 'associate']);
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));

const requiredEnquiryDetails: Record<string, string[]> = {
  general: ['subject', 'message'],
  'business-consultancy': ['challenge', 'desiredOutcome'],
  staffing: ['numberOfPeople', 'preferredStartDate', 'locationDetails', 'expectedOutputs'],
  'ai-solutions': ['businessProblem', 'currentProcess', 'informationUsed'],
  'career-coaching': ['targetRoleDirection', 'goalsToAchieve'],
  partnership: ['organisationOverview', 'proposalDescription', 'problemAddressed', 'contributions'],
};
const validTraining = (data: any) => data &&
  ['fullName', 'email', 'mobileWhatsapp', 'townCity', 'previousExperience', 'careerObjective', 'currentChallenge', 'successMeasure'].every(key => typeof data[key] === 'string' && data[key].trim()) &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) && data.privacyAcknowledged === true &&
  [1, 2, 3, 4, 5, 6, 7].every(number => data['declaration' + number] === true);

app.post('/api/enquiries', async (req, res) => {
  const { category, contact, details } = req.body || {};
  if (!ENQUIRY_CATEGORIES.has(category) || !contact || typeof contact.firstName !== 'string' || !contact.firstName.trim() || typeof contact.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) || contact.privacyAcknowledged !== true || !details || typeof details !== 'object') {
    res.status(400).json({ error: 'Please complete the required contact and privacy fields.' });
    return;
  }
  if (Array.isArray(details) || (requiredEnquiryDetails[category] || []).some(key => typeof details[key] !== 'string' || !details[key].trim()) || (category === 'training' && !validTraining(details))) {
    res.status(400).json({ error: 'Please complete the required fields for this enquiry.' });
    return;
  }
  if (category === 'associate' && (
    !['location', 'expertise', 'sectors', 'availability', 'experience'].every(key => typeof details[key] === 'string' && details[key].trim()) ||
    details.experience.trim().length < 20 || details.retainForOpportunities !== true
  )) {
    res.status(400).json({ error: 'Please complete your professional details and consent to being contacted about associate opportunities.' });
    return;
  }
  const record = { id: `WBD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, receivedAt: new Date().toISOString(), category, contact, details };
  try {
    fs.mkdirSync('data', { recursive: true });
    fs.appendFileSync('data/enquiries.jsonl', JSON.stringify(record) + '\n', { mode: 0o600 });
    const staff = process.env.ENQUIRIES_EMAIL || process.env.ADMISSIONS_EMAIL || 'wowdigital@wowbusinessanddigital.com';
    const summary = JSON.stringify(record, null, 2);
    const staffMail = await sendOutboundEmail(staff, `WBD ${category} enquiry ${record.id}`, `<pre>${escapeHtml(summary)}</pre>`, summary);
    const customerMail = await sendOutboundEmail(contact.email, `We received your enquiry (${record.id})`, `<p>Thank you for contacting WOW Business & Digital. We have received your enquiry and will respond after reviewing it.</p><p>Reference: ${record.id}</p>`, `Thank you for contacting WOW Business & Digital. We have received your enquiry. Reference: ${record.id}`);
    res.status(201).json({ success: true, reference: record.id, staffEmailSent: staffMail.success && staffMail.method !== 'simulated-preview', acknowledgementSent: customerMail.success && customerMail.method !== 'simulated-preview' });
  } catch (error) {
    console.error('Enquiry processing failed:', error);
    res.status(500).json({ error: 'The enquiry could not be recorded.' });
  }
});

// Initialize Gemini AI Client lazily or at server startup
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System instructions for specialized WOW AI Assistants
const ASSISTANT_SYSTEM_PROMPTS: Record<string, string> = {
  business: `You are WOW Business Assistant, an intelligent AI solution developed by WOW Business and Digital Ltd. 
You specialize in Programme & Project Management (PMO), Change Management, Governance, Operational Readiness, Benefits Realisation, and Digital Transformation. 
Provide practical, evidence-based, professional advice for business leaders and project managers, with a focus on African and international markets. Keep responses structured, actionable, and clear.`,

  farm: `You are WOW Farm Assistant, an AI solution from WOW Business and Digital Ltd tailored for agricultural enterprises, commercial farms, and smallholders across Africa and globally.
You provide expert advice on farm management, yield optimization, supply chain efficiency, agricultural tech, climate-resilient practices, and agribusiness operations. Speak practical, reliable, and evidence-based language.`,

  ngo: `You are WOW NGO Assistant, an AI solution from WOW Business and Digital Ltd crafted for non-profit organizations, charities, and international development bodies.
You assist with Grant & Impact Reporting, Monitoring & Evaluation (M&E), Donor Compliance, Project Proposals, Community Engagement, and Stakeholder Governance. Keep tone professional, transparent, and impact-driven.`,

  school: `You are WOW School Assistant, an AI assistant from WOW Business and Digital Ltd for educational institutions, headteachers, and academic administrators.
You assist with institutional governance, student performance tracking, curriculum project management, digital readiness, staff training, and administrative workflow automation.`,

  church: `You are WOW Church Assistant, an AI solution from WOW Business and Digital Ltd designed for faith-based organisations, ministries, and community leadership teams.
You help with community project management, stewardship & financial governance, event planning, volunteer coordination, and leadership development.`,

  general: `You are WOW Assistant, the flagship AI assistant by WOW Business and Digital Ltd.
Your purpose is: "Evidence. Transformation. Impact."
You provide expert guidance across Business Transformation, Digital Innovation, PMO Governance, Academy Training, and AI Solutions.`,
};

// API Endpoint for WOW AI Assistants
app.post("/api/ai-assistant", async (req, res) => {
  try {
    const { assistantType = "business", prompt, history = [] } = req.body;

    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "Prompt string is required" });
      return;
    }

    const systemInstruction = ASSISTANT_SYSTEM_PROMPTS[assistantType] || ASSISTANT_SYSTEM_PROMPTS.general;
    const ai = getAIClient();

    if (ai) {
      // Build conversation context
      const formattedContents = history.map((h: { role: string; text: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      }));

      formattedContents.push({
        role: "user",
        parts: [{ text: prompt }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || "No response generated.";
      res.json({ text, assistantType, source: "gemini" });
      return;
    }

    // Fallback response if GEMINI_API_KEY is missing or in offline preview
    const fallbackResponses: Record<string, string> = {
      business: `[WOW Business Assistant Advisory]: For your query regarding "${prompt}", we recommend establishing a structured PMO framework with weekly RAID logs, benefits realization metrics, and clear governance reviews. WOW Consulting can assist with an Operational Readiness Assessment.`,
      farm: `[WOW Farm Assistant Advisory]: Regarding "${prompt}", integrating smart crop rotation, automated supply tracking, and resource management can help improve operational efficiency. We recommend conducting a Digital & Agricultural Readiness Audit.`,
      ngo: `[WOW NGO Assistant Advisory]: For "${prompt}", impact reporting requires clear M&E frameworks, outcome indicators, and structured Grant Tracking. WOW AI Solutions provides automated Grant & Impact Reporting toolkits.`,
      school: `[WOW School Assistant Advisory]: Addressing "${prompt}" involves aligning administrative workflows, digitizing attendance/performance tracking, and setting clear governance milestones for educational quality.`,
      church: `[WOW Church Assistant Advisory]: For "${prompt}", effective ministry leadership benefits from transparent financial governance, organized volunteer coordination, and structured community outreach planning.`,
      general: `[WOW Assistant Advisory]: Thank you for asking about "${prompt}". WOW Business and Digital Ltd provides end-to-end Business Transformation, Digital Innovation, PMO Setup, and AI Training through our Academy.`
    };

    const text = fallbackResponses[assistantType] || fallbackResponses.general;
    res.json({ text: `Demonstration response. Live AI is not connected.\n\n${text}`, assistantType, source: "fallback" });
  } catch (error: any) {
    console.error("AI Assistant API Error:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
    });
  }
});

installPaymentRoutes(app);

// -------------------------------------------------------------
// ADMISSIONS & REGISTRATION PIPELINE (Option 2 & Option 3)
// -------------------------------------------------------------

// Submit Registration: logs dossier, triggers email alerts (Option 2), and syncs to Google Sheets (Option 3)
app.post("/api/registrations/submit", async (req, res) => {
  try {
    const body = req.body;
    const selectFields = ['workStatus', 'rightToWorkUK', 'highestQualification', 'ukWorkExperience', 'englishFirstLanguage', 'weeklyAvailability', 'birminghamAttendance', 'inPersonProjectAttendance', 'packageSelection', 'paymentPreference'];
    if (!validTraining(body) || !selectFields.every(key => typeof body[key] === 'string' && body[key].trim()) || !['pmQualifications', 'developmentNeeds'].every(key => Array.isArray(body[key]) && body[key].length > 0 && body[key].every((v: unknown) => typeof v === 'string' && v.trim())) || typeof body.submissionId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.submissionId)) {
      res.status(400).json({ error: "Please complete the required application fields, selections, declarations and privacy acknowledgement." });
      return;
    }
    if (typeof body.confirmationCallDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.confirmationCallDate) || !Number.isFinite(Date.parse(body.confirmationCallDate)) || new Date(body.confirmationCallDate).toISOString().slice(0,10) !== body.confirmationCallDate || typeof body.confirmationCallTime !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(body.confirmationCallTime) || typeof body.confirmationCallTimeZone !== 'string' || !body.confirmationCallTimeZone.trim() || body.confirmationCallTimeZone.length > 100 || (body.confirmationCallAlternative != null && (typeof body.confirmationCallAlternative !== 'string' || body.confirmationCallAlternative.length > 500))) {
      res.status(400).json({ error: 'Please provide your preferred confirmation call date, time and time zone.' }); return;
    }
    const duplicate = getAllRegistrations().find(record => record.submissionId === body.submissionId);
    if (duplicate) {
      if (duplicate.email !== body.email) { res.status(409).json({ error: 'Please start a new application.' }); return; }
      res.json({ success: true, referenceNumber: duplicate.referenceNumber, paymentUrl: paymentLink(duplicate.referenceNumber), emailAlertSent: duplicate.emailDelivery?.staffAlert.sent ?? false, delegateWelcomeSent: duplicate.emailDelivery?.delegateWelcome.sent ?? false, sheetsSynced: duplicate.sheetsSync?.synced ?? false });
      return;
    }
    // Copy application fields only; ignore client-supplied workflow state and internal metadata.
    const fields = ['fullName', 'email', 'mobileWhatsapp', 'townCity', ...selectFields, 'workStatusOther', 'highestQualificationOther', 'pmQualifications', 'previousExperience', 'careerObjective', 'currentChallenge', 'developmentNeeds', 'developmentNeedsOther', 'successMeasure', 'howDidYouHear', 'promoCode', 'confirmationCallDate', 'confirmationCallTime', 'confirmationCallTimeZone', 'confirmationCallAlternative', 'privacyAcknowledged', 'marketingConsent', ...[1,2,3,4,5,6,7].map(n => 'declaration' + n)];
    const existingReferences = new Set(getAllRegistrations().map(record => record.referenceNumber));
    const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let referenceNumber: string;
    do {
      const suffix = Array.from(randomBytes(6), byte => alphabet[byte % alphabet.length]).join('');
      referenceNumber = `WOW-CA-${new Date().getUTCFullYear().toString().slice(-2)}-${suffix}`;
    } while (existingReferences.has(referenceNumber));
    const data = {
      ...Object.fromEntries(fields.map(key => [key, body[key]])),
      submissionId: body.submissionId,
      referenceNumber,
      submittedAt: new Date().toISOString(),
      submissionType: 'APPLICATION', status: 'APPLICATION_REVIEW_PENDING',
      cohortDate: '14 November 2026', programTitle: 'Project Management Career Accelerator (6-Month)',
    } as RegistrationData;

    data.paymentUrl = paymentLink(data.referenceNumber);
    const processed = await processRegistrationSubmission(data);

    res.json({
      success: true,
      referenceNumber: processed.referenceNumber,
      paymentUrl: paymentLink(processed.referenceNumber),
      emailAlertSent: processed.emailDelivery?.staffAlert.sent ?? false,
      delegateWelcomeSent: processed.emailDelivery?.delegateWelcome.sent ?? false,
      sheetsSynced: processed.sheetsSync?.synced ?? false,
    });
  } catch (error: any) {
    console.error("Registration submission error:", error);
    res.status(500).json({
      error: "Failed to process registration submission",
    });
  }
});

// Retrieve all registrations for admissions review & export
app.get("/api/registrations", (req, res) => {
  if (!process.env.ADMISSIONS_ADMIN_TOKEN || req.headers.authorization !== `Bearer ${process.env.ADMISSIONS_ADMIN_TOKEN}`) {
    res.status(403).json({ error: 'Admissions access required' });
    return;
  }
  try {
    const list = getAllRegistrations().map(reg => ({ ...reg, paymentUrl: paymentLink(reg.referenceNumber), livePaymentTotal: readPayments().filter(p => p.reference === reg.referenceNumber && p.live).reduce((sum, p) => sum + p.amount - (p.refunded || 0), 0) / 100 }));
    res.json({
      registrations: list,
      total: list.length,
      sheetsConfigured: !!process.env.GOOGLE_SHEETS_WEBHOOK_URL,
      emailConfigured: !!(process.env.RESEND_API_KEY || (process.env.SMTP_HOST && process.env.SMTP_USER)),
      hasResend: !!process.env.RESEND_API_KEY,
      hasSmtp: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
      resendFrom: process.env.RESEND_FROM || process.env.SMTP_FROM || "WOW Academy Admissions <wowdigital@wowbusinessanddigital.com>",
      admissionsEmail: process.env.ADMISSIONS_EMAIL || "wowdigital@wowbusinessanddigital.com",
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve registrations" });
  }
});

// Test Email Dispatch via Resend API or SMTP
app.post("/api/registrations/test-email", async (req, res) => {
  if (!process.env.ADMISSIONS_ADMIN_TOKEN || req.headers.authorization !== `Bearer ${process.env.ADMISSIONS_ADMIN_TOKEN}`) {
    res.status(403).json({ error: 'Admissions access required' });
    return;
  }
  try {
    const { recipientEmail, fromAddress: customFrom } = req.body;
    const targetEmail = recipientEmail?.trim() || process.env.ADMISSIONS_EMAIL || "wowdigital@wowbusinessanddigital.com";

    if (customFrom && typeof customFrom === 'string' && customFrom.trim()) {
      process.env.RESEND_FROM = customFrom.trim();
    }

    const subject = "WOW Academy Admissions - Email Dispatch Verification";
    const text = `This is an automated test from WOW Academy Admissions to verify your email delivery engine (Resend / SMTP). Dispatched at: ${new Date().toISOString()}`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <h2 style="color: #1e3a8a; margin-top: 0; font-size: 20px;">Email Dispatch Verification</h2>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          Your admissions email dispatch engine is operating successfully!
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin: 16px 0;">
          <div style="margin-bottom: 4px;"><strong>Timestamp:</strong> ${new Date().toISOString()}</div>
          <div style="margin-bottom: 4px;"><strong>Delivery Engine:</strong> ${process.env.RESEND_API_KEY ? 'Resend API (Live)' : process.env.SMTP_HOST ? 'Standard SMTP' : 'Local Preview Simulator'}</div>
          <div style="margin-bottom: 4px;"><strong>Sender (From):</strong> ${process.env.RESEND_FROM || 'WOW Admissions <wowdigital@wowbusinessanddigital.com>'}</div>
          <div><strong>Recipient:</strong> ${targetEmail}</div>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
          WOW Business and Digital Ltd • Birmingham, United Kingdom
        </p>
      </div>
    `;

    const result = await sendOutboundEmail(targetEmail, subject, html, text, customFrom);
    res.json({
      success: result.success,
      method: result.method,
      error: result.error,
      targetEmail,
      fromUsed: process.env.RESEND_FROM || 'WOW Admissions <wowdigital@wowbusinessanddigital.com>',
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to dispatch test email", details: err?.message });
  }
});

// Update runtime sender (From) email
app.post("/api/admissions/update-sender", (req, res) => {
  if (!process.env.ADMISSIONS_ADMIN_TOKEN || req.headers.authorization !== `Bearer ${process.env.ADMISSIONS_ADMIN_TOKEN}`) {
    res.status(403).json({ error: 'Admissions access required' });
    return;
  }
  try {
    const { fromAddress } = req.body;
    if (fromAddress && typeof fromAddress === 'string') {
      process.env.RESEND_FROM = fromAddress.trim();
    }
    res.json({
      success: true,
      resendFrom: process.env.RESEND_FROM,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update sender identity" });
  }
});

// Provide 1-click Google Apps Script code for easy Google Sheet connectivity (Option B)
app.get("/api/registrations/google-apps-script", (req, res) => {
  res.json({
    script: getGoogleAppsScriptSnippet(),
    instructions: [
      "1. Open your admissions Google Sheet.",
      "2. Click Extensions > Apps Script.",
      "3. Paste this code into the editor and click Save (Ctrl+S / Cmd+S).",
      "4. Click Deploy > New Deployment. Select Type: Web App.",
      "5. Set Execute as: 'Me' and Who has access: 'Anyone'.",
      "6. Click Deploy, copy the Web App URL, and paste it into GOOGLE_SHEETS_WEBHOOK_URL.",
    ],
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "WOW Business and Digital Ltd" });
});

// Start Vite or Static Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Query routes need programme-specific metadata before JavaScript for social previews.
    app.get('/', (req, res) => {
      let html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
      if (['pm-career-accelerator', 'pm-registration'].includes(String(req.query.page))) {
        const title = 'Project Management Career Accelerator | Starts 14 November 2026 | WOW';
        const description = 'Six months of practical project management development, supervised live WOW project work and career coaching. Standard fee £1,000. Apply for review; £50 registration deposit credited against tuition.';
        html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
          .replace(/(<meta name="description" content=")[^"]*/, '$1' + description)
          .replace(/(<meta property="og:title" content=")[^"]*/, '$1' + title)
          .replace(/(<meta property="og:description" content=")[^"]*/, '$1' + description);
      }
      res.type('html').send(html);
    });
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[WOW Business and Digital Ltd] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
