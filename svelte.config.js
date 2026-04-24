import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // Use Cloudflare Pages with the default functions/_worker.js output
      routes: { include: ['/*'], exclude: ['<all>'] },
    }),
  },
};

export default config;
