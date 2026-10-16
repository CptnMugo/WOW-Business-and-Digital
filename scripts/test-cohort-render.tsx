import React from 'react';
import assert from 'node:assert/strict';
import {renderToStaticMarkup as render} from 'react-dom/server';
import {ProjectManagementCareerAcceleratorSection} from '../src/components/ProjectManagementCareerAcceleratorSection';
import {ProjectManagementRegistrationPage} from '../src/components/ProjectManagementRegistrationPage';
import {CareerExplore} from '../src/components/CareerExplore';
import {ProgrammePolicies} from '../src/components/ProgrammePolicies';
import {PaymentsSection} from '../src/components/PaymentsSection';
import {AssociateRegistration} from '../src/components/AssociateRegistration';
import {Footer} from '../src/components/Footer';
import {WebsiteLinks} from '../src/components/WebsiteLinks';
const noOp=()=>{};
for(const node of [<ProjectManagementCareerAcceleratorSection setActiveTab={noOp}/>,<ProjectManagementRegistrationPage setActiveTab={noOp}/>,<CareerExplore/>,<CareerExplore corporate/>]){
 const html=render(node);assert.match(html,/January 2027/);assert.match(html,/Applications closed|applications are closed|— Closed/);assert.match(html,/<s>November/);
 assert.doesNotMatch(html,/Apply for the November cohort|14 November 2026|31 October 2026|Friday 16 October|Thursday 8/);
 assert.match(html,/No payment/);
}
const taster=render(<CareerExplore/>);assert.match(taster,/Saturday 28 November 2026/);assert.match(taster,/GMT/);assert.doesNotMatch(taster,/<option value="call">/);assert.match(taster,/Calendar booking is not yet connected/);
const terms=render(<ProgrammePolicies privacy={false}/>);assert.match(terms,/January 2027/);assert.doesNotMatch(terms,/31 October|30 November|31 December/);
const payments=render(<PaymentsSection setActiveTab={noOp}/>);assert.match(payments,/Existing accepted applicants should follow their agreed payment instructions/);assert.match(payments,/disabled=""/);assert.doesNotMatch(payments,/<button[^>]*>Apply again/i);
assert.match(render(<AssociateRegistration/>),/page=associate-portal/);assert.match(render(<Footer setActiveTab={noOp}/>),/Associate sign in/);assert.match(render(<WebsiteLinks/>),/Associate portal sign in/);
console.log('PASS cohort and navigation rendering: November crossed out and closed; January open; GMT taster; no expired sessions or January payment dates; existing payment entry retained; Associate entry links present. Static rendering only, not browser interaction.');
