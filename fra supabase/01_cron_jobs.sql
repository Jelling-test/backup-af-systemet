-- =====================================================
-- CRON JOBS BACKUP - Jelling Camping Strømstyring
-- Eksporteret: 14. december 2025
-- =====================================================

-- VIGTIGT: Erstat [SERVICE_ROLE_KEY] og [ANON_KEY] med dine egne nøgler
-- før du kører disse statements på en ny Supabase instans.

-- =====================================================
-- 1. Edge Function CRON Jobs (8 stk)
-- =====================================================

-- Archive and cleanup hourly
SELECT cron.schedule(
  'archive-and-cleanup-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://[DIN_SUPABASE_URL]/functions/v1/archive-meter-readings',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer [SERVICE_ROLE_KEY]'
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);

-- Check low power every 5 min
SELECT cron.schedule(
  'check-low-power-every-5min',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://[DIN_SUPABASE_URL]/functions/v1/check-low-power',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer [SERVICE_ROLE_KEY]'
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);

-- Cleanup expired customers (hourly)
SELECT cron.schedule(
  'cleanup-expired-customers',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://[DIN_SUPABASE_URL]/functions/v1/cleanup-expired-customers',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer [SERVICE_ROLE_KEY]'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Daily accounting report (23:59 UTC = 00:59 DK)
SELECT cron.schedule(
  'daily-accounting-report',
  '59 23 * * *',
  $$
  SELECT net.http_post(
    url := 'https://[DIN_SUPABASE_URL]/functions/v1/daily-accounting-report',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer [SERVICE_ROLE_KEY]'
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);

-- Daily package snapshot (23:59 UTC = 00:59 DK)
SELECT cron.schedule(
  'daily-package-snapshot-job',
  '59 23 * * *',
  $$
  SELECT net.http_post(
    url := 'https://[DIN_SUPABASE_URL]/functions/v1/daily-package-snapshot',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', '[ANON_KEY]'
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);

-- End cleaning power daily (14:00 UTC = 15:00 DK)
SELECT cron.schedule(
  'end-cleaning-power-daily',
  '0 14 * * *',
  $$
  SELECT net.http_post(
    url := 'https://[DIN_SUPABASE_URL]/functions/v1/end-cleaning-power',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer [SERVICE_ROLE_KEY]'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Scheduled emails daily (08:00 UTC = 09:00 DK)
SELECT cron.schedule(
  'scheduled-emails-daily',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://[DIN_SUPABASE_URL]/functions/v1/scheduled-emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer [SERVICE_ROLE_KEY]'
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);

-- Start cleaning power daily (09:00 UTC = 10:00 DK)
SELECT cron.schedule(
  'start-cleaning-power-daily',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://[DIN_SUPABASE_URL]/functions/v1/start-cleaning-power',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer [SERVICE_ROLE_KEY]'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- =====================================================
-- 2. SQL Function CRON Jobs (5 stk)
-- =====================================================

-- Auto shutoff meters without package (every 5 min)
SELECT cron.schedule(
  'auto-shutoff-meters-every-5min',
  '*/5 * * * *',
  'SELECT auto_shutoff_meters_without_package()'
);

-- Cleanup checked out webhooks (weekly, Sunday 03:00 UTC)
SELECT cron.schedule(
  'cleanup-checked-out-webhooks-weekly',
  '0 3 * * 0',
  'SELECT public.cleanup_checked_out_webhooks()'
);

-- Cleanup expired customers daily (16:00 UTC = 17:00 DK)
SELECT cron.schedule(
  'cleanup-expired-customers-daily',
  '0 16 * * *',
  'SELECT manual.cleanup_expired_customers()'
);

-- Daily meter identity snapshot (03:00 UTC = 04:00 DK)
SELECT cron.schedule(
  'daily-meter-identity-snapshot',
  '0 3 * * *',
  'SELECT take_meter_identity_snapshot()'
);

-- Refresh latest readings every minute
SELECT cron.schedule(
  'refresh-latest-readings-every-minute',
  '* * * * *',
  'SELECT refresh_latest_meter_readings()'
);
