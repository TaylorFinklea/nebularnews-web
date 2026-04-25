<script lang="ts">
  import type { ActionData, PageData } from './$types';
  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<section class="mx-auto max-w-4xl">
  <a href="/admin/articles" class="text-sm text-[color:var(--color-muted)] underline">← All articles</a>

  {#if !data.meta}
    <p class="mt-4 rounded-md border border-[color:var(--color-warning-soft)] bg-[color:var(--color-warning-soft)] p-3 text-sm text-[color:var(--color-warning)]">
      Article metadata not in recent list (id: <span class="font-mono">{data.articleId}</span>).
      Rescrape still works.
    </p>
  {:else}
    <h1 class="mt-3 text-xl font-semibold">{data.meta.title ?? data.meta.canonical_url}</h1>
    <a
      href={data.meta.canonical_url}
      target="_blank"
      rel="noreferrer"
      class="break-all text-xs text-[color:var(--color-muted)] underline"
    >
      {data.meta.canonical_url}
    </a>

    <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
        <h2 class="text-sm font-semibold">Scrape state</h2>
        <dl class="mt-2 grid grid-cols-2 gap-2 text-xs">
          <dt class="text-[color:var(--color-muted)]">Content length</dt><dd>{data.meta.content_text_length} chars</dd>
          <dt class="text-[color:var(--color-muted)]">Retry count</dt><dd>{data.meta.scrape_retry_count}</dd>
          <dt class="text-[color:var(--color-muted)]">Fetch attempts</dt><dd>{data.meta.fetch_attempt_count}</dd>
          <dt class="text-[color:var(--color-muted)]">Next retry</dt>
          <dd>{data.meta.next_scrape_attempt_at ? new Date(data.meta.next_scrape_attempt_at).toLocaleString() : '—'}</dd>
          <dt class="text-[color:var(--color-muted)]">Feed</dt>
          <dd>
            {#if data.meta.feed_id}
              <a href={`/admin/feeds/${data.meta.feed_id}`} class="underline">{data.meta.feed_title}</a>
            {:else}
              —
            {/if}
          </dd>
        </dl>
        {#if data.meta.last_fetch_error}
          <pre class="mt-3 whitespace-pre-wrap rounded bg-[color:var(--color-danger-soft)] p-2 font-mono text-xs text-[color:var(--color-danger)]">{data.meta.last_fetch_error}</pre>
        {/if}
      </div>

      <div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
        <h2 class="text-sm font-semibold">Actions</h2>
        <form method="POST" action="?/rescrape" class="mt-3">
          <button
            type="submit"
            class="rounded-md bg-[color:var(--color-accent)] px-3 py-1.5 text-sm font-medium text-white"
          >
            Rescrape now
          </button>
        </form>
        {#if form?.error}
          <p class="mt-3 text-xs text-[color:var(--color-danger)]">{form.error}</p>
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
  {/if}
</section>
