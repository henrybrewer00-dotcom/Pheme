import ArticleFeed from '@/components/feed/ArticleFeed';

export default function FollowingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Following
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Articles from authors you follow
        </p>
      </div>

      <ArticleFeed feedType="followed" />
    </div>
  );
}
