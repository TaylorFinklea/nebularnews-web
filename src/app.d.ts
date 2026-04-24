// See https://svelte.dev/docs/kit/types#app.d.ts

declare global {
  namespace App {
    interface Error {
      code?: string;
    }
    interface Locals {
      sessionToken: string | null;
      user: {
        userId: string;
        isAdmin: boolean;
      } | null;
    }
    interface PageData {
      user?: Locals['user'];
    }
    interface Platform {
      env: {
        // Nothing bound here yet — SvelteKit on Pages gets env via process.env
      };
    }
  }
}

export {};
