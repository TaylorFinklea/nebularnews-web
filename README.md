# nebularnews-web

SvelteKit admin surface for NebularNews. Talks to the Cloudflare Workers API at
`api.nebularnews.com`. Authenticates via Apple Sign In, reuses the same
better-auth session token that the iOS app uses.

## Stack

- SvelteKit 2 + Svelte 5 (runes)
- TypeScript
- Tailwind CSS v4
- `@sveltejs/adapter-cloudflare` → Cloudflare Pages at `admin.nebularnews.com`

## Local dev

```sh
pnpm install
cp .env.example .env
pnpm dev
```

With `DEV_BYPASS_ENABLED=true`, the sign-in page lets you paste a session
token straight out of the `session` D1 table for the account you want to test
as. Useful before Apple Sign In for Web is wired up.

## Auth model

Web follows the iOS pattern: **Bearer token**, not browser cookies. The
handoff works like this:

1. `/sign-in` redirects to `api.nebularnews.com/api/auth/sign-in/social?provider=apple&callbackURL=<handoff>`.
2. Apple → Workers → better-auth creates a session (cookie set on `api.nebularnews.com`).
3. Better-auth redirects to `/api/auth/web-handoff?target=<this web callback>`.
4. Workers reads the session cookie, looks up the session token, redirects to `<target>?token=<token>`.
5. `/sign-in/callback` receives the token, sets an httpOnly cookie `nn_session` on its own host, redirects to `/admin`.
6. `hooks.server.ts` reads `nn_session` on every request, validates against `/admin/me`, populates `event.locals.user`.

This keeps iOS's token flow and the web's cookie flow decoupled; nothing in
better-auth's cross-subdomain cookie config has to change.

## Deploy

```sh
pnpm build
pnpm deploy
```

Cloudflare Pages project: `nebularnews-admin`. Custom domain: `admin.nebularnews.com`.
