/*
# Enable Email Auto-Confirm

1. Changes
- Set mailer_autoconfirm to true so users can sign up without email confirmation.
- This avoids SMTP rate limit issues when many users register.
- Password reset still works through the recovery flow (PASSWORD_RECOVERY event).
*/

UPDATE auth.instances
SET raw_base_config = jsonb_set(
  raw_base_config::jsonb,
  '{mailer_autoconfirm}',
  'true'
)::text
WHERE id = 'dad3e545-1f4a-44b1-a79a-9627538594c8';
