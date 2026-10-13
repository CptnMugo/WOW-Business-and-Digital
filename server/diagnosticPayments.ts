import type { Express } from 'express';
import Stripe from 'stripe';
import fs from 'node:fs';
import path from 'node:path';
import { sendOutboundEmail } from './admissionsService.js';

const OFFER = 'wbd-health-care-diagnostic-oct-2026';
const PRICE = 100000;
const MAX_PLACES = 3;
const CLOSES_AT = Date.parse('2026-10-26T00:00:00Z');
const CHECKOUT_MIN_SECONDS = 1800;
const dataFile = (name: string) => path.join(process.cwd(), 'data', name);
type Started = { id: string; mode: 'test' | 'live' };
type Completed = { id: string; mode: 'test' | 'live'; recordedAt: string };
const records = <T,>(file: string): T[] => {
  if (!fs.existsSync(file)) return [];
  const data: unknown = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(data)) throw new Error('Payment register is unavailable');
  return data as T[];
};
const save = <T,>(file: string, data: T[]) => {
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  fs.writeFileSync(file + '.tmp', JSON.stringify(data, null, 2), { mode: 0o600 });
  fs.renameSync(file + '.tmp', file);
};
const mode = (): 'live' | 'test' => process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'live' : 'test';
const root = () => new URL(process.env.APP_URL || 'http://localhost:3000');
const configured = () => {
  try {
    const site = root();
    return /^sk_(test|live)_/.test(process.env.STRIPE_SECRET_KEY || '') &&
      (site.protocol === 'https:' || (process.env.NODE_ENV !== 'production' && site.hostname === 'localhost'));
  } catch { return false; }
};
const isThisOffer = (session: Stripe.Checkout.Session) => session.metadata?.wbd_offer === OFFER;
const startedFile = dataFile('diagnostic-checkouts.json');
const completedFile = dataFile('diagnostic-payments.json');

export async function recordDiagnosticPayment(session: Stripe.Checkout.Session) {
  if (!isThisOffer(session) || session.payment_status !== 'paid') return false;
  if (session.amount_total !== PRICE || session.currency !== 'gbp') throw new Error('Unexpected diagnostic payment amount');
  const existing = records<Completed>(completedFile);
  if (existing.some(item => item.id === session.id)) return true;
  existing.push({ id: session.id, mode: session.livemode ? 'live' : 'test', recordedAt: new Date().toISOString() });
  save(completedFile, existing);
  const officeEmail = process.env.ENQUIRIES_EMAIL || process.env.ADMISSIONS_EMAIL;
  if (officeEmail) {
    const lines = [
      'New Business Improvement Diagnostic checkout verified',
      'Stripe session: ' + session.id,
      'Business: ' + (session.metadata?.company || 'Not provided'),
      'Customer email: ' + (session.customer_details?.email || session.customer_email || 'Not provided'),
      'Preferred initial appointment: ' + (session.metadata?.preferred_date || 'Not provided'),
      'Mode: ' + (session.livemode ? 'Live' : 'Test'),
      'Next step: Contact the customer to agree an appointment during 26–30 October. The preference is not a confirmed appointment.'
    ];
    const message = lines.join('\n');
    try {
      await sendOutboundEmail(officeEmail, 'Diagnostic payment received: please confirm appointment',
        '<pre style="font-family:inherit;white-space:pre-wrap">' +
          message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>',
        message);
    } catch (error) { console.error('Diagnostic payment notification failed', error); }
  }
  return true;
}

