import React, { useEffect, useState } from 'react';
import { fieldLabel, displayValue, enquiryTitle } from '../engagement/enquiryLabels';
type Enquiry = { cv?: {name: string; size: number}; id: string; receivedAt: string; category: string; contact: Record<string, unknown>; details: Record<string, unknown> };
export function WebsiteEnquiriesRegister({ mode = 'general' }: { mode?: 'general' | 'associates' }) {
 const [rows,setRows] = useState<Enquiry[]>([]);
 const [skills, setSkills] = useState('');
 const [sector, setSector] = useState('');
 const [location, setLocation] = useState('');
 const [cvOnly, setCvOnly] = useState(false);
 const [busy,setBusy] = useState(false);
 const [error,setError] = useState('');
 const [query,setQuery] = useState('');
 async function refresh() {
  setBusy(true); setError('');
  try {
   const response = await fetch('/api/admissions-dashboard/website-enquiries', { cache: 'no-store' });
   const isJson = /json/i.test(response.headers.get('content-type') || '');
   const data: { records?: Enquiry[]; error?: string } = isJson ? await response.json().catch(() => ({})) : {};
   if (!response.ok || !Array.isArray(data.records)) throw new Error(data.error || 'Unable to load records. Please contact technical support to check the website server.');
   setRows(data.records);
  } catch (error) {
   setError(error instanceof Error ? error.message : 'Records could not be loaded.');
  } finally { setBusy(false); }
 }
 useEffect(() => { void refresh(); }, []);
 const scoped = rows.filter(r => mode === 'associates' ? r.category === 'associate' : r.category !== 'associate');
 const visible = scoped.filter(r => {
   const combined = JSON.stringify(r).toLowerCase();
   if (query && !combined.includes(query.toLowerCase())) return false;
   if (mode !== 'associates') return true;
   const details = r.details || {};
   return (!skills || [details.expertise, details.experience, details.qualifications].join(' ').toLowerCase().includes(skills.toLowerCase()))
     && (!sector || String(details.sectors || '').toLowerCase().includes(sector.toLowerCase()))
     && (!location || String(details.location || '').toLowerCase().includes(location.toLowerCase()))
     && (!cvOnly || Boolean(r.cv));
 });
 return <div style={{paddingTop:18}}>
  <p>{mode === 'associates' ? 'Search existing Associate registrations to identify suitable skills for projects. Details remain in the original secure register.' : 'General, business, health and social care, staffing and partnership submissions.'}</p>
  <button disabled={busy} onClick={refresh}>{busy ? 'Loading…' : 'Refresh records'}</button>
  {error && <p role="alert">{error}</p>}
  <>
    <p>{visible.length} matching records out of {scoped.length} in this category.</p>
    <label>Search name, email, organisation, reference or any text
      <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search registrations" style={{display:'block',width:'100%',padding:10,marginBottom:10}} />
    </label>
    {mode === 'associates' && <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,margin:'12px 0 18px'}}>
      <label>Skills / qualifications<input value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. Power BI" style={{display:'block',width:'100%',padding:10}} /></label>
      <label>Sector<input value={sector} onChange={e => setSector(e.target.value)} placeholder="e.g. healthcare" style={{display:'block',width:'100%',padding:10}} /></label>
      <label>Location<input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. UK or remote" style={{display:'block',width:'100%',padding:10}} /></label>
      <label style={{alignSelf:'end'}}><input type="checkbox" checked={cvOnly} onChange={e => setCvOnly(e.target.checked)} /> CV uploaded only</label>
    </div>}
    {visible.slice().reverse().map(r => <details key={r.id} style={{marginTop:12,borderBottom:'1px solid #eee1d0',paddingBottom:12}}>
      <summary style={{cursor:'pointer',fontWeight:600}}>{displayValue(r.contact.firstName)} {String(r.contact.surname || '')} — {mode === 'associates' ? String(r.details.expertise || 'Expertise not specified') : enquiryTitle(r.category)} — {new Date(r.receivedAt).toLocaleString('en-GB')}</summary>
      <p>Reference: {r.id}</p>
      {mode === 'associates' && <>
        <p><strong>Sector:</strong> {displayValue(r.details.sectors)}</p>
        <p><strong>Location:</strong> {displayValue(r.details.location)}</p>
        <p><strong>Availability:</strong> {displayValue(r.details.availability)}</p>
      </>}
      {r.cv && <p><a href={'/api/admissions-dashboard/website-enquiries/'+encodeURIComponent(r.id)+'/cv'}>Download CV: {r.cv.name}</a></p>}
      {[r.contact,r.details].map((group,i)=><dl key={i}>{Object.entries(group).map(([key,value])=><React.Fragment key={key}><dt><strong>{fieldLabel(key)}</strong></dt><dd style={{whiteSpace:'pre-wrap',marginBottom:12}}>{displayValue(value)}</dd></React.Fragment>)}</dl>)}
    </details>)}
    {!scoped.length && <p>No {mode === 'associates' ? 'Associate registrations' : 'website enquiries'} were found. Contact technical support to check that the original private data folder is present.</p>}
  </>
 </div>;
}
