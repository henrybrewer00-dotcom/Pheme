'use client';

import { useState, useEffect } from 'react';

interface RecapData {
  recap: string;
  articleCount: number;
  categories: { name: string; count: number }[];
  timestamp: string;
}

export default function RecapPage() {
  const [recapData, setRecapData] = useState<RecapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecap();
  }, []);

  const fetchRecap = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recap');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recap');
      }

      setRecapData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching recap:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4" />
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Generating your daily recap...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          AI is analyzing yesterday's news
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-2xl mb-4">
          <svg
            className="w-10 h-10 text-red-600 dark:text-red-400"
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
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {error}
        </p>
        <button
          onClick={fetchRecap}
          className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-xl mb-4">
          <svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Daily Recap
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your AI-powered summary of the last 24 hours
        </p>
      </div>

      {/* Stats */}
      {recapData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-xl">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Articles Analyzed
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {recapData.articleCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500 rounded-xl">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Categories
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {recapData.categories.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {recapData && recapData.categories.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Coverage Breakdown
          </h2>
          <div className="flex flex-wrap gap-3">
            {recapData.categories.map((category) => (
              <div
                key={category.name}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium border border-blue-200 dark:border-blue-800"
              >
                <span>{category.name}</span>
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recap */}
      {recapData && (
        <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Summary
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Powered by Claude AI
              </p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {recapData.recap}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Generated on {new Date(recapData.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Refresh button */}
      <div className="text-center">
        <button
          onClick={fetchRecap}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Regenerate Recap
        </button>
      </div>
    </div>
  );
}
