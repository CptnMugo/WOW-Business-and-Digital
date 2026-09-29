import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import Stripe from "stripe";
import dotenv from "dotenv";
import fs from "fs";
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

app.use(express.json());

const ENQUIRY_CATEGORIES = new Set(['general', 'business-consultancy', 'staffing', 'training', 'ai-solutions', 'career-coaching', 'partnership']);
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));

app.post('/api/enquiries', async (req, res) => {
  const { category, contact, details } = req.body || {};
  if (!ENQUIRY_CATEGORIES.has(category) || !contact || typeof contact.firstName !== 'string' || !contact.firstName.trim() || typeof contact.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) || contact.privacyAcknowledged !== true || !details || typeof details !== 'object') {
    res.status(400).json({ error: 'Please complete the required contact and privacy fields.' });
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

// Initialize Stripe Client lazily
let stripeClient: Stripe | null = null;
function getStripe(): Stripe | null {
  if (!stripeClient && process.env.STRIPE_SECRET_KEY) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia" as any,
    });
  }
  return stripeClient;
}

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
      farm: `[WOW Farm Assistant Advisory]: Regarding "${prompt}", integrating smart crop rotation, automated supply tracking, and resource management can yield up to a 35% gain in operational efficiency. We recommend conducting a Digital & Agricultural Readiness Audit.`,
      ngo: `[WOW NGO Assistant Advisory]: For "${prompt}", impact reporting requires clear M&E frameworks, outcome indicators, and structured Grant Tracking. WOW AI Solutions provides automated Grant & Impact Reporting toolkits.`,
      school: `[WOW School Assistant Advisory]: Addressing "${prompt}" involves aligning administrative workflows, digitizing attendance/performance tracking, and setting clear governance milestones for educational quality.`,
      church: `[WOW Church Assistant Advisory]: For "${prompt}", effective ministry leadership benefits from transparent financial governance, organized volunteer coordination, and structured community outreach planning.`,
      general: `[WOW Assistant Advisory]: Thank you for asking about "${prompt}". WOW Business and Digital Ltd provides end-to-end Business Transformation, Digital Innovation, PMO Setup, and AI Training through our Academy.`
    };

    const text = fallbackResponses[assistantType] || fallbackResponses.general;
    res.json({ text, assistantType, source: "fallback" });
  } catch (error: any) {
    console.error("AI Assistant API Error:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      details: error?.message || "Unknown server error",
    });
  }
});

// Stripe Gateway Status endpoint
app.get("/api/stripe/status", (req, res) => {
  const hasSecretKey = Boolean(process.env.STRIPE_SECRET_KEY);
  const publishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY || null;
  res.json({
    configured: hasSecretKey,
    mode: hasSecretKey ? (process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "live" : "test") : "simulation",
    publishableKey,
  });
});

// Stripe Create Checkout Session endpoint
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  try {
    const {
      amount,
      currency = "gbp",
      title = "WOW Business & Digital Services",
      description = "",
      customerEmail,
      customerName,
      clientCompany,
      invoiceReference,
      successUrl,
      cancelUrl,
    } = req.body;

    const parsedAmount = typeof amount === "string" ? parseFloat(amount) : Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      res.status(400).json({ error: "A valid positive payment amount is required" });
      return;
    }

    const stripe = getStripe();
    const curr = (currency || "gbp").toLowerCase();

    // If real STRIPE_SECRET_KEY is configured, call Stripe API to create live/test session
    if (stripe) {
      const origin = req.headers.origin || "http://localhost:3000";
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: curr,
              product_data: {
                name: title,
                description: description || `WOW Business & Digital Limited • ${title}`,
              },
              unit_amount: Math.round(parsedAmount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: customerEmail || undefined,
        metadata: {
          customerName: customerName || "N/A",
          clientCompany: clientCompany || "N/A",
          invoiceReference: invoiceReference || "N/A",
          title: title || "N/A",
        },
        success_url: successUrl || `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${origin}/?payment=cancelled`,
      });

      res.json({
        sessionId: session.id,
        url: session.url,
        isLive: true,
        reference: session.id,
      });
      return;
    }

    // Never report a simulated payment as successful to a visitor.
    res.status(503).json({ error: 'Online payments are temporarily unavailable. Please contact WOW Business & Digital.' });
    return;
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({
      error: "Failed to create Stripe payment session",
      details: error?.message || "Unknown error occurred",
    });
  }
});

// -------------------------------------------------------------
// ADMISSIONS & REGISTRATION PIPELINE (Option 2 & Option 3)
// -------------------------------------------------------------

// Submit Registration: logs dossier, triggers email alerts (Option 2), and syncs to Google Sheets (Option 3)
app.post("/api/registrations/submit", async (req, res) => {
  try {
    const data: RegistrationData = req.body;

    const hasName = (data.firstName && data.lastName) || (data as any).fullName;
    if (!hasName || !data.email) {
      res.status(400).json({ error: "Missing required delegate fields (name, email)" });
      return;
    }

    if (!data.referenceNumber) {
      data.referenceNumber = `WOW-PM-${Math.floor(100000 + Math.random() * 900000)}`;
    }
    if (!data.submittedAt) {
      data.submittedAt = new Date().toISOString();
    }

    const processed = await processRegistrationSubmission(data);

    res.json({
      success: true,
      referenceNumber: processed.referenceNumber,
      registration: processed,
      emailAlertSent: processed.emailDelivery?.staffAlert.sent ?? false,
      delegateWelcomeSent: processed.emailDelivery?.delegateWelcome.sent ?? false,
      sheetsSynced: processed.sheetsSync?.synced ?? false,
    });
  } catch (error: any) {
    console.error("Registration submission error:", error);
    res.status(500).json({
      error: "Failed to process registration submission",
      details: error?.message || "Unknown error",
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
    const list = getAllRegistrations();
    res.json({
      registrations: list,
      total: list.length,
      sheetsConfigured: !!process.env.GOOGLE_SHEETS_WEBHOOK_URL,
      emailConfigured: !!(process.env.RESEND_API_KEY || (process.env.SMTP_HOST && process.env.SMTP_USER)),
      hasResend: !!process.env.RESEND_API_KEY,
      hasSmtp: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
      resendFrom: process.env.RESEND_FROM || process.env.SMTP_FROM || "WOW Academy Admissions <admissions@wowdigital.co.uk>",
      admissionsEmail: process.env.ADMISSIONS_EMAIL || "admissions@wowdigital.co.uk",
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
    const targetEmail = recipientEmail?.trim() || process.env.ADMISSIONS_EMAIL || "admissions@wowdigital.co.uk";

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
          <div style="margin-bottom: 4px;"><strong>Sender (From):</strong> ${process.env.RESEND_FROM || 'WOW Academy Admissions <admissions@wowdigital.co.uk>'}</div>
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
      fromUsed: process.env.RESEND_FROM || 'WOW Academy Admissions <admissions@wowdigital.co.uk>',
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
