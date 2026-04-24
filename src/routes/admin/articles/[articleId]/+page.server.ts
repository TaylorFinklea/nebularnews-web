import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api, ApiError } from '$lib/api/client';
import type { AdminArticleDetail, AdminArticlesPage } from '$lib/api/types';

export const load: PageServerLoad = async ({ locals, fetch, params }) => {
  // There's no GET /admin/articles/:id yet, so fall back to pulling the
  // paginated list with a 1-item filter on id — not ideal but avoids adding
  // another endpoint for now.
  const page = await api.get<AdminArticlesPage>('/admin/articles', {
    sessionToken: locals.sessionToken,
    fetch,
    query: { limit: 200 },
  });
  const meta = page.articles.find((a) => a.id === params.articleId) ?? null;
  return { articleId: params.articleId, meta };
};

export const actions: Actions = {
  rescrape: async ({ locals, fetch, params }) => {
    try {
      const updated = await api.post<AdminArticleDetail>(
        `/admin/articles/${params.articleId}/rescrape`,
        {},
        { sessionToken: locals.sessionToken, fetch },
      );
      return {
        ok: true,
        updated: {
          word_count: updated.word_count,
          extraction_method: updated.extraction_method,
          extraction_quality: updated.extraction_quality,
        },
      };
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Rescrape failed';
      return fail(400, { error: msg });
    }
  },
};
