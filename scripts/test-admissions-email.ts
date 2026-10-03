import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import nodemailer from 'nodemailer';
const cwd=process.cwd(),temp=fs.mkdtempSync(path.join(os.tmpdir(),'wbd-mail-'));
process.chdir(temp);
const original=nodemailer.createTransport;
let calls=0,fail=false,options:any;
(nodemailer as any).createTransport=(config:any)=>{options=config;return {sendMail:async()=>{calls++;if(fail)throw Object.assign(Error('secret must never appear'),{code:'EAUTH'});return {accepted:['test@example.invalid'],rejected:[]};}};};
try {
 const {sendOutboundEmail,saveRegistration,getAllRegistrations,resendStaffApplication}=await import('../server/admissionsService');
 process.env.MAIL_PROVIDER='smtp';process.env.RESEND_API_KEY='obsolete-test-setting';process.env.SMTP_HOST='smtp.ionos.co.uk';process.env.SMTP_USER='test@example.invalid';process.env.SMTP_PASS='dummy';process.env.SMTP_PORT='465';process.env.ADMISSIONS_EMAIL='test@example.invalid';
 let result=await sendOutboundEmail('test@example.invalid','test','test','test');
 assert.equal(result.method,'smtp');assert.equal(result.success,true);assert(options.secure);assert.equal(calls,1);
 process.env.SMTP_PORT='587';await sendOutboundEmail('test@example.invalid','test','test','test');assert(options.requireTLS && !options.secure);
 delete process.env.SMTP_PASS;result=await sendOutboundEmail('test@example.invalid','test','test','test');assert.equal(result.success,false);assert.equal(calls,2);
 process.env.SMTP_PASS='dummy';fail=true;result=await sendOutboundEmail('test@example.invalid','test','test','test');assert.equal(result.method,'smtp');assert(result.error?.includes('EAUTH'));assert(!result.error?.includes('secret must never'));
 fs.mkdirSync('data');
 saveRegistration({referenceNumber:'WOW-CA-26-TEST23',submittedAt:new Date().toISOString(),status:'APPLICATION_REVIEW_PENDING',submissionType:'APPLICATION',firstName:'Test',lastName:'Applicant',email:'test@example.invalid',phone:'000'});
 result=await resendStaffApplication('WOW-CA-26-TEST23');assert.equal(result.success,false);assert(getAllRegistrations()[0].emailDelivery?.staffAlert.error?.includes('EAUTH'));
 fail=false;await resendStaffApplication('WOW-CA-26-TEST23');const before=calls;const skipped=await resendStaffApplication('WOW-CA-26-TEST23');assert('skipped' in skipped && skipped.skipped);assert.equal(calls,before);
 await resendStaffApplication('WOW-CA-26-TEST23',true);assert.equal(calls,before+1);assert.equal(getAllRegistrations().length,1);assert.equal(getAllRegistrations()[0].emailDelivery?.delegateWelcome.sent,false);
 console.log('PASS SMTP selection, TLS, missing credentials, recorded errors, staff-only recovery and duplicate protection. No external emails sent.');
} finally {nodemailer.createTransport=original;process.chdir(cwd);fs.rmSync(temp,{recursive:true,force:true});}
