import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import type { AssociateEligibility } from './associatePortalRules.js';

// Domain logic only: no public routes, persistence, sign-in or emails.
export type AssociateAccount = {
  registrationId: string;
  email: string;
  eligibility: AssociateEligibility;
  inductionEvidence?: { assessor: string; completedAt: string; reference: string };
};
export type Invitation = {
  registrationId: string;
  email: string;
  tokenHash: string;
  expiresAt: number;
  redeemedAt: number | null;
  revokedAt: number | null;
};
const normalized = (value: string) => value.trim().toLowerCase();
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
export function issueInvitation(account: AssociateAccount, now = Date.now()) {
  if (account.eligibility.status !== 'approved') throw new Error('Associate must be approved first');
  if (!account.registrationId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized(account.email))) throw new Error('Invalid registration');
  const token = randomBytes(32).toString('hex');
  const invitation: Invitation = { registrationId: account.registrationId, email: normalized(account.email), tokenHash: hash(token), expiresAt: now + 30 * 60_000, redeemedAt: null, revokedAt: null };
  return {token, invitation};
}
export function canRedeem(invite: Invitation, token: string, account: AssociateAccount, now = Date.now()) {
  if (account.eligibility.status !== 'approved' || invite.redeemedAt !== null || invite.revokedAt !== null || now >= invite.expiresAt) return false;
  if (invite.registrationId !== account.registrationId || invite.email !== normalized(account.email) || !/^[a-f0-9]{64}$/.test(token)) return false;
  const actual = Buffer.from(hash(token), 'hex'), expected = Buffer.from(invite.tokenHash, 'hex');
  return expected.length === 32 && timingSafeEqual(actual, expected);
}
export function approveInduction(account: AssociateAccount, evidence: { assessor: string; completedAt: string; reference: string }): AssociateAccount {
  if (account.eligibility.status !== 'approved' || !evidence.assessor.trim() || !evidence.reference.trim() || !Number.isFinite(Date.parse(evidence.completedAt))) throw new Error('Valid approval evidence required');
  return {...account, eligibility: {...account.eligibility, induction: 'passed'}, inductionEvidence: evidence};
}
