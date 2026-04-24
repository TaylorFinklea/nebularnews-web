<script lang="ts">
  import type { ActionData, PageData } from './$types';
  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<section class="mx-auto flex min-h-screen max-w-md flex-col items-stretch justify-center gap-6 p-8">
  <header class="text-center">
    <h1 class="text-3xl font-semibold tracking-tight">Sign in</h1>
    <p class="mt-1 text-sm text-[color:var(--color-muted)]">
      Access the NebularNews admin console.
    </p>
  </header>

  {#if data.error === 'apple'}
    <p class="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
      Apple Sign In failed. Check the Workers logs for details.
    </p>
  {/if}

  <a
    href={data.appleSignInUrl}
    class="flex items-center justify-center gap-2 rounded-md bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
  >
    Sign in with Apple
  </a>

  {#if data.devBypassEnabled}
    <div class="border-t border-[color:var(--color-border)] pt-6">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
        Dev bypass
      </h2>
      <p class="mt-1 text-xs text-[color:var(--color-muted)]">
        Paste a <code>session.token</code> from D1. For local dev only; disable
        <code>DEV_BYPASS_ENABLED</code> in any deployed environment.
      </p>

      <form method="POST" action="?/bypass" class="mt-3 flex flex-col gap-2">
        <input
          name="token"
          type="text"
          autocomplete="off"
          spellcheck="false"
          placeholder="paste token"
          class="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 font-mono text-sm"
        />
        {#if form?.error}
          <p class="text-xs text-red-700">{form.error}</p>
        {/if}
        <button
          type="submit"
          class="rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm font-medium transition hover:bg-[color:var(--color-surface)]"
        >
          Use token
        </button>
      </form>
    </div>
  {/if}
</section>
