<script lang="ts">
  import type { ActionData, PageData } from './$types';
  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<section class="mx-auto max-w-3xl">
  <a href="/admin/users" class="text-sm text-[color:var(--color-muted)] underline">← All users</a>

  {#if !data.user}
    <p class="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">User not found.</p>
  {:else}
    <h1 class="mt-3 text-2xl font-semibold">{data.user.name ?? data.user.email ?? data.user.id}</h1>
    <div class="text-xs text-[color:var(--color-muted)]">{data.user.email ?? '—'}</div>

    <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
        <h2 class="text-sm font-semibold">Profile</h2>
        <dl class="mt-3 grid grid-cols-2 gap-2 text-xs">
          <dt class="text-[color:var(--color-muted)]">Tier</dt><dd>{data.user.tier ?? 'free'}</dd>
          <dt class="text-[color:var(--color-muted)]">Feeds</dt><dd>{data.user.feed_count}</dd>
          <dt class="text-[color:var(--color-muted)]">Articles read</dt><dd>{data.user.articles_read}</dd>
          <dt class="text-[color:var(--color-muted)]">Tokens (7d)</dt><dd>{data.user.tokens_7d.toLocaleString()}</dd>
          <dt class="text-[color:var(--color-muted)]">Last active</dt>
          <dd>{data.user.last_active ? new Date(data.user.last_active).toLocaleString() : '—'}</dd>
          <dt class="text-[color:var(--color-muted)]">Admin</dt><dd>{data.user.is_admin ? 'yes' : 'no'}</dd>
        </dl>
      </div>

      <div class="flex flex-col gap-4">
        <div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
          <h2 class="text-sm font-semibold">Admin role</h2>
          <form method="POST" action="?/setAdmin" class="mt-3 flex gap-2">
            <input type="hidden" name="is_admin" value={data.user.is_admin ? 'false' : 'true'} />
            <button
              type="submit"
              class="rounded-md border border-[color:var(--color-border)] px-3 py-1.5 text-sm transition hover:bg-[color:var(--color-bg)]"
            >
              {data.user.is_admin ? 'Revoke admin' : 'Grant admin'}
            </button>
          </form>
        </div>

        <div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
          <h2 class="text-sm font-semibold">Trigger brief</h2>
          <p class="mt-1 text-xs text-[color:var(--color-muted)]">
            Generates a brief immediately for this user, bypassing the
            timezone cron check. Sends a push if the user has a device token.
          </p>
          <form method="POST" action="?/triggerBrief" class="mt-3 flex gap-2">
            <select
              name="edition_kind"
              class="rounded-md border border-[color:var(--color-border)] bg-white px-2 py-1.5 text-sm"
            >
              <option value="morning">morning</option>
              <option value="evening">evening</option>
              <option value="ondemand">ondemand</option>
            </select>
            <button
              type="submit"
              class="rounded-md bg-[color:var(--color-accent)] px-3 py-1.5 text-sm font-medium text-white"
            >
              Generate
            </button>
          </form>
        </div>

        {#if form?.error}
          <p class="rounded-md border border-red-300 bg-red-50 p-3 text-xs text-red-800">{form.error}</p>
        {:else if form?.ok && form.action === 'role'}
          <p class="text-xs text-emerald-700">Role updated.</p>
        {:else if form?.ok && form.action === 'brief'}
          <p class="text-xs text-emerald-700">
            Brief generated ({form.brief?.bullet_count ?? 0} bullets){form.brief?.duplicate ? ' — duplicate' : ''}.
          </p>
        {/if}
      </div>
    </div>
  {/if}
</section>
