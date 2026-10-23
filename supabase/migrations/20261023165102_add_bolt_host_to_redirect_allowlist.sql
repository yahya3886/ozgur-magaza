/*
# Add Bolt Host URL to Allowed Redirect URLs

1. Changes
- Update auth.instances raw_base_config to include the bolt.host site URL
  in the "uri_allowlist" so Supabase Auth accepts it as a valid redirect target.
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
    "https://open-source-app-stor-alw0.bolt.host/**"
  ]
}'
WHERE id = 'dad3e545-1f4a-44b1-a79a-9627538594c8';
