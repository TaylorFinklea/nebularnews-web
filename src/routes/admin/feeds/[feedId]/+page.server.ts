import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api, ApiError } from '$lib/api/client';
import type { AdminArticlesPage, AdminFeed } from '$lib/api/types';

export const load: PageServerLoad = async ({ locals, fetch, params }) => {
  const token = locals.sessionToken;
  const [feeds, articles] = await Promise.all([
    api.get<AdminFeed[]>('/admin/feeds', { sessionToken: token, fetch }),
    api.get<AdminArticlesPage>('/admin/articles', {
      sessionToken: token,
      fetch,
      query: { feed_id: params.feedId, limit: 20 },
    }),
  ]);

  const feed = feeds.find((f) => f.id === params.feedId);
  if (!feed) return { feed: null, articles: articles.articles };
  return { feed, articles: articles.articles };
};

export const actions: Actions = {
  update: async ({ request, locals, fetch, params }) => {
    const form = await request.formData();
    const scrape_mode = form.get('scrape_mode');
    const disabled = form.get('disabled') === 'on';

    try {
      await api.patch(`/admin/feeds/${params.feedId}`, { scrape_mode, disabled }, {
        sessionToken: locals.sessionToken,
        fetch,
      });
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Update failed';
      return fail(400, { error: msg });
    }
    return { ok: true };
  },

  repoll: async ({ locals, fetch, params }) => {
    try {
      await api.post(`/admin/feeds/${params.feedId}/repoll`, {}, {
        sessionToken: locals.sessionToken,
        fetch,
      });
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Repoll failed';
      return fail(400, { error: msg });
    }
    return { ok: true, action: 'repoll' };
  },
};
