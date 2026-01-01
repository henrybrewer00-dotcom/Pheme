export interface Article {
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
}

export interface Author {
  id: string;
  name: string;
  normalized_name: string;
  bio: string | null;
  avatar_url: string | null;
  followed_count: number;
  article_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserRead {
  id: string;
  article_id: string;
  user_cookie_id: string;
  read_at: string;
  read_duration: number | null;
  created_at: string;
}

export interface UserFollow {
  id: string;
  author_id: string;
  user_cookie_id: string;
  followed_at: string;
  created_at: string;
}

export interface UserBookmark {
  id: string;
  article_id: string;
  user_cookie_id: string;
  tags: string[] | null;
  notes: string | null;
  bookmarked_at: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_cookie_id: string;
  article_id: string;
  author_id: string;
  type: 'new_article' | 'trending_topic' | 'followed_author';
  is_read: boolean;
  created_at: string;
}

export interface ArticleWithAuthor extends Article {
  author?: Author;
}

export interface NotificationWithDetails extends Notification {
  article: Article;
  author: Author;
}

export type FeedType = 'all' | 'personalized' | 'followed' | 'trending' | 'bookmarked';

export type BiasScore = 'Left' | 'Center-Left' | 'Center' | 'Center-Right' | 'Right' | 'Unknown';
