import type { PageServerLoad } from './$types';
import { api } from '$lib/api/client';
import type { AdminArticlesPage } from '$lib/api/types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  // Recent articles across all feeds, favoring ones with populated content so
  // moderators can browse the "good" output and spot bad extractions.
  const page = await api.get<AdminArticlesPage>('/admin/articles', {
    sessionToken: locals.sessionToken,
    fetch,
    query: { limit: 50 },
  });
  return { articles: page.articles };
};
