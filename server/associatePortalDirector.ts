import type { AssociateAccount } from './associatePortalAccess.js';
import { approveInduction, issueInvitation } from './associatePortalAccess.js';
import { appendInvitation, upsertAccount, type PortalStore } from './associatePortalStore.js';
import type { AssociateStatus, AccreditationStatus } from './associatePortalRules.js';

/**
 * Director-command domain layer, not an HTTP API.
 * The future route layer MUST authenticate the director, verify CSRF and audit writes.
 * Never accept director identity from request body parameters.
 */
export type DirectorContext = { id: string; role: 'director'; authenticated: true };
function authorised(actor: DirectorContext) {
  if (!actor || actor.authenticated !== true || actor.role !== 'director' || !actor.id?.trim())
    throw new Error('Director authentication required');
}
function find(store: PortalStore, id: string): AssociateAccount {
  const account = store.accounts.find(a => a.registrationId === id);
  if (!account) throw new Error('Associate not found');
  return account;
}
function change(store: PortalStore, account: AssociateAccount): PortalStore {
  return upsertAccount(store, account);
}
export function setAssociateStatus(store: PortalStore, actor: DirectorContext, id: string, status: AssociateStatus, reason: string, at = Date.now()): PortalStore {
  authorised(actor);
  if (!['applicant','approved','suspended','revoked'].includes(status) || !reason.trim()) throw new Error('Status and reason required');
  const original = find(store, id);
  if (original.eligibility.status === 'revoked' && status !== 'revoked') throw new Error('Reinstatement requires separate identity verification');
  const updated = change(store, {...original,eligibility:{...original.eligibility,status}});
  if (status === 'suspended' || status === 'revoked') {
    return {...updated,invitations:updated.invitations.map(i=>i.registrationId===id && i.revokedAt===null && i.redeemedAt===null ? {...i,revokedAt:at} : i)};
  }
  return updated;
}
export function setWorkCategories(store: PortalStore, actor: DirectorContext, id: string, categories: string[]): PortalStore {
  authorised(actor);
  if (!Array.isArray(categories) || categories.length>30 || categories.some(x=>typeof x!=='string' || !x.trim() || x.length>100)) throw new Error('Invalid categories');
  const account=find(store,id);
  return change(store,{...account,eligibility:{...account.eligibility,approvedCategories:[...new Set(categories.map(x=>x.trim()))]}});
}
export function setClientAccreditation(store: PortalStore, actor: DirectorContext, id: string, status: AccreditationStatus, evidence: string): PortalStore {
  authorised(actor);
  if (!['not-assessed','approved','expired'].includes(status) || (status==='approved' && !evidence.trim())) throw new Error('Client accreditation requires evidence');
  const account=find(store,id);
  if (account.eligibility.status!=='approved' || account.eligibility.induction!=='passed') throw new Error('Membership and induction required');
  return change(store,{...account,eligibility:{...account.eligibility,clientAccreditation:status}});
}
export function recordInductionApproval(store: PortalStore, actor: DirectorContext, id: string, reference: string, completedAt: string): PortalStore {
  authorised(actor);
  return change(store,approveInduction(find(store,id),{assessor:actor.id,reference,completedAt}));
}
export function prepareAssociateInvitation(store: PortalStore, actor: DirectorContext, id: string, now = Date.now()) {
  authorised(actor);
  const {token,invitation}=issueInvitation(find(store,id),now);
  return {store:appendInvitation(store,invitation),token};
}
