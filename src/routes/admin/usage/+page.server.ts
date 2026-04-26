import type { PageServerLoad } from './$types';
import { api } from '$lib/api/client';
import type { AdminUsageResponse } from '$lib/api/types';

const ALLOWED_DAYS = new Set([7, 30, 90]);

export const load: PageServerLoad = async ({ locals, fetch, url }) => {
  const daysParam = parseInt(url.searchParams.get('days') ?? '30', 10);
  const days = ALLOWED_DAYS.has(daysParam) ? daysParam : 30;

  const usage = await api.get<AdminUsageResponse>('/admin/usage', {
    sessionToken: locals.sessionToken,
    fetch,
    query: { days },
  });

  return { usage, days };
};
