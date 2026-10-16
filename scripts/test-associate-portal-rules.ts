import assert from 'node:assert/strict';
import { assessBidEligibility, countWords, validateOpportunityDates, type AssociateEligibility, type Opportunity } from '../server/associatePortalRules.js';

const associate: AssociateEligibility = {
  status: 'approved', induction: 'passed',
  approvedCategories: ['Digital'], clientAccreditation: 'not-assessed',
};
const opportunity: Opportunity = {
  id: 'TEST-001', kind: 'internal', category: 'Digital', status: 'open',
  openAt: '2026-10-20T09:00:00Z', bidsCloseAt: '2026-10-23T09:00:00Z',
  startsAt: '2026-10-26T09:00:00Z', finishesAt: '2026-10-30T17:00:00Z',
};
const now = '2026-10-21T09:00:00Z';
const check = (a: AssociateEligibility, o: Opportunity, proposal = 'I will deliver the work', time = now) => assessBidEligibility(a, o, proposal, time);
assert.deepEqual(validateOpportunityDates(opportunity), []);
assert.deepEqual(check(associate, opportunity), {allowed:true});
assert.equal(check({...associate, status:'applicant'}, opportunity).allowed, false);
assert.equal(check({...associate, status:'revoked'}, opportunity).allowed, false);
assert.equal(check({...associate, induction:'in-progress'}, opportunity).allowed, false);
assert.equal(check({...associate, induction:'expired'}, opportunity).allowed, false);
assert.equal(check({...associate, approvedCategories:[]}, opportunity).allowed, false);
assert.equal(check(associate, {...opportunity,kind:'client'}).allowed, false);
assert.equal(check({...associate,clientAccreditation:'approved'}, {...opportunity,kind:'client'}).allowed, true);
assert.equal(check(associate, {...opportunity,status:'cancelled'}).allowed, false);
assert.equal(check(associate, opportunity, '', now).allowed, false);
assert.equal(check(associate, opportunity, 'word '.repeat(5001), now).allowed, false);
assert.equal(check(associate, opportunity, 'word '.repeat(5000), now).allowed, true);
assert.equal(check(associate, opportunity, 'valid', opportunity.bidsCloseAt).allowed, false);
assert.equal(check(associate, opportunity, 'valid', '2026-10-19T09:00:00Z').allowed, false);
assert.ok(validateOpportunityDates({...opportunity,bidsCloseAt:opportunity.finishesAt}).length > 0);
assert.equal(countWords('a  b\n c'),3);
console.log('Associate Portal domain eligibility checks passed');
