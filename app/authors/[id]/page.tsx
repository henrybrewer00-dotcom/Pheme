'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Author, Article } from '@/lib/types';
import ArticleCard from '@/components/articles/ArticleCard';
import { ArticleListSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import {
  isAuthorFollowed,
  followAuthor,
  unfollowAuthor,
  getUserId,
} from '@/lib/utils/user';
import { generateAvatarUrl } from '@/lib/utils/helpers';

export default function AuthorPage() {
  const params = useParams();
  const authorId = params.id as string;

  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authorId) {
      fetchAuthor();
      setFollowing(isAuthorFollowed(authorId));
    }
  }, [authorId]);

  const fetchAuthor = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/authors/${authorId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch author');
      }

      setAuthor(data.author);
      setArticles(data.articles || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching author:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const userId = getUserId();

      if (following) {
        unfollowAuthor(authorId);
        setFollowing(false);

        // Also remove from database
        await fetch(
          `/api/user/follow?authorId=${authorId}&userId=${userId}`,
          {
            method: 'DELETE',
          }
        );
      } else {
        followAuthor(authorId);
        setFollowing(true);

        // Also save to database
        await fetch('/api/user/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authorId,
            userId,
          }),
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <ArticleListSkeleton count={5} />
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600 dark:text-red-400">
          {error || 'Author not found'}
        </p>
      </div>
    );
  }

  const avatarUrl =
    author.avatar_url || generateAvatarUrl(author.name);

  return (
    <div className="space-y-8">
      {/* Author header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-start space-x-6">
          <img
            src={avatarUrl}
            alt={author.name}
            className="w-24 h-24 rounded-full"
          />

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {author.name}
                </h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{author.article_count} articles</span>
                  <span>•</span>
                  <span>{author.followed_count} followers</span>
                </div>
              </div>

              <Button
                variant={following ? 'secondary' : 'primary'}
                onClick={handleFollowToggle}
              >
                {following ? 'Following' : 'Follow'}
              </Button>
            </div>

            {author.bio && (
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                {author.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Articles */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Articles by {author.name}
        </h2>

        {articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                showAuthor={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              No articles found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
