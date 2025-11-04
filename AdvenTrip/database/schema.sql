-- AdvenTrip Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/qbtrpfhmowgkihinczsw/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced with Clerk)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- Clerk user ID
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  interests TEXT[] DEFAULT '{}',
  visited_countries TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  destination TEXT NOT NULL,
  location_lat DECIMAL,
  location_lng DECIMAL,
  location_name TEXT,
  duration TEXT,
  images TEXT[] DEFAULT '{}',
  activities TEXT[] DEFAULT '{}',
  hotels TEXT[] DEFAULT '{}',
  restaurants TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_public BOOLEAN DEFAULT true,
  is_editable BOOLEAN DEFAULT false,
  is_bucket_list BOOLEAN DEFAULT false,
  saves_count INTEGER DEFAULT 0,
  reposts_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User interactions (for recommendation algorithm)
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('save', 'swipe_left', 'swipe_right', 'view', 'share', 'repost')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved posts
CREATE TABLE IF NOT EXISTS saved_posts (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- Reposts
CREATE TABLE IF NOT EXISTS reposts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  original_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Chats
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat participants
CREATE TABLE IF NOT EXISTS chat_participants (
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (chat_id, user_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'post_share', 'board_share')),
  shared_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences (for recommendation algorithm)
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  tag_scores JSONB DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_is_public ON posts(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_post_id ON interactions(post_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_user_id ON saved_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Posts policies
CREATE POLICY "Anyone can view public posts" ON posts FOR SELECT USING (is_public = true OR user_id = auth.uid()::text);
CREATE POLICY "Users can create own posts" ON posts FOR INSERT WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (user_id = auth.uid()::text);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (user_id = auth.uid()::text);

-- Interactions policies
CREATE POLICY "Users can view own interactions" ON interactions FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can create own interactions" ON interactions FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- Saved posts policies
CREATE POLICY "Users can view own saved posts" ON saved_posts FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can save posts" ON saved_posts FOR INSERT WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users can unsave posts" ON saved_posts FOR DELETE USING (user_id = auth.uid()::text);

-- Reposts policies
CREATE POLICY "Anyone can view reposts" ON reposts FOR SELECT USING (true);
CREATE POLICY "Users can create own reposts" ON reposts FOR INSERT WITH CHECK (user_id = auth.uid()::text);
CREATE POLICY "Users can delete own reposts" ON reposts FOR DELETE USING (user_id = auth.uid()::text);

-- Chat policies
CREATE POLICY "Users can view own chats" ON chats FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_participants 
    WHERE chat_participants.chat_id = chats.id 
    AND chat_participants.user_id = auth.uid()::text
  )
);

-- Chat participants policies
CREATE POLICY "Users can view participants of their chats" ON chat_participants FOR SELECT USING (
  chat_id IN (
    SELECT chat_id FROM chat_participants WHERE user_id = auth.uid()::text
  )
);

-- Messages policies
CREATE POLICY "Users can view messages in their chats" ON messages FOR SELECT USING (
  chat_id IN (
    SELECT chat_id FROM chat_participants WHERE user_id = auth.uid()::text
  )
);
CREATE POLICY "Users can send messages in their chats" ON messages FOR INSERT WITH CHECK (
  sender_id = auth.uid()::text AND
  chat_id IN (
    SELECT chat_id FROM chat_participants WHERE user_id = auth.uid()::text
  )
);

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (user_id = auth.uid()::text);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- Functions for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

