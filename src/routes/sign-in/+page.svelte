<script lang="ts">
  import type { ActionData, PageData } from './$types';
  let { data, form }: { data: PageData; form: ActionData } = $props();

  let signingIn = $state(false);
  let appleError = $state<string | null>(null);

  // Browser-side POST so better-auth's CSRF-state cookie lands in this user's
  // browser jar (a server proxy from SvelteKit would set the cookie on the
  // server's fetch context, not the user's browser). The cookie must be
  // present on api.nebularnews.com when Apple's `form_post` callback fires,
  // otherwise better-auth rejects with state_mismatch.
  async function startAppleSignIn() {
    if (signingIn) return;
    signingIn = true;
    appleError = null;
    try {
      const callback = `${data.webBase}/sign-in/callback`;
      const handoff = `${data.apiBase}/api/auth/web-handoff?target=${encodeURIComponent(callback)}`;
      const res = await fetch(`${data.apiBase}/api/auth/sign-in/social`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'apple',
          callbackURL: handoff,
          errorCallbackURL: `${data.webBase}/sign-in?error=apple`,
        }),
      });
      if (!res.ok) {
        appleError = `Apple sign-in failed to start (${res.status})`;
        signingIn = false;
        return;
      }
      const json = (await res.json()) as { url?: string };
      if (!json.url) {
        appleError = 'No redirect URL returned';
        signingIn = false;
        return;
      }
      window.location.href = json.url;
    } catch (e) {
      appleError = e instanceof Error ? e.message : 'Sign-in error';
      signingIn = false;
    }
  }
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

  <button
    type="button"
    onclick={startAppleSignIn}
    disabled={signingIn}
    class="flex w-full items-center justify-center gap-2 rounded-md bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
  >
    {signingIn ? 'Redirecting…' : 'Sign in with Apple'}
  </button>
  {#if appleError}
    <p class="rounded-md border border-red-300 bg-red-50 p-3 text-xs text-red-800">{appleError}</p>
  {/if}

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
