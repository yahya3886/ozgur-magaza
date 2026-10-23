/*
# Fix redirect URL in auth config

1. Changes
- Update site_url in auth.instances to use the correct bolt.host URL.
- Ensure the bolt.host URL is in the uri_allowlist for redirect validation.
*/

UPDATE auth.instances
SET raw_base_config = '{
  "external": {
    "anonymous": {
      "enabled": true
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
