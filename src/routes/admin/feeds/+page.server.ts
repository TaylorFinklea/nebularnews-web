import type { PageServerLoad } from './$types';
import { api } from '$lib/api/client';
import type { AdminFeed } from '$lib/api/types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  const feeds = await api.get<AdminFeed[]>('/admin/feeds', {
    sessionToken: locals.sessionToken,
    fetch,
  });
  return { feeds };
};
