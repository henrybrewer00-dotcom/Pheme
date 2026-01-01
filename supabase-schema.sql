-- Pheme AI News Aggregator Database Schema
-- This schema should be executed in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  followed_count INTEGER DEFAULT 0,
  article_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on normalized_name for faster lookups
CREATE INDEX IF NOT EXISTS idx_authors_normalized_name ON authors(normalized_name);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  summary TEXT,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  author_name TEXT,
  source TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  reliability_score DECIMAL(3,1) CHECK (reliability_score >= 0 AND reliability_score <= 10),
  bias_score TEXT CHECK (bias_score IN ('Left', 'Center-Left', 'Center', 'Center-Right', 'Right', 'Unknown')),
  content_snippet TEXT,
  image_url TEXT,
  category TEXT,
  is_trending BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
CREATE INDEX IF NOT EXISTS idx_articles_is_trending ON articles(is_trending) WHERE is_trending = TRUE;
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);

-- User reads table (tracks reading history)
CREATE TABLE IF NOT EXISTS user_reads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_cookie_id TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user reads
CREATE INDEX IF NOT EXISTS idx_user_reads_user_cookie_id ON user_reads(user_cookie_id);
CREATE INDEX IF NOT EXISTS idx_user_reads_article_id ON user_reads(article_id);
CREATE INDEX IF NOT EXISTS idx_user_reads_read_at ON user_reads(read_at DESC);

-- Create unique constraint to prevent duplicate reads
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_reads_unique ON user_reads(article_id, user_cookie_id);

-- User follows table (tracks author follows)
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  user_cookie_id TEXT NOT NULL,
  followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user follows
CREATE INDEX IF NOT EXISTS idx_user_follows_user_cookie_id ON user_follows(user_cookie_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_author_id ON user_follows(author_id);

-- Create unique constraint to prevent duplicate follows
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_follows_unique ON user_follows(author_id, user_cookie_id);

-- User bookmarks table (saved articles with tags)
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_cookie_id TEXT NOT NULL,
  tags TEXT[], -- array of tags
  notes TEXT,
  bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user bookmarks
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_cookie_id ON user_bookmarks(user_cookie_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_article_id ON user_bookmarks(article_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_bookmarked_at ON user_bookmarks(bookmarked_at DESC);

-- Create unique constraint to prevent duplicate bookmarks
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_bookmarks_unique ON user_bookmarks(article_id, user_cookie_id);

-- Article topics/tags table (for categorization)
CREATE TABLE IF NOT EXISTS article_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  relevance_score DECIMAL(3,2) CHECK (relevance_score >= 0 AND relevance_score <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for article topics
CREATE INDEX IF NOT EXISTS idx_article_topics_article_id ON article_topics(article_id);
CREATE INDEX IF NOT EXISTS idx_article_topics_topic ON article_topics(topic);

-- Related articles table (for clustering similar stories)
CREATE TABLE IF NOT EXISTS related_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  related_article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  similarity_score DECIMAL(3,2) CHECK (similarity_score >= 0 AND similarity_score <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT different_articles CHECK (article_id != related_article_id)
);

-- Create indexes for related articles
CREATE INDEX IF NOT EXISTS idx_related_articles_article_id ON related_articles(article_id);
CREATE INDEX IF NOT EXISTS idx_related_articles_related_article_id ON related_articles(related_article_id);

-- User preferences table (for personalization settings)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_cookie_id TEXT NOT NULL UNIQUE,
  preferred_topics TEXT[],
  blocked_sources TEXT[],
  email TEXT,
  email_digest_frequency TEXT CHECK (email_digest_frequency IN ('daily', 'weekly', 'never')),
  dark_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_cookie_id ON user_preferences(user_cookie_id);

-- Notifications table (for followed author updates)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_cookie_id TEXT NOT NULL,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('new_article', 'trending_topic', 'followed_author')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_cookie_id ON notifications(user_cookie_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Functions and Triggers

-- Function to update author's followed count
CREATE OR REPLACE FUNCTION update_author_followed_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE authors SET followed_count = followed_count + 1 WHERE id = NEW.author_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE authors SET followed_count = GREATEST(followed_count - 1, 0) WHERE id = OLD.author_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for author followed count
DROP TRIGGER IF EXISTS trigger_update_author_followed_count ON user_follows;
CREATE TRIGGER trigger_update_author_followed_count
  AFTER INSERT OR DELETE ON user_follows
  FOR EACH ROW EXECUTE FUNCTION update_author_followed_count();

-- Function to update author's article count
CREATE OR REPLACE FUNCTION update_author_article_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.author_id IS NOT NULL THEN
    UPDATE authors SET article_count = article_count + 1 WHERE id = NEW.author_id;
  ELSIF TG_OP = 'DELETE' AND OLD.author_id IS NOT NULL THEN
    UPDATE authors SET article_count = GREATEST(article_count - 1, 0) WHERE id = OLD.author_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for author article count
DROP TRIGGER IF EXISTS trigger_update_author_article_count ON articles;
CREATE TRIGGER trigger_update_author_article_count
  AFTER INSERT OR DELETE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_author_article_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS trigger_articles_updated_at ON articles;
CREATE TRIGGER trigger_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_authors_updated_at ON authors;
CREATE TRIGGER trigger_authors_updated_at
  BEFORE UPDATE ON authors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_user_bookmarks_updated_at ON user_bookmarks;
CREATE TRIGGER trigger_user_bookmarks_updated_at
  BEFORE UPDATE ON user_bookmarks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER trigger_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create notifications for followed authors' new articles
CREATE OR REPLACE FUNCTION notify_followers_on_new_article()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notifications if the article has an author
  IF NEW.author_id IS NOT NULL THEN
    -- Insert notifications for all users who follow this author
    INSERT INTO notifications (user_cookie_id, article_id, author_id, type)
    SELECT
      user_cookie_id,
      NEW.id,
      NEW.author_id,
      'followed_author'
    FROM user_follows
    WHERE author_id = NEW.author_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to notify followers when a new article is published
DROP TRIGGER IF EXISTS trigger_notify_followers_on_new_article ON articles;
CREATE TRIGGER trigger_notify_followers_on_new_article
  AFTER INSERT ON articles
  FOR EACH ROW EXECUTE FUNCTION notify_followers_on_new_article();

-- Enable Row Level Security (RLS) - Optional, uncomment if needed
-- ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_reads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (if RLS is enabled)
-- Example: Allow all users to read articles
-- CREATE POLICY "Allow public read access" ON articles FOR SELECT USING (true);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Insert some seed data for testing (optional)
-- INSERT INTO authors (name, normalized_name, bio) VALUES
--   ('John Doe', 'john-doe', 'Technology journalist covering AI and machine learning'),
--   ('Jane Smith', 'jane-smith', 'Political correspondent for major news outlets');

COMMENT ON TABLE articles IS 'Stores news articles aggregated from various sources';
COMMENT ON TABLE authors IS 'Stores author information and profiles';
COMMENT ON TABLE user_reads IS 'Tracks user reading history for personalization';
COMMENT ON TABLE user_follows IS 'Tracks which authors users follow';
COMMENT ON TABLE user_bookmarks IS 'Stores user-saved articles with tags';
COMMENT ON TABLE article_topics IS 'Tags and categorizes articles by topic';
COMMENT ON TABLE related_articles IS 'Links related articles covering the same story';
COMMENT ON TABLE user_preferences IS 'Stores user preferences and settings';
COMMENT ON TABLE notifications IS 'Manages notifications for followed authors and trending topics';
