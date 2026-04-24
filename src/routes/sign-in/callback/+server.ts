import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { setSessionCookie } from '$lib/auth/session';
import { api, ApiError } from '$lib/api/client';
import type { AdminMe } from '$lib/api/types';

/**
 * Endpoint that the Workers `/api/auth/web-handoff` redirect lands on. The
 * session token is carried in `?token=`. We validate it against `/admin/me`,
 * set the httpOnly cookie on this host, and send the user to /admin.
 *
 * On a bounce-back error (token missing or not-signed-in) we redirect back
 * to /sign-in with an error indicator so the user sees a message rather than
 * a blank admin page.
 */
export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
  const token = url.searchParams.get('token');
  const error = url.searchParams.get('error');

  if (error === 'not_signed_in') {
    throw redirect(303, '/sign-in?error=apple');
  }
  if (!token) {
    throw redirect(303, '/sign-in?error=apple');
  }

  try {
    const me = await api.get<AdminMe>('/admin/me', {
      sessionToken: token,
      fetch,
    });
    if (!me.is_admin) {
      throw redirect(303, '/?error=not_admin');
    }
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw redirect(303, '/sign-in?error=apple');
    }
    throw err;
  }

  setSessionCookie(cookies, token);
  throw redirect(303, '/admin');
};
