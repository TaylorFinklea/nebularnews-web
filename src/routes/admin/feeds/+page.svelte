<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();

  const scrapeModeColor: Record<string, string> = {
    rss_only: 'text-[color:var(--color-muted)]',
    auto_fetch_on_empty: 'text-emerald-700',
    always: 'text-sky-700',
  };
</script>

<section class="mx-auto max-w-6xl">
  <h1 class="text-2xl font-semibold tracking-tight">Feeds</h1>
  <p class="mt-1 text-sm text-[color:var(--color-muted)]">
    {data.feeds.length} feeds · sorted by error count
  </p>

  <div class="mt-6 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
    <table class="w-full text-sm">
      <thead class="bg-[color:var(--color-bg)] text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
        <tr>
          <th class="px-4 py-2">Title</th>
          <th class="px-4 py-2">Mode</th>
          <th class="px-4 py-2 text-right">Subs</th>
          <th class="px-4 py-2 text-right">Errors</th>
          <th class="px-4 py-2 text-right">Scrape err</th>
          <th class="px-4 py-2 text-right">Avg qty</th>
        </tr>
      </thead>
      <tbody>
        {#each data.feeds as feed (feed.id)}
          <tr class="border-t border-[color:var(--color-border)] transition hover:bg-[color:var(--color-bg)]">
            <td class="px-4 py-2">
              <a href={`/admin/feeds/${feed.id}`} class="font-medium underline">
                {feed.title}
              </a>
              <div class="mt-0.5 truncate text-xs text-[color:var(--color-muted)]">
                {feed.url}
              </div>
            </td>
            <td class="px-4 py-2 font-mono text-xs {scrapeModeColor[feed.scrape_mode] ?? ''}">
              {feed.scrape_mode}
            </td>
            <td class="px-4 py-2 text-right">{feed.subscriber_count}</td>
            <td class="px-4 py-2 text-right" class:text-red-700={feed.error_count > 0}>
              {feed.error_count}
            </td>
            <td class="px-4 py-2 text-right" class:text-red-700={feed.scrape_error_count > 0}>
              {feed.scrape_error_count}
            </td>
            <td class="px-4 py-2 text-right">
              {feed.avg_extraction_quality !== null ? feed.avg_extraction_quality.toFixed(2) : '—'}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
