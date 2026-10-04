import { installEngagementDashboard } from './engagement.js';
import type { Express, Request, Response, NextFunction } from 'express';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { getAllRegistrations, saveRegistration, generateStaffAlertEmail, generateDelegateWelcomeEmail, sendOutboundEmail } from './admissionsService.js';
import { readPayments } from './payments.js';
import { answerLabels, emptyReview, reviewStatuses, applicationsCSV, type Application, type Review } from '../src/admissions/model.js';
const scrypt = promisify(scryptCallback);
const base = '/api/admissions-dashboard';
const cookieName = 'wbd_admissions';
const directory = () => path.join(process.cwd(), 'data');
function read<T>(name: string, fallback: T): T { const file = path.join(directory(), name); return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback; }
function write(name: string, value: unknown) { fs.mkdirSync(directory(), { recursive: true, mode: 0o700 }); const file = path.join(directory(), name); fs.writeFileSync(file + '.tmp', JSON.stringify(value, null, 2), { mode: 0o600 }); fs.renameSync(file + '.tmp', file); }
type User = { email: string; name: string; salt: string; hash: string };
function users(): User[] { const data = read<User[]>('admissions-users.json', []); if (!Array.isArray(data)) throw new Error('Invalid staff store'); return data; }
export async function createAdmissionsUser(email: string, name: string, password: string) {
 email = email.trim().toLowerCase();
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name.trim() || password.length < 16) throw new Error('Valid email, name and password of at least 16 characters required.');
 const salt = randomBytes(16).toString('hex'); const hash = (await scrypt(password, salt, 64) as Buffer).toString('hex');
 write('admissions-users.json', [...users().filter(u => u.email !== email), { email, name: name.trim(), salt, hash }]);
}
export function revokeAdmissionsUser(email: string) { write('admissions-users.json', users().filter(u => u.email !== email.trim().toLowerCase())); }
function reviews(): Record<string, Review> { const data = read<Record<string, Review>>('admissions-reviews.json', {}); if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error('Invalid review store'); return data; }
function list(): Application[] {
 const review = reviews(); const payments = readPayments();
 return getAllRegistrations().map(record => {
  const raw = record as unknown as Record<string, unknown>;
  const answers = Object.fromEntries(Object.keys(answerLabels).filter(k => raw[k] != null).map(k => [k, raw[k]])) as Application['answers'];
  const email = (value: typeof record.emailDelivery.staffAlert | undefined) => value ? { sent: value.sent, method: value.method, timestamp: value.timestamp } : null;
  return { reference: record.referenceNumber, name: String(raw.fullName || [record.firstName, record.lastName].filter(Boolean).join(' ') || 'Unnamed applicant'), email: record.email, submittedAt: record.submittedAt, answers, review: review[record.referenceNumber] || emptyReview(), emails: { staff: email(record.emailDelivery?.staffAlert), applicant: email(record.emailDelivery?.delegateWelcome) }, paid: payments.filter(p => p.reference === record.referenceNumber && p.live).reduce((s, p) => s + p.amount - (p.refunded || 0), 0), sheetsSynced: record.sheetsSync?.synced === true };
 });
}
const digest = (text: string) => createHash('sha256').update(text).digest('hex');
function token(req: Request) { return (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(cookieName + '='))?.slice(cookieName.length + 1) || ''; }
export function installAdmissionsDashboard(app: Express) {
 const sessions = new Map<string, { email: string; fingerprint: string; expires: number }>();
 const attempts = new Map<string, { count: number; expires: number }>();
 const sending = new Set<string>();
 const cooldown = new Map<string, number>();
 const production = () => process.env.NODE_ENV === 'production';
 const cookie = (res: Response, value: string, age: number) => res.cookie(cookieName, value, { httpOnly: true, sameSite: 'strict', secure: production(), path: base, maxAge: age });
 app.use(base, (_req, res, next) => { res.set({ 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }); next(); });
 // The expected origin is configured, never inferred from untrusted Host headers.
 app.use(base, (req, res, next) => {
  if (['GET', 'HEAD'].includes(req.method)) return next();
  let expected: string;
  try { expected = new URL(process.env.APP_URL || (production() ? '' : 'http://localhost:3000')).origin; } catch { res.status(503).json({ error: 'Admissions origin is not configured.' }); return; }
  if (req.headers.origin !== expected || !req.is('application/json')) { res.status(403).json({ error: 'Please use the dashboard on the website.' }); return; }
  next();
 });
 const current = (req: Request) => {
  const key = digest(token(req)); const session = sessions.get(key);
  if (!session || session.expires < Date.now()) { sessions.delete(key); return null; }
  const user = users().find(u => u.email === session.email && digest(u.hash) === session.fingerprint);
  if (!user) sessions.delete(key);
  return user || null;
 };
 const guard = (req: Request, res: Response, next: NextFunction) => { try { const user = current(req); if (!user) { res.status(401).json({ error: 'Please sign in again.' }); return; } res.locals.user = user; next(); } catch { res.status(503).json({ error: 'Admissions access is temporarily unavailable.' }); } };
 app.get(base + '/session', (req, res) => { try { res.json({ user: current(req)?.name || null }); } catch { res.status(503).json({ error: 'Admissions access is temporarily unavailable.' }); } });
 app.post(base + '/login', async (req, res) => {
  try {
   for (const [k, v] of attempts) if (v.expires < Date.now()) attempts.delete(k);
   const key = req.ip || 'unknown'; const attempt = attempts.get(key) || { count: 0, expires: Date.now() + 15 * 60_000 };
   if (attempts.size >= 5000 || attempt.count >= 10) { res.status(429).json({ error: 'Too many attempts. Please try again in 15 minutes.' }); return; }
   attempt.count++; attempts.set(key, attempt);
   const { email, password } = req.body || {};
   if (typeof email !== 'string' || typeof password !== 'string' || email.length > 254 || password.length > 256) { res.status(400).json({ error: 'Enter your email and password.' }); return; }
   const user = users().find(u => u.email === email.trim().toLowerCase());
   const calculated = await scrypt(password, user?.salt || 'wbd-dummy-salt', 64) as Buffer;
   if (!user || !timingSafeEqual(calculated, Buffer.from(user.hash, 'hex'))) { res.status(401).json({ error: 'Email or password is incorrect.' }); return; }
   for (const [k, v] of sessions) if (v.expires < Date.now()) sessions.delete(k);
   if (sessions.size >= 1000) { res.status(503).json({ error: 'Please try again later.' }); return; }
   sessions.delete(digest(token(req)));
   const value = randomBytes(32).toString('hex'); const age = 60 * 60_000;
   sessions.set(digest(value), { email: user.email, fingerprint: digest(user.hash), expires: Date.now() + age });
   attempts.delete(key); cookie(res, value, age); res.json({ user: user.name });
  } catch { res.status(503).json({ error: 'Admissions sign-in is unavailable. Ask your website administrator to check staff access.' }); }
 });
 app.post(base + '/logout', (req, res) => { sessions.delete(digest(token(req))); cookie(res, '', 0); res.json({ success: true }); });
 app.use(base, guard);
 installEngagementDashboard(app);
 app.get(base + '/applications', (_req, res) => { try { res.json({ applications: list() }); } catch { res.status(503).json({ error: 'Applications could not be loaded. Ask your website administrator to check the saved register.' }); } });
 app.get(base + '/export', (_req, res) => { try { res.attachment('WBD-applications.csv').type('text/csv').send(applicationsCSV(list())); } catch { res.status(503).json({ error: 'Export is unavailable.' }); } });
 app.patch(base + '/applications/:reference', (req, res) => {
  try {
   const reference = req.params.reference;
   if (!getAllRegistrations().some(r => r.referenceNumber === reference)) { res.status(404).json({ error: 'Application not found.' }); return; }
   const data = req.body || {}; const { status, notes, callDate, callTime, callZone, version } = data;
   if (!reviewStatuses.includes(status) || typeof notes !== 'string' || notes.length > 10_000 || !Number.isInteger(version) || ![callDate, callTime, callZone].every(v => typeof v === 'string') || callZone.length > 100 || (callDate && (!/^\d{4}-\d{2}-\d{2}$/.test(callDate) || !Number.isFinite(Date.parse(callDate)) || new Date(callDate).toISOString().slice(0, 10) !== callDate)) || (callTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(callTime)) || ((callDate || callTime || callZone) && !(callDate && callTime && callZone.trim())) || (status === 'Call arranged' && !(callDate && callTime && callZone.trim()))) { res.status(400).json({ error: 'Check the status, notes and confirmed call details. An arranged call needs a date, time and time zone.' }); return; }
   const all = reviews(); const previous = all[reference] || emptyReview();
   if (version !== previous.version) { res.status(409).json({ error: 'A colleague updated this application. Refresh and review their changes before saving.' }); return; }
   const review: Review = { version: version + 1, status, notes, callDate, callTime, callZone, updatedAt: new Date().toISOString(), updatedBy: res.locals.user.name };
   all[reference] = review; write('admissions-reviews.json', all); res.json({ review });
  } catch { res.status(503).json({ error: 'Review changes could not be saved.' }); }
 });
 app.post(base + '/applications/:reference/email', async (req, res) => {
  const { reference } = req.params; const { kind, confirmed } = req.body || {};
  if (!['staff', 'applicant'].includes(kind) || confirmed !== true) { res.status(400).json({ error: 'Confirm the email action first.' }); return; }
  const key = reference + ':' + kind;
  if (sending.has(key) || (cooldown.get(key) || 0) > Date.now()) { res.status(429).json({ error: 'An email was just requested. Wait one minute before trying again.' }); return; }
  try {
   const reg = getAllRegistrations().find(r => r.referenceNumber === reference);
   if (!reg) { res.status(404).json({ error: 'Application not found.' }); return; }
   // Do not send an awaiting-review acknowledgement after a decision.
   const status = reviews()[reference]?.status;
   if (kind === 'applicant' && (status === 'Accepted' || status === 'Not accepted')) { res.status(409).json({ error: 'This application has a decision. Send the appropriate decision email manually, not an awaiting-review acknowledgement.' }); return; }
   sending.add(key);
   const content = kind === 'staff' ? generateStaffAlertEmail(reg) : generateDelegateWelcomeEmail(reg);
   const result = await sendOutboundEmail(kind === 'staff' ? process.env.ADMISSIONS_EMAIL || 'wowdigital@wowbusinessanddigital.com' : reg.email, content.subject, content.html, content.text);
   const latest = getAllRegistrations().find(r => r.referenceNumber === reference);
   if (!latest) throw new Error('Application removed during send');
   const blank = { sent: false, method: 'not-attempted', timestamp: '' };
   latest.emailDelivery = { staffAlert: latest.emailDelivery?.staffAlert || blank, delegateWelcome: latest.emailDelivery?.delegateWelcome || blank, [kind === 'staff' ? 'staffAlert' : 'delegateWelcome']: { sent: result.success, method: result.method, timestamp: new Date().toISOString(), error: result.error } };
   saveRegistration(latest);
   for (const [k, v] of cooldown) if (v < Date.now()) cooldown.delete(k);
   cooldown.set(key, Date.now() + 60_000);
   res.json({ sent: result.success });
  } catch { res.status(503).json({ error: 'The email result could not be confirmed. Check Resend before retrying to avoid a duplicate.' }); }
  finally { sending.delete(key); }
 });
}