let starting = false;
export function installDiagnosticPaymentRoutes(app: Express, stripeClient: () => Stripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!)) {
  async function placesAvailable(stripe: Stripe) {
    const active = records<Started>(startedFile).filter(item => item.mode === mode());
    let occupied = 0;
    for (const item of active) {
      const session = await stripe.checkout.sessions.retrieve(item.id);
      if (!isThisOffer(session)) throw new Error('Unexpected entry in diagnostic checkout register');
      if (session.payment_status === 'paid') {
        await recordDiagnosticPayment(session);
        occupied++;
      } else if (session.status === 'open') occupied++;
    }
    return Math.max(0, MAX_PLACES - occupied);
  }

  app.get('/api/diagnostic/status', async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    if (Date.now() >= CLOSES_AT) {
      res.json({ accepting: false, closed: true, remaining: 0, mode: mode() }); return;
    }
    if (!configured()) {
      res.json({ accepting: false, closed: false, configured: false, remaining: null, mode: mode() }); return;
    }
    try {
      const remaining = await placesAvailable(stripeClient());
      res.json({ accepting: remaining > 0 && Date.now() + CHECKOUT_MIN_SECONDS * 1000 <= CLOSES_AT,
        closed: false, configured: true, remaining, mode: mode() });
    } catch (error) {
      console.error('Diagnostic status unavailable', error);
      res.status(503).json({ error: 'Online booking is temporarily unavailable. Contact WOW for assistance.' });
    }
  });

  app.post('/api/diagnostic/checkout', express.json({ limit: '8kb' }), async (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (Date.now() + CHECKOUT_MIN_SECONDS * 1000 > CLOSES_AT) {
      res.status(410).json({ error: 'The October introductory payment window has closed.' }); return;
    }
    if (!configured()) { res.status(503).json({ error: 'Online payments are currently unavailable. Please contact WOW.' }); return; }
    const { company, email, preferredDate, termsAccepted } = req.body || {};
    if (typeof company !== 'string' || company.trim().length < 2 || company.trim().length > 120 ||
        typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !['2026-10-26','2026-10-27','2026-10-28','2026-10-29','2026-10-30'].includes(preferredDate) ||
        termsAccepted !== true) {
      res.status(400).json({ error: 'Please supply the business name, email, preferred date and consent to the package terms.' }); return;
    }
    if (starting) { res.status(409).json({ error: 'A checkout is being prepared. Please retry shortly.' }); return; }
    starting = true;
    try {
      const stripe = stripeClient();
      if ((await placesAvailable(stripe)) < 1) {
        res.status(409).json({ error: 'All currently available places are reserved. Contact WOW to enquire.' }); return;
      }
      const site = root().origin + '/?page=health-care-diagnostic';
      const expiresAt = Math.min(Math.floor(Date.now()/1000) + 1800, Math.floor(CLOSES_AT/1000));
      const session = await stripe.checkout.sessions.create({
        mode: 'payment', payment_method_types: ['card'],
        customer_email: email.trim().toLowerCase(),
        line_items: [{ price_data: { currency: 'gbp', unit_amount: PRICE,
          product_data: { name: 'WOW Business Improvement Diagnostic for Health & Care Organisations',
            description: 'Structured assessment for one location or service; prioritised findings, RAG scorecard, 30/60/90-day improvement plan and leadership feedback.' } },
          quantity: 1 }],
        metadata: { wbd_offer: OFFER, company: company.trim(), preferred_date: preferredDate, terms_accepted_at: new Date().toISOString() },
        success_url: site + '&checkout=success&session_id={CHECKOUT_SESSION_ID}',
        cancel_url: site + '&checkout=cancelled',
        expires_at: expiresAt,
      });
      if (!session.url) throw new Error('Checkout URL not returned');
      try {
        const started = records<Started>(startedFile);
        started.push({ id: session.id, mode: mode() });
        save(startedFile, started);
      } catch (error) {
        await stripe.checkout.sessions.expire(session.id).catch(() => undefined);
        throw error;
      }
      res.json({ url: session.url });
    } catch (error) {
      console.error('Diagnostic checkout failed', error);
      res.status(503).json({ error: 'Checkout could not be prepared. No payment was taken; please try again or contact WOW.' });
    } finally { starting = false; }
  });

  app.get('/api/diagnostic/verify', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const sessionId = req.query.session_id;
    if (typeof sessionId !== 'string' || !/^cs_(test_|live_)[a-zA-Z0-9]+$/.test(sessionId)) {
      res.status(400).json({ error: 'Invalid checkout reference.' }); return;
    }
    if (!configured()) { res.status(503).json({ error: 'Verification unavailable. Contact WOW before paying again.' }); return; }
    try {
      const session = await stripeClient().checkout.sessions.retrieve(sessionId);
      if (!isThisOffer(session) || session.amount_total !== PRICE || session.currency !== 'gbp') {
        res.status(403).json({ error: 'Checkout is not for this diagnostic.' }); return;
      }
      res.json({ paid: await recordDiagnosticPayment(session), mode: session.livemode ? 'live' : 'test' });
    } catch (error) {
      console.error('Diagnostic verification unavailable', error);
      res.status(503).json({ error: 'Verification is delayed. Do not pay twice; contact WOW with your checkout details.' });
    }
  });
}
