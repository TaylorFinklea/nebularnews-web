import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // If already signed in as an admin, jump straight to the admin dashboard.
  if (locals.user?.isAdmin) throw redirect(303, '/admin');
  return {};
};
