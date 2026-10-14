import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import express from 'express';
import { installAssociateDirectorWriteApi } from '../server/associatePortalDirectorWriteApi.js';
import {savePortalStore,loadPortalStore} from '../server/associatePortalStore.js';

const folder=fs.mkdtempSync(path.join(os.tmpdir(),'wbd-director-actions-'));
const origin='https://www.wowbusinessanddigital.com';
const app=express();app.use(express.json());
installAssociateDirectorWriteApi(app,{
  dataDirectory:folder,expectedOrigin:origin,
  verifyDirectorSession:async req=>req.get('x-test-director')==='yes'?{id:'TEST-DIRECTOR',role:'director',authenticated:true}:null,
  verifyCsrf:async req=>req.get('x-test-csrf')==='valid',
});
const server=app.listen(0,'127.0.0.1');
try {
  savePortalStore(folder,{version:1,accounts:[{registrationId:'DEMO-1',email:'demo@example.org',eligibility:{status:'applicant',induction:'not-started',approvedCategories:[],clientAccreditation:'not-assessed'}}],invitations:[]});
  const address=server.address();
  if(!address||typeof address==='string')throw new Error('Missing test port');
  async function send(body:unknown,headers:Record<string,string>={}){
    const res=await fetch('http://127.0.0.1:'+address.port+'/api/associate-director/actions',{method:'POST',headers:{'Content-Type':'application/json',origin,'x-test-director':'yes','x-test-csrf':'valid',...headers},body:JSON.stringify(body)});
    return res.status;
  }
  const cmd={action:'membership',registrationId:'DEMO-1',status:'approved',reason:'Checked'};
  assert.equal(await send(cmd,{'x-test-director':'no'}),403);
  assert.equal(await send(cmd,{'x-test-csrf':'invalid'}),403);
  assert.equal(await send(cmd,{origin:'https://evil.example'}),403);
  assert.equal(loadPortalStore(folder).accounts[0].eligibility.status,'applicant');
  assert.equal(await send(cmd),200);
  assert.equal(loadPortalStore(folder).accounts[0].eligibility.status,'approved');
  assert.equal(await send({action:'induction',registrationId:'DEMO-1',reference:'IND-TEST',completedAt:'2026-10-14T12:00:00Z'}),200);
  assert.equal(loadPortalStore(folder).accounts[0].eligibility.induction,'passed');
  assert.equal(await send({action:'categories',registrationId:'DEMO-1',categories:['Digital']}),200);
  assert.deepEqual(loadPortalStore(folder).accounts[0].eligibility.approvedCategories,['Digital']);
  console.log('Director write API integration tests passed');
} finally {server.close();fs.rmSync(folder,{recursive:true,force:true});}
