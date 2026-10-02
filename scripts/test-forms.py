"""Run after npm run build. Tests local APIs using isolated storage and no external credentials."""
import uuid, copy, json, os, pathlib, subprocess, tempfile, time, urllib.request, urllib.error
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
training.update(dict(submissionId=str(uuid.uuid4()), workStatus='Employed', rightToWorkUK='Yes', highestQualification='Undergraduate Degree', ukWorkExperience='Yes', englishFirstLanguage='Yes', weeklyAvailability='Yes - can commit weekly time', birminghamAttendance='Yes', inPersonProjectAttendance='Yes', packageSelection='WOW Career Accelerator 6-Month Programme (£1,000)', paymentPreference='Pay in full £900 by 31 October 2026', pmQualifications=['None'], developmentNeeds=['Interview skills']))
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
        assert 'registration' not in result
        repeated=request('/api/registrations/submit',training)
        assert repeated['referenceNumber']==result['referenceNumber']
        register=pathlib.Path(folder)/'data/registrations.json'
        records=json.loads(register.read_text()); assert len(records)==1
        assert records[0]['status']=='APPLICATION_REVIEW_PENDING' and records[0]['submissionType']=='APPLICATION' and records[0]['cohortDate']=='14 November 2026'
        assert records[0]['paymentPreference']==training['paymentPreference']
        acknowledgement=records[0]['emailDelivery']['delegateWelcome']['previewHtml']
        assert '14 November 2026' in acknowledgement and 'No payment has been taken' in acknowledgement and 'October 2026 Intake' not in acknowledgement
        for package, preference in [
            ('WOW Career Accelerator 6-Month Programme (£1,000)', 'Pay in full £900 by 31 October 2026'),
            ('WOW Career Accelerator 6-Month Programme (£1,000)', 'Two instalments £500 by 31 October 2026 and £500 by 30 November 2026'),
            ('WOW Career Accelerator 6-Month Programme (£1,000)', '£50 registration deposit after acceptance'),
            ('WOW Career Accelerator 6-Month Programme (£1,000)', 'Discuss employer sponsorship / bespoke arrangement'),
            ('Career Accelerator + 1-to-1 Executive Mentorship (£1,250)', 'Executive mentorship package £1,250 by invoice'),
            ('Career Accelerator + 1-to-1 Executive Mentorship (£1,250)', 'Discuss instalments for executive mentorship'),
        ]:
            application=copy.deepcopy(training);application.update(submissionId=str(uuid.uuid4()), packageSelection=package, paymentPreference=preference)
            saved_result=request('/api/registrations/submit',application)
            saved_record=next(r for r in json.loads(register.read_text()) if r['referenceNumber']==saved_result['referenceNumber'])
            assert saved_record['paymentPreference']==preference and saved_record['packageSelection']==package and saved_record['status']=='APPLICATION_REVIEW_PENDING'
            assert 'url' not in saved_result and 'sessionId' not in saved_result
        passed.append('All six payment preferences retained for review with no checkout URL or session')
        for field,value in [('email','invalid'),('privacyAcknowledged',False),('declaration7',False),('townCity',''),('workStatus',''),('pmQualifications',[]),('developmentNeeds',[]),('submissionId','invalid')]:
            invalid=copy.deepcopy(training);invalid[field]=value;request('/api/registrations/submit',invalid,400)
        passed.append('Career Accelerator: valid application saved; invalid email, missing town, consent and declaration rejected')
        previous=register.read_text();register.write_text('corrupt')
        another=copy.deepcopy(training);another['submissionId']=str(uuid.uuid4())
        request('/api/registrations/submit',another,500)
        assert register.read_text()=='corrupt'
        register.write_text(previous)
        passed.append('Retries reuse the reference; server owns status/date; private metadata excluded; corrupt storage fails without overwriting')
        status=request('/api/stripe/status')
        assert status['configured'] is False and status['mode']=='invoice' and status['publishableKey'] is None
        with urllib.request.urlopen('http://127.0.0.1:3000/?page=pm-career-accelerator') as response:
            html=response.read().decode()
            assert '<title>Project Management Career Accelerator | Starts 14 November 2026 | WOW</title>' in html
            assert 'og:image' in html and 'invoice after acceptance' in html
        with urllib.request.urlopen('http://127.0.0.1:3000/WBD_Website_Share_Image_1200x630.png') as response:
            assert response.headers['Content-Type']=='image/png' and len(response.read())>1000
        passed.append('Campaign URL returns programme metadata and the approved social sharing image')
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
