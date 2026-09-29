"""Run after npm run build. Tests local APIs using isolated storage and no external credentials."""
import copy, json, os, pathlib, subprocess, tempfile, time, urllib.request, urllib.error
root = pathlib.Path(__file__).resolve().parents[1]
passed = []
checks = 0

def request(route, payload=None, expected=200):
    global checks
    req = urllib.request.Request('http://127.0.0.1:3000' + route, data=json.dumps(payload).encode() if payload is not None else None, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            status, body = response.status, response.read()
    except urllib.error.HTTPError as error:
        status, body = error.code, error.read()
    assert status == expected, (route, status, body.decode()[:200])
    checks += 1
    return json.loads(body)

training = dict(fullName='Test Applicant', email='test@example.invalid', mobileWhatsapp='00000000000', townCity='Test City', previousExperience='Yes, 1-3 years', careerObjective='Test objective', currentChallenge='Test challenge', successMeasure='Test measure', privacyAcknowledged=True, submissionType='SUBMIT_AND_PAY', status='AWAITING_PAYMENT')
training.update({'declaration'+str(n): True for n in range(1,8)})
cases = {
    'general': dict(subject='Test only', message='Test enquiry'),
    'business-consultancy': dict(challenge='Test challenge', desiredOutcome='Test outcome'),
    'staffing': dict(numberOfPeople='1', preferredStartDate='To agree', locationDetails='Remote', expectedOutputs='Test deliverable'),
    'training': training,
    'ai-solutions': dict(businessProblem='Test problem', currentProcess='Manual', informationUsed='Dummy data'),
    'career-coaching': dict(targetRoleDirection='Programme manager', goalsToAchieve='Test goal'),
    'partnership': dict(organisationOverview='Test organisation', proposalDescription='Test proposal', problemAddressed='Test problem', contributions='Test contribution'),
    'associate': dict(location='Test City', expertise='Finance', sectors='Education', availability='Two days a week', experience='Test experience description for local checks only.', retainForOpportunities=True),
}
with tempfile.TemporaryDirectory(prefix='wbd-forms-') as folder:
    os.symlink(root / 'dist', pathlib.Path(folder) / 'dist')
    log = open(pathlib.Path(folder) / 'server.log', 'w')
    server = subprocess.Popen(['node', str(root / 'dist/server.cjs')], cwd=folder, env={'PATH': os.environ['PATH'], 'NODE_ENV': 'production'}, stdout=log, stderr=log)
    try:
        for _ in range(50):
            if server.poll() is not None: raise RuntimeError('Isolated test server failed to start')
            try:
                request('/api/health'); break
            except urllib.error.URLError: time.sleep(.1)
        else: raise RuntimeError('Test server did not become ready')
        for category, details in cases.items():
            body = dict(category=category, contact=dict(firstName='Test', surname='Applicant', email='test@example.invalid', privacyAcknowledged=True), details=details)
            result=request('/api/enquiries', body, 201)
            assert result['success'] and result['reference'] and not result['staffEmailSent'] and not result['acknowledgementSent']
            passed.append(category+': valid submission recorded; simulated email correctly reported')
            for field, value in [('email','invalid'),('privacyAcknowledged',False),('firstName','')]:
                invalid=copy.deepcopy(body);invalid['contact'][field]=value;request('/api/enquiries', invalid, 400)
            invalid=copy.deepcopy(body);invalid['details']={};request('/api/enquiries',invalid,400)
            passed.append(category+': invalid email, missing name, missing consent and empty details rejected')
        saved=[json.loads(line) for line in (pathlib.Path(folder)/'data/enquiries.jsonl').read_text().splitlines()]
        assert len(saved)==8 and {x['category'] for x in saved}==set(cases)
        passed.append('All eight successful enquiry payloads persisted exactly once; rejected submissions not saved')
        result=request('/api/registrations/submit',training)
        assert result['success'] and not result['emailAlertSent'] and not result['delegateWelcomeSent']
        for field,value in [('email','invalid'),('privacyAcknowledged',False),('declaration7',False),('townCity','')]:
            invalid=copy.deepcopy(training);invalid[field]=value;request('/api/registrations/submit',invalid,400)
        passed.append('Career Accelerator: valid application saved; invalid email, missing town, consent and declaration rejected')
        assert request('/api/stripe/status')['configured'] is False
        request('/api/stripe/create-checkout-session',dict(amount=50),503)
        request('/api/stripe/create-checkout-session',dict(amount=-1),400)
        passed.append('Payments: unconfigured checkout blocked without fake success; negative amount rejected')
        request('/api/ai-assistant',dict(prompt='Explain programme governance',assistantType='business'))
        request('/api/ai-assistant',dict(prompt=''),400)
        passed.append('Assistant: local fallback responds; empty request rejected')
        print('\n'.join('PASS '+x for x in passed))
        print(f'PASS {checks} HTTP checks plus persisted record assertions. Browser interaction and real email/payment delivery are not covered.')
    finally:
        server.terminate();server.wait(timeout=10);log.close()
