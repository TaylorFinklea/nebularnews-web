<script lang="ts">
  import { page } from '$app/state';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: any } = $props();

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/feeds', label: 'Feeds' },
    { href: '/admin/articles', label: 'Articles' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/ai', label: 'AI usage' },
    { href: '/admin/content', label: 'Content' },
    { href: '/admin/briefs', label: 'Briefs' },
    { href: '/admin/health', label: 'Health' },
  ];

  function isActive(href: string): boolean {
    if (href === '/admin') return page.url.pathname === '/admin';
    return page.url.pathname.startsWith(href);
  }
</script>

<div class="flex min-h-screen">
  <aside class="w-56 shrink-0 border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
    <div class="mb-6">
      <a href="/" class="block text-lg font-semibold tracking-tight">NebularNews</a>
      <p class="text-xs text-[color:var(--color-muted)]">admin</p>
    </div>

    <nav class="flex flex-col gap-1">
      {#each navItems as item (item.href)}
        <a
          href={item.href}
          class="rounded-md px-3 py-1.5 text-sm transition"
          class:bg-[color:var(--color-bg)]={isActive(item.href)}
          class:font-medium={isActive(item.href)}
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </aside>

  <div class="flex-1 overflow-x-hidden">
    <header class="flex items-center justify-between border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-6 py-3">
      <div class="text-sm text-[color:var(--color-muted)]">
        Signed in as
        <span class="font-medium text-[color:var(--color-ink)]">
          {data.user.email ?? data.user.name ?? data.user.userId}
        </span>
      </div>
      <form method="POST" action="/admin/sign-out">
        <button
          type="submit"
          class="text-sm text-[color:var(--color-muted)] transition hover:text-[color:var(--color-ink)]"
        >
          Sign out
        </button>
      </form>
    </header>

    <div class="p-6">
      {@render children()}
    </div>
  </div>
</div>
