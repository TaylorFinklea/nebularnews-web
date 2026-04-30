import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api, ApiError } from '$lib/api/client';
import type {
  AdminFallbackImagesPage,
  AdminFallbackGenerateResult,
  AdminFallbackCommitResult,
} from '$lib/api/types';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  const page = await api.get<AdminFallbackImagesPage>('/admin/fallback-images', {
    sessionToken: locals.sessionToken,
    fetch,
  });
  return { slots: page.slots };
};

export const actions: Actions = {
  generate: async ({ request, locals, fetch }) => {
    const form = await request.formData();
    const slot = (form.get('slot') as string | null)?.trim();
    const provider = (form.get('provider') as string | null)?.trim() as
      | 'openai'
      | 'imagen3'
      | null;
    const prompt = (form.get('prompt') as string | null)?.trim();

    if (!slot) return fail(400, { error: 'slot is required' });
    if (!provider || !['openai', 'imagen3'].includes(provider)) {
      return fail(400, { error: 'provider must be openai or imagen3' });
    }
    if (!prompt) return fail(400, { error: 'prompt is required' });
    if (prompt.length > 2000) return fail(400, { error: 'prompt must be 2000 characters or fewer' });

    try {
      const result = await api.post<AdminFallbackGenerateResult>(
        `/admin/fallback-images/${slot}/generate`,
        { provider, prompt },
        { sessionToken: locals.sessionToken, fetch },
      );
      return {
        action: 'generate' as const,
        slot: parseInt(slot, 10),
        previewId: result.previewId,
        previewUrl: result.previewUrl,
      };
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Generation failed';
      return fail(502, { error: msg });
    }
  },

  commit: async ({ request, locals, fetch }) => {
    const form = await request.formData();
    const slot = (form.get('slot') as string | null)?.trim();
    const previewId = (form.get('previewId') as string | null)?.trim();

    if (!slot) return fail(400, { error: 'slot is required' });
    if (!previewId) return fail(400, { error: 'previewId is required' });

    try {
      const result = await api.post<AdminFallbackCommitResult>(
        `/admin/fallback-images/${slot}/commit`,
        { previewId },
        { sessionToken: locals.sessionToken, fetch },
      );
      return {
        action: 'commit' as const,
        slot: result.slot,
        url: result.url,
      };
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Commit failed';
      return fail(502, { error: msg });
    }
  },

  discard: async ({ request, locals, fetch }) => {
    const form = await request.formData();
    const previewId = (form.get('previewId') as string | null)?.trim();

    if (!previewId) return fail(400, { error: 'previewId is required' });

    try {
      await api.del(`/admin/fallback-images/preview/${previewId}`, {
        sessionToken: locals.sessionToken,
        fetch,
      });
      return { action: 'discard' as const };
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Discard failed';
      return fail(502, { error: msg });
    }
  },
};
