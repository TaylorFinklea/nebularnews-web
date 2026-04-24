import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user) throw redirect(303, '/sign-in');
  if (!locals.user.isAdmin) throw redirect(303, '/?error=not_admin');
  return { user: locals.user, sessionToken: locals.sessionToken };
};
