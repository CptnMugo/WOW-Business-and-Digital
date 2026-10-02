import fs from 'node:fs';
import path from 'node:path';
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import type { Express, Request, Response } from 'express';
const file = () => path.join(process.env.DATA_DIR || 'data', 'workspace-access.json');
const hash = (v: string) => createHash('sha256').update(v).digest('hex');
type Member = { email: string; name: string; reason: string; reference: string; requestedAt: string; approvedUntil?: number; inviteHash?: string; inviteUntil?: number };
type Session = { email: string; hash: string; expires: number };
type Store = { members: Member[]; sessions: Session[] };
export function readAccess(): Store {
  if (!fs.existsSync(file())) return { members: [], sessions: [] };
  const data = JSON.parse(fs.readFileSync(file(), 'utf8'));
  if (!Array.isArray(data.members) || !Array.isArray(data.sessions)) throw new Error('Invalid access store');
  return data;
}
export function writeAccess(data: Store) {
  fs.mkdirSync(path.dirname(file()), { recursive: true, mode: 0o700 });
  const temp = file() + '.' + randomBytes(8).toString('hex');
  fs.writeFileSync(temp, JSON.stringify(data), { mode: 0o600 });
  fs.renameSync(temp, file());
}
export function approveAccess(email: string, days = 210) {
  const data = readAccess();
  const member = data.members.find(m => m.email === email.toLowerCase().trim());
  if (!member) throw new Error('No request found for this email');
  const code = randomBytes(24).toString('base64url');
  member.approvedUntil = Date.now() + days * 86400000;
  member.inviteHash = hash(code); member.inviteUntil = Date.now() + 86400000;
  data.sessions = data.sessions.filter(s => s.email !== member.email);
  writeAccess(data); return code;
}
export function revokeAccess(email: string) {
  const data = readAccess(); const member = data.members.find(m => m.email === email.toLowerCase().trim());
  if (!member) throw new Error('No request found');
  delete member.approvedUntil; delete member.inviteHash; delete member.inviteUntil;
  data.sessions = data.sessions.filter(s => s.email !== member.email); writeAccess(data);
}
const cookieName = () => process.env.NODE_ENV === 'production' ? '__Host-wow_workspace' : 'wow_workspace';
const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, path: '/' });
function memberFor(req: Request) {
  const cookie = (req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith(cookieName() + '='));
  if (!cookie) return undefined;
  const token = cookie.slice(cookieName().length + 1); const data = readAccess();
  const session = data.sessions.find(s => s.hash === hash(token) && s.expires > Date.now());
  return session && data.members.find(m => m.email === session.email && (m.approvedUntil || 0) > Date.now());
}
export function installWorkspaceAccess(app: Express) {
  app.use((req,res,next) => {
    if (req.path.toLowerCase().includes('simulation.html')) { res.status(404).end(); return; }
    next();
  });
  const attempts = new Map<string, { count: number; until: number }>();
  app.use('/api/workspace', (req, res, next) => {
    res.set('Cache-Control', 'no-store'); res.set('X-Content-Type-Options', 'nosniff');
    if (req.method === 'POST') {
      if (req.headers['sec-fetch-site'] === 'cross-site') { res.status(403).json({ error: 'Use the WOW website to continue.' }); return; }
      const origin = req.headers.origin;
      if (origin && ![process.env.PUBLIC_ORIGIN || 'https://www.wowbusinessanddigital.com', ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000','http://127.0.0.1:3000'] : [])].includes(origin)) { res.status(403).json({error:'Invalid request origin.'}); return; }
      const key = req.ip || req.socket.remoteAddress || 'unknown';
      const entry = attempts.get(key); const current = entry && entry.until > Date.now() ? entry : { count: 0, until: Date.now() + 900000 };
      if (++current.count > 30) { res.status(429).json({error:'Please wait before trying again.'}); return; }
      attempts.set(key, current);
      if (attempts.size > 10000) for (const [key, value] of attempts) if (value.until < Date.now()) attempts.delete(key);
    }
    next();
  });
  app.post('/api/workspace/request', (req, res) => {
    const { name, email, reason, privacyAcknowledged } = req.body || {};
    if (typeof name !== 'string' || !name.trim() || name.length > 150 || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof reason !== 'string' || !reason.trim() || reason.length > 2000 || privacyAcknowledged !== true) { res.status(400).json({error:'Complete your name, email, reason and privacy acknowledgement.'}); return; }
    try {
      const data = readAccess(); const normalized = email.trim().toLowerCase();
      // Repeated requests reuse their receipt; the response never exposes approval status.
      const reference = data.members.find(m => m.email === normalized)?.reference || 'WBD-ACCESS-' + randomBytes(6).toString('hex').toUpperCase();
      if (!data.members.some(m => m.email === normalized)) data.members.push({name:name.trim(),email:normalized,reason:reason.trim(),reference,requestedAt:new Date().toISOString()});
      writeAccess(data); res.status(201).json({success:true,reference});
    } catch { res.status(503).json({error:'Your request could not be recorded. Please try again.'}); }
  });
  app.post('/api/workspace/login', (req, res) => {
    const {email, code} = req.body || {};
    if (typeof email !== 'string' || typeof code !== 'string' || code.length > 100) { res.status(401).json({error:'This sign-in code is invalid or expired.'}); return; }
    try {
      const data = readAccess(); const member = data.members.find(m => m.email === email.trim().toLowerCase());
      if (!member?.inviteHash || (member.inviteUntil || 0) <= Date.now() || (member.approvedUntil || 0) <= Date.now() || !timingSafeEqual(Buffer.from(hash(code)), Buffer.from(member.inviteHash))) { res.status(401).json({error:'This sign-in code is invalid or expired.'}); return; }
      const token = randomBytes(32).toString('base64url'); const expires = Math.min(Date.now() + 8 * 3600000, member.approvedUntil!);
      delete member.inviteHash; delete member.inviteUntil;
      data.sessions = data.sessions.filter(s => s.expires > Date.now()); data.sessions.push({email:member.email,hash:hash(token),expires}); writeAccess(data);
      res.cookie(cookieName(), token, {...cookieOptions(), maxAge:expires-Date.now()}); res.json({success:true,name:member.name});
    } catch { res.status(503).json({error:'Sign-in is temporarily unavailable.'}); }
  });
  app.get('/api/workspace/session', (req,res) => { try { const m = memberFor(req); res.json({authenticated:!!m,name:m?.name}); } catch { res.status(503).json({error:'Workspace unavailable.'}); } });
  app.post('/api/workspace/logout', (req,res) => {
    try { const raw=(req.headers.cookie || '').split(';').map(v=>v.trim()).find(v=>v.startsWith(cookieName()+'='));
      if(raw) { const data=readAccess(); data.sessions=data.sessions.filter(s=>s.hash!==hash(raw.slice(cookieName().length+1))); writeAccess(data); }
      res.clearCookie(cookieName(),cookieOptions());res.json({success:true});
    } catch {res.status(503).json({error:'Sign-out could not be completed. Please try again.'});}
  });
  app.get('/api/workspace/content', (req,res) => {
    try { if(!memberFor(req)){res.status(401).json({error:'Approved access and sign-in are required.'});return;}
      const html=fs.readFileSync(path.join(process.cwd(),'server/workspaces/simulation.html'),'utf8').replace(/<header>[\s\S]*?<\/header>/,'').replace(/<nav class="publicnav"[\s\S]*?<\/nav>/,'').replace('Proposed website location | explore the three screens below','Career Accelerator training workspace');
      res.set('Content-Security-Policy', "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; frame-ancestors 'self'; form-action 'none'");res.type('html').send(html);
    } catch {res.status(503).json({error:'Workspace temporarily unavailable.'});}
  });
}
