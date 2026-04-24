<script lang="ts">
  import '../app.css';
  import { Toaster } from 'svelte-sonner';

  let { children } = $props();
</script>

<Toaster position="top-right" richColors />

<main class="min-h-screen">
  {@render children()}
</main>
