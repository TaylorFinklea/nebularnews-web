import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { setSessionCookie } from '$lib/auth/session';
import { api, ApiError } from '$lib/api/client';
import type { AdminMe } from '$lib/api/types';

const DEFAULT_API = 'https://api.nebularnews.com';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user?.isAdmin) throw redirect(303, '/admin');

  const apiBase = publicEnv.PUBLIC_API_BASE_URL ?? DEFAULT_API;
  const webBase = publicEnv.PUBLIC_WEB_BASE_URL ?? url.origin;
  return {
    apiBase,
    webBase,
    devBypassEnabled: privateEnv.DEV_BYPASS_ENABLED === 'true',
    error: url.searchParams.get('error'),
  };
};

export const actions: Actions = {
  /**
   * Dev-only action that accepts a paste-in session token (copied from the
   * `session` table in D1) so a developer can sign in as any admin before
   * Apple Sign In for Web is configured.
   */
  bypass: async ({ request, cookies, fetch }) => {
    if (privateEnv.DEV_BYPASS_ENABLED !== 'true') {
      return fail(403, { error: 'Dev bypass is disabled' });
    }

    const form = await request.formData();
    const token = String(form.get('token') ?? '').trim();
    if (!token) return fail(400, { error: 'Paste a session token' });

    try {
      const me = await api.get<AdminMe>('/admin/me', {
        sessionToken: token,
        fetch,
      });
      if (!me.is_admin) return fail(403, { error: 'Token is valid but not for an admin user' });
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Token rejected';
      return fail(401, { error: msg });
    }

    setSessionCookie(cookies, token);
    throw redirect(303, '/admin');
  },
};
