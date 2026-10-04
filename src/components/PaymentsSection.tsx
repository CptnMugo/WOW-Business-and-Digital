import React, { useEffect, useState } from 'react';
import { NavTab } from '../types';
import { CAREER_ACCELERATOR as programme } from '../data/careerAccelerator';

export const PaymentsSection = ({ setActiveTab }: { setActiveTab: (tab: NavTab) => void }) => {
  const query = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  const reference = query.get('reference') || '';
  const token = query.get('token') || '';
  const [recoveryReference, setRecoveryReference] = useState(reference);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryBusy, setRecoveryBusy] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [status, setStatus] = useState<{configured:boolean;mode:string} | null>(null);
  const [account, setAccount] = useState<{paid:number;reserved:boolean;mentorship:boolean;settled?:boolean} | null>(null);
  const [plan, setPlan] = useState('deposit');
  const [customAmount, setCustomAmount] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [verificationBlocked, setVerificationBlocked] = useState(false);
  const post = async (url:string, body:object) => {
    const response = await fetch(url, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to load payment information. Please contact WOW.');
    return result;
  };
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await fetch('/api/stripe/status');
        if (!response.ok) throw new Error('Card payment status is unavailable.');
        const s = await response.json();
        if (!active) return;
        setStatus(s);
        if (reference && token) {
          const sessionId = query.get('session_id');
          if (sessionId) {
            try {
              const verified = await post('/api/stripe/verify', {reference,token,sessionId});
              if (!active) return;
              setMessage(verified.paid ? verified.mode === 'test' ? 'Test payment verified. No money was charged and no real place has been reserved.' : 'Thank you. Your payment has been verified.' : 'Payment is not yet confirmed. Please contact WOW before trying again.');
              if (!verified.paid) setVerificationBlocked(true);
            } catch(e) { if(active) {setVerificationBlocked(true);setMessage(e instanceof Error ? e.message : 'Please contact WOW before paying again.');} }
          } else if (query.has('cancelled')) setMessage('Checkout was cancelled. Your application is saved; no payment has been confirmed for this checkout.');
          const a = await post('/api/stripe/application',{reference,token});
          if(active) {setAccount(a); if(a.paid >= 5000) setPlan(a.mentorship ? 'custom' : 'instalment');}
        }
      } catch(e) {if(active) setMessage(e instanceof Error ? e.message : 'Card payments are unavailable.');}
    })();
    return () => {active=false;};
  }, [reference,token]);
  const paid = account?.paid || 0;
  const money = (pence:number) => new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(pence/100);
  const total = account?.mentorship ? 125000 : 100000;
  const options = [
    {id:'deposit',title:'Reserve your place',target:5000,description:'£50 registration deposit, credited against your programme fee. Pay this only after receiving your acceptance email.'},
    ...(!account?.mentorship ? [
      {id:'early',title:'Early settlement',target:90000,description:'£900 total when paid in full by 31 October 2026. Any deposit already paid is deducted.'},
      {id:'instalment',title:'Two instalments',target:paid < 50000 ? 50000 : 100000,description:'£500 by 31 October and £500 by 30 November 2026. Your deposit counts towards the first £500.'},
    ] : []),
    ...(!account?.mentorship ? [{id:'full',title:'Standard programme',target:total,description:'£1,000 total. Previous verified payments are deducted.'}] : []),
  ];
  const earlyExpired = new Date() >= new Date('2026-11-01T00:00:00Z');
  const amount = plan === 'custom' ? Math.round(Number(customAmount)*100) : (options.find(o=>o.id===plan)?.target || 0)-paid;
  const checkout = async (e:React.FormEvent) => {
    e.preventDefault(); if(busy)return;
    setBusy(true);setMessage('');
    try {const result = await post('/api/stripe/create-checkout-session',{reference,token,plan,customAmount,termsAccepted:accepted}); window.location.assign(result.url);}
    catch(e) {setMessage(e instanceof Error ? e.message : 'Checkout could not be opened.');setBusy(false);}
  };
  return <section className="max-w-5xl mx-auto px-5 py-12 space-y-7 text-slate-800">
    <p className="text-sm font-semibold text-navy-700">Career Accelerator | Starts {programme.startDate}</p>
    <h1 className="text-3xl font-bold">Reserve your place and pay online</h1>
    <p>Payment is requested only after your 10-minute confirmation call and acceptance. Your acceptance email will confirm your agreed payment schedule and payment instructions. Once accepted, you can pay £50 to reserve your place; the deposit is credited towards your total programme fee.</p>
    {status?.mode === 'test' && <div className="bg-amber-50 border border-amber-500 rounded-xl p-4 font-semibold">Stripe test mode: test cards only. No real money is collected and no place is reserved.</div>}
    {message && <p role="status" className="bg-[#f8f4ed] border border-[#d4a24c] rounded-xl p-5">{message}</p>}
    {reference && <p className="break-all">Application reference: <strong>{reference}</strong></p>}
    {account && <div className="bg-[#f8f4ed] rounded-xl p-5"><p>Verified {status?.mode === 'test' ? 'test ' : ''}payments: <strong>{money(paid)}</strong></p><p>{account.reserved ? 'A live payment of at least £50 is recorded. Your acceptance email confirms your enrolment arrangements.' : 'No live reservation payment is recorded. Please wait for acceptance, then follow your agreed payment schedule.'}</p></div>}
    {account?.mentorship && <p>Executive mentorship is an optional add-on. Payment options and arrangements are available. Please agree the additional fee and schedule with WOW before making a bespoke payment.</p>}
    {(!reference || !token || (status && !account && message && !verificationBlocked)) && <div className="bg-[#f8f4ed] border border-[#d4a24c] rounded-xl p-5 space-y-3">
      <h2 className="text-xl font-bold">Already applied? Get your payment link</h2>
      <p>After your confirmation call and acceptance, use the personal payment link in your email. If it is missing, enter your application reference and the email address used to apply. We will send the link to that address if your application is recorded as accepted. Do not submit another application.</p>
      <form className="space-y-3" onSubmit={async e => { e.preventDefault(); if(recoveryBusy)return; setRecoveryBusy(true); setRecoveryMessage(''); try { const result = await post('/api/stripe/request-payment-link',{reference:recoveryReference.trim(),email:recoveryEmail.trim()}); setRecoveryMessage(result.message); } catch(error) { setRecoveryMessage(error instanceof Error ? error.message : 'Please contact WOW for your payment link.'); } finally {setRecoveryBusy(false);} }}>
        <label className="block font-semibold">Application reference<input required value={recoveryReference} onChange={e=>setRecoveryReference(e.target.value)} maxLength={100} className="block border rounded-lg p-3 mt-2 w-full" autoComplete="off" /></label>
        <label className="block font-semibold">Application email address<input required type="email" value={recoveryEmail} onChange={e=>setRecoveryEmail(e.target.value)} maxLength={254} className="block border rounded-lg p-3 mt-2 w-full" autoComplete="email" /></label>
        <button disabled={recoveryBusy} type="submit" className="bg-[#0b2d5b] text-white px-6 py-3 rounded-lg disabled:opacity-50">{recoveryBusy ? 'Requesting link...' : 'Email my payment link'}</button>
      </form>
      {recoveryMessage && <p role="status">{recoveryMessage}</p>}
      <p>Still waiting for acceptance, or cannot find your reference? Contact <a className="underline" href={`mailto:${programme.email}?subject=Career%20Accelerator%20payment%20link`}>{programme.email}</a>. Payment is requested only after acceptance.</p>
    </div>}
    <form onSubmit={checkout} className="space-y-6">
      <fieldset><legend className="font-bold text-xl mb-4">Choose your payment</legend><div className="grid md:grid-cols-2 gap-4">
        {options.map(o => <label key={o.id} className={`block bg-white border-2 rounded-2xl p-5 cursor-pointer ${plan===o.id?'border-[#b78a38]':'border-slate-200'}`}>
          <input type="radio" name="payment-plan" value={o.id} checked={plan===o.id} onChange={()=>setPlan(o.id)} disabled={o.target<=paid || (o.id==='early' && earlyExpired)} className="mr-2 accent-[#0b2d5b]"/><span className="font-bold">{o.title}</span>
          <p className="text-2xl font-bold text-[#0b2d5b] my-2">{money(Math.max(0,o.target-paid))}{account && paid>0 ? ' remaining' : ''}</p><p>{o.description}</p>{o.id==='early' && earlyExpired && <p>Offer closed.</p>}
        </label>)}
        <label className={`block bg-white border-2 rounded-2xl p-5 ${plan==='custom'?'border-[#b78a38]':'border-slate-200'}`}><input type="radio" name="payment-plan" checked={plan==='custom'} onChange={()=>setPlan('custom')} className="mr-2 accent-[#0b2d5b]"/><span className="font-bold">Pay a bespoke amount / test payment</span><p className="mt-2">Use an amount agreed with WOW. Small test payments belong in test mode. A live payment below £50 does not reserve a place.</p></label>
      </div></fieldset>
      {plan==='custom' && <label className="block font-semibold">Amount in GBP (£)<input required type="number" min="1" max={(total-paid)/100} step="0.01" value={customAmount} onChange={e=>setCustomAmount(e.target.value)} className="block border border-slate-400 rounded-lg p-3 mt-2 w-full"/><span className="text-sm font-normal">Minimum £1.</span></label>}
      <label className="flex gap-3 items-start"><input type="checkbox" required checked={accepted} onChange={e=>setAccepted(e.target.checked)} className="mt-1 accent-[#0b2d5b]"/><span>I have read the <a href="/?page=programme-terms" target="_blank" rel="noopener noreferrer" className="underline">programme terms</a>, including the fees, deposit and cancellation information. I have received my acceptance email and am paying according to my agreed payment schedule.</span></label>
      <button disabled={!reference || !token || !account || account.settled || !status?.configured || busy || verificationBlocked || amount<=0 || !Number.isFinite(amount)} className="bg-[#0b2d5b] text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50" type="submit">{account?.settled ? 'Programme fee paid in full' : busy ? 'Opening Stripe...' : `${status?.mode==='test'?'Test payment':'Pay'} ${money(Number.isFinite(amount)?Math.max(0,amount):0)} with Stripe`}</button>
      {(!reference || !token) && <p>Your personal payment link unlocks this button and matches the payment to your application. Retrieve it above; you do not need to apply again.</p>}
    </form>
    {status && !status.configured && <p>Online checkout is awaiting server configuration. Contact <a className="underline" href={`mailto:${programme.email}`}>{programme.email}</a> for help. Do not send card details by email.</p>}
    <p>Employer sponsorship requires written agreement with WOW. For business invoices or other bespoke services, contact WOW for an agreed payment arrangement. All prices shown are total fees; WOW is not VAT registered.</p>
  </section>;
};
