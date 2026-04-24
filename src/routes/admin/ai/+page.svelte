<script lang="ts">
  import type { PageData } from './$types';
  import StatCard from '$lib/components/StatCard.svelte';
  let { data }: { data: PageData } = $props();
</script>

<section class="mx-auto max-w-6xl">
  <h1 class="text-2xl font-semibold tracking-tight">AI usage</h1>

  <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
    <StatCard label="Tokens · day" value={data.ai.daily.tokens.toLocaleString()} />
    <StatCard label="Calls · day" value={data.ai.daily.calls.toLocaleString()} />
    <StatCard label="Tokens · week" value={data.ai.weekly.tokens.toLocaleString()} />
    <StatCard label="Calls · week" value={data.ai.weekly.calls.toLocaleString()} />
  </div>

  <section class="mt-8">
    <h2 class="text-lg font-semibold">By provider (7d)</h2>
    <div class="mt-3 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <table class="w-full text-sm">
        <thead class="bg-[color:var(--color-bg)] text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
          <tr>
            <th class="px-4 py-2">Provider</th>
            <th class="px-4 py-2 text-right">Calls</th>
            <th class="px-4 py-2 text-right">Tokens</th>
          </tr>
        </thead>
        <tbody>
          {#each data.ai.by_provider as p (p.provider)}
            <tr class="border-t border-[color:var(--color-border)]">
              <td class="px-4 py-2">{p.provider}</td>
              <td class="px-4 py-2 text-right">{p.call_count.toLocaleString()}</td>
              <td class="px-4 py-2 text-right">{p.total_tokens.toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="mt-8">
    <h2 class="text-lg font-semibold">By endpoint (7d)</h2>
    <div class="mt-3 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <table class="w-full text-sm">
        <thead class="bg-[color:var(--color-bg)] text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
          <tr>
            <th class="px-4 py-2">Endpoint</th>
            <th class="px-4 py-2 text-right">Calls</th>
          </tr>
        </thead>
        <tbody>
          {#each data.ai.by_endpoint as e (e.endpoint)}
            <tr class="border-t border-[color:var(--color-border)]">
              <td class="px-4 py-2 font-mono text-xs">{e.endpoint}</td>
              <td class="px-4 py-2 text-right">{e.call_count.toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="mt-8">
    <h2 class="text-lg font-semibold">Tool calls (7d)</h2>
    <p class="mt-1 text-xs text-[color:var(--color-muted)]">
      {data.tools.total_calls} total · {data.tools.server_calls} server · {data.tools.client_calls} client
    </p>
    <div class="mt-3 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <table class="w-full text-sm">
        <thead class="bg-[color:var(--color-bg)] text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
          <tr>
            <th class="px-4 py-2">Tool</th>
            <th class="px-4 py-2 text-right">Count</th>
            <th class="px-4 py-2 text-right">Succeeded</th>
            <th class="px-4 py-2 text-right">Failed</th>
            <th class="px-4 py-2 text-right">Thrown</th>
            <th class="px-4 py-2 text-right">Gap</th>
            <th class="px-4 py-2 text-right">Rate</th>
          </tr>
        </thead>
        <tbody>
          {#each data.tools.by_tool as t (t.name)}
            <tr class="border-t border-[color:var(--color-border)]">
              <td class="px-4 py-2 font-mono text-xs">{t.name}</td>
              <td class="px-4 py-2 text-right">{t.count}</td>
              <td class="px-4 py-2 text-right text-emerald-700">{t.succeeded}</td>
              <td class="px-4 py-2 text-right" class:text-red-700={t.failed > 0}>{t.failed}</td>
              <td class="px-4 py-2 text-right" class:text-red-700={t.thrown_errors > 0}>{t.thrown_errors}</td>
              <td class="px-4 py-2 text-right text-xs" class:text-amber-700={t.logging_gap > 0}>{t.logging_gap}</td>
              <td class="px-4 py-2 text-right text-xs">
                {t.success_rate !== null ? (t.success_rate * 100).toFixed(0) + '%' : '—'}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</section>
