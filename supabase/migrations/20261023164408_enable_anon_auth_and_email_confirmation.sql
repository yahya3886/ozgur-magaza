/*
# Enable Anonymous Sign-In and Email Confirmation via Auth Config

1. Authentication Configuration Changes
- Insert a base config into auth.instances enabling anonymous sign-ins and email confirmation.
- This config is read by GoTrue (Supabase Auth) to control auth provider behavior.

2. Security
- No table or RLS changes — this only modifies auth service configuration.
*/

INSERT INTO auth.instances (id, uuid, raw_base_config)
VALUES (
  gen_random_uuid(),
  gen_random_uuid(),
  '{
    "anonymous_sign_in": { "enabled": true },
    "mailer_otp_exp": 86400,
    "mailer_confirm_email": true,
    "site_url": "https://ksvwcqcdyxfcfkchunyg.supabase.co"
  }'
)
ON CONFLICT DO NOTHING;
