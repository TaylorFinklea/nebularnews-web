/**
 * Types that mirror the Workers API response shapes one-to-one.
 *
 * Keys stay in the server's snake_case so there's no translation layer —
 * page components refer to fields by the same name they appear on the wire.
 * If the API changes, these types follow; no normalization step to keep in
 * sync.
 */

export interface ApiEnvelope<T> {
  ok: true;
  data: T;
}

export interface ApiErrorEnvelope {
  ok: false;
  error: { code: string; message: string };
  request_id?: string;
}

// ---------- Admin ----------

export interface AdminMe {
  is_admin: boolean;
  user_id?: string;
  email?: string | null;
  name?: string | null;
}

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  is_admin: boolean;
  created_at: number | string;
  tier: string | null;
  subscription_expires: number | null;
  tokens_7d: number;
  feed_count: number;
  articles_read: number;
  last_active: number | null;
}

export interface AdminFeed {
  id: string;
  title: string;
  url: string;
  feed_type: string;
  error_count: number;
  last_polled_at: number | null;
  scrape_mode: string;
  scrape_error_count: number;
  avg_extraction_quality: number | null;
  subscriber_count: number;
  site_url?: string | null;
  scrape_provider?: string | null;
  disabled?: number | boolean;
}

export interface AdminArticle {
  id: string;
  title: string | null;
  canonical_url: string;
  published_at: number | null;
  fetched_at: number | null;
  content_text_length: number;
  last_fetch_error: string | null;
  scrape_retry_count: number;
  next_scrape_attempt_at: number | null;
  fetch_attempt_count: number;
  quarantined_at: number | null;
  feed_id: string | null;
  feed_title: string | null;
}

export interface AdminUsageDailyRow {
  provider: string;          // 'steel' | 'browserless'
  day_unix: number;
  call_count: number;
  success_count: number;
  error_count: number;
  total_duration_ms: number;
  p50_duration_ms: number | null;
  p95_duration_ms: number | null;
}

export interface AdminUsageResponse {
  today: Record<string, AdminUsageDailyRow>;
  daily: AdminUsageDailyRow[];
}

export interface AdminArticleDetail extends AdminArticle {
  content_html: string | null;
  content_text: string | null;
  excerpt: string | null;
  word_count: number | null;
  extraction_method: string | null;
  extraction_quality: number | null;
  last_fetch_attempt_at: number | null;
  feed_scrape_mode: string | null;
  quarantined_at: number | null;
}

export interface AdminArticlesPage {
  articles: AdminArticle[];
  next_before: number | null;
}

export interface AdminAiStats {
  daily: { tokens: number; calls: number };
  weekly: { tokens: number; calls: number };
  by_provider: Array<{ provider: string; total_tokens: number; call_count: number }>;
  by_endpoint: Array<{ endpoint: string; call_count: number }>;
  possible_errors_7d: number;
}

export interface AdminToolStatsTool {
  name: string;
  count: number;
  succeeded: number;
  failed: number;
  thrown_errors: number;
  logging_gap: number;
  success_rate: number | null;
  last_at: number;
}

export interface AdminToolStats {
  window_days: number;
  total_calls: number;
  server_calls: number;
  client_calls: number;
  messages_with_tools: number;
  by_tool: AdminToolStatsTool[];
}

export interface AdminHealth {
  recent_pulls: Array<{
    id: string;
    status: string;
    completed_at: number;
    stats: unknown;
  }>;
  feeds_with_errors: number;
  total_users: number;
  total_articles: number;
  articles_scored_last_hour: number;
}

export interface AdminScrapingStats {
  fetched_1h: number;
  fetched_24h: number;
  on_cooldown: number;
  total_with_errors: number;
  avg_extraction_quality_24h: number | null;
  by_scrape_mode: Array<{ scrape_mode: string; fetch_count: number }>;
  recent_errors: Array<{
    article_id: string;
    title: string | null;
    error: string;
    attempted_at: number;
    feed_title: string | null;
  }>;
}

export interface AdminBriefRow {
  id: string;
  user_id: string;
  user_email: string | null;
  edition_kind: string;
  edition_slot: string;
  timezone: string;
  status: string;
  generated_at: number;
  candidate_count: number;
  provider: string | null;
  model: string | null;
  source_count: number;
}

export interface AdminBriefsPage {
  briefs: AdminBriefRow[];
  next_before: number | null;
}
