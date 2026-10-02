"""Build a self-contained, offline preview from the production bundle. No real submissions."""
from pathlib import Path
import base64,re,json
root=Path(__file__).resolve().parents[1]
html=(root/'dist/index.html').read_text()
css=(root/('dist'+re.search(r'href="(/assets/[^\"]+\.css)"',html)[1])).read_text()
font=base64.b64encode((root/'public/fonts/Montserrat-Variable.ttf').read_bytes()).decode()
css=css.replace('/fonts/Montserrat-Variable.ttf','data:font/ttf;base64,'+font)
js=(root/('dist'+re.search(r'src="(/assets/[^\"]+\.js)"',html)[1])).read_text()
icon='data:image/png;base64,'+base64.b64encode((root/'public/wbd-favicon.png').read_bytes()).decode()
html=html.replace('/wbd-favicon.png',icon)
html=re.sub(r'<link rel="stylesheet"[^>]+>',lambda m:'<style>'+css+'</style>',html)
mock='''
try { if(!location.search)history.replaceState({},'',location.pathname+'?page=payments&reference=WOW-CA-26-7K4M9P&token=demo'); }catch{}
window.fetch=async(url,options)=>{
 const data=options?.body ? JSON.parse(options.body) : {};
 const answer = (value,ok=true)=>({ok,json:async()=>value});
 if(url==='/api/stripe/status')return answer({configured:true,mode:'test'});
 if(url==='/api/stripe/application')return answer({paid:new URLSearchParams(location.search).has('deposit')?5000:0,reserved:false,mentorship:false,settled:false});
 if(url==='/api/stripe/create-checkout-session')return answer({error:'Preview only. The deployed website will open secure Stripe Checkout for this selection. No payment was taken.'},false);
 if(url==='/api/registrations/submit')return answer({success:true,referenceNumber:'WOW-CA-26-7K4M9P',paymentUrl:location.pathname+'?page=payments&reference=WOW-CA-26-7K4M9P&token=demo'});
 return answer({error:'Offline preview only. This feature requires the deployed website.'},false);
};
'''
html=re.sub(r'<script type="module"[^>]+></script>',lambda m:'<script>'+mock+'</script><script type="module">'+js.replace('</script','<\\/script')+'</script>',html)
nav=''.join(f'<a style="color:white;margin:5px 12px;display:inline-block" href="?{query}">{label}</a>' for label,query in [('Programme','page=pm-career-accelerator'),('Application','page=pm-registration'),('Payment options','page=payments&reference=WOW-CA-26-7K4M9P&token=demo'),('After £50 deposit','page=payments&reference=WOW-CA-26-7K4M9P&token=demo&deposit=1'),('Terms','page=programme-terms')])
bar='<div style="padding:14px;background:#0b2d5b;color:white;font:14px Arial;text-align:center">PAYMENT JOURNEY PREVIEW | Demonstration data only | No real submissions, charges or emails<nav aria-label="Review navigation">'+nav+'</nav></div>'
html=html.replace('<div id="root"></div>',bar+'<div id="root"></div>')
output=root.parent/'WBD_Payment_Journey_Preview.html'
output.write_text(html)
print(output)
