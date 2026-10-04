import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const root=process.cwd();
const temp=fs.mkdtempSync(path.join(root,'scripts/.payment-review-'));
try {
 const render=await build({stdin:{contents:`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {PaymentsSection} from './src/components/PaymentsSection';module.exports=renderToStaticMarkup(React.createElement(PaymentsSection,{setActiveTab:()=>{}}));`,resolveDir:root,loader:'tsx'},bundle:true,platform:'node',format:'cjs',packages:'external',write:false});
 const file=path.join(temp,'render.cjs');fs.writeFileSync(file,render.outputFiles[0].text);const markup=createRequire(import.meta.url)(file);
 const client=await build({stdin:{resolveDir:root,loader:'tsx',contents:`
import React,{useState} from 'react';import{createRoot}from'react-dom/client';import{PaymentsSection}from'./src/components/PaymentsSection';import{Logo}from'./src/components/Logo';
let paid=0;
window.__WBD_DEMO_QUERY='';
window.fetch=async(url,options)=>{
 const body=options?.body?JSON.parse(options.body):{};let data;let status=200;
 if(url==='/api/stripe/status')data={configured:true,mode:'test'};
 else if(url==='/api/stripe/application')data={paid,reserved:false,mentorship:false,settled:false};
 else if(url==='/api/stripe/request-payment-link')data={message:'DEMO ONLY: No email was sent. On the website, matching an accepted application would send a private payment link. Use the Accepted applicant button above to see the next screen.'};
 else if(url==='/api/stripe/create-checkout-session'){
 const target={deposit:5000,early:90000,instalment:paid<50000?50000:100000,full:100000};
 const amount=body.plan==='custom'?Math.round(Number(body.customAmount)*100):target[body.plan]-paid;
 if(!body.termsAccepted||!Number.isFinite(amount)||amount<100){status=400;data={error:'Check the amount and confirm the terms.'};}else data={url:'#demo-checkout',amount,plan:body.plan};
 }else{status=404;data={error:'This action is not connected in the preview.'};}
 return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
};
function Review(){const[key,setKey]=useState(0);const[checkout,setCheckout]=useState(null);const[view,setView]=useState('Public Payments');
 window.__previewCheckout=result=>setCheckout(result);
 const change=(next,amount=0)=>{paid=amount;window.__WBD_DEMO_QUERY=next==='Public Payments'?'':'?reference=DEMO-ACCEPTED&token=demonstration-only';setView(next);setKey(n=>n+1);setCheckout(null);};
 return <><header style={{background:'#0b2d5b',color:'white',padding:24}}><div style={{maxWidth:960,margin:'auto'}}><Logo lightMode size='lg'/><h1 style={{fontSize:24,fontWeight:700,marginTop:20}}>Payment journey review</h1><p>Demo only. No real emails, applications or Stripe transactions.</p><div className='demo-controls'>{['Public Payments','Accepted applicant','After £50 deposit'].map(v=><button key={v} aria-pressed={view===v} onClick={()=>change(v,v==='After £50 deposit'?5000:0)}>{v}</button>)}</div><p style={{fontSize:13}}>Choose a view. In Accepted applicant, choose an amount, tick the terms box and press the Stripe button to see the simulated hand-off.</p></div></header><PaymentsSection key={key} setActiveTab={()=>{}}/>{checkout&&<div role='dialog' aria-modal='true' aria-label='Simulated Stripe hand-off' style={{position:'fixed',inset:0,background:'#071a36ee',display:'grid',placeItems:'center',padding:20}}><div style={{background:'#fff',color:'#0b2d5b',padding:32,borderRadius:16,maxWidth:500}}><h2 style={{fontSize:25,fontWeight:700}}>Stripe hand-off demonstrated</h2><p style={{fontSize:32,margin:'20px 0'}}>{new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(checkout.amount/100)}</p><p>The website would open Stripe Checkout for this amount. This preview stops here. No payment has been created or taken.</p><button className='demo-close' onClick={()=>{setCheckout(null);setKey(n=>n+1);}}>Back to payment choices</button></div></div>}</>;
}createRoot(document.getElementById('root')).render(<Review/>);
`},bundle:true,minify:true,format:'iife',write:false,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'offline-payment-review',setup(build){build.onLoad({filter:/PaymentsSection\.tsx$/},args=>({contents:fs.readFileSync(args.path,'utf8').replace("typeof window === 'undefined' ? '' : window.location.search","typeof window === 'undefined' ? '' : (window as any).__WBD_DEMO_QUERY || ''").replace('window.location.assign(result.url)','(window as any).__previewCheckout(result)'),loader:'tsx'}));}}]});
 const css=fs.readFileSync('dist/assets/'+fs.readdirSync('dist/assets').find(f=>f.endsWith('.css')),'utf8').replace(/@font-face\{[^}]*\}/g,'');
 const font=fs.readFileSync('public/fonts/Montserrat-Variable.ttf').toString('base64');
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>WBD payment journey - interactive review</title><style>${css}@font-face{font-family:Montserrat;src:url(data:font/ttf;base64,${font});font-weight:100 900}body{margin:0;background:#f8f4ed;font-family:Montserrat,Arial,sans-serif}.demo-controls{display:flex;flex-wrap:wrap;gap:10px;margin:20px 0}.demo-controls button,.demo-close{padding:12px 18px;border-radius:8px;border:1px solid #d4a24c;cursor:pointer}.demo-controls button[aria-pressed=true]{background:#d4a24c;color:#0b2d5b}.demo-close{margin-top:20px;background:#0b2d5b;color:white}button:focus-visible,input:focus-visible{outline:3px solid #a97726;outline-offset:3px}</style></head><body><div id="root"><div style="background:#0b2d5b;color:white;padding:20px">REVIEW ONLY - Open this file in a browser to try the interactive examples. No real payments or emails.</div>${markup}</div><script>${client.outputFiles[0].text.replace(/<\/script/gi,'<\\/script')}</script></body></html>`;
 const target=path.resolve(root,'../WBD_Payment_Journey_Reviewed.html');fs.writeFileSync(target,html);console.log(target);
}finally{fs.rmSync(temp,{recursive:true,force:true});}
