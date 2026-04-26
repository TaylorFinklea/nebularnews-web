import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api, ApiError } from '$lib/api/client';
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

export const actions: Actions = {
  generatePush: async ({ request, locals, fetch }) => {
    const form = await request.formData();
    const user_id = (form.get('user_id') as string | null)?.trim();
    const edition_kind = (form.get('edition_kind') as string | null) ?? 'ondemand';
    const lookback_hours = parseInt((form.get('lookback_hours') as string | null) ?? '24', 10);

    if (!user_id) return fail(400, { error: 'user_id is required' });

    try {
      const result = await api.post<{
        id: string | null;
        bullet_count: number;
        candidate_count: number;
        pushed: boolean;
        duplicate: boolean;
      }>(
        `/admin/briefs/generate-for-user?push=true`,
        { user_id, edition_kind, lookback_hours: Number.isFinite(lookback_hours) ? lookback_hours : 24 },
        { sessionToken: locals.sessionToken, fetch },
      );
      return {
        generated: true,
        bullets: result.bullet_count,
        candidates: result.candidate_count,
        pushed: result.pushed,
        duplicate: result.duplicate,
      };
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Generation failed';
      return fail(400, { error: msg });
    }
  },
};
