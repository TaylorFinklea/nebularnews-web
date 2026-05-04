import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api, ApiError } from '$lib/api/client';
import type { AdminUser } from '$lib/api/types';

export type FeedEngagementRow = {
  feed_id: string;
  feed_title: string | null;
  reads: number;
  saves: number;
  dismisses: number;
  avg_depth_percent: number | null;
  avg_time_minutes: number | null;
};

export type RecentScoreRow = {
  article_id: string;
  article_title: string | null;
  score: number;
  label: string | null;
  scoring_method: string;
  weighted_average: number | null;
  evidence_json: string | null;
  created_at: number;
};

export type ScoringSnapshot = {
  feed_engagement: FeedEngagementRow[];
  recent_scores: RecentScoreRow[];
  score_totals: {
    last_24h: number;
    last_7d: number;
    last_score_at: number | null;
  };
};

export const load: PageServerLoad = async ({ locals, fetch, params }) => {
  const usersPromise = api.get<AdminUser[]>('/admin/users', {
    sessionToken: locals.sessionToken,
    fetch,
  });
  // Snapshot is best-effort — a failure shouldn't block the rest of the
  // user detail page from rendering, so swallow and surface as null.
  const snapshotPromise = api
    .get<ScoringSnapshot>(`/admin/users/${params.userId}/scoring-snapshot`, {
      sessionToken: locals.sessionToken,
      fetch,
    })
    .catch(() => null);

  const [users, snapshot] = await Promise.all([usersPromise, snapshotPromise]);
  const user = users.find((u) => u.id === params.userId) ?? null;
  return { user, snapshot };
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
