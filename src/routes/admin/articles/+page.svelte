<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();

  function toggleParam(name: string) {
    const u = new URL(window.location.href);
    if (u.searchParams.get(name) === 'true') u.searchParams.delete(name);
    else u.searchParams.set(name, 'true');
    window.location.href = u.toString();
  }
</script>

<section class="mx-auto max-w-6xl">
  <h1 class="text-2xl font-semibold tracking-tight">Articles</h1>

  <div class="mt-4 flex gap-2">
    <button
      type="button"
      class="rounded-md border border-[color:var(--color-border)] px-3 py-1.5 text-sm transition"
      class:bg-[color:var(--color-surface)]={data.filters.emptyOnly}
      onclick={() => toggleParam('empty_only')}
    >
      Empty only
    </button>
    <button
      type="button"
      class="rounded-md border border-[color:var(--color-border)] px-3 py-1.5 text-sm transition"
      class:bg-[color:var(--color-surface)]={data.filters.hasError}
      onclick={() => toggleParam('has_error')}
    >
      With errors
    </button>
  </div>

  <div class="mt-4 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
    <table class="w-full text-sm">
      <thead class="bg-[color:var(--color-bg)] text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
        <tr>
          <th class="px-4 py-2">Title</th>
          <th class="px-4 py-2">Feed</th>
          <th class="px-4 py-2 text-right">Content</th>
          <th class="px-4 py-2 text-right">Retries</th>
          <th class="px-4 py-2">Next retry</th>
          <th class="px-4 py-2">Error</th>
        </tr>
      </thead>
      <tbody>
        {#each data.page.articles as a (a.id)}
          <tr class="border-t border-[color:var(--color-border)] transition hover:bg-[color:var(--color-bg)]">
            <td class="px-4 py-2">
              <a href={`/admin/articles/${a.id}`} class="underline">
                {a.title ?? a.canonical_url}
              </a>
            </td>
            <td class="px-4 py-2 text-xs text-[color:var(--color-muted)]">
              {a.feed_title ?? '—'}
            </td>
            <td class="px-4 py-2 text-right">{a.content_text_length} chars</td>
            <td class="px-4 py-2 text-right">{a.scrape_retry_count}</td>
            <td class="px-4 py-2 text-xs text-[color:var(--color-muted)]">
              {a.next_scrape_attempt_at ? new Date(a.next_scrape_attempt_at).toLocaleString() : '—'}
            </td>
            <td class="px-4 py-2 font-mono text-xs text-[color:var(--color-danger)]">{a.last_fetch_error ?? ''}</td>
          </tr>
        {/each}
        {#if data.page.articles.length === 0}
          <tr><td colspan="6" class="px-4 py-8 text-center text-sm text-[color:var(--color-muted)]">No articles match</td></tr>
        {/if}
      </tbody>
    </table>
  </div>

  {#if data.page.next_before}
    <a
      href={`?before=${data.page.next_before}${data.filters.emptyOnly ? '&empty_only=true' : ''}${data.filters.hasError ? '&has_error=true' : ''}`}
      class="mt-4 inline-block text-sm underline"
    >
      Next page
    </a>
  {/if}
</section>
