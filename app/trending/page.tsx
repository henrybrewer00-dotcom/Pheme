import ArticleFeed from '@/components/feed/ArticleFeed';

export default function TrendingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Trending News
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hot topics and breaking stories
        </p>
      </div>

      <ArticleFeed feedType="trending" />
    </div>
  );
}
