import type { AdmissionsAPI } from './model';
const base = '/api/admissions-dashboard';
async function request(path: string, method = 'GET', body?: unknown) {
 const response = await fetch(base + path, { method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' });
 if (!response.ok) { const message = await response.json().catch(() => ({})); const error = new Error(message.error || 'The request failed. Please try again.'); Object.assign(error, { status: response.status }); throw error; }
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
