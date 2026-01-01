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
  getUserId,
} from '@/lib/utils/user';

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
  const [showMore, setShowMore] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const userId = getUserId();

      if (isBookmarked) {
        unbookmarkArticle(article.id);
        setIsBookmarked(false);

        // Also remove from database
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
    <article className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="block"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                {article.title}
              </h3>
            </a>

            {/* Source and metadata row */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                {domain}
              </span>

              {article.is_trending && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 text-orange-700 dark:text-orange-300 rounded-full font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  Trending
                </span>
              )}

              {article.reliability_score !== null && article.reliability_score >= 7 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 rounded-full font-medium text-xs">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Bookmark button */}
          <button
            onClick={handleBookmark}
            className="flex-shrink-0 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
          >
            {isBookmarked ? (
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </button>
        </div>

        {/* Content snippet - Collapsible */}
        {article.content_snippet && (
          <div>
            <p className={`text-gray-600 dark:text-gray-400 leading-relaxed ${!showMore ? 'line-clamp-2' : ''}`}>
              {article.content_snippet}
            </p>
            {article.content_snippet.length > 150 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {showMore ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* AI Summary */}
        {article.summary && (
          <div>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-xl text-sm font-medium hover:shadow-md transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
              {showSummary ? 'Hide' : 'Show'} AI Summary
            </button>
            {showSummary && (
              <div className="mt-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer metadata */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
          {showAuthor && article.author_name && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {article.author_id ? (
                <Link
                  href={`/authors/${article.author_id}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {article.author_name}
                </Link>
              ) : (
                <span className="font-medium">{article.author_name}</span>
              )}
            </div>
          )}

          {article.published_at && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{formatRelativeTime(article.published_at)}</span>
            </div>
          )}

          {article.bias_score && article.bias_score !== 'Unknown' && (
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBiasColor(article.bias_score)}`}>
                {article.bias_score}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
