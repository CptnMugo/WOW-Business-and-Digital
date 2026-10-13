import React, { useEffect, useState } from 'react';

type Status = { accepting: boolean; closed: boolean; remaining: number | null; configured?: boolean; mode: 'live' | 'test' };
const appointmentDates = ['2026-10-26','2026-10-27','2026-10-28','2026-10-29','2026-10-30'];
const benefits = [
  ['A wider business perspective','Look at management, people, workflows, finance and digital tools together — not just compliance or IT.'],
  ['Relevant care improvement priorities','Consider governance, evidence and relevant CQC expectations within your overall business priorities.'],
  ['Practical priorities, not jargon','Understand what needs attention first, what can wait and where existing resources may be used better.']
];
export function HealthCareDiagnostic() {
  const [status,setStatus] = useState<Status | null>(null);
  const [message,setMessage] = useState('');
  const [company,setCompany] = useState('');
  const [email,setEmail] = useState('');
  const [preferredDate,setPreferredDate] = useState('2026-10-26');
  const [accepted,setAccepted] = useState(false);
  const [busy,setBusy] = useState(false);
  const query = new URLSearchParams(window.location.search);
  const sessionId = query.get('session_id');
  const checkoutReturn = query.get('checkout');
  useEffect(() => {
    let mounted = true;
    fetch('/api/diagnostic/status', { cache: 'no-store' }).then(async response => {
      if (!response.ok) throw new Error('Online availability cannot be checked. Please contact WOW.');
      return response.json();
    }).then(data => { if(mounted) setStatus(data); }).catch(error=> {if(mounted)setMessage(error.message);});
    if (checkoutReturn === 'cancelled') setMessage('Checkout was cancelled; no payment has been confirmed.');
    if (checkoutReturn === 'success' && sessionId) {
      fetch('/api/diagnostic/verify?session_id=' + encodeURIComponent(sessionId), { cache: 'no-store' })
        .then(async response => {
          const result = await response.json();
          if(!response.ok) throw new Error(result.error || 'Please contact WOW before making another payment.');
          return result;
        }).then(result => {if(mounted)setMessage(result.paid ? result.mode === 'test'
          ? 'Test checkout verified. No money was collected. This does not reserve a real appointment.'
          : 'Your £1,000 payment is confirmed. Thank you. WOW will contact you to confirm an appointment; your selected date is a preference, not a booked appointment.'
          : 'Payment is not confirmed yet. Please contact WOW before attempting another payment.');})
        .catch(error=>{if(mounted)setMessage(error.message);});
    }
    return () => {mounted=false;};
  },[checkoutReturn,sessionId]);

  async function pay(event: React.FormEvent) {
    event.preventDefault(); if (busy || !status?.accepting) return;
    setBusy(true);setMessage('');
    try {
      const response = await fetch('/api/diagnostic/checkout', {method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({company,email,preferredDate,termsAccepted:accepted})});
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || 'Checkout unavailable.');
      window.location.assign(result.url);
    } catch(error) {
      setMessage(error instanceof Error ? error.message : 'Checkout unavailable. Contact WOW.');
      setBusy(false);
    }
  }
  return <div className="bg-[#f8f4ed] text-[#0b2d5b]">
    <section className="bg-[#0b2d5b] text-white px-5 py-12 sm:py-20">
      <div className="max-w-5xl mx-auto">
        <a href="?page=health-social-care" className="underline text-[#f0c474]">Health and social care services</a>
        <p className="font-bold uppercase tracking-widest text-[#f0c474] mt-7 text-sm">A practical, independent business review</p>
        <h1 className="text-4xl sm:text-6xl font-black leading-tight mt-3 max-w-4xl">Business Improvement Diagnostic <span className="text-[#f0c474]">for Health &amp; Care Organisations</span></h1>
        <p className="text-xl mt-6 max-w-3xl leading-relaxed">You know how to care. Let us help you strengthen the business behind that care.</p>
        <p className="max-w-3xl mt-5 text-[#dbe4ec]">Experienced transformation leadership to help you see where time, money and effort can be used more effectively — with a focused plan you can actually act on.</p>
      </div>
    </section>
    <div className="max-w-5xl mx-auto px-5 py-12 space-y-12">
      <section className="bg-white border border-[#ded7cb] rounded-2xl p-6 sm:p-9">
        <p className="uppercase text-xs tracking-widest font-bold text-[#1e63f3]">October introductory package</p>
        <h2 className="text-4xl font-black mt-2">£1,000 <span className="line-through text-xl text-slate-400 font-medium ml-2">£3,000</span></h2>
        <p className="text-sm mt-2">£3,000 is the planned standard price for the same package from November, not a competitor quote. The October promotional payment window closes at 00:00 GMT on Monday 26 October 2026.</p>
        <p className="mt-4 font-bold">Three promotional places initially available. First appointments must take place 26–30 October 2026.</p>
      </section>
      <section>
        <h2 className="text-3xl font-bold mb-5">What we'll look at</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {benefits.map(([title,description])=><article key={title} className="bg-white rounded-2xl border border-[#ded7cb] p-6"><h3 className="text-lg font-bold mb-3">{title}</h3><p>{description}</p></article>)}
        </div>
      </section>
      <section className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl font-bold mb-5">Your tangible outputs</h2>
          <ul className="space-y-3 list-disc pl-5">
            <li>Structured assessment of one health or care service/location</li>
            <li>Identified inefficiencies, risks and opportunities</li>
            <li>Relevant CQC improvement considerations as part of the wider review</li>
            <li>Prioritised red/amber/green improvement scorecard</li>
            <li>Practical 30/60/90-day improvement action plan</li>
            <li>Leadership feedback discussion and next-step priorities</li>
          </ul>
          <p className="mt-4 text-sm">Delivered predominantly remotely. This is a focused business diagnostic, not a comprehensive CQC inspection or a guarantee of regulatory outcomes. Follow-on implementation is separately scoped.</p>
        </div>
        <div className="bg-white border border-[#ded7cb] rounded-2xl p-6">
          <h2 className="text-2xl font-bold">Why WOW?</h2>
          <p className="mt-4">Our director brings over 20 years of business improvement, digital transformation, change and programme delivery experience across the NHS, private healthcare and social care.</p>
          <p className="mt-4">That includes transformation across a major care group with approximately 260 homes and seven hospitals, and supporting an NHS organisation to simplify more than 100 clinical forms to approximately 20.</p>
          <p className="mt-4">A recent recipient of the package in the health and social care sector has also benefited from practical support to strengthen workflows, reporting and governance. References can be discussed subject to permission.</p>
        </div>
      </section>
      <section id="diagnostic-payment" className="rounded-2xl border-2 border-[#d4a24c] bg-white p-6 sm:p-9">
        <h2 className="text-3xl font-bold">Secure your October diagnostic</h2>
        <p className="mt-3">Pay £1,000 securely through Stripe. Your preferred initial appointment date is a request only; WOW will contact you to confirm a suitable time. If a suitable appointment cannot be agreed, we'll arrange a refund.</p>
        {status?.mode === 'test' && <p className="bg-amber-50 border border-amber-300 rounded-lg p-3 mt-4">Test mode: no real payment can be collected or place reserved.</p>}
        {status?.closed ? <p className="mt-5 font-bold">The October introductory offer has closed. The diagnostic remains available — contact WOW for current pricing and dates.</p> :
          status?.configured === false ? <p className="mt-5">Online payment is not yet available. Contact WOW to discuss the diagnostic.</p> :
          status && status.remaining === 0 ? <p className="mt-5">The three places are currently reserved or taken. Contact WOW to ask about alternatives.</p> :
          status && !status.accepting ? <p className="mt-5">Online promotional checkout is no longer available. Contact WOW for support.</p> :
          status?.accepting && !sessionId ? <form onSubmit={pay} className="grid gap-4 mt-6 max-w-xl">
            <p className="font-bold">Places currently available: {status.remaining}</p>
            <label className="grid gap-1 font-semibold">Business name<input className="border rounded-lg p-3 font-normal" required maxLength={120} minLength={2} value={company} onChange={e=>setCompany(e.target.value)}/></label>
            <label className="grid gap-1 font-semibold">Email address<input className="border rounded-lg p-3 font-normal" type="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/></label>
            <label className="grid gap-1 font-semibold">Preferred initial appointment date (not confirmed)<select className="border rounded-lg p-3 font-normal" value={preferredDate} onChange={e=>setPreferredDate(e.target.value)}>{appointmentDates.map(date=><option key={date} value={date}>{new Date(date+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</option>)}</select></label>
            <label className="flex gap-3 items-start"><input type="checkbox" required checked={accepted} onChange={e=>setAccepted(e.target.checked)} className="mt-1"/><span>I understand this is a focused review for one service/location, mainly remote; the chosen appointment date requires confirmation, and follow-on work is not included. I agree to the £1,000 fee and that a refund will be arranged if WOW cannot agree a suitable initial appointment.</span></label>
            <button type="submit" disabled={busy || !accepted} className="bg-[#0b2d5b] rounded-lg px-6 py-4 text-white font-bold disabled:opacity-60">{busy ? 'Opening secure checkout…':'Pay £1,000 securely with Stripe'}</button>
          </form> : !sessionId && <p className="mt-5">Checking availability…</p>}
        {message && <p role="status" className="mt-5 border border-[#d4a24c] bg-[#f8f4ed] rounded-lg p-4">{message}</p>}
        <p className="mt-6 text-sm">Questions before paying? <a className="underline font-semibold" href="mailto:wowdigital@wowbusinessanddigital.com?subject=Business%20Improvement%20Diagnostic">Email WOW</a> or call <a className="underline" href="tel:+447932174127">07932 174127</a>.</p>
      </section>
    </div>
  </div>;
}
