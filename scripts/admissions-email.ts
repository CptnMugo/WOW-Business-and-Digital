/** Run on the private website server from the repository root. */
import 'dotenv/config';
import nodemailer from 'nodemailer';
import { getAllRegistrations, resendStaffApplication, sendOutboundEmail } from '../server/admissionsService.js';
const [command, reference, flag] = process.argv.slice(2);
try {
  if (command === 'list') {
    console.table(getAllRegistrations().map(r=>({reference:r.referenceNumber,submitted:r.submittedAt,staffEmail:r.emailDelivery?.staffAlert.sent ? 'accepted by provider' : 'not sent',method:r.emailDelivery?.staffAlert.method || '',error:r.emailDelivery?.staffAlert.error || ''})));
  } else if (command === 'verify') {
    if (process.env.MAIL_PROVIDER !== 'smtp') throw Error('Set MAIL_PROVIDER=smtp before checking the IONOS connection.');
    if (!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)) throw Error('SMTP host, username or mailbox password is missing.');
    const port=Number(process.env.SMTP_PORT)||465;
    const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port,secure:port===465,requireTLS:port===587,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:10000,tls:{rejectUnauthorized:true}});
    await transport.verify();transport.close();
    console.log('SMTP connection and authentication passed. No email sent; inbox delivery still needs a test.');
  } else if (command === 'test' && reference === '--send') {
    const to=process.env.ADMISSIONS_EMAIL || 'wowdigital@wowbusinessanddigital.com';
    const result=await sendOutboundEmail(to,'TEST - WOW admissions email delivery','<p>This is an authorised email delivery test from the WOW website. Please confirm it arrived in the admissions inbox.</p>','This is an authorised email delivery test from the WOW website. Please confirm it arrived in the admissions inbox.');
    console.log(result);if(!result.success)process.exitCode=1;
  } else if (command === 'resend' && reference && (flag === '--send' || flag === '--force-send')) {
    const result=await resendStaffApplication(reference,flag==='--force-send');
    console.log(result);if(!result.success)process.exitCode=1;
  } else {
    console.log('Commands: list | verify | test --send | resend REFERENCE --send | resend REFERENCE --force-send');
    console.log('Resend affects staff notification only. --send skips records already accepted by the provider; --force-send intentionally sends another copy. Run one recovery process at a time.');
    process.exitCode=1;
  }
} catch(error:any) {console.error('Email check failed:',error?.code || (['list','resend'].includes(command) ? 'Check the reference and private register.' : 'Check SMTP configuration, credentials and server connectivity.'));process.exitCode=1;}
