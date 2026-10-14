import type { Express, Request, Response, NextFunction } from 'express';
import { updatePortalStore } from './associatePortalTransactions.js';
import { setAssociateStatus, setWorkCategories, recordInductionApproval, type DirectorContext } from './associatePortalDirector.js';

/**
 * NOT mounted in server.ts. Secure integration boundary for the Director's
 * initial write actions. Caller MUST supply a verified, role-authorised
 * server session and a configured HTTPS origin. No arbitrary identity headers.
 * Operations are exclusively transactional and do not send emails.
 */
export type DirectorSessionVerifier = (request: Request) => Promise<DirectorContext | null>;
export type DirectorWriteDependencies = {
  dataDirectory: string;
  expectedOrigin: string;
  verifyDirectorSession: DirectorSessionVerifier;
  verifyCsrf: (request: Request, actor: DirectorContext) => Promise<boolean>;
};
type Action =
 | { action: 'membership'; registrationId: string; status: 'applicant'|'approved'|'suspended'|'revoked'; reason: string }
 | { action: 'categories'; registrationId: string; categories: string[] }
 | { action: 'induction'; registrationId: string; reference: string; completedAt: string };
const isObject = (v: unknown): v is Record<string,unknown> => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
function parseAction(body: unknown): Action {
  if (!isObject(body) || typeof body.registrationId !== 'string' || !body.registrationId.trim() || body.registrationId.length > 150) throw new Error('Invalid Associate reference');
  if (body.action === 'membership' && typeof body.reason === 'string' && body.reason.trim() && body.reason.length <= 2000 && ['applicant','approved','suspended','revoked'].includes(String(body.status)))
    return {action:'membership', registrationId:body.registrationId, reason:body.reason, status:body.status as Action & any};
  if (body.action === 'categories' && Array.isArray(body.categories) && body.categories.length <= 30 && body.categories.every(x=>typeof x==='string' && x.length<=100))
    return {action:'categories',registrationId:body.registrationId,categories:body.categories};
  if (body.action === 'induction' && typeof body.reference==='string' && body.reference.trim() && body.reference.length<=200 && typeof body.completedAt==='string' && body.completedAt.length<=50)
    return {action:'induction',registrationId:body.registrationId,reference:body.reference,completedAt:body.completedAt};
  throw new Error('Invalid Director action');
}
export function installAssociateDirectorWriteApi(app: Express, deps: DirectorWriteDependencies) {
  // Explicit opt-in: never mounted until a security review and integration tests pass.
  const origin = new URL(deps.expectedOrigin).origin;
  const base = '/api/associate-director';
  const guard = async (req: Request,res: Response,next: NextFunction) => {
    res.set({'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'});
    if (req.get('origin') !== origin || !req.is('application/json')) {res.status(403).json({error:'Request origin denied'});return;}
    try {
      const actor = await deps.verifyDirectorSession(req);
      if (!actor || actor.authenticated!==true || actor.role!=='director' || !actor.id?.trim()) {res.status(403).json({error:'Director access required'});return;}
      if (!await deps.verifyCsrf(req,actor)) {res.status(403).json({error:'CSRF check failed'});return;}
      res.locals.director=actor;
      next();
    } catch {res.status(503).json({error:'Secure Director verification unavailable'});}
  };
  app.post(base+'/actions',guard,(req,res)=>{
    let action:Action;
    try {action=parseAction(req.body);} catch {res.status(400).json({error:'Invalid action'});return;}
    try {
      const actor=res.locals.director as DirectorContext;
      const result=updatePortalStore(deps.dataDirectory,current=>{
        let next;
        switch(action.action) {
          case 'membership': next=setAssociateStatus(current,actor,action.registrationId,action.status,action.reason);break;
          case 'categories': next=setWorkCategories(current,actor,action.registrationId,action.categories);break;
          case 'induction': next=recordInductionApproval(current,actor,action.registrationId,action.reference,action.completedAt);break;
        }
        return {next,result:{registrationId:action.registrationId,action:action.action}};
      });
      res.json({success:true,...result});
    } catch (e) {
      const message=e instanceof Error?e.message:'Unable to update Associate';
      res.status(/locked/.test(message)?409:/not found/.test(message)?404:400).json({error:message});
    }
  });
}
