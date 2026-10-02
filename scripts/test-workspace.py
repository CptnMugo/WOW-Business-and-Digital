"""Private workspace checks: temporary records, no external messages or accounts."""
import os, pathlib, subprocess, tempfile, time, urllib.request, urllib.error, json, hashlib
root=pathlib.Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='wbd-access-') as folder:
    folder=pathlib.Path(folder)
    os.symlink(root/'dist',folder/'dist'); os.symlink(root/'server',folder/'server')
    proc=subprocess.Popen(['node',str(root/'dist/server.cjs')],cwd=folder,env={'PATH':os.environ['PATH'],'NODE_ENV':'production'},stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    checks=0
    def request(route,payload=None,status=200,cookie=None,origin=None):
        global checks
        headers={'Content-Type':'application/json'}
        if cookie:headers['Cookie']=cookie
        if origin:headers['Origin']=origin
        req=urllib.request.Request('http://127.0.0.1:3000'+route,data=json.dumps(payload).encode() if payload is not None else None,headers=headers)
        try:r=urllib.request.urlopen(req,timeout=5)
        except urllib.error.HTTPError as e:r=e
        body=r.read();assert r.status==status,(route,r.status,body[:100]);checks+=1
        return body,r.headers
    try:
        for _ in range(100):
            try:urllib.request.urlopen('http://127.0.0.1:3000/api/health');break
            except:time.sleep(.1)
        assert json.loads(request('/api/workspace/session')[0])['authenticated'] is False
        request('/api/workspace/content',status=401)
        request('/server/workspaces/simulation.html',status=404)
        request('/src/assets/projectSimulation.html',status=404)
        valid={'name':'Test Participant','email':'test@example.invalid','reason':'3-hour taster session','privacyAcknowledged':True}
        request('/api/workspace/request',{**valid,'privacyAcknowledged':False},400)
        request('/api/workspace/request',valid,403,origin='https://untrusted.invalid')
        assert json.loads(request('/api/workspace/request',valid,201)[0])['reference'].startswith('WBD-ACCESS-')
        request('/api/workspace/content',status=401)
        request('/api/workspace/login',{'email':valid['email'],'code':'wrong'},401)
        env={**os.environ,'DATA_DIR':str(folder/'data')}
        approved=subprocess.check_output(['node','--import','tsx','scripts/workspace-access.ts','approve',valid['email'],'7'],cwd=root,env=env,text=True)
        code=approved.strip().splitlines()[-1]
        store=json.loads((folder/'data/workspace-access.json').read_text());assert store['members'][0]['inviteHash']==hashlib.sha256(code.encode()).hexdigest()
        body,headers=request('/api/workspace/login',{'email':valid['email'],'code':code})
        cookie=headers['Set-Cookie'].split(';')[0];assert '__Host-wow_workspace=' in cookie
        assert all(v.lower() in headers['Set-Cookie'].lower() for v in ['Secure','HttpOnly','SameSite=Strict'])
        request('/api/workspace/login',{'email':valid['email'],'code':code},401)
        assert json.loads(request('/api/workspace/session',cookie=cookie)[0])['authenticated'] is True
        html,headers=request('/api/workspace/content',cookie=cookie);assert b'<html' in html and 'no-store' in headers['Cache-Control']
        assert "connect-src 'none'" in headers['Content-Security-Policy']
        request('/api/workspace/logout',{},cookie=cookie)
        request('/api/workspace/content',status=401,cookie=cookie)
        # An administrator can revoke an active session immediately.
        code=subprocess.check_output(['node','--import','tsx','scripts/workspace-access.ts','approve',valid['email'],'7'],cwd=root,env=env,text=True).strip().splitlines()[-1]
        _,headers=request('/api/workspace/login',{'email':valid['email'],'code':code});cookie=headers['Set-Cookie'].split(';')[0]
        subprocess.check_output(['node','--import','tsx','scripts/workspace-access.ts','revoke',valid['email']],cwd=root,env=env)
        request('/api/workspace/content',status=401,cookie=cookie)
        # Expired invitations and malformed records fail closed.
        db=folder/'data/workspace-access.json';store=json.loads(db.read_text());member=store['members'][0]
        member.update(inviteHash=hashlib.sha256(b'expired').hexdigest(),inviteUntil=0,approvedUntil=int(time.time()*1000)+100000)
        db.write_text(json.dumps(store));request('/api/workspace/login',{'email':valid['email'],'code':'expired'},401)
        db.write_text('{broken');request('/api/workspace/request',valid,503);request('/api/workspace/content',status=503,cookie=cookie)
        for p in (root/'dist/assets').glob('*.js'):assert 'Proposed website location | explore the three screens below' not in p.read_text()
        print(f'PASS {checks} private workspace HTTP checks; approval, hashed credentials, one-use codes, cookie controls, logout, revocation, expiry, closed failure and no bundled workspace content')
    finally:proc.terminate();proc.wait(timeout=10)
