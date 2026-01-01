import ArticleFeed from '@/components/feed/ArticleFeed';

export default function BookmarksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bookmarks
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your saved articles
        </p>
      </div>

      <ArticleFeed feedType="bookmarked" />
    </div>
  );
}
