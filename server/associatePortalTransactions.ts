import fs from 'node:fs';
import path from 'node:path';
import { loadPortalStore, savePortalStore, type PortalStore } from './associatePortalStore.js';

/**
 * Exclusive synchronous transaction for the isolated prototype store.
 * The lock directory is created atomically. A leftover lock fails closed and
 * requires operator investigation; never silently delete one in production.
 * Not a substitute for a database in multi-server deployment.
 */
export function updatePortalStore<T>(
  folder: string,
  apply: (current: PortalStore) => { next: PortalStore; result: T },
): T {
  fs.mkdirSync(folder, { recursive: true, mode: 0o700 });
  const lock = path.join(folder, '.associate-portal.lock');
  try {
    fs.mkdirSync(lock, { mode: 0o700 });
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST')
      throw new Error('Associate register is locked; retry or ask technical support to inspect the lock');
    throw error;
  }
  try {
    const current = loadPortalStore(folder);
    const { next, result } = apply(current);
    if (next.version !== current.version) throw new Error('Unexpected store version');
    savePortalStore(folder, next);
    return result;
  } finally {
    fs.rmdirSync(lock);
  }
}
