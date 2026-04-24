<script lang="ts">
  let { label, value, hint }: { label: string; value: string | number; hint?: string } = $props();
</script>

<div class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
  <div class="text-xs font-medium uppercase tracking-wide text-[color:var(--color-muted)]">{label}</div>
  <div class="mt-2 text-2xl font-semibold">{value}</div>
  {#if hint}
    <div class="mt-1 text-xs text-[color:var(--color-muted)]">{hint}</div>
  {/if}
</div>
