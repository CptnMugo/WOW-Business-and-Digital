import 'dotenv/config';
import { readAccess, approveAccess, revokeAccess } from '../server/workspaceAccess';
const [action,email,days] = process.argv.slice(2);
if(action==='list') console.log(JSON.stringify(readAccess().members.map(({inviteHash,...m})=>m),null,2));
else if(action==='approve' && email) {
  const duration=days ? Number(days) : 210;
  if(!Number.isInteger(duration)||duration<1||duration>365) throw new Error('Access days must be 1–365');
  console.log('Share this one-use code privately with the approved applicant. It expires in 24 hours:\n'+approveAccess(email,duration));
} else if(action==='revoke' && email) { revokeAccess(email); console.log('Access revoked.'); }
else throw new Error('Usage: node --import tsx scripts/workspace-access.ts list | approve EMAIL [DAYS] | revoke EMAIL');
