import type { PageServerLoad } from './$types';
import { api } from '$lib/api/client';
import type { AdminHealth, AdminScrapingStats } from '$lib/api/types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  const token = locals.sessionToken;
  const [health, scraping] = await Promise.all([
    api.get<AdminHealth>('/admin/health', { sessionToken: token, fetch }),
    api.get<AdminScrapingStats>('/admin/scraping-stats', { sessionToken: token, fetch }),
  ]);
  return { health, scraping };
};
