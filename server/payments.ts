import express, { Express } from 'express';
import Stripe from 'stripe';
import fs from 'node:fs';
import path from 'node:path';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { sendOutboundEmail, getAllRegistrations } from './admissionsService.js';

const file = () => path.join(process.cwd(), 'data', 'payments.json');
type Payment = { session: string; reference: string; amount: number; live: boolean; date: string; plan?: string; refunded?: number };
export const readPayments = (): Payment[] => fs.existsSync(file()) ? JSON.parse(fs.readFileSync(file(), 'utf8')) : [];
const origin = () => {
  try {
    return new URL(process.env.APP_URL || 'http://localhost:3000').origin;
  } catch {
    return 'http://localhost:3000';
  }
};
let derivedSigningKey: string = '';
const signingKey = () => {
  if ((process.env.PAYMENT_LINK_SECRET || '').length >= 32) return process.env.PAYMENT_LINK_SECRET!;
  if (process.env.STRIPE_SECRET_KEY) {
    if (!derivedSigningKey) {
      derivedSigningKey = createHmac('sha256', 'wbd-payment-signing-fallback').update(process.env.STRIPE_SECRET_KEY).digest('hex');
    }
    return derivedSigningKey;
  }
  return '';
};
export function paymentToken(reference: string) {
  return signingKey() ? createHmac('sha256', signingKey()).update(reference).digest('hex') : '';
}
export function paymentLink(reference: string) {
  if (!signingKey()) return '';
  try { return `${origin()}/?page=payments&reference=${encodeURIComponent(reference)}&token=${paymentToken(reference)}`; } catch { return ''; }
}
function validToken(reference: string, token: string) {
  const expected = paymentToken(reference);
  return !!expected && typeof token === 'string' && /^[0-9a-f]{64}$/.test(token) && timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
export function quotePayment(plan: string, alreadyPaid: number, mentorship: boolean, custom?: string, now = new Date()) {
  const total = mentorship ? 125000 : 100000;
  if (plan === 'custom') {
    if (typeof custom !== 'string' || !/^\d+(\.\d{1,2})?$/.test(custom)) throw new Error('Enter an amount in pounds with no more than two decimal places.');
    const amount = Math.round(Number(custom) * 100);
    if (amount < 100 || amount > total - alreadyPaid) throw new Error('Enter at least £1 and no more than the remaining programme balance.');
    return amount;
  }
  const targets: Record<string, number> = { deposit: 5000, instalment: alreadyPaid < 50000 ? 50000 : total, full: total, early: 90000 };
  if (!(plan in targets)) throw new Error('Choose a payment option.');
  if (plan === 'early' && (mentorship || now >= new Date('2026-11-01T00:00:00Z'))) throw new Error('The £900 offer is for the standard programme paid by 31 October 2026.');
  const amount = targets[plan] - alreadyPaid;
  if (amount <= 0) throw new Error('This payment stage is already paid. Choose the next stage if a balance remains.');
  return amount;
}
export function recordPaidSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== 'paid') return false;
  const m = session.metadata || {};
  if (!m.wbd_reference || !m.wbd_amount || session.currency !== 'gbp' || session.amount_total !== Number(m.wbd_amount)) throw new Error('Payment verification failed.');
  const payments = readPayments();
  if (!payments.some(p => p.session === session.id)) {
    payments.push({ session: session.id, reference: m.wbd_reference, amount: session.amount_total!, live: session.livemode, date: new Date().toISOString(), plan: m.plan });
    fs.mkdirSync(path.dirname(file()), { recursive: true, mode: 0o700 });
    fs.writeFileSync(file() + '.tmp', JSON.stringify(payments, null, 2), { mode: 0o600 });
    fs.renameSync(file() + '.tmp', file());
  }
  return true;
}
const locks = new Set<string>();
export function recordRefund(session: Stripe.Checkout.Session, amountRefunded: number) {
  recordPaidSession(session);
  const payments = readPayments();
  const payment = payments.find(p => p.session === session.id);
  if (!payment || !Number.isInteger(amountRefunded) || amountRefunded < 0 || amountRefunded > payment.amount) throw new Error('Invalid refund amount.');
  payment.refunded = Math.max(payment.refunded || 0, amountRefunded);
  fs.writeFileSync(file() + '.tmp', JSON.stringify(payments, null, 2), { mode: 0o600 });
  fs.renameSync(file() + '.tmp', file());
}
export function installPaymentWebhook(app: Express) {
  app.post('/api/stripe/webhook', express.raw({ type: 'application/json', limit: '100kb' }), async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) { res.sendStatus(503); return; }
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'] as string, process.env.STRIPE_WEBHOOK_SECRET);
      if (['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.wbd_reference) recordPaidSession(session);
      }
      if (event.type === 'charge.refunded') {
        const charge = event.data.object as Stripe.Charge;
        if (typeof charge.payment_intent === 'string') {
          const sessions = await stripe.checkout.sessions.list({ payment_intent: charge.payment_intent, limit: 1 });
          for (const session of sessions.data) if (session.metadata?.wbd_reference) recordRefund(session, charge.amount_refunded);
        }
      }
      res.json({ received: true });
    } catch { res.status(400).json({ error: 'Webhook could not be verified or recorded; retry required.' }); }
  });
}
export function installPaymentRoutes(app: Express, createClient: () => Stripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!)) {
  const configured = () => {
    try { return !!(process.env.STRIPE_SECRET_KEY?.match(/^sk_(test|live)_/) && signingKey() && /^https?:\/\//.test(origin())); } catch { return false; }
  };
  const mode = () => process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'live' : 'test';
  app.get('/api/stripe/status', (_req, res) => res.json({
    configured: configured(),
    mode: mode(),
    webhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || null,
  }));
  // Recovery sends only to the address on an accepted application; never exposes a link publicly.
  const recoveryLimits = new Map<string, { count: number; until: number }>();
  app.post('/api/stripe/request-payment-link', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const { reference, email } = req.body || {};
    if (typeof reference !== 'string' || reference.length > 100 || !reference.trim() || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { res.status(400).json({error:'Enter your application reference and email address.'}); return; }
    const now = Date.now();
    for (const [key, limit] of recoveryLimits) if (limit.until < now) recoveryLimits.delete(key);
    const keys = ['ip:' + req.ip, 'application:' + reference.trim().toUpperCase()];
    if (recoveryLimits.size > 5000 || keys.some(key => (recoveryLimits.get(key)?.count || 0) >= 3)) { res.status(429).json({error:'Please wait 15 minutes before requesting another link, or contact WOW.'}); return; }
    for (const key of keys) { const old = recoveryLimits.get(key); recoveryLimits.set(key,{count:(old?.count || 0)+1,until:old?.until || now+15*60_000}); }
    const reply = {message:'If these details match an accepted application, we will send a payment link to your application email address. Check your inbox and spam folder. If it does not arrive, contact WOW quoting your reference. You do not need to apply again.'};
    try {
      const reg = getAllRegistrations().find(r => r.referenceNumber.toUpperCase() === reference.trim().toUpperCase() && r.email.toLowerCase() === email.trim().toLowerCase());
      const reviewsFile = path.join(process.cwd(), 'data', 'admissions-reviews.json');
      const reviews = fs.existsSync(reviewsFile) ? JSON.parse(fs.readFileSync(reviewsFile, 'utf8')) : {};
      if (reg && reviews[reg.referenceNumber]?.status === 'Accepted') {
        const link = paymentLink(reg.referenceNumber);
        if (!link || !link.startsWith('https://')) throw new Error('Payment link configuration required');
        const safeLink = link.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
        const text = `Your WOW Career Accelerator payment link: ${link}\n\nUse this private link to pay according to the schedule agreed in your acceptance email. The £50 deposit is credited towards tuition. Keep this link private. If you have already paid but it is not showing, contact WOW before paying again.`;
        const result = await sendOutboundEmail(reg.email, 'Your WOW Career Accelerator payment link', `<p>Use your private payment link to pay according to your agreed acceptance and payment schedule.</p><p><a href="${safeLink}">Open your payment page</a></p><p>The £50 deposit is credited towards tuition. If you have already paid but it is not showing, contact WOW before paying again. Keep this link private.</p>`, text);
        if (!result.success) console.error('[Payment link recovery] Email provider did not accept the message. Check mail configuration.');
      }
      // Same response for unmatched/unaccepted applications to avoid revealing applicant status.
      res.json(reply);
    } catch { res.status(503).json({error:'Payment link recovery is unavailable. Contact WOW with your reference; do not apply again.'}); }
  });
  app.post('/api/stripe/application', (req, res) => {
    const { reference, token } = req.body || {};
    if (typeof reference !== 'string' || !validToken(reference, token)) { res.status(403).json({ error: 'Open the private payment link supplied after your application.' }); return; }
    const reg = getAllRegistrations().find(r => r.referenceNumber === reference);
    if (!reg) { res.status(404).json({ error: 'Application not found.' }); return; }
    const live = mode() === 'live';
    const paid = readPayments().filter(p => p.reference === reference && p.live === live).reduce((n,p) => n + p.amount - (p.refunded || 0), 0);
    res.set('Cache-Control','no-store').json({ paid, reserved: live && paid >= 5000, settled: paid >= (/mentorship/i.test(reg.packageSelection || '') ? 125000 : readPayments().some(p=>p.reference===reference && p.live===live && p.plan==='early') ? 90000 : 100000), mentorship: /mentorship/i.test(reg.packageSelection || ''), mode: mode() });
  });
  app.post('/api/stripe/create-checkout-session', async (req, res) => {
    const { reference, token, plan, customAmount, termsAccepted } = req.body || {};
    if (typeof reference !== 'string' || !validToken(reference, token)) { res.status(403).json({ error: 'Open your private application payment link.' }); return; }
    if (termsAccepted !== true) { res.status(400).json({ error: 'Please read and accept the programme terms before payment.' }); return; }
    if (!configured()) { res.status(503).json({ error: 'Card payments are not ready yet. Please contact WOW quoting your application reference. Your place is not reserved without payment or an agreed sponsorship arrangement.' }); return; }
    if (locks.has(reference)) { res.status(409).json({ error: 'A checkout is being prepared. Please wait and try again.' }); return; }
    locks.add(reference);
    try {
      const reg = getAllRegistrations().find(r => r.referenceNumber === reference);
      if (!reg) throw new Error('Application not found.');
      const stripe = createClient();
      // One reusable Stripe customer per application; inspect sessions across process restarts.
      const customersFile = path.join(path.dirname(file()), 'payment-customers.json');
      const customers = fs.existsSync(customersFile) ? JSON.parse(fs.readFileSync(customersFile, 'utf8')) : {};
      const customerKey = `${mode()}:${reference}`;
      if (!customers[customerKey]) {
        const created = await stripe.customers.create({ email: reg.email, metadata: { wbd_reference: reference } }, { idempotencyKey: `wbd-customer-${reference}` });
        // Re-read after the network await so another application's customer is not overwritten.
        const current = fs.existsSync(customersFile) ? JSON.parse(fs.readFileSync(customersFile, 'utf8')) : {};
        current[customerKey] = created.id;
        fs.mkdirSync(path.dirname(file()), { recursive: true, mode: 0o700 });
        fs.writeFileSync(customersFile + '.tmp', JSON.stringify(current), { mode: 0o600 });
        fs.renameSync(customersFile + '.tmp', customersFile);
        customers[customerKey] = created.id;
      }
      const customer = { id: customers[customerKey] };
      const sessions = await stripe.checkout.sessions.list({ customer: customer.id, limit: 100 });
      for (const session of sessions.data) {
        if (session.metadata?.wbd_reference !== reference) continue;
        if (session.payment_status === 'paid') recordPaidSession(session);
        if (session.status === 'complete' && session.payment_status !== 'paid') throw new Error('An earlier payment is still being confirmed. Please contact WOW before paying again.');
        if (session.status === 'open') await stripe.checkout.sessions.expire(session.id);
      }
      const paid = readPayments().filter(p => p.reference === reference && p.live === (mode() === 'live')).reduce((n,p) => n + p.amount - (p.refunded || 0), 0);
      const settledEarly = readPayments().some(p => p.reference === reference && p.live === (mode() === 'live') && p.plan === 'early');
      if (settledEarly && paid >= 90000) throw new Error('Your early settlement programme fee is already paid in full.');
      if (plan === 'full' && /mentorship/i.test(reg.packageSelection || '') && !reg.packageSelection?.includes('1,250')) throw new Error('Please agree your executive mentorship fee and payment arrangements with WOW before using the bespoke payment option.');
      const amount = quotePayment(plan, paid, !!/mentorship/i.test(reg.packageSelection || ''), customAmount);
      const returnUrl = paymentLink(reference);
      const session = await stripe.checkout.sessions.create({
        mode: 'payment', customer: customer.id, payment_method_types: ['card'],
        line_items: [{ price_data: { currency: 'gbp', unit_amount: amount, product_data: { name: `WOW Career Accelerator - ${plan === 'deposit' ? 'registration deposit' : plan === 'custom' ? 'agreed part payment' : plan === 'instalment' ? 'instalment' : 'programme balance'}` } }, quantity: 1 }],
        client_reference_id: reference, metadata: { wbd_reference: reference, wbd_amount: String(amount), plan, termsAcceptedAt: new Date().toISOString(), termsVersion: '2026-10-02' },
        success_url: `${returnUrl}&session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${returnUrl}&cancelled=1`, expires_at: Math.floor(Date.now()/1000)+1800,
      });
      res.json({ url: session.url, mode: mode(), amount });
    } catch (error) { res.status(400).json({ error: error instanceof Error && !('type' in error) ? error.message : 'Checkout could not be prepared. No payment has been taken. Please try again or contact WOW.' }); }
    finally { locks.delete(reference); }
  });
  app.post('/api/stripe/verify', async (req, res) => {
    const { reference, token, sessionId } = req.body || {};
    if (typeof reference !== 'string' || !validToken(reference, token) || typeof sessionId !== 'string') { res.sendStatus(403); return; }
    try {
      const stripe = createClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.metadata?.wbd_reference !== reference) { res.sendStatus(403); return; }
      const paid = recordPaidSession(session);
      res.set('Cache-Control','no-store').json({ paid, mode: session.livemode ? 'live' : 'test' });
    } catch { res.status(503).json({ error: 'Payment confirmation is temporarily unavailable. Do not pay again; contact WOW with your reference.' }); }
  });
  app.get('/api/stripe/ledger', (req,res) => {
    if (!process.env.ADMISSIONS_ADMIN_TOKEN || req.headers.authorization !== `Bearer ${process.env.ADMISSIONS_ADMIN_TOKEN}`) { res.sendStatus(403); return; }
    res.set('Cache-Control','no-store').json(readPayments());
  });
}
