import type { PageServerLoad } from './$types';
import { api } from '$lib/api/client';
import type { AdminBriefsPage } from '$lib/api/types';

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
  const userFilter = url.searchParams.get('user_id') ?? undefined;
  const page = await api.get<AdminBriefsPage>('/admin/briefs', {
    sessionToken: locals.sessionToken,
    fetch,
    query: { limit: 50, user_id: userFilter },
  });
  return { briefs: page.briefs, nextBefore: page.next_before, userFilter };
};
