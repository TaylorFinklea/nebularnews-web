<script lang="ts">
  import type { ActionData, PageData } from './$types';
  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<section class="mx-auto max-w-4xl">
  <a href="/admin/feeds" class="text-sm text-[color:var(--color-muted)] underline">← All feeds</a>

  {#if !data.feed}
    <p class="mt-4 rounded-md border border-[color:var(--color-danger-border)] bg-[color:var(--color-danger-soft)] p-3 text-sm text-[color:var(--color-danger)]">
      Feed not found.
    </p>
  {:else}
    <h1 class="mt-3 text-2xl font-semibold tracking-tight">{data.feed.title}</h1>
    <div class="text-xs text-[color:var(--color-muted)] break-all">{data.feed.url}</div>

    <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
        <h2 class="text-sm font-semibold">Settings</h2>

        <form method="POST" action="?/update" class="mt-3 flex flex-col gap-3">
          <label class="flex flex-col text-xs">
            <span class="font-medium uppercase tracking-wide text-[color:var(--color-muted)]">Scrape mode</span>
            <select
              name="scrape_mode"
              class="mt-1 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-2 py-1.5 text-sm"
              value={data.feed.scrape_mode}
            >
              <option value="rss_only">rss_only</option>
              <option value="auto_fetch_on_empty">auto_fetch_on_empty</option>
              <option value="always">always</option>
            </select>
          </label>

          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" name="disabled" checked={Boolean(data.feed.disabled)} />
            Disabled
          </label>

          <button
            type="submit"
            class="self-start rounded-md bg-[color:var(--color-accent)] px-3 py-1.5 text-sm font-medium text-white"
          >
            Save
          </button>

          {#if form?.error}
            <p class="text-xs text-[color:var(--color-danger)]">{form.error}</p>
          {:else if form?.ok}
            <p class="text-xs text-[color:var(--color-success)]">Saved.</p>
          {/if}
        </form>
      </div>

      <div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
        <h2 class="text-sm font-semibold">Actions</h2>
        <form method="POST" action="?/repoll" class="mt-3">
          <button
            type="submit"
            class="rounded-md border border-[color:var(--color-border)] px-3 py-1.5 text-sm transition hover:bg-[color:var(--color-bg)]"
          >
            Force re-poll
          </button>
        </form>

        <dl class="mt-4 grid grid-cols-2 gap-2 text-xs">
          <dt class="text-[color:var(--color-muted)]">Subscribers</dt><dd>{data.feed.subscriber_count}</dd>
          <dt class="text-[color:var(--color-muted)]">Error count</dt><dd>{data.feed.error_count}</dd>
          <dt class="text-[color:var(--color-muted)]">Scrape errors</dt><dd>{data.feed.scrape_error_count}</dd>
          <dt class="text-[color:var(--color-muted)]">Avg quality</dt>
          <dd>{data.feed.avg_extraction_quality !== null ? data.feed.avg_extraction_quality.toFixed(2) : '—'}</dd>
          <dt class="text-[color:var(--color-muted)]">Last polled</dt>
          <dd>{data.feed.last_polled_at ? new Date(data.feed.last_polled_at).toLocaleString() : '—'}</dd>
        </dl>
      </div>
    </div>

    <section class="mt-8">
      <h2 class="text-lg font-semibold">Recent articles</h2>
      <div class="mt-3 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <table class="w-full text-sm">
          <thead class="bg-[color:var(--color-bg)] text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
            <tr>
              <th class="px-4 py-2">Title</th>
              <th class="px-4 py-2 text-right">Content</th>
              <th class="px-4 py-2 text-right">Retries</th>
              <th class="px-4 py-2">Error</th>
            </tr>
          </thead>
          <tbody>
            {#each data.articles as a (a.id)}
              <tr class="border-t border-[color:var(--color-border)]">
                <td class="px-4 py-2">
                  <a href={`/admin/articles/${a.id}`} class="underline">
                    {a.title ?? a.canonical_url}
                  </a>
                </td>
                <td class="px-4 py-2 text-right">
                  {a.content_text_length} chars
                </td>
                <td class="px-4 py-2 text-right">{a.scrape_retry_count}</td>
                <td class="px-4 py-2 font-mono text-xs text-[color:var(--color-danger)]">
                  {a.last_fetch_error ?? ''}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  {/if}
</section>
