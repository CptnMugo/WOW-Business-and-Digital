import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { updatePortalStore } from '../server/associatePortalTransactions.js';
import { loadPortalStore, appendInvitation } from '../server/associatePortalStore.js';
import type { Invitation } from '../server/associatePortalAccess.js';
const dir = fs.mkdtempSync(path.join(os.tmpdir(),'wbd-associate-lock-'));
const now = Date.parse('2026-10-14T12:00:00Z');
try {
  const result=updatePortalStore(dir,current=>({next:{...current,accounts:[{registrationId:'DEMO',email:'demo@example.org',eligibility:{status:'approved',induction:'not-started',approvedCategories:[],clientAccreditation:'not-assessed'}}]},result:'committed'}));
  assert.equal(result,'committed');
  assert.equal(loadPortalStore(dir).accounts.length,1);
  assert.throws(()=>updatePortalStore(dir,()=>{throw new Error('interrupted');}),/interrupted/);
  assert.equal(fs.existsSync(path.join(dir,'.associate-portal.lock')),false);
  assert.equal(loadPortalStore(dir).accounts.length,1);
  fs.mkdirSync(path.join(dir,'.associate-portal.lock'));
  assert.throws(()=>updatePortalStore(dir,current=>({next:current,result:null})),/locked/);
  fs.rmdirSync(path.join(dir,'.associate-portal.lock'));
  const old:Invitation={registrationId:'DEMO',email:'demo@example.org',tokenHash:'a'.repeat(64),expiresAt:now+3600000,redeemedAt:null,revokedAt:null};
  const next:Invitation={...old,tokenHash:'b'.repeat(64)};
  const stored=appendInvitation({...loadPortalStore(dir),invitations:[old]},next,now);
  assert.equal(stored.invitations[0].revokedAt,now);
  assert.equal(stored.invitations[1].revokedAt,null);
  console.log('Associate store transaction and clock tests passed');
} finally {fs.rmSync(dir,{recursive:true,force:true});}
