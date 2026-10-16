import type { Express, Request, Response, NextFunction } from 'express';
import { loadPortalStore } from './associatePortalStore.js';
import type { DirectorContext } from './associatePortalDirector.js';

/**
 * Staging-only integration adapter. Not imported/mounted by server.ts.
 * Authentication MUST be supplied by verified backend session, never a request header,
 * URL parameter or request body. Production integration needs CSRF, audit and review.
 */
export type VerifiedDirector = (req: Request) => Promise<DirectorContext | null>;
export type PortalReadDependencies = {
  dataDirectory: string;
  verifiedDirector: VerifiedDirector;
};
export type AssociateSummary = {
  registrationId: string;
  email: string;
  status: string;
  inductionStatus: string;
  categories: string[];
  clientAccreditation: string;
};
export function associateSummaries(directory: string): AssociateSummary[] {
  return loadPortalStore(directory).accounts.map(a => ({
    registrationId: a.registrationId,
    email: a.email,
    status: a.eligibility.status,
    inductionStatus: a.eligibility.induction,
    categories: [...a.eligibility.approvedCategories],
    clientAccreditation: a.eligibility.clientAccreditation,
  }));
}
/** Must be mounted only after server-session authentication has been implemented and tested. */
export function installAssociateDirectorReadApi(app: Express, dependencies: PortalReadDependencies): void {
  const base = '/api/associate-director';
  app.use(base, (_req, res, next) => {
    res.set('Cache-Control','no-store').set('X-Robots-Tag','noindex, nofollow');
    next();
  });
  const guard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const director = await dependencies.verifiedDirector(req);
      if (!director || director.authenticated !== true || director.role !== 'director' || !director.id.trim()) {
        res.status(403).json({error:'Authorised Director access required.'});
        return;
      }
      next();
    } catch {
      res.status(503).json({error:'Director verification is temporarily unavailable.'});
    }
  };
  app.get(base+'/associates',guard,(_req,res) => {
    try { res.json({associates:associateSummaries(dependencies.dataDirectory)}); }
    catch { res.status(503).json({error:'Associate register unavailable.'}); }
  });
}
