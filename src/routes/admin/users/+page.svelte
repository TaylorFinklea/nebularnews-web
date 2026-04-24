<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<section class="mx-auto max-w-6xl">
  <h1 class="text-2xl font-semibold tracking-tight">Users</h1>
  <p class="mt-1 text-sm text-[color:var(--color-muted)]">
    {data.users.length} users
  </p>

  <div class="mt-6 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
    <table class="w-full text-sm">
      <thead class="bg-[color:var(--color-bg)] text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
        <tr>
          <th class="px-4 py-2">User</th>
          <th class="px-4 py-2">Tier</th>
          <th class="px-4 py-2 text-right">Feeds</th>
          <th class="px-4 py-2 text-right">Read</th>
          <th class="px-4 py-2 text-right">Tokens 7d</th>
          <th class="px-4 py-2">Last active</th>
          <th class="px-4 py-2">Admin</th>
        </tr>
      </thead>
      <tbody>
        {#each data.users as u (u.id)}
          <tr class="border-t border-[color:var(--color-border)] transition hover:bg-[color:var(--color-bg)]">
            <td class="px-4 py-2">
              <a href={`/admin/users/${u.id}`} class="underline">
                {u.name ?? u.email ?? u.id}
              </a>
              <div class="mt-0.5 text-xs text-[color:var(--color-muted)]">{u.email ?? '—'}</div>
            </td>
            <td class="px-4 py-2 text-xs">{u.tier ?? 'free'}</td>
            <td class="px-4 py-2 text-right">{u.feed_count}</td>
            <td class="px-4 py-2 text-right">{u.articles_read}</td>
            <td class="px-4 py-2 text-right">{u.tokens_7d.toLocaleString()}</td>
            <td class="px-4 py-2 text-xs text-[color:var(--color-muted)]">
              {u.last_active ? new Date(u.last_active).toLocaleDateString() : '—'}
            </td>
            <td class="px-4 py-2 text-xs">
              {u.is_admin ? '✓' : ''}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
