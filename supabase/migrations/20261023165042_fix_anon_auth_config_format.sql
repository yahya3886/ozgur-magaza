/*
# Fix Anonymous Sign-In Config Format

1. Changes
- Update auth.instances raw_base_config with correct GoTrue configuration format.
- GoTrue expects anonymous sign-in under "external.anonymous.enabled".
- Set site_url to the actual deployed bolt.host URL.
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
  "site_url": "https://open-source-app-stor-alw0.bolt.host"
}'
WHERE id = 'dad3e545-1f4a-44b1-a79a-9627538594c8';
