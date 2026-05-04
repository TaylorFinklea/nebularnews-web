<script lang="ts">
  import type { ActionData, PageData } from './$types';
  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<section class="mx-auto max-w-3xl">
  <a href="/admin/users" class="text-sm text-[color:var(--color-muted)] underline">← All users</a>

  {#if !data.user}
    <p class="mt-4 rounded-md border border-[color:var(--color-danger-border)] bg-[color:var(--color-danger-soft)] p-3 text-sm text-[color:var(--color-danger)]">User not found.</p>
  {:else}
    <h1 class="mt-3 text-2xl font-semibold">{data.user.name ?? data.user.email ?? data.user.id}</h1>
    <div class="text-xs text-[color:var(--color-muted)]">{data.user.email ?? '—'}</div>

    <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
        <h2 class="text-sm font-semibold">Profile</h2>
        <dl class="mt-3 grid grid-cols-2 gap-2 text-xs">
          <dt class="text-[color:var(--color-muted)]">Tier</dt><dd>{data.user.tier ?? 'free'}</dd>
          <dt class="text-[color:var(--color-muted)]">Feeds</dt><dd>{data.user.feed_count}</dd>
          <dt class="text-[color:var(--color-muted)]">Articles read</dt><dd>{data.user.articles_read}</dd>
          <dt class="text-[color:var(--color-muted)]">Tokens (7d)</dt><dd>{data.user.tokens_7d.toLocaleString()}</dd>
          <dt class="text-[color:var(--color-muted)]">Last active</dt>
          <dd>{data.user.last_active ? new Date(data.user.last_active).toLocaleString() : '—'}</dd>
          <dt class="text-[color:var(--color-muted)]">Admin</dt><dd>{data.user.is_admin ? 'yes' : 'no'}</dd>
        </dl>
      </div>

      <div class="flex flex-col gap-4">
        <div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
          <h2 class="text-sm font-semibold">Admin role</h2>
          <form method="POST" action="?/setAdmin" class="mt-3 flex gap-2">
            <input type="hidden" name="is_admin" value={data.user.is_admin ? 'false' : 'true'} />
            <button
              type="submit"
              class="rounded-md border border-[color:var(--color-border)] px-3 py-1.5 text-sm transition hover:bg-[color:var(--color-bg)]"
            >
              {data.user.is_admin ? 'Revoke admin' : 'Grant admin'}
            </button>
          </form>
        </div>

        <div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
          <h2 class="text-sm font-semibold">Trigger brief</h2>
          <p class="mt-1 text-xs text-[color:var(--color-muted)]">
            Generates a brief immediately for this user, bypassing the
            timezone cron check. Sends a push if the user has a device token.
          </p>
          <form method="POST" action="?/triggerBrief" class="mt-3 flex gap-2">
            <select
              name="edition_kind"
              class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-2 py-1.5 text-sm"
            >
              <option value="morning">morning</option>
              <option value="evening">evening</option>
              <option value="ondemand">ondemand</option>
            </select>
            <button
              type="submit"
              class="rounded-md bg-[color:var(--color-accent)] px-3 py-1.5 text-sm font-medium text-white"
            >
              Generate
            </button>
          </form>
        </div>

        {#if form?.error}
          <p class="rounded-md border border-[color:var(--color-danger-border)] bg-[color:var(--color-danger-soft)] p-3 text-xs text-[color:var(--color-danger)]">{form.error}</p>
        {:else if form?.ok && form.action === 'role'}
          <p class="text-xs text-[color:var(--color-success)]">Role updated.</p>
        {:else if form?.ok && form.action === 'brief'}
          <p class="text-xs text-[color:var(--color-success)]">
            Brief generated ({form.brief?.bullet_count ?? 0} bullets){form.brief?.duplicate ? ' — duplicate' : ''}.
          </p>
        {/if}
      </div>
    </div>

    {#if data.snapshot}
      {@const snap = data.snapshot}
      <div class="mt-6 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
        <div class="flex items-baseline justify-between">
          <h2 class="text-sm font-semibold">Scoring snapshot</h2>
          <span class="text-xs text-[color:var(--color-muted)]">
            {snap.score_totals.last_24h} scored · 24h · last
            {snap.score_totals.last_score_at
              ? new Date(snap.score_totals.last_score_at).toLocaleString()
              : '—'}
          </span>
        </div>

        <h3 class="mt-4 text-xs font-medium uppercase tracking-wide text-[color:var(--color-muted)]">Per-feed engagement</h3>
        {#if snap.feed_engagement.length === 0}
          <p class="mt-2 text-xs text-[color:var(--color-muted)]">No engagement recorded yet.</p>
        {:else}
          <div class="mt-2 overflow-x-auto">
            <table class="w-full min-w-[600px] text-xs">
              <thead class="text-left text-[color:var(--color-muted)]">
                <tr>
                  <th class="py-1 pr-3 font-medium">Feed</th>
                  <th class="py-1 pr-3 font-medium">Reads</th>
                  <th class="py-1 pr-3 font-medium">Saves</th>
                  <th class="py-1 pr-3 font-medium">Dismisses</th>
                  <th class="py-1 pr-3 font-medium">Avg depth</th>
                  <th class="py-1 pr-3 font-medium">Avg time</th>
                </tr>
              </thead>
              <tbody>
                {#each snap.feed_engagement as f (f.feed_id)}
                  <tr class="border-t border-[color:var(--color-border)]">
                    <td class="py-1 pr-3">{f.feed_title ?? f.feed_id}</td>
                    <td class="py-1 pr-3 tabular-nums">{f.reads}</td>
                    <td class="py-1 pr-3 tabular-nums">{f.saves}</td>
                    <td class="py-1 pr-3 tabular-nums">{f.dismisses}</td>
                    <td class="py-1 pr-3 tabular-nums">{f.avg_depth_percent != null ? `${f.avg_depth_percent}%` : '—'}</td>
                    <td class="py-1 pr-3 tabular-nums">{f.avg_time_minutes != null ? `${f.avg_time_minutes} min` : '—'}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}

        <h3 class="mt-6 text-xs font-medium uppercase tracking-wide text-[color:var(--color-muted)]">
          Recent scores ({snap.score_totals.last_7d} in last 7d)
        </h3>
        {#if snap.recent_scores.length === 0}
          <p class="mt-2 text-xs text-[color:var(--color-muted)]">No scores yet.</p>
        {:else}
          <ul class="mt-2 divide-y divide-[color:var(--color-border)]">
            {#each snap.recent_scores as s (s.article_id + s.created_at)}
              <li class="flex items-baseline gap-3 py-1.5 text-xs">
                <span
                  class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px]"
                  class:bg-emerald-500={s.score >= 4}
                  class:text-white={s.score >= 4 || s.score <= 2}
                  class:bg-amber-500={s.score === 3}
                  class:bg-rose-500={s.score <= 2}
                >
                  {s.score}
                </span>
                <span class="min-w-0 flex-1 truncate" title={s.article_title ?? ''}>{s.article_title ?? s.article_id}</span>
                <span class="text-[color:var(--color-muted)]">{s.scoring_method}</span>
                <span class="text-[color:var(--color-muted)]">{new Date(s.created_at).toLocaleString()}</span>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    {/if}
  {/if}
</section>
