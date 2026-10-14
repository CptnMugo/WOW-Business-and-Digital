import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {issueInvitation, type AssociateAccount} from '../server/associatePortalAccess.js';
import {loadPortalStore,savePortalStore,upsertAccount,appendInvitation} from '../server/associatePortalStore.js';
const folder=fs.mkdtempSync(path.join(os.tmpdir(),'wbd-associate-test-'));
try {
  const account:AssociateAccount={registrationId:'WBD-TEST-1',email:'PERSON@example.com',eligibility:{status:'approved',induction:'not-started',approvedCategories:['Digital'],clientAccreditation:'not-assessed'}};
  assert.equal(loadPortalStore(folder).accounts.length,0);
  const saved=upsertAccount(loadPortalStore(folder),account);
  savePortalStore(folder,saved);
  assert.equal(loadPortalStore(folder).accounts[0].email,'person@example.com');
  assert.equal(upsertAccount(saved,account).accounts.length,1);
  assert.throws(()=>upsertAccount(saved,{...account,registrationId:'WBD-TEST-2'}),/Email already/);
  assert.throws(()=>upsertAccount(saved,{...account,email:'different@example.com'}),/verified identity/);
  const invite=issueInvitation(saved.accounts[0],Date.parse('2026-10-14T12:00:00Z')).invitation;
  const withInvite=appendInvitation(saved,invite);
  assert.equal(withInvite.invitations.length,1);
  assert.equal(withInvite.invitations[0].tokenHash.length,64);
  assert.throws(()=>appendInvitation(saved,{...invite,registrationId:'missing'}));
  savePortalStore(folder,withInvite);
  assert.equal(loadPortalStore(folder).invitations.length,1);
  fs.writeFileSync(path.join(folder,'associate-portal.json'),'{"version":99}');
  assert.throws(()=>loadPortalStore(folder),/Invalid portal store/);
  console.log('Associate Portal private store checks passed');
} finally {fs.rmSync(folder,{recursive:true,force:true});}
