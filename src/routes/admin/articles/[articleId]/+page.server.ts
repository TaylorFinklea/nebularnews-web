import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api, ApiError } from '$lib/api/client';
import type { AdminArticleDetail } from '$lib/api/types';

export const load: PageServerLoad = async ({ locals, fetch, params }) => {
  try {
    const article = await api.get<AdminArticleDetail>(
      `/admin/articles/${params.articleId}`,
      { sessionToken: locals.sessionToken, fetch },
    );
    return { article };
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status === 404) {
      throw error(404, 'Article not found');
    }
    throw err;
  }
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
  unquarantine: async ({ locals, fetch, params }) => {
    try {
      await api.post<AdminArticleDetail>(
        `/admin/articles/${params.articleId}/unquarantine`,
        {},
        { sessionToken: locals.sessionToken, fetch },
      );
      return { unquarantined: true };
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Unquarantine failed';
      return fail(400, { error: msg });
    }
  },
};
