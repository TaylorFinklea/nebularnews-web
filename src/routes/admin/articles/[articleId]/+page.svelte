<script lang="ts">
  import type { ActionData, PageData } from './$types';
  let { data, form }: { data: PageData; form: ActionData } = $props();

  const a = $derived(data.article);
</script>

<section class="mx-auto max-w-4xl">
  <a href="/admin/articles" class="text-sm text-[color:var(--color-muted)] underline">← All articles</a>

  <h1 class="mt-3 text-xl font-semibold">{a.title ?? a.canonical_url}</h1>
  <a
    href={a.canonical_url}
    target="_blank"
    rel="noreferrer"
    class="break-all text-xs text-[color:var(--color-muted)] underline"
  >
    {a.canonical_url}
  </a>

  <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
    <div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
      <h2 class="text-sm font-semibold">Scrape state</h2>
      <dl class="mt-2 grid grid-cols-2 gap-2 text-xs">
        <dt class="text-[color:var(--color-muted)]">Content length</dt>
        <dd>{a.content_text_length} chars</dd>
        <dt class="text-[color:var(--color-muted)]">Word count</dt>
        <dd>{a.word_count ?? '—'}</dd>
        <dt class="text-[color:var(--color-muted)]">Extraction method</dt>
        <dd class="font-mono">{a.extraction_method ?? '—'}</dd>
        <dt class="text-[color:var(--color-muted)]">Quality</dt>
        <dd>{a.extraction_quality !== null ? a.extraction_quality.toFixed(2) : '—'}</dd>
        <dt class="text-[color:var(--color-muted)]">Retry count</dt>
        <dd>{a.scrape_retry_count}</dd>
        <dt class="text-[color:var(--color-muted)]">Fetch attempts</dt>
        <dd>{a.fetch_attempt_count}</dd>
        <dt class="text-[color:var(--color-muted)]">Next retry</dt>
        <dd>{a.next_scrape_attempt_at ? new Date(a.next_scrape_attempt_at).toLocaleString() : '—'}</dd>
        <dt class="text-[color:var(--color-muted)]">Last attempt</dt>
        <dd>{a.last_fetch_attempt_at ? new Date(a.last_fetch_attempt_at).toLocaleString() : '—'}</dd>
        <dt class="text-[color:var(--color-muted)]">Published</dt>
        <dd>{a.published_at ? new Date(a.published_at).toLocaleString() : '—'}</dd>
        <dt class="text-[color:var(--color-muted)]">Feed</dt>
        <dd>
          {#if a.feed_id}
            <a href={`/admin/feeds/${a.feed_id}`} class="underline">{a.feed_title}</a>
            {#if a.feed_scrape_mode}
              <span class="ml-1 text-[color:var(--color-muted)]">({a.feed_scrape_mode})</span>
            {/if}
          {:else}
            —
          {/if}
        </dd>
      </dl>
      {#if a.last_fetch_error}
        <pre class="mt-3 whitespace-pre-wrap rounded bg-[color:var(--color-danger-soft)] p-2 font-mono text-xs text-[color:var(--color-danger)]">{a.last_fetch_error}</pre>
      {/if}
    </div>

    <div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
      <h2 class="text-sm font-semibold">Actions</h2>
      {#if a.quarantined_at}
        <div class="mt-3 rounded-md border border-[color:var(--color-warning-soft)] bg-[color:var(--color-warning-soft)] p-3 text-xs text-[color:var(--color-warning)]">
          <p class="font-medium">Quarantined</p>
          <p class="mt-1">Hidden from user feeds since {new Date(a.quarantined_at).toLocaleString()}. Permanent extraction failure or retries exhausted.</p>
        </div>
      {/if}
      <form method="POST" action="?/rescrape" class="mt-3">
        <button
          type="submit"
          class="rounded-md bg-[color:var(--color-accent)] px-3 py-1.5 text-sm font-medium text-white"
        >
          Rescrape now
        </button>
      </form>
      {#if a.quarantined_at}
        <form method="POST" action="?/unquarantine" class="mt-2">
          <button
            type="submit"
            class="rounded-md border border-[color:var(--color-border)] px-3 py-1.5 text-sm font-medium text-[color:var(--color-fg)]"
          >
            Unquarantine
          </button>
        </form>
      {/if}
      {#if form?.error}
        <p class="mt-3 text-xs text-[color:var(--color-danger)]">{form.error}</p>
      {:else if form?.unquarantined}
        <p class="mt-3 text-xs text-[color:var(--color-success)]">Unquarantined. Article is back in feeds.</p>
      {:else if form?.ok}
        <p class="mt-3 text-xs text-[color:var(--color-success)]">
          Rescraped.
          {#if form.updated}
            {form.updated.word_count ?? 0} words · {form.updated.extraction_method}
          {/if}
        </p>
      {/if}
    </div>
  </div>

  {#if a.excerpt || a.content_text}
    <section class="mt-8">
      <h2 class="text-lg font-semibold">Content preview</h2>
      {#if a.excerpt}
        <p class="mt-2 text-sm text-[color:var(--color-muted)] italic">{a.excerpt}</p>
      {/if}
      {#if a.content_text}
        <pre class="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 text-xs leading-relaxed">{a.content_text.slice(0, 5000)}{a.content_text.length > 5000 ? '\n\n…(truncated)' : ''}</pre>
      {/if}
    </section>
  {/if}
</section>
