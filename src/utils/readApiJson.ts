/**
 * Read JSON responses from the WOW API without exposing a reverse-proxy HTML
 * error page to customers. Do not automatically retry submissions: the server
 * may already have saved a record before the response was interrupted.
 */
export async function readApiJson<T>(response: Response, context: string): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  let data: unknown = null;
  if (/\bjson\b|\+json\b/i.test(contentType)) {
    try { data = await response.json(); } catch { /* An invalid/truncated response is not an acknowledgement. */ }
  }
  const error = data && typeof data === 'object' && typeof (data as { error?: unknown }).error === 'string'
    ? (data as { error: string }).error : '';
  if (!response.ok) {
    if (response.status === 413) {
      throw new Error('The website could not accept this upload or request because of its size. If attaching a CV, please email it to wowdigital@wowbusinessanddigital.com. Your submission has not been confirmed.');
    }
    if (response.status === 429) {
      throw new Error(error || 'Too many requests. Please wait and contact WOW before submitting again if you are unsure whether we received your details.');
    }
    throw new Error(error || `${context} (HTTP ${response.status}). We cannot confirm whether it was recorded. Please contact wowdigital@wowbusinessanddigital.com before trying again.`);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`${context} The website returned an unexpected response, so receipt cannot be confirmed. Please contact wowdigital@wowbusinessanddigital.com before submitting again.`);
  }
  return data as T;
}
