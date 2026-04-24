# Apple Sign In for Web — setup

Follow these steps to wire up real Apple Sign In for the admin web. This is
a one-time manual setup because only you can sign into the Apple Developer
portal.

The iOS app already has Sign In with Apple working via its native App ID
(`com.nebularnews.ios`). The web uses a **Services ID** — a separate
identifier — because Apple treats native and web OAuth as distinct clients.

## 1. Create the Services ID

1. Go to https://developer.apple.com/account/resources/identifiers/list/serviceId
2. Click the **+** button to register a new identifier.
3. Select **Services IDs** → Continue.
4. Fill in:
   - **Description**: `NebularNews Web`
   - **Identifier**: `com.nebularnews.web`
5. Click **Continue** → **Register**.

## 2. Configure Sign in with Apple on the Services ID

1. Click the new `com.nebularnews.web` entry to edit it.
2. Check the box for **Sign In with Apple**, then click **Configure**.
3. Set:
   - **Primary App ID**: `com.nebularnews.ios` (the existing App ID, so both web and iOS share one account identity).
   - **Domains and Subdomains**: `admin.nebularnews.com`
   - **Return URLs**: `https://api.nebularnews.com/api/auth/callback/apple`
4. Click **Next** → **Done** → **Save**.

Apple will ask you to verify ownership of `admin.nebularnews.com` by
downloading a verification file and hosting it at
`https://admin.nebularnews.com/.well-known/apple-developer-domain-association.txt`.
Drop the file into `static/.well-known/` in this repo, rebuild, redeploy,
then click **Verify** in the Apple portal.

## 3. Generate the web client secret JWT

Apple doesn't give you a plain client secret for Sign In — you mint a short-
lived JWT signed with your existing `.p8` private key.

Using the same key ID as iOS (`Z4D9B5P5F6`) and the Services ID you just
created:

```sh
# One-time; generates a 6-month JWT to use as APPLE_CLIENT_SECRET_WEB.
# Requires the .p8 key file — you already have this for iOS.
cat <<'EOF' > /tmp/mint-apple-jwt.mjs
import { SignJWT, importPKCS8 } from 'jose';
import { readFileSync } from 'node:fs';

const teamId = 'K7CBQW6MPG';
const keyId = 'Z4D9B5P5F6';
const clientId = 'com.nebularnews.web';
const p8 = readFileSync(process.argv[2], 'utf8');
const key = await importPKCS8(p8, 'ES256');

const now = Math.floor(Date.now() / 1000);
const jwt = await new SignJWT({ iss: teamId, iat: now, exp: now + 60 * 60 * 24 * 180, aud: 'https://appleid.apple.com', sub: clientId })
  .setProtectedHeader({ alg: 'ES256', kid: keyId })
  .sign(key);

console.log(jwt);
EOF

node /tmp/mint-apple-jwt.mjs /path/to/AuthKey_Z4D9B5P5F6.p8
```

Save the output — that string is your web client secret.

## 4. Push secrets to Wrangler

Back in the `nebularnews` (Workers) repo:

```sh
cd ~/git/nebularnews
npx wrangler secret put APPLE_SERVICES_ID --env production
# → enter: com.nebularnews.web

npx wrangler secret put APPLE_CLIENT_SECRET_WEB --env production
# → paste the JWT from step 3
```

## 5. Wire up the Workers auth to accept the Services ID

The current `src/lib/auth.ts` uses a single `APPLE_CLIENT_ID`. Better-auth's
Apple provider can accept an array of client IDs so both native and web
audiences validate:

```ts
apple: {
  clientId: [env.APPLE_CLIENT_ID, env.APPLE_SERVICES_ID].filter(Boolean) as string[],
  clientSecret: env.APPLE_CLIENT_SECRET_WEB ?? env.APPLE_CLIENT_SECRET,
},
```

Exact syntax depends on the better-auth version we're on — verify via the
`better-auth` docs before committing. If the provider only accepts a single
client ID, the workaround is to run the web OAuth flow through a thin
custom route that validates the id_token against the Services ID audience
before upgrading to a better-auth session.

## 6. Verify end-to-end

1. Visit https://admin.nebularnews.com/ (once the custom domain is wired in
   step 7) or the pages.dev URL.
2. Click **Sign in with Apple**.
3. Complete the OAuth flow.
4. Land back on `/admin` with your email in the top bar.

## 7. Wire the custom domain (`admin.nebularnews.com`)

In the Cloudflare dashboard:

1. **Pages** → `nebularnews-admin` → **Custom domains** → **Set up a custom domain**.
2. Enter `admin.nebularnews.com`.
3. Accept the DNS CNAME record Cloudflare creates (it'll point
   `admin.nebularnews.com` at `nebularnews-admin.pages.dev`).
4. Wait a minute for the cert to issue.

## Dev bypass during setup

Until Apple Services ID is fully verified, `DEV_BYPASS_ENABLED=true` in
`.env` (or in Pages preview env) lets you paste a `session.token` row
straight from D1 into the sign-in page. Always disable this on production.
