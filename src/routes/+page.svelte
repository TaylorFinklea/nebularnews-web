<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

<section class="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 p-8 text-center">
  <h1 class="text-4xl font-semibold tracking-tight">NebularNews</h1>
  <p class="text-lg text-[color:var(--color-muted)]">
    Admin console and web reader for NebularNews.
  </p>

  {#if data.user}
    <p class="text-sm text-[color:var(--color-muted)]">
      Signed in as <span class="font-mono">{data.user.userId}</span>
      {#if !data.user.isAdmin} — not an admin{/if}
    </p>
  {:else}
    <a
      href="/sign-in"
      class="inline-flex items-center rounded-md bg-[color:var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
    >
      Sign in
    </a>
  {/if}
</section>
