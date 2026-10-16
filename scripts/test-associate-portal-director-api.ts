import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {associateSummaries} from '../server/associatePortalDirectorApi.js';
import {savePortalStore} from '../server/associatePortalStore.js';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'wbd-director-api-'));
try {
  assert.deepEqual(associateSummaries(dir),[]);
  savePortalStore(dir,{version:1,accounts:[{
    registrationId:'TEST-01',email:'fictional@example.org',
    eligibility:{status:'approved',induction:'passed',approvedCategories:['Digital'],clientAccreditation:'not-assessed'},
    inductionEvidence:{assessor:'internal',completedAt:'2026-10-14T10:00:00Z',reference:'IND-DEMO-1'},
  }],invitations:[{registrationId:'TEST-01',email:'fictional@example.org',tokenHash:'a'.repeat(64),expiresAt:1,redeemedAt:null,revokedAt:null}]});
  const result=associateSummaries(dir);
  assert.equal(result.length,1);
  assert.equal(result[0].inductionStatus,'passed');
  assert.equal('inductionEvidence' in result[0],false);
  assert.equal('tokenHash' in result[0],false);
  assert.equal('invitations' in result[0],false);
  assert.equal(result[0].categories[0],'Digital');
  console.log('Director read-model checks passed');
} finally { fs.rmSync(dir,{recursive:true,force:true}); }
