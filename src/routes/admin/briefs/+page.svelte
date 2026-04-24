<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<section class="mx-auto max-w-5xl">
  <h1 class="text-2xl font-semibold tracking-tight">Briefs</h1>
  <p class="mt-1 text-sm text-[color:var(--color-muted)]">
    {data.briefs.length} recent editions{data.userFilter ? ` · filtered to user ${data.userFilter}` : ''}
  </p>

  {#if data.userFilter}
    <a href="/admin/briefs" class="mt-2 inline-block text-sm underline">Clear filter</a>
  {/if}

  <div class="mt-6 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
    <table class="w-full text-sm">
      <thead class="bg-[color:var(--color-bg)] text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
        <tr>
          <th class="px-4 py-2">Generated</th>
          <th class="px-4 py-2">Kind</th>
          <th class="px-4 py-2">User</th>
          <th class="px-4 py-2">Timezone</th>
          <th class="px-4 py-2 text-right">Bullets</th>
          <th class="px-4 py-2 text-right">Candidates</th>
          <th class="px-4 py-2">Provider</th>
        </tr>
      </thead>
      <tbody>
        {#each data.briefs as b (b.id)}
          <tr class="border-t border-[color:var(--color-border)]">
            <td class="px-4 py-2 text-xs">
              {new Date(b.generated_at).toLocaleString()}
            </td>
            <td class="px-4 py-2">
              <span class="rounded bg-[color:var(--color-bg)] px-2 py-0.5 text-xs font-medium">
                {b.edition_kind}
              </span>
            </td>
            <td class="px-4 py-2 text-xs">
              <a href={`/admin/users/${b.user_id}`} class="underline">
                {b.user_email ?? b.user_id}
              </a>
              <a
                href={`/admin/briefs?user_id=${b.user_id}`}
                class="ml-2 text-[color:var(--color-muted)] underline"
              >
                filter
              </a>
            </td>
            <td class="px-4 py-2 text-xs">{b.timezone}</td>
            <td class="px-4 py-2 text-right">{b.source_count}</td>
            <td class="px-4 py-2 text-right">{b.candidate_count}</td>
            <td class="px-4 py-2 text-xs text-[color:var(--color-muted)]">{b.provider ?? '—'}</td>
          </tr>
        {/each}
        {#if data.briefs.length === 0}
          <tr><td colspan="7" class="px-4 py-8 text-center text-sm text-[color:var(--color-muted)]">No briefs yet</td></tr>
        {/if}
      </tbody>
    </table>
  </div>

  {#if data.nextBefore}
    <a
      href={`?before=${data.nextBefore}${data.userFilter ? `&user_id=${data.userFilter}` : ''}`}
      class="mt-4 inline-block text-sm underline"
    >
      Next page
    </a>
  {/if}
</section>
