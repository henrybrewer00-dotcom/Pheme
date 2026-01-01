import ArticleFeed from '@/components/feed/ArticleFeed';

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          All News
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Latest articles from around the web
        </p>
      </div>

      <ArticleFeed feedType="all" />
    </div>
  );
}
