import React, { useState } from 'react';
import type { NavTab } from '../types';
type Entry = { tab: NavTab; title: string; description: string };
export const websiteLinkGroups: { title: string; links: Entry[] }[] = [
 {title:'Contact and work with WOW',links:[
  {tab:'contact',title:'Contact us / request a consultation',description:'Send a business enquiry and arrange a conversation with WOW.'},
  {tab:'associate-portal',title:'Associate portal sign in',description:'Invited associates: induction, work packages, bids and private assignments.'},
  {tab:'associates',title:'Become an associate',description:'Register your expertise, with an optional CV and cover note.'},
  {tab:'health-social-care',title:'Health and social care support',description:'Explore project delivery, service improvement and transformation support.'},
  {tab:'corporate-career',title:'Sponsor an employee',description:'Discuss Career Accelerator learning aligned to workplace deliverables.'},
 ]},
 {title:'Career Accelerator and learning',links:[
  {tab:'pm-career-accelerator',title:'Career Accelerator',description:'Read about the programme, practical project work and career support.'},
  {tab:'pm-registration',title:'Apply for the Career Accelerator',description:'Complete your application. No payment is taken on application.'},
  {tab:'career-explore',title:'Taster sessions and adviser enquiries',description:'View available sessions and request a place. Confirmation is sent separately.'},
  {tab:'project-simulation',title:'Simulation workspace — request access or sign in',description:'Private learning workspace. Access requires approval and sign-in.'},
  {tab:'payments',title:'Fees and payments',description:'Use your payment instructions after acceptance or request payment-link recovery.'},
  {tab:'career-coaching',title:'Career coaching',description:'Explore career development support.'},
  {tab:'training',title:'Training services',description:'Explore learning and development support.'},
 ]},
 {title:'Services and resources',links:[
  {tab:'services',title:'All services',description:'Find the right support for your organisation.'},
  {tab:'consulting',title:'Consulting and delivery',description:'Explore our approach to planning and delivering change.'},
  {tab:'business-consultancy',title:'Business consultancy',description:'Explore business improvement and transformation.'},
  {tab:'staffing',title:'Specialist staffing',description:'Discuss capacity and expertise for your project.'},
  {tab:'ai-solutions',title:'Digital and AI solutions',description:'Explore practical digital support.'},
  {tab:'wow-assistant',title:'WOW Assistant demonstrations',description:'Explore the existing interactive assistant demonstrations.'},
  {tab:'products',title:'Products and toolkits',description:'Browse the existing tools and resources page.'},
  {tab:'insights',title:'Insights',description:'Browse articles and updates.'},
  {tab:'case-studies',title:'Experience examples',description:'Read examples of relevant delivery experience.'},
  {tab:'about',title:'About and experience',description:'Find out about WOW and its founder.'},
 ]},
 {title:'Staff and policies',links:[
  {tab:'manage-applications',title:'Staff login',description:'Authorised staff: applications, website enquiries, associate CVs and Career Accelerator requests.'},
  {tab:'privacy',title:'Privacy notice',description:'How personal information is used.'},
  {tab:'programme-terms',title:'Programme terms',description:'Read the Career Accelerator terms.'},
 ]},
];
export function WebsiteLinks() {
 const [message,setMessage]=useState('');
 async function copy(tab:NavTab) {const url=new URL('/',window.location.origin);url.searchParams.set('page',tab);try {await navigator.clipboard.writeText(url.href);setMessage('Link copied. You can paste it into an email or message.');}catch{setMessage('Copy this link: '+url.href);}}
 return <section className="max-w-7xl mx-auto px-5 py-12 space-y-8"><div><p className="wbd-eyebrow">FIND YOUR WAY</p><h1 className="text-3xl sm:text-4xl font-bold">All pages, forms and logins</h1><p className="mt-4">Open the page you need, or copy its link to share. Private areas still require the appropriate access.</p></div><p role="status" className="break-all">{message}</p>{websiteLinkGroups.map(group=><section key={group.title} aria-label={group.title}><h2 className="text-2xl font-bold mb-4">{group.title}</h2><div className="grid md:grid-cols-2 gap-4">{group.links.map(link=><div key={link.tab} className="rounded-xl border border-[#ded7cb] bg-white p-5"><a className="font-bold underline underline-offset-4" href={'?page='+link.tab}>{link.title}</a><p className="text-sm my-3">{link.description}</p><button type="button" className="text-sm rounded-lg border border-[#0b2d5b] px-3 py-2" onClick={()=>copy(link.tab)} aria-label={'Copy link for '+link.title}>Copy link</button></div>)}</div></section>)}</section>;
}
