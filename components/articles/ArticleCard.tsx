'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import {
  formatRelativeTime,
  extractDomain,
  getBiasColor,
  getReliabilityColor,
  truncateText,
} from '@/lib/utils/helpers';
import {
  isArticleBookmarked,
  bookmarkArticle,
  unbookmarkArticle,
} from '@/lib/utils/user';
import Button from '@/components/ui/Button';

interface ArticleCardProps {
  article: Article;
  showAuthor?: boolean;
  onRead?: (article: Article) => void;
}

export default function ArticleCard({
  article,
  showAuthor = true,
  onRead,
}: ArticleCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(
    isArticleBookmarked(article.id)
  );
  const [showSummary, setShowSummary] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isBookmarked) {
        unbookmarkArticle(article.id);
        setIsBookmarked(false);

        // Also remove from database
        const userId = localStorage.getItem('pheme_user_id');
        if (userId) {
          await fetch(
            `/api/user/bookmark?articleId=${article.id}&userId=${userId}`,
            {
              method: 'DELETE',
            }
          );
        }
      } else {
        bookmarkArticle(article.id);
        setIsBookmarked(true);

        // Also save to database
        const userId = localStorage.getItem('pheme_user_id');
        if (userId) {
          await fetch('/api/user/bookmark', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              articleId: article.id,
              userId,
            }),
          });
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleClick = () => {
    if (onRead) {
      onRead(article);
    }
  };

  const domain = extractDomain(article.url);

  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="group"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {article.title}
              </h3>
            </a>
          </div>

          {/* Bookmark button */}
          <button
            onClick={handleBookmark}
            className="ml-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
          >
            {isBookmarked ? (
              <svg
                className="w-5 h-5 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Content snippet */}
        {article.content_snippet && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {truncateText(article.content_snippet, 200)}
          </p>
        )}

        {/* Summary toggle */}
        {article.summary && (
          <div>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showSummary ? 'Hide' : 'Show'} AI Summary
            </button>
            {showSummary && (
              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {article.summary}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          {/* Source */}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {domain}
          </span>

          {/* Author */}
          {showAuthor && article.author_name && (
            <>
              <span>•</span>
              {article.author_id ? (
                <Link
                  href={`/authors/${article.author_id}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {article.author_name}
                </Link>
              ) : (
                <span>{article.author_name}</span>
              )}
            </>
          )}

          {/* Published date */}
          {article.published_at && (
            <>
              <span>•</span>
              <span>{formatRelativeTime(article.published_at)}</span>
            </>
          )}

          {/* Reliability score */}
          {article.reliability_score !== null && (
            <>
              <span>•</span>
              <span
                className={getReliabilityColor(article.reliability_score)}
                title="Reliability score"
              >
                {article.reliability_score.toFixed(1)}/10
              </span>
            </>
          )}

          {/* Bias indicator */}
          {article.bias_score && article.bias_score !== 'Unknown' && (
            <>
              <span>•</span>
              <span className={getBiasColor(article.bias_score)}>
                {article.bias_score}
              </span>
            </>
          )}

          {/* Trending indicator */}
          {article.is_trending && (
            <>
              <span>•</span>
              <span className="inline-flex items-center text-orange-600 dark:text-orange-400">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                    clipRule="evenodd"
                  />
                </svg>
                Trending
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
