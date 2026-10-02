import React, { useEffect, useState } from 'react';
import { NavTab } from '../types';
export const ProjectSimulationPage = ({ setActiveTab }: { setActiveTab: (tab: NavTab) => void }) => {
  const [authenticated,setAuthenticated]=useState(false);
  const [checking,setChecking]=useState(false);
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState('');
  const [error,setError]=useState('');
  const [view,setView]=useState<'request'|'login'>('request');
  useEffect(()=>{setChecking(true);let active=true;fetch('/api/workspace/session').then(r=>r.json()).then(d=>{if(active)setAuthenticated(d.authenticated===true);}).catch(()=>{}).finally(()=>{if(active)setChecking(false);});return()=>{active=false;};},[]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if(busy)return;
    const form=event.currentTarget; const data=new FormData(form); setBusy(true);setError('');setNotice('');
    try {
      const payload=view==='request' ? {name:data.get('name'),email:data.get('email'),reason:data.get('reason'),privacyAcknowledged:data.get('privacy')==='on'} : {email:data.get('email'),code:data.get('code')};
      const response=await fetch('/api/workspace/'+view,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const result=await response.json();if(!response.ok)throw new Error(result.error||'Please try again.');
      form.reset();
      if(view==='login')setAuthenticated(true);
      else setNotice(`Thank you. Your access request has been recorded. Reference: ${result.reference}. WOW will review your request and contact you using the email supplied. Access is not automatic.`);
    }catch(e){setError(e instanceof Error ? e.message : 'Please try again.');}finally{setBusy(false);}
  }
  async function logout(){setBusy(true);setError('');try{const r=await fetch('/api/workspace/logout',{method:'POST'});if(!r.ok)throw new Error('Sign-out could not be completed. Please try again.');setAuthenticated(false);setNotice('You have signed out.');}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  const field='w-full rounded-lg border border-navy-200 p-3 mt-1 text-navy-900 bg-white';
  return <section className="px-3 sm:px-6 py-10"><div className="max-w-5xl mx-auto space-y-5">
    <button onClick={()=>setActiveTab('pm-career-accelerator')} className="font-semibold underline">Back to Career Accelerator</button>
    <p className="text-sm font-semibold uppercase tracking-wider text-royal">Private learning space</p>
    <h1 className="text-3xl font-bold">Career Accelerator simulation workspace</h1>
    <p>This workspace is used during the Project Management Career Accelerator training programme. Participants practise the project lifecycle, communicate with simulated stakeholders and develop practical project outputs.</p>
    <p>Access is available to approved participants and people invited to an arranged 3-hour taster or 5-day simulation. Submit a request for review, or sign in using the individual code provided by WOW.</p>
    {notice&&<p role="status" className="rounded-lg bg-teal-50 p-4">{notice}</p>}
    {error&&<p role="alert" className="rounded-lg bg-red-50 p-4">{error}</p>}
    {checking?<p>Checking workspace access…</p>:authenticated?<>
      <button disabled={busy} onClick={logout} className="underline font-semibold">Sign out</button>
      <p className="text-sm">This is a training simulation with scripted sponsor and coach responses and optional device voice. Notes stay in this browser where available; use fictional information, download your work and reset notes when using a shared device.</p>
      <iframe title="Private Career Accelerator simulation workspace" src="/api/workspace/content" className="w-full rounded-xl border border-navy-200 bg-white" style={{height:'1200px'}} />
    </>:<div className="max-w-xl rounded-xl border border-navy-200 bg-white p-6">
      <div className="flex gap-5 mb-5"><button type="button" aria-pressed={view==='request'} onClick={()=>{setView('request');setError('');}} className="font-semibold underline">Request access</button><button type="button" aria-pressed={view==='login'} onClick={()=>{setView('login');setError('');}} className="font-semibold underline">Sign in</button></div>
      <h2 className="text-xl font-bold mb-4">{view==='request'?'Request workspace access':'Sign in to your workspace'}</h2>
      <form key={view} onSubmit={submit} className="space-y-4">
        {view==='request'&&<label className="block">Full name<input className={field} name="name" autoComplete="name" required maxLength={150}/></label>}
        <label className="block">Email address<input className={field} type="email" name="email" autoComplete="email" required maxLength={254}/></label>
        {view==='request'?<>
          <label className="block">Reason for requesting access<select className={field} name="reason" required defaultValue=""><option value="" disabled>Select a reason</option><option>Career Accelerator participant</option><option>3-hour taster session</option><option>5-day simulation</option><option>Facilitator or invited collaborator</option><option>Other — please contact me to discuss</option></select></label>
          <label className="flex gap-3 items-start"><input type="checkbox" name="privacy" required className="mt-1"/><span>I have read the <button type="button" onClick={()=>setActiveTab('privacy')} className="underline">privacy notice</button> and understand WOW will use these details to review and manage my access request.</span></label>
        </>:<><label className="block">Individual sign-in code<input className={field} name="code" type="password" autoComplete="one-time-code" required maxLength={100}/></label><p className="text-sm">Codes are for one sign-in and expire after 24 hours. To return after signing out or when your session expires, contact WOW for a new code.</p></>}
        <button disabled={busy} type="submit" className="rounded-lg bg-navy-900 text-white px-5 py-3 font-semibold disabled:opacity-50">{busy?'Please wait…':view==='request'?'Send access request':'Sign in'}</button>
      </form>
      <p className="text-sm mt-4">For access support: <a href="mailto:wowdigital@wowbusinessanddigital.com" className="underline">wowdigital@wowbusinessanddigital.com</a></p>
    </div>}
  </div></section>;
};
