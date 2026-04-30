import type { PageServerLoad } from './$types';
import { api } from '$lib/api/client';
import type { AdminAuditPage } from '$lib/api/types';

const ALLOWED_METHODS = new Set(['POST', 'PATCH', 'DELETE']);

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
  const userId = url.searchParams.get('user_id') ?? undefined;
  const methodRaw = url.searchParams.get('method')?.toUpperCase();
  const method = methodRaw && ALLOWED_METHODS.has(methodRaw) ? methodRaw : undefined;
  const path = url.searchParams.get('path') ?? undefined;
  const beforeRaw = url.searchParams.get('before');
  const before = beforeRaw && /^\d+$/.test(beforeRaw) ? parseInt(beforeRaw, 10) : undefined;

  const page = await api.get<AdminAuditPage>('/admin/audit', {
    sessionToken: locals.sessionToken,
    fetch,
    query: { user_id: userId, method, path, before, limit: 100 },
  });

  return { page, filters: { userId, method, path } };
};
