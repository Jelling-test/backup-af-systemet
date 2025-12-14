-- =====================================================
-- ORGANIZATIONS SEED DATA
-- Eksporteret: 14. december 2025
-- =====================================================

INSERT INTO organizations (id, name, organization_type, subscription_tier, settings, created_at, updated_at)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Jelling Camping',
  'camping',
  'pro',
  '{
    "email_settings": {
      "smtp_from": "stroem@jellingcamping.dk",
      "admin_email": "info@jellingcamping.dk",
      "bogholderi_email": "bogholderi@jellingcamping.dk"
    },
    "basis_pris_per_enhed": 4.5,
    "lav_strøm_threshold": 5
  }'::jsonb,
  '2025-10-26 14:35:22.210273+00',
  '2025-10-26 14:35:22.210273+00'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  settings = EXCLUDED.settings;
