import type { PageServerLoad } from './$types';
import { api } from '$lib/api/client';
import type { AdminArticlesPage } from '$lib/api/types';

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
  const emptyOnly = url.searchParams.get('empty_only') === 'true';
  const hasError = url.searchParams.get('has_error') === 'true';
  const feedId = url.searchParams.get('feed_id') ?? undefined;

  const page = await api.get<AdminArticlesPage>('/admin/articles', {
    sessionToken: locals.sessionToken,
    fetch,
    query: {
      limit: 100,
      empty_only: emptyOnly ? 'true' : undefined,
      has_error: hasError ? 'true' : undefined,
      feed_id: feedId,
    },
  });

  return { page, filters: { emptyOnly, hasError, feedId } };
};
