-- ============================================
-- MATCHUP SUPABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: Drop old custom users table
-- ============================================
DROP TABLE IF EXISTS users_matches CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS matches CASCADE;

-- ============================================
-- STEP 2: Create profiles table (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name VARCHAR(120),
  role TEXT CHECK (role IN ('player', 'organiser')) DEFAULT 'player',
  favourites INT DEFAULT 0,
  profile_image TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- STEP 3: Create matches table
-- ============================================
CREATE TABLE matches (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2),
  date DATE,
  location TEXT,
  time TIME,
  pax INT2,
  host UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Policies for matches
CREATE POLICY "Matches are viewable by everyone"
  ON matches FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create matches"
  ON matches FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own matches"
  ON matches FOR UPDATE
  USING (auth.uid() = host);

CREATE POLICY "Users can delete own matches"
  ON matches FOR DELETE
  USING (auth.uid() = host);

-- ============================================
-- STEP 4: Create users_matches junction table
-- ============================================
CREATE TABLE users_matches (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id BIGINT REFERENCES matches(id) ON DELETE CASCADE,
  payment_success BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, match_id)
);

-- Enable Row Level Security
ALTER TABLE users_matches ENABLE ROW LEVEL SECURITY;

-- Policies for users_matches
CREATE POLICY "Users can view their own match registrations"
  ON users_matches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Match hosts can view their match registrations"
  ON users_matches FOR SELECT
  USING (auth.uid() IN (
    SELECT host FROM matches WHERE id = match_id
  ));

CREATE POLICY "Users can register for matches"
  ON users_matches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unregister from matches"
  ON users_matches FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STEP 5: Create indexes for performance
-- ============================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_matches_date ON matches(date);
CREATE INDEX idx_matches_host ON matches(host);
CREATE INDEX idx_users_matches_user_id ON users_matches(user_id);
CREATE INDEX idx_users_matches_match_id ON users_matches(match_id);

-- ============================================
-- STEP 6: Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    COALESCE(new.raw_user_meta_data->>'role', 'player')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- DONE! Your schema is ready.
-- ============================================
