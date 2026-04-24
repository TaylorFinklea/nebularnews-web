<script lang="ts">
  import type { PageData } from './$types';
  import StatCard from '$lib/components/StatCard.svelte';
  let { data }: { data: PageData } = $props();
</script>

<section class="mx-auto max-w-6xl">
  <h1 class="text-2xl font-semibold tracking-tight">Health</h1>

  <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
    <StatCard label="Users" value={data.health.total_users.toLocaleString()} />
    <StatCard label="Articles" value={data.health.total_articles.toLocaleString()} />
    <StatCard label="Feed errors" value={data.health.feeds_with_errors.toLocaleString()} />
    <StatCard label="Scored · 1h" value={data.health.articles_scored_last_hour.toLocaleString()} />
  </div>

  <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
    <StatCard label="Scrapes · 1h" value={data.scraping.fetched_1h.toLocaleString()} />
    <StatCard label="Scrapes · 24h" value={data.scraping.fetched_24h.toLocaleString()} />
    <StatCard label="Cooldown" value={data.scraping.on_cooldown.toLocaleString()} />
    <StatCard
      label="Avg quality"
      value={data.scraping.avg_extraction_quality_24h !== null ? data.scraping.avg_extraction_quality_24h.toFixed(2) : '—'}
    />
  </div>

  <section class="mt-8">
    <h2 class="text-lg font-semibold">Scrape mode volume (24h)</h2>
    <div class="mt-3 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <table class="w-full text-sm">
        <thead class="bg-[color:var(--color-bg)] text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
          <tr>
            <th class="px-4 py-2">Mode</th>
            <th class="px-4 py-2 text-right">Fetches</th>
          </tr>
        </thead>
        <tbody>
          {#each data.scraping.by_scrape_mode as row (row.scrape_mode)}
            <tr class="border-t border-[color:var(--color-border)]">
              <td class="px-4 py-2 font-mono text-xs">{row.scrape_mode}</td>
              <td class="px-4 py-2 text-right">{row.fetch_count.toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="mt-8">
    <h2 class="text-lg font-semibold">Recent pull runs</h2>
    <div class="mt-3 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <table class="w-full text-sm">
        <thead class="bg-[color:var(--color-bg)] text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
          <tr>
            <th class="px-4 py-2">Status</th>
            <th class="px-4 py-2">Completed</th>
            <th class="px-4 py-2">Stats</th>
          </tr>
        </thead>
        <tbody>
          {#each data.health.recent_pulls as p (p.id)}
            <tr class="border-t border-[color:var(--color-border)]">
              <td class="px-4 py-2 text-xs">{p.status}</td>
              <td class="px-4 py-2 text-xs">
                {p.completed_at ? new Date(p.completed_at).toLocaleString() : '—'}
              </td>
              <td class="px-4 py-2 font-mono text-xs text-[color:var(--color-muted)]">
                {JSON.stringify(p.stats)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="mt-8">
    <h2 class="text-lg font-semibold">Recent scrape errors</h2>
    <div class="mt-3 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <table class="w-full text-sm">
        <thead class="bg-[color:var(--color-bg)] text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
          <tr>
            <th class="px-4 py-2">Article</th>
            <th class="px-4 py-2">Feed</th>
            <th class="px-4 py-2">Error</th>
            <th class="px-4 py-2">When</th>
          </tr>
        </thead>
        <tbody>
          {#each data.scraping.recent_errors as e (e.article_id)}
            <tr class="border-t border-[color:var(--color-border)]">
              <td class="px-4 py-2">
                <a href={`/admin/articles/${e.article_id}`} class="underline">
                  {e.title ?? e.article_id}
                </a>
              </td>
              <td class="px-4 py-2 text-xs text-[color:var(--color-muted)]">{e.feed_title ?? '—'}</td>
              <td class="px-4 py-2 font-mono text-xs text-red-700">{e.error}</td>
              <td class="px-4 py-2 text-xs text-[color:var(--color-muted)]">
                {new Date(e.attempted_at).toLocaleString()}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</section>
