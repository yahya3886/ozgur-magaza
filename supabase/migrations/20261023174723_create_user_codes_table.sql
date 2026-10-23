/*
# Create User Codes Table for Guest Hash Login

1. New Tables
- `user_codes`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users, defaults to current authenticated user)
  - `code_hash` (text, unique — the guest's hash code that identifies their session)
  - `display_name` (text, default 'Misafir')
  - `created_at` (timestamptz)

2. Security
- Enable RLS on `user_codes`.
- Grant SELECT, INSERT to `authenticated` (anon users get authenticated role from Supabase anonymous auth).
- SELECT: users can read only their own code row.
- INSERT: users can insert only their own code row.
- DELETE: users can delete their own code row (account deletion).
- No UPDATE needed.

3. Important Notes
- When a guest signs in anonymously, a random hash code is generated and stored.
- The user can copy this hash code to restore their session later on another device.
- The hash code is stored as a SHA-256 hash for security — the plain code is shown to the user once.
*/

CREATE TABLE IF NOT EXISTS user_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  code_hash text UNIQUE NOT NULL,
  display_name text NOT NULL DEFAULT 'Misafir',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_codes ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON user_codes TO authenticated;

DROP POLICY IF EXISTS "select_own_user_code" ON user_codes;
CREATE POLICY "select_own_user_code"
  ON user_codes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_user_code" ON user_codes;
CREATE POLICY "insert_own_user_code"
  ON user_codes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_user_code" ON user_codes;
CREATE POLICY "delete_own_user_code"
  ON user_codes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_codes_code_hash ON user_codes(code_hash);
