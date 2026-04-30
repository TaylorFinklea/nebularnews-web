<script lang="ts">
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  // Slot selected for the modal
  let activeSlot = $state<number | null>(null);
  let previewId = $state<string | null>(null);
  let previewUrl = $state<string | null>(null);
  let generating = $state(false);
  let committing = $state(false);

  // Reflect generate/commit action results into modal state
  $effect(() => {
    if (form && 'action' in form && form.action === 'generate' && form.previewUrl) {
      previewId = form.previewId ?? null;
      previewUrl = form.previewUrl ?? null;
      generating = false;
    }
    if (form && 'action' in form && form.action === 'commit') {
      closeModal();
    }
    if (form && 'action' in form && form.action === 'discard') {
      closeModal();
    }
  });

  function openModal(slot: number) {
    activeSlot = slot;
    previewId = null;
    previewUrl = null;
    generating = false;
    committing = false;
  }

  function closeModal() {
    activeSlot = null;
    previewId = null;
    previewUrl = null;
    generating = false;
    committing = false;
  }

  function activeSlotData() {
    if (activeSlot === null) return null;
    return data.slots.find((s) => s.slot === activeSlot) ?? null;
  }

  const FALLBACK_BASE = 'https://r2-fallback.nebularnews.com';

  function slotImageUrl(slot: number): string {
    return `${FALLBACK_BASE}/fallback-${String(slot).padStart(3, '0')}.jpg`;
  }
</script>

<section class="mx-auto max-w-5xl">
  <h1 class="text-2xl font-semibold tracking-tight">Fallback Images</h1>
  <p class="mt-1 text-sm text-[color:var(--color-muted)]">
    30-slot pool of editorial images used when a brief has no lead article image.
    Each image is stored at <code class="font-mono text-xs">r2-fallback.nebularnews.com/fallback-NNN.jpg</code>.
  </p>

  {#if form && 'error' in form && form.error}
    <p class="mt-3 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{form.error}</p>
  {/if}

  <!-- 6×5 grid of slot tiles -->
  <div class="mt-6 grid grid-cols-6 gap-3">
    {#each data.slots as s (s.slot)}
      <button
        type="button"
        onclick={() => openModal(s.slot)}
        class="group relative overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] transition hover:border-[color:var(--color-accent)]"
      >
        <!-- Thumbnail -->
        <div class="aspect-square w-full overflow-hidden bg-[color:var(--color-bg)]">
          {#if s.exists}
            <img
              src={slotImageUrl(s.slot)}
              alt="Slot {s.slot}"
              loading="lazy"
              class="h-full w-full object-cover"
              onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          {:else}
            <div class="flex h-full w-full items-center justify-center text-[color:var(--color-muted)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3 3h18M3 21h18" />
              </svg>
            </div>
          {/if}
        </div>

        <!-- Slot badge -->
        <div class="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-xs font-medium text-white">
          {String(s.slot).padStart(3, '0')}
        </div>

        <!-- Hover overlay -->
        <div class="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
          <span class="rounded bg-[color:var(--color-accent)] px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
            Regenerate
          </span>
        </div>
      </button>
    {/each}
  </div>
</section>

<!-- Modal -->
{#if activeSlot !== null}
  {@const slotData = activeSlotData()}
  <!-- Backdrop -->
  <button
    type="button"
    class="fixed inset-0 z-40 bg-black/50"
    onclick={closeModal}
    aria-label="Close modal"
  ></button>

  <!-- Panel -->
  <div
    class="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-lg -translate-y-1/2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 shadow-xl"
    role="dialog"
    aria-modal="true"
    aria-label="Regenerate slot {activeSlot}"
  >
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold">
        Slot {String(activeSlot).padStart(3, '0')}
      </h2>
      <button
        type="button"
        onclick={closeModal}
        class="text-[color:var(--color-muted)] transition hover:text-[color:var(--color-ink)]"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Current / preview image -->
    <div class="mb-4 aspect-video w-full overflow-hidden rounded-md bg-[color:var(--color-bg)]">
      {#if previewUrl}
        <img src={previewUrl} alt="Preview" class="h-full w-full object-cover" />
      {:else if slotData?.exists}
        <img
          src={slotImageUrl(activeSlot)}
          alt="Current slot {activeSlot}"
          class="h-full w-full object-cover"
          onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      {:else}
        <div class="flex h-full w-full items-center justify-center text-[color:var(--color-muted)]">
          <span class="text-sm">No image yet</span>
        </div>
      {/if}
    </div>

    <!-- Generate form -->
    <form method="POST" action="?/generate" onsubmit={() => { generating = true; }}>
      <input type="hidden" name="slot" value={activeSlot} />

      <fieldset class="mb-3">
        <legend class="mb-1 text-xs font-medium text-[color:var(--color-muted)]">Provider</legend>
        <div class="flex gap-4">
          <label class="flex cursor-pointer items-center gap-1.5 text-sm">
            <input type="radio" name="provider" value="openai" checked class="accent-[color:var(--color-accent)]" />
            OpenAI gpt-image-1
          </label>
          <label class="flex cursor-pointer items-center gap-1.5 text-sm">
            <input type="radio" name="provider" value="imagen3" class="accent-[color:var(--color-accent)]" />
            Google Imagen 3
          </label>
        </div>
      </fieldset>

      <label class="block text-xs">
        <span class="block font-medium text-[color:var(--color-muted)]">Prompt</span>
        <textarea
          name="prompt"
          rows="3"
          maxlength="2000"
          placeholder="abstract editorial newsroom illustration, soft blue gradient"
          class="mt-1 w-full rounded border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-2 py-1.5 text-sm leading-snug"
        >{slotData?.lastPrompt ?? ''}</textarea>
      </label>

      <button
        type="submit"
        disabled={generating}
        class="mt-3 rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {generating ? 'Generating…' : 'Generate'}
      </button>
    </form>

    <!-- Save / Discard (visible after a preview is available) -->
    {#if previewId}
      <div class="mt-4 flex gap-3 border-t border-[color:var(--color-border)] pt-4">
        <form method="POST" action="?/commit" onsubmit={() => { committing = true; }}>
          <input type="hidden" name="slot" value={activeSlot} />
          <input type="hidden" name="previewId" value={previewId} />
          <button
            type="submit"
            disabled={committing}
            class="rounded-md bg-[color:var(--color-accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {committing ? 'Saving…' : 'Save'}
          </button>
        </form>

        <form method="POST" action="?/discard">
          <input type="hidden" name="previewId" value={previewId} />
          <button
            type="submit"
            class="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium transition hover:bg-[color:var(--color-bg)]"
          >
            Discard
          </button>
        </form>
      </div>
    {/if}

    {#if form && 'error' in form && form.error}
      <p class="mt-3 text-xs text-red-600">{form.error}</p>
    {/if}
  </div>
{/if}
