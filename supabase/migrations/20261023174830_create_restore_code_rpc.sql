/*
# Create Restore Code RPC Function

1. New Functions
- `restore_code(code_text text)` — SECURITY DEFINER function that:
  - Takes a guest code as input
  - Looks up the code in user_codes table
  - If found, updates the user_id to the current authenticated user (transferring the code identity)
  - Returns the display_name if successful, or null if code not found
  - This allows users to restore their guest identity with their code on a new device

2. Security
- SECURITY DEFINER: runs with elevated privileges to update another user's row
- REVOKE EXECUTE from PUBLIC and anon
- GRANT EXECUTE to authenticated only
- The function only updates user_id, not the code itself

3. Important Notes
- When a guest enters their code on a new device, a new anonymous session is created,
  then this function transfers the old code identity to the new session.
- The code itself is never exposed to other users.
*/

CREATE OR REPLACE FUNCTION restore_code(code_text text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  found_display_name text;
  found_id uuid;
BEGIN
  SELECT id, display_name INTO found_id, found_display_name
  FROM user_codes
  WHERE code_hash = code_text
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  UPDATE user_codes
  SET user_id = auth.uid()
  WHERE id = found_id;

  RETURN found_display_name;
END;
$$;

REVOKE EXECUTE ON FUNCTION restore_code(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION restore_code(text) TO authenticated;
