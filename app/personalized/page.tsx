import ArticleFeed from '@/components/feed/ArticleFeed';

export default function PersonalizedPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          For You
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Personalized based on your reading history
        </p>
      </div>

      <ArticleFeed feedType="personalized" />
    </div>
  );
}
