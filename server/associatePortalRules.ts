/**
 * Pure domain rules for the WBD Associate Portal.
 * No routes, storage or public access are created by this module.
 * All decisions must also be checked on the server at bid submission.
 */
export type AssignmentKind = 'internal' | 'client';
export type AssociateStatus = 'applicant' | 'approved' | 'suspended' | 'revoked';
export type InductionStatus = 'not-started' | 'in-progress' | 'passed' | 'expired';
export type AccreditationStatus = 'not-assessed' | 'approved' | 'expired';
export type AssociateEligibility = {
  status: AssociateStatus;
  induction: InductionStatus;
  approvedCategories: string[];
  clientAccreditation: AccreditationStatus;
};
export type Opportunity = {
  id: string;
  kind: AssignmentKind;
  category: string;
  openAt: string;
  bidsCloseAt: string;
  startsAt: string;
  finishesAt: string;
  status: 'draft' | 'open' | 'closed' | 'awarded' | 'cancelled';
};
export type BidDecision = { allowed: true } | { allowed: false; reason: string };
const validInstant = (value: string) => /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(value) && Number.isFinite(Date.parse(value));

export function validateOpportunityDates(o: Opportunity): string[] {
  const errors: string[] = [];
  const dates = [o.openAt, o.bidsCloseAt, o.startsAt, o.finishesAt];
  if (!dates.every(validInstant)) return ['All opportunity dates must be valid UTC ISO timestamps'];
  const [opens, closes, starts, finishes] = dates.map(v => Date.parse(v));
  if (!(opens < closes)) errors.push('Bid deadline must be after opening');
  if (!(closes <= starts)) errors.push('Bids must close no later than the start time');
  if (!(starts < finishes)) errors.push('Finish must be after start');
  return errors;
}
export function countWords(value: string): number {
  return value.trim() ? value.trim().split(/\s+/u).length : 0;
}
export function assessBidEligibility(
  associate: AssociateEligibility,
  opportunity: Opportunity,
  proposal: string,
  now: string,
): BidDecision {
  if (associate.status !== 'approved') return {allowed:false,reason:'Associate membership is not approved'};
  if (associate.induction !== 'passed') return {allowed:false,reason:'WBD induction must be completed before bidding'};
  if (!associate.approvedCategories.includes(opportunity.category)) return {allowed:false,reason:'Not approved for this work category'};
  if (opportunity.kind === 'client' && associate.clientAccreditation !== 'approved') return {allowed:false,reason:'Client work requires additional competency approval'};
  if (opportunity.status !== 'open') return {allowed:false,reason:'Opportunity is not open'};
  if (validateOpportunityDates(opportunity).length) return {allowed:false,reason:'Opportunity dates are invalid'};
  if (!validInstant(now)) return {allowed:false,reason:'Current time must be verified'};
  if (Date.parse(now) < Date.parse(opportunity.openAt) || Date.parse(now) >= Date.parse(opportunity.bidsCloseAt)) return {allowed:false,reason:'Bidding window is closed'};
  const words = countWords(proposal);
  if (words < 1 || words > 5000) return {allowed:false,reason:'Proposal must contain 1 to 5,000 words'};
  return {allowed:true};
}
