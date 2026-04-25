<script lang="ts">
  import type { PageData } from './$types';
  import StatCard from '$lib/components/StatCard.svelte';

  let { data }: { data: PageData } = $props();

  const health = $derived(data.health);
  const scraping = $derived(data.scraping);
  const ai = $derived(data.ai);

  function fmt(n: number | null | undefined): string {
    if (n === null || n === undefined) return '—';
    return n.toLocaleString();
  }
</script>

<section class="mx-auto max-w-6xl">
  <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
  <p class="mt-1 text-sm text-[color:var(--color-muted)]">
    Live counts from the Workers API.
  </p>

  <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard label="Total users" value={fmt(health?.total_users)} />
    <StatCard label="Total articles" value={fmt(health?.total_articles)} />
    <StatCard label="Feeds w/ errors" value={fmt(health?.feeds_with_errors)} />
    <StatCard label="Scored last hr" value={fmt(health?.articles_scored_last_hour)} />

    <StatCard label="Scrapes last 24h" value={fmt(scraping?.fetched_24h)} />
    <StatCard label="Scrapes last 1h" value={fmt(scraping?.fetched_1h)} />
    <StatCard label="On cooldown" value={fmt(scraping?.on_cooldown)} />
    <StatCard
      label="Avg extraction qty"
      value={scraping?.avg_extraction_quality_24h !== null && scraping?.avg_extraction_quality_24h !== undefined
        ? scraping.avg_extraction_quality_24h.toFixed(2)
        : '—'}
    />

    <StatCard label="AI tokens · day" value={fmt(ai?.daily.tokens)} />
    <StatCard label="AI tokens · week" value={fmt(ai?.weekly.tokens)} />
    <StatCard label="AI calls · day" value={fmt(ai?.daily.calls)} />
    <StatCard label="AI errors · 7d" value={fmt(ai?.possible_errors_7d)} />
  </div>

  {#if scraping?.recent_errors && scraping.recent_errors.length > 0}
    <section class="mt-10">
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
            {#each scraping.recent_errors as row (row.article_id)}
              <tr class="border-t border-[color:var(--color-border)]">
                <td class="px-4 py-2">
                  <a href={`/admin/articles/${row.article_id}`} class="underline">
                    {row.title ?? row.article_id}
                  </a>
                </td>
                <td class="px-4 py-2 text-[color:var(--color-muted)]">{row.feed_title ?? '—'}</td>
                <td class="px-4 py-2 font-mono text-xs text-[color:var(--color-danger)]">{row.error}</td>
                <td class="px-4 py-2 text-xs text-[color:var(--color-muted)]">
                  {new Date(row.attempted_at).toLocaleString()}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  {/if}
</section>
