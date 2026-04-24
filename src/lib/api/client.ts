import { env as publicEnv } from '$env/dynamic/public';
import type { ApiEnvelope, ApiErrorEnvelope } from './types';

/**
 * Thin typed client for the Workers API.
 *
 * Every response is expected to be `{ ok: true, data: T }` on success or
 * `{ ok: false, error: { code, message } }` on failure. We throw
 * `ApiError` on the error envelope so call sites can use try/catch rather
 * than union-narrowing on every response.
 *
 * The client is used from SvelteKit server-side load functions, so the
 * bearer token is looked up from `event.locals` and passed in explicitly.
 * No ambient state.
 */

const DEFAULT_BASE_URL = 'https://api.nebularnews.com';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiClientOptions {
  baseUrl?: string;
  sessionToken?: string | null;
  fetch?: typeof globalThis.fetch;
}

function getBaseUrl(opts?: ApiClientOptions): string {
  if (opts?.baseUrl) return opts.baseUrl;
  return publicEnv.PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL;
}

async function call<T>(
  method: string,
  path: string,
  opts: ApiClientOptions & { body?: unknown; query?: Record<string, string | number | boolean | undefined | null> } = {},
): Promise<T> {
  const base = getBaseUrl(opts);
  const url = new URL(path.startsWith('/') ? `/api${path}` : `/api/${path}`, base);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.sessionToken) headers.Authorization = `Bearer ${opts.sessionToken}`;

  const res = await (opts.fetch ?? fetch)(url.toString(), {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  let payload: ApiEnvelope<T> | ApiErrorEnvelope;
  try {
    payload = (await res.json()) as ApiEnvelope<T> | ApiErrorEnvelope;
  } catch (e) {
    throw new ApiError(
      `Non-JSON response (${res.status})`,
      'bad_response',
      res.status,
    );
  }

  if (!payload || (payload as ApiErrorEnvelope).ok === false) {
    const err = (payload as ApiErrorEnvelope)?.error;
    throw new ApiError(
      err?.message ?? `Request failed (${res.status})`,
      err?.code ?? 'unknown',
      res.status,
      (payload as ApiErrorEnvelope)?.request_id,
    );
  }

  return (payload as ApiEnvelope<T>).data;
}

export const api = {
  get: <T>(path: string, opts?: ApiClientOptions & { query?: Record<string, string | number | boolean | undefined | null> }) =>
    call<T>('GET', path, opts),
  post: <T>(path: string, body: unknown, opts?: ApiClientOptions) =>
    call<T>('POST', path, { ...opts, body }),
  patch: <T>(path: string, body: unknown, opts?: ApiClientOptions) =>
    call<T>('PATCH', path, { ...opts, body }),
  del: <T>(path: string, opts?: ApiClientOptions) =>
    call<T>('DELETE', path, opts),
};
