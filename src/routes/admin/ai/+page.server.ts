import type { PageServerLoad } from './$types';
import { api } from '$lib/api/client';
import type { AdminAiStats, AdminToolStats } from '$lib/api/types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  const token = locals.sessionToken;
  const [ai, tools] = await Promise.all([
    api.get<AdminAiStats>('/admin/ai-stats', { sessionToken: token, fetch }),
    api.get<AdminToolStats>('/admin/tool-call-stats', { sessionToken: token, fetch }),
  ]);
  return { ai, tools };
};
