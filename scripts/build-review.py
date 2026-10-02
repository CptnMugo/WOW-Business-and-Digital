"""Produce an offline review with forms disabled and no private simulation content."""
from pathlib import Path
import base64, re, subprocess, tempfile
root=Path(__file__).resolve().parents[1]
out=root.parent
html=(root/'dist/index.html').read_text()
css=(root/('dist'+re.search(r'href="(/assets/[^\"]+\.css)"',html)[1])).read_text()
font=base64.b64encode((root/'public/fonts/Montserrat-Variable.ttf').read_bytes()).decode()
css=css.replace('/fonts/Montserrat-Variable.ttf','data:font/ttf;base64,'+font)
js=(root/('dist'+re.search(r'src="(/assets/[^\"]+\.js)"',html)[1])).read_text()
icon='data:image/png;base64,'+base64.b64encode((root/'public/wbd-favicon.png').read_bytes()).decode()
html=html.replace('/wbd-favicon.png',icon)
html=re.sub(r'<link rel="stylesheet"[^>]+>',lambda m:'<style>'+css+'</style>',html)
html=re.sub(r'<script type="module"[^>]+></script>',lambda m:'<script>window.fetch=async()=>{throw new Error("Offline review only. Requests and sign-in require the deployed website.");};</script><script type="module">'+js.replace('</script','<\\/script')+'</script>',html)
nav=''.join(f'<a style="color:white;margin:5px 12px;display:inline-block" href="?page={route}">{label}</a>' for label,route in [('Home','home'),('About','about'),('Services','services'),('Career Accelerator','pm-career-accelerator'),('Application','pm-registration'),('Workspace access','project-simulation'),('Fees','payments'),('Contact','contact'),('Associates','associates')])
bar='<div style="padding:14px;background:#0b2d5b;color:white;font:14px Arial;text-align:center">CONSOLIDATED REVIEW · Private simulation access added · Forms and sign-in are disabled.<nav aria-label="Review navigation">'+nav+'</nav></div>'
html=html.replace('<div id="root"></div>',bar+'<div id="root"></div>')
(out/'WBD_Career_Accelerator_Review.html').write_text(html)
with tempfile.TemporaryDirectory() as temp:
    markup=Path(temp)/'markup.html'
    subprocess.run(['node','--import','tsx','scripts/render-workspace-preview.tsx',str(markup)],cwd=root,check=True)
    body=markup.read_text()
    # The standalone public-page preview is non-interactive and contains no private workspace.
    body=body.replace('<button','<button disabled').replace('<input','<input disabled').replace('<select','<select disabled')
    static='<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WOW | Simulation workspace access preview</title><style>'+css+'</style></head><body class="bg-slate-50 text-navy-900"><div style="padding:16px;background:#0b2d5b;color:white">PUBLIC ACCESS PAGE PREVIEW · Form disabled · Not yet live</div>'+body+'</body></html>'
    (out/'WBD_Simulation_Access_Preview.html').write_text(static)
assert 'simulation workspace' in html and 'Bridge Community Services' not in html
assert 'Request workspace access' in static and '<iframe' not in static
print('Saved consolidated offline review and standalone public access preview; private simulation content excluded.')
