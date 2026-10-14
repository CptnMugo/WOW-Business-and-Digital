import React, { useState } from 'react';

/**
 * Fictional review only. This component MUST NOT be routed into production
 * until director authentication, server authorization and audit storage exist.
 * No live records, network requests, invite links or mutation actions.
 */
type DemoPerson={id:string;name:string;area:string;induction:'Not started'|'In progress'|'Passed';membership:'Applicant'|'Approved';client:'Not assessed'|'Approved'};
const samples:DemoPerson[]=[
 {id:'DEMO-A01',name:'Alex Morgan',area:'Project delivery',induction:'Passed',membership:'Approved',client:'Not assessed'},
 {id:'DEMO-A02',name:'Sam Taylor',area:'Digital adoption',induction:'In progress',membership:'Approved',client:'Not assessed'},
 {id:'DEMO-A03',name:'Jordan Lee',area:'Design and communications',induction:'Not started',membership:'Applicant',client:'Not assessed'},
];
export function AssociateDirectorPreview(){
 const [selected,setSelected]=useState(samples[0].id);
 const person=samples.find(a=>a.id===selected)!;
 return <main className="min-h-screen bg-[#F8F4ED] text-[#0B2D5B] p-4 md:p-8">
  <div className="max-w-6xl mx-auto space-y-6">
   <header className="bg-[#0B2D5B] text-white rounded-xl p-6">
    <p className="uppercase tracking-widest text-[#D4A24C] text-xs font-bold">WOW Business &amp; Digital</p>
    <h1 className="text-3xl font-bold mt-2">Director · Associate management</h1>
    <p className="mt-2">Review induction, work categories and access readiness.</p>
    <p className="mt-4 p-3 bg-white/15 rounded-lg font-semibold">DEMONSTRATION ONLY — fictional people. No real applications are displayed or updated.</p>
   </header>
   <section className="grid md:grid-cols-3 gap-4" aria-label="Demonstration summary">
    {[[ 'Sample associates','3'],['Induction completed','1'],['Client accredited','0']].map(([label,count])=><div key={label} className="rounded-xl bg-white border border-slate-200 p-5"><p className="text-sm">{label}</p><p className="text-3xl font-bold">{count}</p></div>)}
   </section>
   <section className="grid md:grid-cols-[minmax(220px,1fr)_minmax(0,2fr)] gap-5">
    <div className="rounded-xl bg-white p-5 border border-slate-200">
     <h2 className="text-xl font-bold mb-4">Sample registrations</h2>
     <div className="flex flex-col gap-2">{samples.map(a=><button type="button" key={a.id} onClick={()=>setSelected(a.id)} aria-pressed={a.id===selected} className={'text-left rounded-lg border p-3 '+(a.id===selected?'border-[#1E63F3] bg-blue-50':'border-slate-200')}>
      <strong>{a.name}</strong><span className="block text-sm">{a.area}</span><span className="block text-xs">{a.membership}</span>
     </button>)}</div>
    </div>
    <div className="rounded-xl bg-white p-5 border border-slate-200">
     <h2 className="text-xl font-bold">{person.name}</h2><p className="text-sm mt-1">Reference: {person.id}</p>
     <dl className="grid sm:grid-cols-2 gap-4 mt-5">
      <div><dt className="text-sm font-semibold">Membership</dt><dd>{person.membership}</dd></div>
      <div><dt className="text-sm font-semibold">Induction</dt><dd>{person.induction}</dd></div>
      <div><dt className="text-sm font-semibold">Specialist area</dt><dd>{person.area}</dd></div>
      <div><dt className="text-sm font-semibold">Client accreditation</dt><dd>{person.client}</dd></div>
     </dl>
     <h3 className="font-bold mt-6">Planned Director actions</h3>
     <p className="text-sm mt-2">Approve membership, record verified induction evidence, assign work categories, accredit client work, issue an invitation, or suspend access.</p>
     <div className="flex flex-wrap gap-2 mt-4">{['Approve','Record induction','Assign categories','Invite'].map(label=><button key={label} type="button" disabled className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed">{label} — not enabled</button>)}</div>
     <p className="mt-5 text-sm border-l-4 border-[#D4A24C] pl-3">Bidding eligibility requires approved membership, completed induction, an approved category and additional accreditation for client assignments.</p>
    </div>
   </section>
  </div>
 </main>;
}
