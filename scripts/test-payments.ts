import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import express from 'express';
import Stripe from 'stripe';
const before = process.cwd();
const temporary = fs.mkdtempSync(path.join(os.tmpdir(),'wbd-payments-'));
process.chdir(temporary);
process.env.PAYMENT_LINK_SECRET = 'isolated-test-secret-not-for-production';
process.env.APP_URL = 'https://example.invalid';
process.env.STRIPE_SECRET_KEY = 'sk_test_isolated';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_isolated';
const { quotePayment, paymentToken, paymentLink, readPayments, recordRefund, recordPaidSession, installPaymentRoutes, installPaymentWebhook } = await import('../server/payments');
const { saveRegistration } = await import('../server/admissionsService');
const reference = 'WOW-CA-26-7K4M9P';
const now = new Date('2026-10-02');
assert.equal(quotePayment('deposit',0,false,undefined,now),5000);
assert.equal(quotePayment('early',5000,false,undefined,now),85000);
assert.equal(quotePayment('instalment',5000,false,undefined,now),45000);
assert.equal(quotePayment('instalment',50000,false,undefined,now),50000);
assert.equal(quotePayment('full',5000,true,undefined,now),120000);
assert.equal(quotePayment('custom',0,false,'1.25',now),125);
for(const value of ['0','-1','1.001','1e2','1001','NaN']) assert.throws(()=>quotePayment('custom',0,false,value,now));
assert.throws(()=>quotePayment('early',0,false,undefined,new Date('2026-11-01')));
assert.throws(()=>quotePayment('early',0,true,undefined,now));
assert.throws(()=>quotePayment('deposit',5000,false,undefined,now));
assert.throws(()=>quotePayment('tampered',0,false,undefined,now));
fs.mkdirSync('data',{recursive:true});
saveRegistration({referenceNumber:reference,email:'test@example.invalid',packageSelection:'Standard',submittedAt:new Date().toISOString(),submissionType:'APPLICATION',status:'APPLICATION_REVIEW_PENDING',firstName:'Test',lastName:'Applicant',phone:''});
assert(paymentLink(reference).includes(paymentToken(reference)));
let sessions:any[]=[];
let createdCustomers=0;
const fake = {
  customers:{create:async()=>{createdCustomers++;return {id:'cus_test'};}},
  checkout:{sessions:{
    list:async()=>({data:sessions}),
    expire:async(id:string)=>{sessions.find(s=>s.id===id).status='expired';},
    create:async(payload:any)=>{const session={...payload,id:'cs_'+sessions.length,url:'https://checkout.stripe.com/test',status:'open',livemode:false,payment_status:'unpaid',currency:'gbp',amount_total:payload.line_items[0].price_data.unit_amount};sessions.push(session);return session;},
    retrieve:async(id:string)=>{const session=sessions.find(s=>s.id===id);if(!session)throw Error('missing');return session;},
  }}
} as unknown as Stripe;
const app=express();installPaymentWebhook(app);app.use(express.json());installPaymentRoutes(app,()=>fake);
const server=app.listen(0,'127.0.0.1');
await new Promise<void>(resolve=>server.once('listening',resolve));
const address=server.address() as {port:number};
let checks=18;
async function call(endpoint:string,body?:any,expected=200){
 const response=await fetch(`http://127.0.0.1:${address.port}/api/stripe/${endpoint}`,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 assert.equal(response.status,expected,endpoint+': '+await response.clone().text());checks++;return response.json();
}
try{
 const realFetch=globalThis.fetch; const messages:any[]=[];
 process.env.RESEND_API_KEY='test-only'; process.env.MAIL_PROVIDER='resend';
 globalThis.fetch=(async (url:any, options:any)=>String(url)==='https://api.resend.com/emails' ? (messages.push(JSON.parse(options.body)),new Response('{"id":"mock"}',{status:200})) : realFetch(url,options)) as typeof fetch;
 try {
  await call('request-payment-link',{reference,email:'test@example.invalid'});
  assert.equal(messages.length,0); checks++;
  fs.writeFileSync('data/admissions-reviews.json',JSON.stringify({[reference]:{status:'Accepted'}}));
  await call('request-payment-link',{reference,email:'wrong@example.invalid'});
  assert.equal(messages.length,0); checks++;
  const recovery=await call('request-payment-link',{reference,email:'test@example.invalid'});
  assert.equal(messages.length,1); assert.deepEqual(messages[0].to,['test@example.invalid']); assert(messages[0].text.includes(paymentLink(reference))); assert(!JSON.stringify(recovery).includes(paymentToken(reference))); checks+=4;
  await call('request-payment-link',{reference,email:'test@example.invalid'},429);
 } finally {globalThis.fetch=realFetch;delete process.env.RESEND_API_KEY;}
 const auth={reference,token:paymentToken(reference)};
 await call('application',{reference,token:'bad'},403);
 await call('application',{reference,token:'é'.repeat(64)},403);
 await call('create-checkout-session',{...auth,plan:'deposit'},400);
 await call('create-checkout-session',{...auth,termsAccepted:true,plan:'deposit',amount:1});
 assert.equal(sessions[0].amount_total,5000);checks++;
 await call('create-checkout-session',{...auth,termsAccepted:true,plan:'deposit'});
 assert.equal(sessions[0].status,'expired');assert.equal(createdCustomers,1);checks+=2;
 assert.equal((await call('verify',{...auth,sessionId:sessions[1].id})).paid,false);
 sessions[1].payment_status='paid';sessions[1].status='complete';
 await call('verify',{...auth,sessionId:sessions[1].id});
 await call('verify',{...auth,sessionId:sessions[1].id});
 assert.equal(readPayments().length,1);checks++;
 const account=await call('application',auth);assert.equal(account.paid,5000);assert.equal(account.reserved,false);checks+=2;
 await call('create-checkout-session',{...auth,termsAccepted:true,plan:'early'});
 assert.equal(sessions[2].amount_total,85000);checks++;
 sessions[2].payment_status='paid';sessions[2].status='complete';
 await call('verify',{...auth,sessionId:sessions[2].id});
 assert.equal((await call('application',auth)).settled,true);
 await call('create-checkout-session',{...auth,termsAccepted:true,plan:'full'},400);
 await call('verify',{...auth,sessionId:'missing'},503);
 assert.throws(()=>recordPaidSession({...sessions[2],id:'bad',amount_total:1}));checks++;
 // A signed webhook can record a live payment without the browser returning.
 const live={...sessions[1],id:'cs_live_mock',livemode:true};
 const payload=JSON.stringify({id:'evt_mock',type:'checkout.session.completed',data:{object:live}});
 const signature=Stripe.webhooks.generateTestHeaderString({payload,secret:process.env.STRIPE_WEBHOOK_SECRET!});
 for(let i=0;i<2;i++){
   const response=await fetch(`http://127.0.0.1:${address.port}/api/stripe/webhook`,{method:'POST',headers:{'Content-Type':'application/json','stripe-signature':signature},body:payload});assert.equal(response.status,200);checks++;
 }
 assert.equal(readPayments().filter(p=>p.live).length,1);checks++;
 const invalid=await fetch(`http://127.0.0.1:${address.port}/api/stripe/webhook`,{method:'POST',headers:{'Content-Type':'application/json','stripe-signature':'bad'},body:payload});assert.equal(invalid.status,400);checks++;
 process.env.STRIPE_SECRET_KEY='sk_live_isolated';
 assert.equal((await call('application',auth)).reserved,true);
 assert.equal((await call('application',auth)).paid,5000);
 recordRefund(live,5000);recordRefund(live,5000);
 assert.equal((await call('application',auth)).reserved,false);
 assert.equal((await call('application',auth)).paid,0);
 recordPaidSession(live);
 assert.equal((await call('application',auth)).paid,0);
 delete process.env.STRIPE_WEBHOOK_SECRET;
 assert.equal((await call('status')).configured,true);
 delete process.env.STRIPE_SECRET_KEY;
 assert.equal((await call('status')).configured,false);
 await call('create-checkout-session',{...auth,termsAccepted:true,plan:'deposit'},503);
 console.log(`PASS ${checks} payment checks: prices, credits, deadlines, private links, duplicate/cancelled checkouts, signatures, live/test separation and fail-closed setup. No Stripe network calls or money moved.`);
} finally {server.close();process.chdir(before);fs.rmSync(temporary,{recursive:true,force:true});}
