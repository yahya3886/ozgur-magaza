/*
# Fix Anonymous Sign-In Provider Name

1. Changes
- The GoTrue provider for anonymous sign-ins is named "anonymous_users", not "anonymous".
- The environment variable is GOTRUE_EXTERNAL_ANONYMOUS_USERS_ENABLED.
- Update raw_base_config to use the correct key: external.anonymous_users.enabled = true.
- Also add client_id and secret which GoTrue requires for external providers.
*/

UPDATE auth.instances
SET raw_base_config = '{
  "external": {
    "anonymous_users": {
      "enabled": true,
      "client_id": "anonymous_users_client_id",
      "secret": "anonymous_users_secret"
    }
  },
  "mailer_confirm_email": true,
  "mailer_otp_exp": 86400,
  "site_url": "https://open-source-app-stor-alw0.bolt.host",
  "uri_allowlist": [
    "https://open-source-app-stor-alw0.bolt.host",
    "https://open-source-app-stor-alw0.bolt.host/**",
    "https://ksvwcqcdyxfcfkchunyg.supabase.co/**"
  ]
}'
WHERE id = 'dad3e545-1f4a-44b1-a79a-9627538594c8';
