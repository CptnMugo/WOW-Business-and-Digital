import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import express from 'express';
const originalCwd = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'wbd-admissions-test-'));
process.chdir(temp);
process.env.NODE_ENV = 'production';
process.env.APP_URL = 'https://admissions.example.com';
process.env.RESEND_API_KEY = 'fake-test-key';
process.env.RESEND_FROM = 'Test <sender@example.com>';
process.env.MAIL_PROVIDER = 'resend';
process.env.ADMISSIONS_EMAIL = 'staff@example.com';
delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
const nativeFetch = globalThis.fetch;
let providerFailure = false; const sent: any[] = [];
globalThis.fetch = (async (url: any, options: any) => {
 if (String(url) === 'https://api.resend.com/emails') { sent.push(JSON.parse(options.body)); return new Response(JSON.stringify(providerFailure ? { message: 'test rejection' } : { id: 'dummy-message' }), { status: providerFailure ? 500 : 200, headers: { 'Content-Type': 'application/json' } }); }
 if (!String(url).startsWith('http://127.0.0.1:')) throw new Error('External traffic forbidden in test');
 return nativeFetch(url, options);
}) as typeof fetch;
const { createAdmissionsUser, revokeAdmissionsUser, installAdmissionsDashboard } = await import('../server/admissionsDashboard.js');
const { saveRegistration } = await import('../server/admissionsService.js');
const app = express(); app.use(express.json()); installAdmissionsDashboard(app);
const server = app.listen(0, '127.0.0.1'); await new Promise<void>(resolve => server.once('listening', resolve));
const address = server.address() as { port: number }; const root = `http://127.0.0.1:${address.port}/api/admissions-dashboard`;
let cookie = ''; let checks = 0;
function check(value: unknown, message: string) { assert.ok(value, message); checks++; }
async function request(url: string, method = 'GET', body?: unknown, origin = process.env.APP_URL, auth = true) {
 return fetch(root + url, { method, headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(origin ? { Origin: origin } : {}), ...(auth && cookie ? { Cookie: cookie } : {}) }, body: body ? JSON.stringify(body) : undefined });
}
async function login() { const response = await request('/login', 'POST', { email: 'admin@example.com', password: 'dummy-password-for-test-only' }); cookie = response.headers.get('set-cookie')!.split(';')[0]; return response; }
try {
 await createAdmissionsUser('admin@example.com', 'Test Reviewer', 'dummy-password-for-test-only');
 const userFile = fs.readFileSync('data/admissions-users.json', 'utf8'); check(!userFile.includes('dummy-password'), 'password must be hashed');
 saveRegistration({ referenceNumber: 'TEST-1', firstName: 'Example', lastName: 'Applicant', email: 'applicant@example.com', phone: 'dummy', status: 'APPLICATION_REVIEW_PENDING', submittedAt: '2026-10-03T10:00:00Z', submissionType: 'APPLICATION', paymentUrl: 'SECRET_PAYMENT_TOKEN', submissionId: 'PRIVATE_NONCE', emailDelivery: { staffAlert: { sent: false, method: 'test', timestamp: '', previewHtml: 'PRIVATE_EMAIL_HTML' }, delegateWelcome: { sent: false, method: 'test', timestamp: '' } } });
 fs.writeFileSync('data/payments.json', JSON.stringify([{ session:'one',reference:'TEST-1',live:true,amount:10000,refunded:2500,date:'' }, {session:'two',reference:'TEST-1',live:false,amount:100000,date:''}]));
 for (const [url, method, body] of [['/applications','GET',null],['/export','GET',null],['/applications/TEST-1','PATCH',{}],['/applications/TEST-1/email','POST',{kind:'staff',confirmed:true}]] as const) check((await request(url, method, body, process.env.APP_URL, false)).status === 401, 'protect ' + url);
 check((await request('/login','POST',{email:'admin@example.com',password:'dummy-password-for-test-only'},'https://evil.example.com')).status === 403,'reject cross-origin login');
 check((await request('/login','POST',{email:'admin@example.com',password:'wrong'})).status === 401,'reject wrong password');
 const signedIn = await login(); check(signedIn.ok,'valid login'); const setCookie = signedIn.headers.get('set-cookie')!; check(/HttpOnly/i.test(setCookie) && /Secure/i.test(setCookie) && /SameSite=Strict/i.test(setCookie),'secure session cookie');
 check((await (await request('/session')).json()).user === 'Test Reviewer','session identity');
 let response = await request('/applications'); const text = await response.text(); check(!/SECRET_PAYMENT_TOKEN|PRIVATE_NONCE|PRIVATE_EMAIL_HTML/.test(text),'exclude secret/internal fields'); check(response.headers.get('cache-control') === 'no-store','no-store header');
 let record = JSON.parse(text).applications[0]; check(record.paid === 7500,'live payments net of refunds only'); check(record.review.status === 'Received','default review');
 let review = { ...record.review, status:'Call arranged',callDate:'2026-10-06',callTime:'14:00',callZone:'Europe/London',notes:'=SUM(1,2)' };
 check((await request('/applications/TEST-1','PATCH',review,'https://evil.example.com')).status === 403,'CSRF review blocked');
 check((await request('/applications/TEST-1','PATCH',{...review,callDate:'2026-02-30'})).status === 400,'invalid calendar date');
 check((await request('/applications/TEST-1','PATCH',{...review,callTime:''})).status === 400,'partial appointment rejected');
 check((await request('/applications/TEST-1','PATCH',{...review,status:'UNSAFE'})).status === 400,'unknown status rejected');
 check((await request('/applications/NOT-FOUND','PATCH',review)).status === 404,'unknown reference rejected');
 response = await request('/applications/TEST-1','PATCH',review); const saved = (await response.json()).review; check(saved.version === 1 && saved.updatedBy === 'Test Reviewer','review persisted with version and reviewer');
 check((await request('/applications/TEST-1','PATCH',review)).status === 409,'concurrent stale edit blocked');
 const raw = JSON.parse(fs.readFileSync('data/registrations.json','utf8'))[0]; check(raw.status === 'APPLICATION_REVIEW_PENDING' && raw.email === 'applicant@example.com','original application unchanged'); check(sent.length === 0,'review sends no messages');
 const csv = await (await request('/export')).text(); check(csv.includes("'=SUM(1,2)"),'CSV formula neutralised'); check(csv.includes('75.00'),'CSV live payment total');
 check((await request('/applications/TEST-1/email','POST',{kind:'applicant'})).status === 400,'email requires explicit confirmation');
 response = await request('/applications/TEST-1/email','POST',{kind:'applicant',confirmed:true}); check((await response.json()).sent,'mock provider acceptance'); check(sent.length === 1 && sent[0].to[0] === 'applicant@example.com','correct applicant destination'); check(sent[0].text.includes('No payment is required at this stage'),'acknowledgement wording');
 check((await request('/applications/TEST-1/email','POST',{kind:'applicant',confirmed:true})).status === 429,'duplicate send throttled');
 providerFailure = true; response = await request('/applications/TEST-1/email','POST',{kind:'staff',confirmed:true}); check(!(await response.json()).sent,'provider rejection recorded honestly'); check(sent.at(-1).to[0] === 'staff@example.com','correct staff destination');
 record = (await (await request('/applications')).json()).applications[0]; check(record.emails.applicant.sent && !record.emails.staff.sent,'separate send results'); check(record.review.version === 1 && record.review.notes === review.notes,'email preserves review');
 response = await request('/applications/TEST-1','PATCH',{...saved,status:'Accepted'}); check(response.ok,'record acceptance');
 // A fresh route instance has no cooldown, exercising decision protection rather than duplicate throttling.
 const app2 = express(); app2.use(express.json()); installAdmissionsDashboard(app2); const server2 = app2.listen(0,'127.0.0.1'); await new Promise<void>(resolve=>server2.once('listening',resolve));
 try {
  const alt = `http://127.0.0.1:${(server2.address() as any).port}/api/admissions-dashboard`;
  const login2 = await fetch(alt+'/login',{method:'POST',headers:{'Content-Type':'application/json',Origin:process.env.APP_URL},body:JSON.stringify({email:'admin@example.com',password:'dummy-password-for-test-only'})});
  const denied = await fetch(alt+'/applications/TEST-1/email',{method:'POST',headers:{'Content-Type':'application/json',Origin:process.env.APP_URL,Cookie:login2.headers.get('set-cookie')!.split(';')[0]},body:JSON.stringify({kind:'applicant',confirmed:true})});
  check(denied.status === 409,'no awaiting-review acknowledgement after decision');
 } finally { server2.close(); }
 await request('/logout','POST',{}); check((await request('/applications')).status === 401,'logout invalidates cookie');
 await login(); await createAdmissionsUser('admin@example.com','Test Reviewer','dummy-new-password-for-test'); check((await request('/applications')).status === 401,'password reset invalidates session');
 await createAdmissionsUser('admin@example.com','Test Reviewer','dummy-password-for-test-only'); await login(); revokeAdmissionsUser('admin@example.com'); check((await request('/applications')).status === 401,'revocation invalidates session');
 await createAdmissionsUser('admin@example.com','Test Reviewer','dummy-password-for-test-only'); await login();
 fs.writeFileSync('data/registrations.json','corrupt-data'); check((await request('/applications')).status === 503,'corrupt storage fails closed'); check(fs.readFileSync('data/registrations.json','utf8') === 'corrupt-data','corrupt data not replaced');
 await request('/logout','POST',{}); for(let i=0;i<10;i++) await request('/login','POST',{email:'nobody@example.com',password:'wrong'}); check((await request('/login','POST',{email:'nobody@example.com',password:'wrong'})).status === 429,'login throttling');
 console.log(`${checks} admissions dashboard checks passed. Dummy data and mocked email only.`);
} finally { globalThis.fetch = nativeFetch; server.close(); process.chdir(originalCwd); fs.rmSync(temp,{recursive:true,force:true}); }
