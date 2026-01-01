import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          url: string;
          summary: string | null;
          author_id: string | null;
          author_name: string | null;
          source: string;
          published_at: string | null;
          reliability_score: number | null;
          bias_score: string | null;
          content_snippet: string | null;
          image_url: string | null;
          category: string | null;
          is_trending: boolean;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          url: string;
          summary?: string | null;
          author_id?: string | null;
          author_name?: string | null;
          source: string;
          published_at?: string | null;
          reliability_score?: number | null;
          bias_score?: string | null;
          content_snippet?: string | null;
          image_url?: string | null;
          category?: string | null;
          is_trending?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          url?: string;
          summary?: string | null;
          author_id?: string | null;
          author_name?: string | null;
          source?: string;
          published_at?: string | null;
          reliability_score?: number | null;
          bias_score?: string | null;
          content_snippet?: string | null;
          image_url?: string | null;
          category?: string | null;
          is_trending?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      authors: {
        Row: {
          id: string;
          name: string;
          normalized_name: string;
          bio: string | null;
          avatar_url: string | null;
          followed_count: number;
          article_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          normalized_name: string;
          bio?: string | null;
          avatar_url?: string | null;
          followed_count?: number;
          article_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          normalized_name?: string;
          bio?: string | null;
          avatar_url?: string | null;
          followed_count?: number;
          article_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_reads: {
        Row: {
          id: string;
          article_id: string;
          user_cookie_id: string;
          read_at: string;
          read_duration: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          user_cookie_id: string;
          read_at?: string;
          read_duration?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          user_cookie_id?: string;
          read_at?: string;
          read_duration?: number | null;
          created_at?: string;
        };
      };
      user_follows: {
        Row: {
          id: string;
          author_id: string;
          user_cookie_id: string;
          followed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          user_cookie_id: string;
          followed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          user_cookie_id?: string;
          followed_at?: string;
          created_at?: string;
        };
      };
      user_bookmarks: {
        Row: {
          id: string;
          article_id: string;
          user_cookie_id: string;
          tags: string[] | null;
          notes: string | null;
          bookmarked_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          user_cookie_id: string;
          tags?: string[] | null;
          notes?: string | null;
          bookmarked_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          user_cookie_id?: string;
          tags?: string[] | null;
          notes?: string | null;
          bookmarked_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_cookie_id: string;
          article_id: string;
          author_id: string;
          type: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_cookie_id: string;
          article_id: string;
          author_id: string;
          type: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_cookie_id?: string;
          article_id?: string;
          author_id?: string;
          type?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
