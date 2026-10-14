import React, { useState } from 'react';

/**
 * Public, fictional preview only. No real account access, bids or notifications.
 * Production associate access MUST be implemented with server-side authorization.
 */
const sample = [
  {ref:'DEMO-001',title:'Website release QA and GitHub review',category:'Digital',fee:'$50',close:'23 Oct 2026',start:'26 Oct 2026',finish:'30 Oct 2026'},
  {ref:'DEMO-002',title:'Brand consistency and Canva asset production',category:'Design',fee:'$50',close:'24 Oct 2026',start:'27 Oct 2026',finish:'3 Nov 2026'},
  {ref:'DEMO-003',title:'AI-assisted tender response quality review',category:'Tenders',fee:'$80',close:'25 Oct 2026',start:'28 Oct 2026',finish:'4 Nov 2026'},
];
const menu=['Overview','Available opportunities','My bids','Induction & skills','Notifications'];
export function AssociatePortalPreview(){
 const [tab,setTab]=useState('Overview');
 return <div className="min-h-screen bg-[#F8F4ED] text-[#0B2D5B] px-4 py-10">
  <div className="mx-auto max-w-6xl">
   <div className="bg-[#0B2D5B] text-white rounded-2xl p-6 mb-6">
    <div className="text-[#D4A24C] tracking-widest text-xs uppercase font-bold">WOW Business & Digital</div>
    <h1 className="text-3xl font-bold my-2">Associate Services Portal</h1>
    <p className="max-w-3xl">Building a specialist delivery network for WBD's own operations and professional services to clients. AI-supported delivery, human expertise, quality assurance and accountability.</p>
    <p className="mt-4 text-sm font-semibold bg-white/15 rounded-lg p-3">DEMONSTRATION ONLY — fictional opportunities and dates. This preview does not grant access or submit bids.</p>
   </div>
   <div className="flex gap-2 flex-wrap mb-6" aria-label="Portal sections">{menu.map(m=><button key={m} onClick={()=>setTab(m)} className={`rounded-lg px-4 py-2 border ${tab===m?'bg-[#1E63F3] text-white border-[#1E63F3]':'bg-white border-slate-300'}`}>{m}</button>)}</div>
   {tab==='Overview'&&<div className="grid md:grid-cols-3 gap-4">{[['Opportunities','Browse eligible work, payments and timelines'],['Competencies','Demonstrate genuine expertise using approved AI tools'],['My work','Track bids, milestones and quality checks']].map(([a,b])=><div key={a} className="bg-white rounded-xl p-6 border border-slate-200"><h2 className="text-xl font-bold mb-2">{a}</h2><p>{b}</p></div>)}</div>}
   {tab==='Available opportunities'&&<div className="grid gap-4">{sample.map(s=><article key={s.ref} className="bg-white rounded-xl border border-slate-200 p-6"><div className="text-xs text-[#1E63F3] font-bold">{s.ref} · {s.category}</div><h2 className="text-xl font-bold my-2">{s.title}</h2><p className="mb-3">Indicative payment: <strong>{s.fee}</strong></p><div className="grid sm:grid-cols-3 gap-2 text-sm"><p>Bid closes: <strong>{s.close}</strong></p><p>Starts: <strong>{s.start}</strong></p><p>Finishes: <strong>{s.finish}</strong></p></div><p className="mt-3 text-sm">Bidding is enabled only for approved associates in the live secured portal.</p><button disabled className="mt-3 bg-slate-200 text-slate-600 py-2 px-4 rounded-lg cursor-not-allowed">Bidding available after launch</button></article>)}</div>}
   {tab==='My bids'&&<section className="bg-white p-6 rounded-xl"><h2 className="text-xl font-bold">My bids and assignments</h2><p className="mt-2">Approved associates will track submitted, shortlisted, awarded and completed work here. No real bid data is shown in this preview.</p></section>}
   {tab==='Induction & skills'&&<section className="bg-white p-6 rounded-xl"><h2 className="text-xl font-bold">Induction and specialist accreditation</h2><p className="mt-2">Mandatory WBD induction, approved use of AI, professional competency assessments, confidentiality and secure working. Work categories will be assigned after review.</p></section>}
   {tab==='Notifications'&&<section className="bg-white p-6 rounded-xl"><h2 className="text-xl font-bold">Notification schedule</h2><p className="mt-2">When activated, the system will email eligible associates about new packages, send bid-deadline reminders, confirm decisions and notify successful associates ahead of start and finish dates.</p><p className="mt-2 font-semibold">No emails are sent from this demonstration.</p></section>}
   <p className="mt-8 text-sm">Already registered? Your existing WBD associate application will be considered for account invitation once secure access is launched. Do not create another registration.</p>
  </div>
 </div>;
}
