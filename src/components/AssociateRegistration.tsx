import React, { useState } from 'react';
import { readApiJson } from '../utils/readApiJson';

export const AssociateRegistration: React.FC = () => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{reference: string; acknowledgementSent: boolean; staffEmailSent: boolean} | null>(null);
  const fields = [
    ['fullName', 'Full name', 'text', true],
    ['email', 'Email address', 'email', true],
    ['phone', 'Telephone (optional)', 'tel', false],
    ['organisation', 'Business or organisation (optional)', 'text', false],
    ['location', 'Location and countries you can work in', 'text', true],
    ['expertise', 'Specialist expertise', 'text', true],
    ['sectors', 'Sectors you have worked in', 'text', true],
    ['qualifications', 'Relevant qualifications (optional)', 'text', false],
    ['availability', 'Availability and preferred working pattern', 'text', true],
    ['profileUrl', 'LinkedIn or portfolio link (optional)', 'url', false],
  ] as const;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const formData = new FormData(event.currentTarget);
    const file = formData.get('cv') as File | null;
    formData.delete('cv');
    const data = Object.fromEntries(formData);
    setBusy(true); setError('');
    try {
      let cv: { name: string; base64: string } | undefined;
      if (file && file.size) {
        if (file.size > 5 * 1024 * 1024 || !/\.(pdf|doc|docx)$/i.test(file.name)) throw new Error('Please choose a PDF or Word CV up to 5 MB.');
        const encoded = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = () => reject(new Error('Your CV could not be read. Please select it again.')); reader.readAsDataURL(file); });
        cv = { name:file.name, base64:encoded };
      }
      const response = await fetch('/api/associate-enquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'associate', cv, contact: {
          firstName: String(data.fullName || '').trim(), email: data.email,
          telephone: data.phone, privacyAcknowledged: data.consent === 'on',
        }, details: { ...data, retainForOpportunities: data.consent === 'on', status: 'EXPRESSION_OF_INTEREST' } }),
      });
      const body = await readApiJson<{reference: string; acknowledgementSent: boolean; staffEmailSent: boolean; success?: boolean}>(response, 'Your expression of interest could not be confirmed.');
      if (!body.reference) throw new Error('The website did not confirm receipt. Please contact wowdigital@wowbusinessanddigital.com before submitting again.');
      setResult(body);
    } catch (err) { setError(err instanceof Error ? err.message : 'Please try again or email wowdigital@wowbusinessanddigital.com.'); }
    finally { setBusy(false); }
  }

  return <section className="max-w-4xl mx-auto px-4 py-12 space-y-7">
    <div className="space-y-3"><p className="wbd-eyebrow">WORK WITH WBD</p>
      <h1 className="text-4xl font-black text-navy-900">Become an Associate</h1>
      <p className="text-slate-700 leading-relaxed">We bring together specialists around client needs, with WBD leading and coordinating delivery. Tell us about your expertise in technology and AI, finance, commercial, procurement, people and HR, communications, programme delivery or another business function.</p>
      <p className="text-sm text-slate-600">This is an expression of interest. Joining the network is subject to review and any relevant checks. Submitting this form does not guarantee acceptance or paid work.</p>
    </div>
    {result ? <div role="status" className="rounded-2xl bg-white border border-navy-200 p-7 space-y-3">
      <h2 className="text-2xl font-bold">Thank you — your details have been received</h2>
      <p>Reference: <strong>{result.reference}</strong></p>
      <p>We will review your experience and contact you if there is a suitable next step.</p>
      {(!result.acknowledgementSent || !result.staffEmailSent) && <p className="text-sm text-slate-700">Your details have been saved, but email delivery has not been confirmed. Keep this reference and contact wowdigital@wowbusinessanddigital.com if you need to follow up.</p>}
    </div> : <form onSubmit={submit} className="bg-white border border-navy-200 rounded-2xl p-6 sm:p-8 space-y-6">
      <p className="text-sm">Fields marked * are required.</p>
      <div className="grid sm:grid-cols-2 gap-5">{fields.map(([name, label, type, required]) => <label key={name} className="block text-sm font-semibold text-navy-900">
        {label}{required ? ' *' : ''}
        <input name={name} type={type} required={required} maxLength={500} className="mt-2 block w-full rounded-xl border border-slate-300 p-3 font-normal bg-navy-50" />
      </label>)}</div>
      <label className="block text-sm font-semibold">Relevant experience and examples of your work *
        <textarea name="experience" required minLength={20} maxLength={5000} rows={5} className="mt-2 block w-full rounded-xl border border-slate-300 p-3 font-normal bg-navy-50" />
      </label>
      <p className="text-sm text-slate-600">Share a brief professional summary and public links. You can also attach your CV and add a cover note below. Please do not include confidential client information.</p>
      <label className="block text-sm font-semibold">Upload your CV (optional)
        <input type="file" name="cv" accept=".pdf,.doc,.docx" className="mt-2 block w-full" aria-describedby="cv-help" />
        <span id="cv-help" className="block mt-2 font-normal">PDF or Word (.doc or .docx), up to 5 MB. Your CV is available only to authorised staff.</span>
      </label>
      <label className="block text-sm font-semibold">Cover note (optional)
        <textarea name="coverNote" maxLength={5000} rows={4} className="mt-2 block w-full rounded-xl border border-slate-300 p-3 font-normal bg-navy-50" placeholder="Tell us why you would like to work with WOW and what you could bring to our projects." />
      </label>
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="consent" required className="mt-1" />
        <span>I agree that WBD may retain these details to assess my expression of interest and contact me about suitable associate opportunities. I can request removal by emailing wowdigital@wowbusinessanddigital.com. *</span>
      </label>
      {error && <p role="alert" className="text-rose-800">{error}</p>}
      <button disabled={busy} className="rounded-xl bg-navy-600 hover:bg-navy-700 text-white px-6 py-3 font-bold disabled:opacity-60">{busy ? 'Submitting…' : 'Submit expression of interest'}</button>
    </form>}
  </section>;
};
