/*
# Create Chat Messages Table

1. New Tables
- `chat_messages`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users, defaults to current authenticated user)
  - `username` (text, display name shown in chat — derived from email or "Misafir" for anonymous)
  - `content` (text, the message content, max 500 chars)
  - `is_anonymous` (boolean, whether the sender is an anonymous user)
  - `created_at` (timestamptz, when the message was sent)

2. Security
- Enable RLS on `chat_messages`.
- Grant SELECT and INSERT to `authenticated` (all authenticated users can read and send messages — this is a public chat).
- Grant DELETE to `authenticated` but only for own messages (users can delete their own messages).
- SELECT policy: all authenticated users can read all messages (public chat).
- INSERT policy: authenticated users can insert messages with their own user_id.
- DELETE policy: users can only delete their own messages.
- No UPDATE — messages are immutable once sent.

3. Important Notes
- This is a public chat room where all signed-in users (including anonymous) can see all messages.
- Anonymous users get the `authenticated` role from Supabase, so they can participate.
- Messages are real-time via Supabase realtime subscriptions.
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL DEFAULT 'Misafir',
  content text NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 500),
  is_anonymous boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON chat_messages TO authenticated;

-- All authenticated users can read all messages (public chat)
DROP POLICY IF EXISTS "select_all_chat_messages" ON chat_messages;
CREATE POLICY "select_all_chat_messages"
  ON chat_messages FOR SELECT
  TO authenticated USING (true);

-- Users can only insert messages as themselves
DROP POLICY IF EXISTS "insert_own_chat_messages" ON chat_messages;
CREATE POLICY "insert_own_chat_messages"
  ON chat_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own messages
DROP POLICY IF EXISTS "delete_own_chat_messages" ON chat_messages;
CREATE POLICY "delete_own_chat_messages"
  ON chat_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Index for ordering by created_at
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages (created_at DESC);
