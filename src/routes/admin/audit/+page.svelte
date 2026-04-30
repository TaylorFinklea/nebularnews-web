<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const entries = $derived(data.page.entries);
  const nextBefore = $derived(data.page.next_before);
  const filters = $derived(data.filters);

  function fmtTime(ms: number): string {
    return new Date(ms).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  function statusClass(code: number | null): string {
    if (code === null) return 'text-[color:var(--color-muted)]';
    if (code >= 500) return 'text-[color:var(--color-danger)]';
    if (code >= 400) return 'text-[color:var(--color-warning)]';
    return 'text-[color:var(--color-success)]';
  }

  function methodClass(method: string): string {
    if (method === 'DELETE') return 'text-[color:var(--color-danger)]';
    if (method === 'PATCH') return 'text-[color:var(--color-warning)]';
    return 'text-[color:var(--color-accent)]';
  }

  function shortBody(json: string | null): string {
    if (!json) return '';
    if (json.length <= 80) return json;
    return json.slice(0, 80) + '…';
  }

  function nextHref(before: number): string {
    const p = new URLSearchParams();
    if (filters.userId) p.set('user_id', filters.userId);
    if (filters.method) p.set('method', filters.method);
    if (filters.path) p.set('path', filters.path);
    p.set('before', String(before));
    return `/admin/audit?${p.toString()}`;
  }
</script>

<section class="mx-auto max-w-7xl">
  <h1 class="text-2xl font-semibold tracking-tight">Audit log</h1>
  <p class="mt-1 text-sm text-[color:var(--color-muted)]">
    Every admin POST / PATCH / DELETE — captured at middleware via <code>c.executionCtx.waitUntil</code>.
    Most-recent first.
  </p>

  <form method="GET" class="mt-4 flex flex-wrap items-end gap-3 text-sm">
    <label class="flex flex-col gap-1">
      <span class="text-xs uppercase tracking-wide text-[color:var(--color-muted)]">User ID</span>
      <input type="text" name="user_id" value={filters.userId ?? ''} placeholder="user-…" class="rounded-md px-2 py-1.5" />
    </label>
    <label class="flex flex-col gap-1">
      <span class="text-xs uppercase tracking-wide text-[color:var(--color-muted)]">Method</span>
      <select name="method" class="rounded-md px-2 py-1.5">
        <option value="" selected={!filters.method}>Any</option>
        <option value="POST" selected={filters.method === 'POST'}>POST</option>
        <option value="PATCH" selected={filters.method === 'PATCH'}>PATCH</option>
        <option value="DELETE" selected={filters.method === 'DELETE'}>DELETE</option>
      </select>
    </label>
    <label class="flex flex-col gap-1">
      <span class="text-xs uppercase tracking-wide text-[color:var(--color-muted)]">Path prefix</span>
      <input type="text" name="path" value={filters.path ?? ''} placeholder="/admin/feeds" class="rounded-md px-2 py-1.5" />
    </label>
    <button
      type="submit"
      class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-1.5 text-sm hover:bg-[color:var(--color-bg)]"
    >
      Apply
    </button>
    {#if filters.userId || filters.method || filters.path}
      <a href="/admin/audit" class="text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-ink)]">Reset</a>
    {/if}
  </form>

  {#if entries.length === 0}
    <div class="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 text-center text-sm text-[color:var(--color-muted)]">
      No entries match the current filters.
    </div>
  {:else}
    <div class="mt-6 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <table class="w-full text-sm">
        <thead class="bg-[color:var(--color-bg)] text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
          <tr>
            <th class="px-3 py-2">When</th>
            <th class="px-3 py-2">Method</th>
            <th class="px-3 py-2">Path</th>
            <th class="px-3 py-2 text-right">Status</th>
            <th class="px-3 py-2">User</th>
            <th class="px-3 py-2">Body</th>
          </tr>
        </thead>
        <tbody>
          {#each entries as entry (entry.id)}
            <tr class="border-t border-[color:var(--color-border)] align-top">
              <td class="px-3 py-2 whitespace-nowrap text-xs text-[color:var(--color-muted)]">
                {fmtTime(entry.created_at)}
              </td>
              <td class="px-3 py-2 font-mono text-xs {methodClass(entry.method)}">{entry.method}</td>
              <td class="px-3 py-2 font-mono text-xs">{entry.path}</td>
              <td class="px-3 py-2 text-right tabular-nums {statusClass(entry.status_code)}">
                {entry.status_code ?? '—'}
              </td>
              <td class="px-3 py-2">
                <a href={`/admin/users/${entry.user_id}`} class="font-mono text-xs underline">
                  {entry.user_id.slice(0, 12)}…
                </a>
              </td>
              <td class="px-3 py-2 font-mono text-xs text-[color:var(--color-muted)]">
                {shortBody(entry.body_json)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if nextBefore !== null}
      <div class="mt-4 flex justify-center">
        <a
          href={nextHref(nextBefore)}
          class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 text-sm hover:bg-[color:var(--color-bg)]"
        >
          Older →
        </a>
      </div>
    {/if}
  {/if}
</section>
