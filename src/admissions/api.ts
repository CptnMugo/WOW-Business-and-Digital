import type { AdmissionsAPI } from './model';
import { readApiJson } from '../utils/readApiJson';
const base = '/api/admissions-dashboard';
async function request(path: string, method = 'GET', body?: unknown) {
 const response = await fetch(base + path, { method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' });
 if (!response.ok) { let error: Error; try { await readApiJson(response, 'Staff dashboard request failed.'); error = new Error('Staff dashboard request failed.'); } catch (e) { error = e instanceof Error ? e : new Error('Staff dashboard request failed.'); } Object.assign(error, { status: response.status }); throw error; }
 if (response.headers.get('content-type')?.includes('text/html')) throw new Error('Staff dashboard API is returning a website page instead of data. Contact technical support to check the server deployment.');
 return response;
}
export const admissionsAPI: AdmissionsAPI = {
 session: async () => (await request('/session')).json(),
 login: async (email, password) => (await request('/login', 'POST', { email, password })).json(),
 logout: async () => { await request('/logout', 'POST', {}); },
 list: async () => (await (await request('/applications')).json()).applications,
 save: async (reference, review) => (await (await request('/applications/' + encodeURIComponent(reference), 'PATCH', review)).json()).review,
 resend: async (reference, kind) => (await request('/applications/' + encodeURIComponent(reference) + '/email', 'POST', { kind, confirmed: true })).json(),
 export: async () => (await request('/export')).blob(),
};
