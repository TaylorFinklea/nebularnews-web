import type { Cookies } from '@sveltejs/kit';
import { api, ApiError } from '$lib/api/client';
import type { AdminMe } from '$lib/api/types';

export const SESSION_COOKIE = 'nn_session';

export interface ResolvedSession {
  sessionToken: string;
  user: { userId: string; isAdmin: boolean };
}

export function readSessionCookie(cookies: Cookies): string | null {
  return cookies.get(SESSION_COOKIE) ?? null;
}

export function setSessionCookie(cookies: Cookies, token: string): void {
  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days, matches better-auth's session TTL
  });
}

export function clearSessionCookie(cookies: Cookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

/**
 * Validate a bearer token against `/admin/me` on the Workers API. Returns
 * null if the token is absent, invalid, or belongs to a non-admin user.
 *
 * `/admin/me` is gated by the is_admin middleware, so a 403 means "valid
 * session, not an admin" — we treat that as not-authenticated for the
 * admin surface and let the caller redirect to the landing page.
 */
export async function resolveSession(
  sessionToken: string | null,
  fetchFn: typeof fetch = fetch,
): Promise<ResolvedSession | null> {
  if (!sessionToken) return null;
  try {
    const me = await api.get<AdminMe>('/admin/me', {
      sessionToken,
      fetch: fetchFn,
    });
    return {
      sessionToken,
      user: { userId: me.user_id ?? '', isAdmin: me.is_admin === true },
    };
  } catch (err: unknown) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      return null;
    }
    // For transient errors (5xx, network), treat as no session rather than
    // propagating — the layout load will redirect to sign-in, better than
    // showing a broken admin page.
    return null;
  }
}
