import fs from 'node:fs';
import type { Express } from 'express';
import { displayValue, fieldLabel, enquiryTitle } from '../src/engagement/enquiryLabels.js';
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export function businessSender() {
 const configured = process.env.MAIL_PROVIDER === 'smtp' ? process.env.SMTP_FROM || process.env.SMTP_USER : process.env.RESEND_FROM || process.env.SMTP_FROM;
 const address = configured?.match(/<([^>]+)>/)?.[1] || (configured?.includes('@') ? configured.replace(/^["']|["']$/g, '') : 'WowAcademy@contact.wowbusinessanddigital.com');
 return `WOW Business & Digital <${address}>`;
}
export function enquiryEmail(record: any) {
 const fields = [['Reference', record.id], ['Received', record.receivedAt], ...Object.entries(record.contact).map(([k,v]) => [fieldLabel(k), displayValue(v)]), ...Object.entries(record.details).map(([k,v]) => [fieldLabel(k), displayValue(v)])];
 const title = enquiryTitle(record.category);
 const text = title + '\n\n' + fields.map(([k,v]) => `${k}: ${v}`).join('\n\n') + '\n\nReview: https://www.wowbusinessanddigital.com/?page=manage-applications';
 const html = `<div style="font-family:Arial,sans-serif;color:#0b2d5b;max-width:680px"><h1 style="font-size:24px">${escape(title)}</h1><p>A website submission is ready for review.</p><table style="border-collapse:collapse;width:100%">${fields.map(([k,v]) => `<tr><th style="text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #ddd">${escape(String(k))}</th><td style="padding:10px;border-bottom:1px solid #ddd;white-space:pre-wrap">${escape(String(v))}</td></tr>`).join('')}</table><p><a href="https://www.wowbusinessanddigital.com/?page=manage-applications">Open staff dashboard</a> and select Website enquiries.</p></div>`;
 return { text, html, subject: `${title} — ${[record.contact.firstName, record.contact.surname].filter(Boolean).join(' ')} — ${record.id}`.replace(/[\r\n]/g, ' ') };
}
// Called only after admissions authentication middleware.
export function installWebsiteEnquiriesDashboard(app: Express) {
 app.get('/api/admissions-dashboard/website-enquiries', (_req,res) => {
  try {
   const file = 'data/enquiries.jsonl';
   const records = fs.existsSync(file) ? fs.readFileSync(file,'utf8').split('\n').filter(s => s.trim()).map(s => JSON.parse(s)) : [];
   res.json({ records });
  } catch { res.status(503).json({ error: 'Website enquiries could not be loaded. Ask your administrator to check the saved enquiry file.' }); }
 });
}
