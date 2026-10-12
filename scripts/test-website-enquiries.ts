import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import express from 'express';
import { installAdmissionsDashboard, createAdmissionsUser } from '../server/admissionsDashboard.js';
import { enquiryEmail, businessSender } from '../server/websiteEnquiries.js';
const cwd = process.cwd(); const temp=fs.mkdtempSync(os.tmpdir()+'/wbd-enquiries-'); process.chdir(temp);
process.env.APP_URL='http://localhost:3000';process.env.RESEND_FROM='WOW Academy Admissions <WowAcademy@contact.wowbusinessanddigital.com>';
const app=express();app.use(express.json());installAdmissionsDashboard(app);const server=app.listen(0,'127.0.0.1');await new Promise<void>(r=>server.once('listening',r)); const root=`http://127.0.0.1:${(server.address() as any).port}`;
try {
 assert.equal((await fetch(root+'/api/admissions-dashboard/website-enquiries')).status,401);
 fs.mkdirSync('data',{recursive:true});const record={id:'TEST-OLD',receivedAt:'2026-10-01T10:00:00Z',category:'general',contact:{firstName:'Test',email:'test@example.invalid'},details:{message:'<script>alert(1)</script>\nSecond line'}};fs.writeFileSync('data/enquiries.jsonl',JSON.stringify(record)+'\n');
 await createAdmissionsUser('staff@example.com','Staff','long-password-for-tests-123');const login=await fetch(root+'/api/admissions-dashboard/login',{method:'POST',headers:{'Content-Type':'application/json',Origin:'http://localhost:3000'},body:JSON.stringify({email:'staff@example.com',password:'long-password-for-tests-123'})});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie')!.split(';')[0];
 const list=await fetch(root+'/api/admissions-dashboard/website-enquiries',{headers:{Cookie:cookie}});assert.equal(list.status,200);assert.deepEqual((await list.json()).records,[record]);assert.match(list.headers.get('cache-control')!,/no-store/);
 const email=enquiryEmail(record);assert.ok(!email.html.includes('<script>'));assert.ok(email.html.includes('&lt;script&gt;'));assert.match(email.text,/Message:/);assert.match(email.subject,/Website enquiry — Test/);assert.equal(businessSender(),'WOW Business & Digital <WowAcademy@contact.wowbusinessanddigital.com>');
 fs.appendFileSync('data/enquiries.jsonl','invalid');assert.equal((await fetch(root+'/api/admissions-dashboard/website-enquiries',{headers:{Cookie:cookie}})).status,503);
 console.log('PASS: private access, historical records, no-store, escaped readable email, business display name, corrupt-store error. No external emails.');
} finally {server.close();process.chdir(cwd);fs.rmSync(temp,{recursive:true,force:true});}
