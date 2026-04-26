<script lang="ts">
  import type { PageData } from './$types';
  import type { AdminUsageDailyRow } from '$lib/api/types';

  let { data }: { data: PageData } = $props();

  const today = $derived(data.usage.today);
  const daily = $derived(data.usage.daily);
  const days = $derived(data.days);

  const providers = ['steel', 'browserless'] as const;
  const isEmpty = $derived(
    daily.length === 0 && Object.keys(today).length === 0,
  );

  function successRate(row: AdminUsageDailyRow): number {
    if (row.call_count === 0) return 0;
    return Math.round((row.success_count / row.call_count) * 100);
  }

  function formatDay(unixMs: number): string {
    return new Date(unixMs).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function dur(ms: number | null): string {
    if (ms === null) return '—';
    if (ms < 1000) return ms + 'ms';
    return (ms / 1000).toFixed(1) + 's';
  }
</script>

<section class="mx-auto max-w-6xl">
  <div class="flex items-baseline justify-between">
    <h1 class="text-2xl font-semibold tracking-tight">API usage</h1>
    <div class="flex gap-1 text-xs">
      {#each [7, 30, 90] as opt}
        <a
          href={`/admin/usage?days=${opt}`}
          class="rounded-md px-2.5 py-1 transition"
          class:bg-[color:var(--color-bg)]={days === opt}
          class:text-[color:var(--color-muted)]={days !== opt}
        >
          {opt}d
        </a>
      {/each}
    </div>
  </div>
  <p class="mt-1 text-sm text-[color:var(--color-muted)]">
    Steel and Browserless calls. Today's row is computed live; older days come from the 3:30am UTC rollup.
  </p>

  {#if isEmpty}
    <div class="mt-8 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 text-center text-sm text-[color:var(--color-muted)]">
      No calls recorded yet — first cron runs at the top of the hour.
    </div>
  {:else}
    <!-- Today: one card per provider -->
    <section class="mt-6">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">Today</h2>
      <div class="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {#each providers as provider}
          {@const row = today[provider]}
          <div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
            <div class="flex items-baseline justify-between">
              <h3 class="text-sm font-semibold capitalize">{provider}</h3>
              <span class="text-xs text-[color:var(--color-muted)]">
                {row ? successRate(row) + '% success' : '—'}
              </span>
            </div>
            {#if row}
              <p class="mt-2 text-3xl font-semibold tabular-nums">{row.call_count}</p>
              <p class="text-xs text-[color:var(--color-muted)]">calls</p>
              <dl class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <dt class="text-[color:var(--color-muted)]">Errors</dt>
                <dd class:text-[color:var(--color-danger)]={row.error_count > 0}>{row.error_count}</dd>
                <dt class="text-[color:var(--color-muted)]">p50</dt>
                <dd>{dur(row.p50_duration_ms)}</dd>
                <dt class="text-[color:var(--color-muted)]">p95</dt>
                <dd>{dur(row.p95_duration_ms)}</dd>
              </dl>
            {:else}
              <p class="mt-2 text-sm text-[color:var(--color-muted)]">No calls today.</p>
            {/if}
          </div>
        {/each}
      </div>
    </section>

    <!-- Daily history -->
    {#if daily.length > 0}
      <section class="mt-8">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">Last {days} days</h2>
        <div class="mt-3 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <table class="w-full text-sm">
            <thead class="bg-[color:var(--color-bg)] text-left text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
              <tr>
                <th class="px-3 py-2">Day</th>
                <th class="px-3 py-2">Provider</th>
                <th class="px-3 py-2 text-right">Calls</th>
                <th class="px-3 py-2 text-right">Success %</th>
                <th class="px-3 py-2 text-right">Errors</th>
                <th class="px-3 py-2 text-right">p50</th>
                <th class="px-3 py-2 text-right">p95</th>
              </tr>
            </thead>
            <tbody>
              {#each daily as row}
                <tr class="border-t border-[color:var(--color-border)]">
                  <td class="px-3 py-2">{formatDay(row.day_unix)}</td>
                  <td class="px-3 py-2 capitalize">{row.provider}</td>
                  <td class="px-3 py-2 text-right tabular-nums">{row.call_count}</td>
                  <td class="px-3 py-2 text-right tabular-nums">{successRate(row)}%</td>
                  <td
                    class="px-3 py-2 text-right tabular-nums"
                    class:text-[color:var(--color-danger)]={row.error_count > 0}
                  >
                    {row.error_count}
                  </td>
                  <td class="px-3 py-2 text-right tabular-nums">{dur(row.p50_duration_ms)}</td>
                  <td class="px-3 py-2 text-right tabular-nums">{dur(row.p95_duration_ms)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    {/if}
  {/if}
</section>
