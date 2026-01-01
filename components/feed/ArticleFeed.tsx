'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/lib/types';
import ArticleCard from '@/components/articles/ArticleCard';
import { ArticleListSkeleton } from '@/components/ui/Skeleton';
import { getUserId, addToReadingHistory } from '@/lib/utils/user';

interface ArticleFeedProps {
  feedType?: 'all' | 'personalized' | 'trending' | 'followed' | 'bookmarked';
  limit?: number;
}

export default function ArticleFeed({
  feedType = 'all',
  limit = 50,
}: ArticleFeedProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchArticles(0, true);
  }, [feedType]);

  const fetchArticles = async (offset: number, reset: boolean = false) => {
    try {
      setLoading(true);
      const userId = getUserId();

      let url = `/api/articles?feed=${feedType}&limit=${limit}&offset=${offset}`;
      if (userId) {
        url += `&userId=${userId}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch articles');
      }

      const newArticles = data.articles || [];
      setArticles(reset ? newArticles : [...articles, ...newArticles]);
      setHasMore(newArticles.length === limit);
      setError(null);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchArticles(newPage * limit, false);
  };

  const handleArticleRead = async (article: Article) => {
    try {
      const userId = getUserId();

      // Add to local reading history
      addToReadingHistory({
        articleId: article.id,
        title: article.title,
        readAt: new Date().toISOString(),
      });

      // Record read in database
      if (userId) {
        await fetch('/api/user/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articleId: article.id,
            userId,
          }),
        });
      }
    } catch (error) {
      console.error('Error recording article read:', error);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-medium">{error}</p>
        </div>
        <button
          onClick={() => fetchArticles(0, true)}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (loading && articles.length === 0) {
    return <ArticleListSkeleton count={10} />;
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-12 h-12 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          No articles found
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Check back later for new content
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onRead={handleArticleRead}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center py-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
