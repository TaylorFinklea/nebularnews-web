import type { PageServerLoad } from './$types';
import { api } from '$lib/api/client';
import type { AdminUser } from '$lib/api/types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  const users = await api.get<AdminUser[]>('/admin/users', {
    sessionToken: locals.sessionToken,
    fetch,
  });
  return { users };
};
