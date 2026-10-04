import React, { useEffect, useState } from 'react';
export type EnquiryCategory = 'business-consultancy' | 'staffing' | 'training' | 'ai-solutions' | 'career-coaching' | 'partnership' | 'general' | 'health-social-care';
export interface ContactSectionProps { initialCategory?: EnquiryCategory; }
const topics: Record<EnquiryCategory, string> = {
  'health-social-care': 'Health and social care project or programme',
  general: 'General enquiry / not sure yet',
  'business-consultancy': 'Transformation, services or project delivery',
  staffing: 'Specialist support or associates',
  training: 'Training or Career Accelerator',
  'ai-solutions': 'Digital workflows or practical AI',
  'career-coaching': 'Career coaching or CV support',
  partnership: 'Partnerships or international work',
};
export const ContactSection: React.FC<ContactSectionProps> = ({ initialCategory }) => {
  const [topic, setTopic] = useState<string>(initialCategory || 'general');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState('');
  const [deliveryWarning, setDeliveryWarning] = useState(false);
  useEffect(() => { setTopic(initialCategory || 'general'); setSuccess(false); }, [initialCategory]);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) || '').trim();
    if (!value('firstName') || !value('message')) { setError('Please enter your name and a message.'); return; }
    setBusy(true); setError('');
    try {
      const reason = topics[topic as EnquiryCategory] || 'Other';
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        category: 'general',
        contact: { firstName: value('firstName'), surname: value('surname'), email: value('email'), telephone: value('telephone'), organisationName: value('organisationName'), privacyAcknowledged: data.get('privacy') === 'on', marketingConsent: false },
        details: { reason, subject: reason, message: value('message') },
      }) });
      if (!response.ok) throw new Error('Your enquiry could not be saved. Please try again or email us directly.');
      const result = await response.json();
      if (!result.success || !result.reference) throw new Error('Your enquiry could not be confirmed. Please try again.');
      setReference(result.reference);
      setDeliveryWarning(!result.staffEmailSent || !result.acknowledgementSent);
      form.reset(); setSuccess(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to send. Please try again.'); }
    finally { setBusy(false); }
  };
  const field = 'block w-full mt-2 rounded-lg border border-[#b9c5d0] p-3 bg-white text-[#0b2d5b] focus:outline-2 focus:outline-[#0b2d5b]';
  return <section className="max-w-4xl mx-auto px-5 py-12">
    <h1 className="text-3xl sm:text-5xl font-bold text-[#0b2d5b]">{initialCategory === 'health-social-care' ? 'Discuss your health and social care project' : 'How can we help you?'}</h1>
    <p className="mt-4 text-base leading-relaxed max-w-2xl">Tell us what you need help with. We welcome individuals, small businesses and larger organisations, in the UK and internationally.</p>
    <div className="my-6 flex flex-col gap-2 text-sm">
      <a className="underline break-all" href="mailto:wowdigital@wowbusinessanddigital.com">wowdigital@wowbusinessanddigital.com</a>
      <a className="underline" href="tel:+441212969549">+44 121 296 9549</a>
    </div>
    {success ? <div role="status" className="rounded-2xl border border-[#d4a24c] bg-white p-8">
      <h2 className="text-2xl font-bold">Thank you for contacting WOW Business &amp; Digital</h2>
      <p className="mt-3">Your enquiry has been saved. We will review it and respond as soon as possible.</p>
      <p className="mt-3">Your reference is <strong>{reference}</strong>. Please quote it if you contact us.</p>
      {deliveryWarning && <p className="mt-3">Email delivery could not be confirmed. If you need to follow up, please contact us using the details above.</p>}
      <button className="underline mt-5" onClick={() => setSuccess(false)}>Send another enquiry</button>
    </div> : <form onSubmit={submit} className="bg-white rounded-2xl border border-[#ded7cb] p-6 sm:p-8 space-y-6">
      <p className="text-sm">Fields marked * are required.</p>
      <label className="block font-medium" htmlFor="enquiry-topic">What would you like help with? *
        <select id="enquiry-topic" className={field} value={topic} onChange={e => setTopic(e.target.value)} required>
          {Object.entries(topics).map(([id, title]) => <option key={id} value={id}>{title}</option>)}<option value="other">Other</option>
        </select>
      </label>
      <div className="grid sm:grid-cols-2 gap-5">
        <label htmlFor="enquiry-first" className="block">First name *<input id="enquiry-first" name="firstName" autoComplete="given-name" maxLength={100} required className={field} /></label>
        <label htmlFor="enquiry-last" className="block">Surname<input id="enquiry-last" name="surname" autoComplete="family-name" maxLength={100} className={field} /></label>
        <label htmlFor="enquiry-email" className="block">Email *<input id="enquiry-email" name="email" type="email" autoComplete="email" maxLength={254} required className={field} /></label>
        <label htmlFor="enquiry-phone" className="block">Phone (optional)<input id="enquiry-phone" name="telephone" type="tel" autoComplete="tel" maxLength={50} className={field} /></label>
      </div>
      <label htmlFor="enquiry-org" className="block">Organisation (optional)<input id="enquiry-org" name="organisationName" autoComplete="organization" maxLength={200} className={field} /></label>
      <label htmlFor="enquiry-message" className="block">How can we help? *<textarea id="enquiry-message" name="message" rows={5} maxLength={10000} required className={field} placeholder={initialCategory === 'health-social-care' ? 'Tell us what needs to change, your desired timescale and the support you need. It is fine if you are still exploring your options.' : 'Tell us what you would like to achieve. It is fine if you are still exploring your options.'} /></label>
      <label className="flex items-start gap-3 text-sm leading-relaxed" htmlFor="enquiry-privacy"><input id="enquiry-privacy" name="privacy" type="checkbox" required className="mt-1 accent-[#0b2d5b]" />I understand WOW Business &amp; Digital will use these details to respond to my enquiry. *</label>
      <p className="text-sm">Read our <a className="underline" href="?page=privacy">privacy notice</a>.</p>
      {error && <p role="alert" className="text-red-800">{error}</p>}
      <button disabled={busy} type="submit" className="bg-[#0b2d5b] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#173b63] disabled:opacity-60">{busy ? 'Sending...' : 'Send enquiry'}</button>
    </form>}
  </section>;
};
