import type { PageServerLoad } from './$types';
import { api } from '$lib/api/client';
import type { AdminAiStats, AdminHealth, AdminScrapingStats } from '$lib/api/types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  const token = locals.sessionToken;

  // Pull everything the dashboard tiles need in parallel. If any one of these
  // fails (transient network, stale token) we still want to render the
  // surface with partial data rather than a full error page.
  const [healthResult, scrapingResult, aiResult] = await Promise.allSettled([
    api.get<AdminHealth>('/admin/health', { sessionToken: token, fetch }),
    api.get<AdminScrapingStats>('/admin/scraping-stats', { sessionToken: token, fetch }),
    api.get<AdminAiStats>('/admin/ai-stats', { sessionToken: token, fetch }),
  ]);

  return {
    health: healthResult.status === 'fulfilled' ? healthResult.value : null,
    scraping: scrapingResult.status === 'fulfilled' ? scrapingResult.value : null,
    ai: aiResult.status === 'fulfilled' ? aiResult.value : null,
  };
};
