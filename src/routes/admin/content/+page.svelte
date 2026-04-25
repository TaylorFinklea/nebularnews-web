<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<section class="mx-auto max-w-5xl">
  <h1 class="text-2xl font-semibold tracking-tight">Content moderation</h1>
  <p class="mt-1 text-sm text-[color:var(--color-muted)]">
    Most-recent articles. Click any row to inspect or rescrape.
  </p>

  <div class="mt-6 grid grid-cols-1 gap-3">
    {#each data.articles as a (a.id)}
      <a
        href={`/admin/articles/${a.id}`}
        class="block rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 transition hover:bg-[color:var(--color-bg)]"
      >
        <div class="flex items-baseline justify-between gap-4">
          <h2 class="text-sm font-semibold">{a.title ?? a.canonical_url}</h2>
          <span class="shrink-0 text-xs text-[color:var(--color-muted)]">
            {a.published_at ? new Date(a.published_at).toLocaleDateString() : '—'}
          </span>
        </div>
        <div class="mt-1 flex flex-wrap items-center gap-3 text-xs text-[color:var(--color-muted)]">
          <span>{a.feed_title ?? 'Unknown feed'}</span>
          <span>·</span>
          <span>{a.content_text_length} chars</span>
          {#if a.scrape_retry_count > 0}
            <span>· {a.scrape_retry_count} retries</span>
          {/if}
          {#if a.last_fetch_error}
            <span class="text-[color:var(--color-danger)]">· error</span>
          {/if}
        </div>
      </a>
    {/each}
  </div>
</section>
