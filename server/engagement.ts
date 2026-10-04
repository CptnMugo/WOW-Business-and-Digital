import type { Express } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { sendOutboundEmail } from './admissionsService.js';
import { sessions, sessionOpen } from '../src/engagement/options.js';
export type Engagement = { reference: string; createdAt: string; kind: string; name: string; email: string; phone: string; company: string; employees: string; message: string; session: string; status: string; notes: string; version: number; emailStatus: { staff: boolean; visitor: boolean }; };
const file = () => path.join(process.cwd(), 'data', 'career-enquiries.json');
export function readEngagements(): Engagement[] { if (!fs.existsSync(file())) return []; const data = JSON.parse(fs.readFileSync(file(), 'utf8')); if (!Array.isArray(data)) throw new Error('Invalid enquiry store'); return data; }
function write(rows: Engagement[]) { fs.mkdirSync(path.dirname(file()), { recursive: true, mode: 0o700 }); fs.writeFileSync(file() + '.tmp', JSON.stringify(rows, null, 2), { mode: 0o600 }); fs.renameSync(file() + '.tmp', file()); }
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export function installEngagement(app: Express) {
 const attempts = new Map<string, { n: number; until: number }>();
 app.post('/api/career-enquiries', async (req, res) => {
  const b = req.body || {}; const keys = ['name','email','phone','company','employees','message','session'];
  if (!req.is('application/json') || !['taster','call','corporate'].includes(b.kind) || b.consent !== true || b.website || keys.some(k => typeof b[k] !== 'string' || b[k].length > (k === 'message' ? 2000 : 254)) || !b.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) || (b.kind === 'corporate' && (!b.company.trim() || !b.phone.trim()))) { res.status(400).json({ error: 'Please complete the required fields and privacy acknowledgement.' }); return; }
  const session = sessions.find(s => s.id === b.session && s.kind === b.kind);
  if (b.kind !== 'corporate' && (!session || !sessionOpen(session))) { res.status(400).json({ error: 'Please select a future session from the available times.' }); return; }
  for (const [key, value] of attempts) if (value.until < Date.now()) attempts.delete(key);
  const key = req.ip || 'unknown'; const attempt = attempts.get(key) || { n: 0, until: Date.now() + 3600000 };
  if (attempt.n >= 6 || attempts.size >= 10000) { res.status(429).json({ error: 'Please wait before sending another request.' }); return; }
  attempt.n++; attempts.set(key, attempt);
  let record: Engagement;
  try {
   record = { reference: 'WOW-E-' + randomUUID(), createdAt: new Date().toISOString(), kind: b.kind, ...Object.fromEntries(keys.map(k => [k, b[k].trim()])), session: session ? session.label + ' (UK time)' : '', status: 'New', notes: '', version: 0, emailStatus: { staff: false, visitor: false } } as Engagement;
   write([...readEngagements(), record]);
  } catch { res.status(503).json({ error: 'Your request could not be saved. Please try again later.' }); return; }
  const acknowledgment = record.kind === 'corporate' ? 'Thank you for your corporate enquiry. WOW will contact you to discuss employee sponsorship and support.' : 'Thank you. Your request has been received, but your place or call is not yet confirmed. WOW will email confirmation and joining details separately. Please do not attend without confirmation.';
  const detail = [record.reference, record.name, record.email, record.phone, record.company, record.employees, record.session, record.message].filter(Boolean).join('\n');
  const send = async (to: string, subject: string, text: string) => { try { return (await sendOutboundEmail(to, subject, `<div style="white-space:pre-wrap">${escape(text)}</div>`, text)).success; } catch { return false; } };
  const [staff, visitor] = await Promise.all([send(process.env.ADMISSIONS_EMAIL || 'wowdigital@wowbusinessanddigital.com', `Career ${record.kind} request: ${record.name}`, detail), send(record.email, 'WOW: request received', acknowledgment + '\n\n' + record.reference + '\n' + record.session + '\n\nNo payment has been taken. This is not a programme application or a reservation for the November cohort.')]);
  try { const rows = readEngagements(); const saved = rows.find(r => r.reference === record.reference); if (saved) saved.emailStatus = { staff, visitor }; write(rows); } catch { /* Persisted request remains available even if email audit update fails. */ }
  res.status(201).json({ reference: record.reference, message: acknowledgment, emailAccepted: visitor });
 });
}
// Install only AFTER the existing admissions authentication and origin guards.
export function installEngagementDashboard(app: Express) {
 app.get('/api/admissions-dashboard/career-enquiries', (_req, res) => { try { res.json({ records: readEngagements() }); } catch { res.status(503).json({ error: 'Enquiries could not be loaded.' }); } });
 app.patch('/api/admissions-dashboard/career-enquiries/:reference', (req, res) => {
  try {
   const { status, notes, version } = req.body || {};
   if (!['New','Contacted','Confirmed manually','Closed'].includes(status) || typeof notes !== 'string' || notes.length > 5000 || !Number.isInteger(version)) { res.status(400).json({ error: 'Check the status and notes.' }); return; }
   const rows = readEngagements(); const record = rows.find(r => r.reference === req.params.reference);
   if (!record) { res.status(404).json({ error: 'Request not found.' }); return; }
   if (record.version !== version) { res.status(409).json({ error: 'This request has changed. Refresh before saving.' }); return; }
   Object.assign(record, { status, notes, version: version + 1 }); write(rows); res.json({ record });
  } catch { res.status(503).json({ error: 'Changes could not be saved.' }); }
 });
}
