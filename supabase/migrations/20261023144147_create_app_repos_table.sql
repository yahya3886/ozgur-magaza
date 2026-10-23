/*
# Create app_repos table for user-added app sources

## Purpose
Each signed-in user can add custom JSON URLs that serve as app repository sources
(similar to F-Droid repos). The app fetches app listings from the default F-Droid
source plus any user-added repos.

## New Tables
- `app_repos`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users with cascade delete)
  - `name` (text, not null) — display name for the repo source
  - `url` (text, not null) — JSON URL to fetch app data from
  - `is_default` (boolean, default false) — whether this is a default repo
  - `enabled` (boolean, default true) — whether the repo is active
  - `created_at` (timestamptz, default now())

## Security
- Enable RLS on `app_repos`.
- Grant CRUD to `authenticated` only (sign-in required).
- Owner-scoped policies: each user can only CRUD their own repo entries.
- `user_id` defaults to `auth.uid()` so inserts work even when the client omits it.
*/

CREATE TABLE IF NOT EXISTS app_repos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_repos ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON app_repos TO authenticated;

DROP POLICY IF EXISTS "select_own_repos" ON app_repos;
CREATE POLICY "select_own_repos" ON app_repos FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_repos" ON app_repos;
CREATE POLICY "insert_own_repos" ON app_repos FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_repos" ON app_repos;
CREATE POLICY "update_own_repos" ON app_repos FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_repos" ON app_repos;
CREATE POLICY "delete_own_repos" ON app_repos FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
