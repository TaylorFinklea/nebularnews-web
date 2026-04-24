import type { Handle } from '@sveltejs/kit';
import { clearSessionCookie, readSessionCookie, resolveSession } from '$lib/auth/session';

/**
 * Attach the resolved session to `event.locals` on every request. Downstream
 * `+layout.server.ts` and `+page.server.ts` files read `event.locals.user` /
 * `event.locals.sessionToken` to gate admin pages and build API calls.
 *
 * If the cookie is present but `/admin/me` says it's invalid (expired,
 * revoked, or non-admin), clear the cookie so the user gets a clean
 * sign-in experience on the next request.
 */
export const handle: Handle = async ({ event, resolve }) => {
  const token = readSessionCookie(event.cookies);
  const session = await resolveSession(token, event.fetch);

  if (token && !session) {
    clearSessionCookie(event.cookies);
  }

  event.locals.sessionToken = session?.sessionToken ?? null;
  event.locals.user = session?.user ?? null;

  return resolve(event);
};
