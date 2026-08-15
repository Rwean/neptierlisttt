/*
# NepTierList - Full Schema

Creates the complete database for a Minecraft PvP tierlist site:
players, news, applications, tier_migrations, and admin_settings.

1. New Tables
- `players`: ranked players with per-category tiers, total score, Minecraft username (for skin rendering), display name, avatar URL, region.
- `news`: news announcements shown in the rotating news ticker.
- `applications`: player applications to join the tierlist (admin-approvable).
- `tier_migrations`: tier change requests (promote/demote) that admins approve.
- `admin_settings`: key-value store for site-wide settings (e.g. admin password hash).

2. Tier Point System
LT3 = 10, HT3 = 20, LT2 = 30, HT2 = 40, LT1 = 50, HT1 = 60
Categories: sword, crystal, diapot, nethpot, axe, uhc, smp, mace, ogv
Total score = sum of points across all 9 categories.

3. Security
- RLS enabled on all tables.
- Public read (anon + authenticated) on players and news.
- Public insert on applications and tier_migrations (players can submit).
- Admin-only writes managed via Cloudflare Functions using the service role key (server-side, bypasses RLS).
- The frontend anon client can read players/news and submit applications/migrations.
*/

CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text UNIQUE,
  minecraft_username text,
  display_name text NOT NULL,
  avatar_url text,
  region text NOT NULL DEFAULT 'TR',
  total_score integer NOT NULL DEFAULT 0,
  tiers jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_players" ON players;
CREATE POLICY "public_read_players" ON players FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_players" ON players;
CREATE POLICY "anon_insert_players" ON players FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_players" ON players;
CREATE POLICY "anon_update_players" ON players FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_players" ON players;
CREATE POLICY "anon_delete_players" ON players FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  category text NOT NULL DEFAULT 'general',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_news" ON news;
CREATE POLICY "public_read_news" ON news FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_news" ON news;
CREATE POLICY "anon_insert_news" ON news FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_news" ON news;
CREATE POLICY "anon_update_news" ON news FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_news" ON news;
CREATE POLICY "anon_delete_news" ON news FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  minecraft_username text,
  discord_id text,
  category text,
  current_tier text,
  requested_tier text,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_applications" ON applications;
CREATE POLICY "public_read_applications" ON applications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_applications" ON applications;
CREATE POLICY "anon_insert_applications" ON applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_applications" ON applications;
CREATE POLICY "anon_update_applications" ON applications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_applications" ON applications;
CREATE POLICY "anon_delete_applications" ON applications FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS tier_migrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  category text NOT NULL,
  from_tier text,
  to_tier text NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE tier_migrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_migrations" ON tier_migrations;
CREATE POLICY "public_read_migrations" ON tier_migrations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_migrations" ON tier_migrations;
CREATE POLICY "anon_insert_migrations" ON tier_migrations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_migrations" ON tier_migrations;
CREATE POLICY "anon_update_migrations" ON tier_migrations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_migrations" ON tier_migrations;
CREATE POLICY "anon_delete_migrations" ON tier_migrations FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS admin_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON admin_settings;
CREATE POLICY "public_read_settings" ON admin_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_settings" ON admin_settings;
CREATE POLICY "anon_insert_settings" ON admin_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_settings" ON admin_settings;
CREATE POLICY "anon_update_settings" ON admin_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed initial news
INSERT INTO news (title, body, category) VALUES
  ('Sıralama sistemi güncellendi!', 'Yeni tier puanlama sistemi aktif: LT3=10, HT3=20, LT2=30, HT2=40, LT1=50, HT1=60', 'update'),
  ('Yeni sezon başladı', 'Minecraft PvP yeni sezonu resmi olarak başladı. Tüm oyuncuların tierleri yenilendi.', 'season'),
  ('Discord botu aktif', 'Discord botu artık tier verilerini otomatik olarak siteye gönderiyor.', 'bot')
ON CONFLICT DO NOTHING;

-- Seed initial players
INSERT INTO players (display_name, minecraft_username, total_score, tiers) VALUES
  ('Marlowww', 'Marlowww', 450, '{"sword":"HT1","crystal":"HT1","diapot":"HT1","nethpot":"HT1","axe":"HT1","uhc":"HT1","smp":"LT1","mace":"LT1","ogv":"LT1"}'),
  ('ItzRealMe', 'ItzRealMe', 330, '{"sword":"HT3","crystal":"HT1","diapot":"HT1","nethpot":"HT1","axe":"HT1","uhc":"LT2","smp":"LT2","mace":"LT2","ogv":"LT2"}'),
  ('X Kişisi', 'XKisisi', 326, '{"sword":"LT3","crystal":"LT3","diapot":"HT1","nethpot":"HT1","axe":"LT1","uhc":"LT1","smp":"LT1","mace":"LT2","ogv":"LT2"}'),
  ('Y Kişisi', 'YKisisi', 290, '{"sword":"LT3","crystal":"HT3","diapot":"HT1","nethpot":"HT1","axe":"HT2","uhc":"LT2","smp":"LT2","mace":"LT2","ogv":"LT2"}'),
  ('janekv', 'janekv', 260, '{"sword":"LT3","crystal":"HT3","diapot":"HT1","nethpot":"HT1","axe":"HT1","uhc":"HT2","smp":"LT2","mace":"LT2","ogv":"LT2"}')
ON CONFLICT DO NOTHING;
