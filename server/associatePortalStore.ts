import fs from 'node:fs';
import path from 'node:path';
import type { AssociateAccount, Invitation } from './associatePortalAccess.js';

/**
 * Private, standalone prototype store. NOT mounted to Express or wired to production.
 * Keep it outside public/static directories. Never commit generated data files.
 */
export type PortalStore = { version: 1; accounts: AssociateAccount[]; invitations: Invitation[] };
const fresh = (): PortalStore => ({ version: 1, accounts: [], invitations: [] });
export function loadPortalStore(folder: string): PortalStore {
  const filename = path.join(folder, 'associate-portal.json');
  if (!fs.existsSync(filename)) return fresh();
  const data: unknown = JSON.parse(fs.readFileSync(filename, 'utf8'));
  if (!data || typeof data !== 'object' || (data as PortalStore).version !== 1 ||
      !Array.isArray((data as PortalStore).accounts) || !Array.isArray((data as PortalStore).invitations))
    throw new Error('Invalid portal store: manual recovery required');
  return data as PortalStore;
}
export function savePortalStore(folder: string, store: PortalStore): void {
  if (store.version !== 1 || !Array.isArray(store.accounts) || !Array.isArray(store.invitations))
    throw new Error('Invalid portal store');
  const ids = store.accounts.map(a => a.registrationId);
  const emails = store.accounts.map(a => a.email.trim().toLowerCase());
  if (ids.some(x => !x) || new Set(ids).size !== ids.length || new Set(emails).size !== emails.length)
    throw new Error('Duplicate or missing Associate identity');
  fs.mkdirSync(folder, { recursive: true, mode: 0o700 });
  const dest = path.join(folder, 'associate-portal.json');
  // Do not silently replace corrupted data: always load and recover first.
  const tmp = path.join(folder, '.associate-portal-' + process.pid + '-' + Date.now() + '.tmp');
  try {
    fs.writeFileSync(tmp, JSON.stringify(store, null, 2), {mode:0o600,flag:'wx'});
    fs.renameSync(tmp,dest);
  } finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
}
export function upsertAccount(store: PortalStore, account: AssociateAccount): PortalStore {
  if (!account.registrationId || !account.email.trim()) throw new Error('Registration ID and email required');
  const normalized = account.email.trim().toLowerCase();
  if (store.accounts.some(a => a.registrationId !== account.registrationId && a.email.trim().toLowerCase() === normalized))
    throw new Error('Email already linked to another registration');
  const existing = store.accounts.find(a=>a.registrationId===account.registrationId);
  if (existing && existing.email.trim().toLowerCase() !== normalized)
    throw new Error('Changing registered email requires separately verified identity');
  return {...store, accounts:[...store.accounts.filter(a=>a.registrationId!==account.registrationId), {...account,email:normalized}]};
}
export function appendInvitation(store: PortalStore, invitation: Invitation): PortalStore {
  if (!store.accounts.some(a=>a.registrationId===invitation.registrationId && a.email===invitation.email))
    throw new Error('Invitation must refer to existing Associate');
  // Supersede existing unused invitations to prevent multiple live invite links.
  return {...store,invitations:[
    ...store.invitations.map(i=>i.registrationId===invitation.registrationId && i.redeemedAt===null && i.revokedAt===null
      ? {...i,revokedAt:Date.now()} : i),
    invitation,
  ]};
}
