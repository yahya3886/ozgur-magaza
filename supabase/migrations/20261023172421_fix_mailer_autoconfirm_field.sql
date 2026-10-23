/*
# Fix Email Sending Configuration

1. Changes
- Rename "mailer_confirm_email" to "mailer_autoconfirm" (correct GoTrue field name).
- Set mailer_autoconfirm to false so confirmation and password reset emails are actually sent.
- Add SMTP configuration fields so GoTrue can send emails.
- Keep all other existing config (anonymous_users, site_url, uri_allowlist) unchanged.

2. Important Notes
- The previous config used "mailer_confirm_email" which is not a recognized GoTrue field,
  so GoTrue defaulted mailer_autoconfirm to true (auto-confirm on, no emails sent).
- With mailer_autoconfirm: false, GoTrue will send confirmation emails on signup
  and recovery emails on password reset.
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
  "mailer_autoconfirm": false,
  "mailer_otp_exp": 86400,
  "site_url": "https://open-source-app-stor-alw0.bolt.host",
  "uri_allowlist": [
    "https://open-source-app-stor-alw0.bolt.host",
    "https://open-source-app-stor-alw0.bolt.host/**",
    "https://ksvwcqcdyxfcfkchunyg.supabase.co/**"
  ]
}'
WHERE id = 'dad3e545-1f4a-44b1-a79a-9627538594c8';
