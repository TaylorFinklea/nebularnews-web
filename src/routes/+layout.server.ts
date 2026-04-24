import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  // Surface the resolved user to every page so <NavBar /> can decide
  // whether to show "Sign in" vs the admin menu.
  return { user: locals.user };
};
