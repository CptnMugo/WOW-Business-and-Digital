import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import express from 'express';
const cwd = process.cwd(); const temp = fs.mkdtempSync(os.tmpdir() + '/wbd-engagement-'); process.chdir(temp);
process.env.RESEND_API_KEY = 'test'; process.env.RESEND_FROM = 'test@example.com'; process.env.MAIL_PROVIDER = 'resend'; process.env.APP_URL = 'http://localhost:3000';
const nativeFetch = globalThis.fetch; let fail = false;
globalThis.fetch = (async (url: any, options: any) => { if (String(url) === 'https://api.resend.com/emails') return new Response(JSON.stringify(fail ? { message: 'rejected' } : { id: 'test' }), { status: fail ? 500 : 200 }); if (!String(url).startsWith('http://127.0.0.1:')) throw new Error('No external traffic'); return nativeFetch(url, options); }) as typeof fetch;
const { installEngagement, readEngagements } = await import('../server/engagement.js'); const { installAdmissionsDashboard, createAdmissionsUser } = await import('../server/admissionsDashboard.js');
const app = express(); app.use(express.json()); installAdmissionsDashboard(app); installEngagement(app); const server = app.listen(0,'127.0.0.1'); await new Promise<void>(r => server.once('listening',r)); const root = `http://127.0.0.1:${(server.address() as any).port}`;
const body = { kind: 'corporate', name: 'Test Contact', email: 'test@example.com', phone: '0123456789', company: 'Test Company', employees: '3', message: '<script>test</script>', session: '', consent: true, website: '' };
async function post(b: any) { return fetch(root + '/api/career-enquiries', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(b) }); }
try {
 assert.equal((await fetch(root+'/api/admissions-dashboard/career-enquiries')).status,401);
 assert.equal((await post({...body, consent:false})).status,400);
 assert.equal((await post({...body, company:''})).status,400);
 assert.equal((await post({...body, website:'spam'})).status,400);
 assert.equal((await post({...body, kind:'call',session:'invented'})).status,400);
 let response=await post(body); assert.equal(response.status,201); assert.equal((await response.json()).emailAccepted,true);
 fail=true; response=await post({...body,kind:'call',session:'call:2026-10-08:11:00'}); assert.equal(response.status,201); const result=await response.json(); assert.equal(result.emailAccepted,false); assert.match(result.message,/not yet confirmed/);
 await createAdmissionsUser('staff@example.com','Test Staff','a-long-test-password-1234');
 const login = await fetch(root+'/api/admissions-dashboard/login', {method:'POST',headers:{'Content-Type':'application/json',Origin:'http://localhost:3000'},body:JSON.stringify({email:'staff@example.com',password:'a-long-test-password-1234'})});
 assert.equal(login.status,200); const cookie=login.headers.get('set-cookie')!.split(';')[0];
 const list=await fetch(root+'/api/admissions-dashboard/career-enquiries',{headers:{Cookie:cookie}}); assert.equal(list.status,200); assert.equal((await list.json()).records.length,2);
 const reviewURL=root+'/api/admissions-dashboard/career-enquiries/'+result.reference;
 const options={method:'PATCH',headers:{'Content-Type':'application/json',Origin:'http://localhost:3000',Cookie:cookie},body:JSON.stringify({status:'Contacted',notes:'Test note',version:0})};
 assert.equal((await fetch(reviewURL,options)).status,200); assert.equal((await fetch(reviewURL,options)).status,409);
 assert.equal((await fetch(reviewURL,{...options,headers:{...options.headers,Origin:'https://wrong.example'}})).status,403);
 assert.equal(readEngagements().length,2); assert.equal(readEngagements()[1].emailStatus.visitor,false);
 assert.equal(fs.existsSync('data/registrations.json'),false);
 console.log('PASS: new enquiries validate, save independently, survive email failure and require staff authentication. No live email/calendar calls.');
} finally { server.close(); process.chdir(cwd); fs.rmSync(temp,{recursive:true,force:true}); }
