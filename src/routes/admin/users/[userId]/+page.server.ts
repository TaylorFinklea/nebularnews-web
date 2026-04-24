import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api, ApiError } from '$lib/api/client';
import type { AdminUser } from '$lib/api/types';

export const load: PageServerLoad = async ({ locals, fetch, params }) => {
  const users = await api.get<AdminUser[]>('/admin/users', {
    sessionToken: locals.sessionToken,
    fetch,
  });
  const user = users.find((u) => u.id === params.userId) ?? null;
  return { user };
};

export const actions: Actions = {
  setAdmin: async ({ request, locals, fetch, params }) => {
    const form = await request.formData();
    const is_admin = form.get('is_admin') === 'true';
    try {
      await api.post(`/admin/users/${params.userId}/role`, { is_admin }, {
        sessionToken: locals.sessionToken,
        fetch,
      });
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed';
      return fail(400, { error: msg });
    }
    return { ok: true, action: 'role' };
  },

  triggerBrief: async ({ request, locals, fetch, params }) => {
    const form = await request.formData();
    const kind = String(form.get('edition_kind') ?? 'morning');
    try {
      const result = await api.post<{ id: string | null; duplicate: boolean; bullet_count: number }>(
        '/admin/briefs/generate-for-user',
        { user_id: params.userId, edition_kind: kind },
        { sessionToken: locals.sessionToken, fetch },
      );
      return { ok: true, action: 'brief', brief: result };
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Brief generation failed';
      return fail(400, { error: msg });
    }
  },
};
