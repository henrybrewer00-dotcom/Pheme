'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NotificationWithDetails } from '@/lib/types';
import { getUserId } from '@/lib/utils/user';
import { formatRelativeTime } from '@/lib/utils/helpers';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<
    NotificationWithDetails[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const userId = getUserId();

      const response = await fetch(
        `/api/user/notifications?userId=${userId}&unreadOnly=${filter === 'unread'}`
      );
      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationId,
          isRead: true,
        }),
      });

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'followed_author':
        return (
          <svg
            className="w-6 h-6 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        );
      case 'trending_topic':
        return (
          <svg
            className="w-6 h-6 text-orange-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        );
    }
  };

  const getNotificationMessage = (notification: NotificationWithDetails) => {
    switch (notification.type) {
      case 'followed_author':
        return (
          <>
            <strong>{notification.author.name}</strong> published a new article
          </>
        );
      case 'trending_topic':
        return <>This article is now trending</>;
      default:
        return <>New article available</>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Notifications
        </h1>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === 'unread'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 ${
                !notification.is_read
                  ? 'border-l-4 border-l-gradient-to-b from-blue-500 to-purple-500 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20'
                  : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {getNotificationMessage(notification)}
                  </p>

                  <Link
                    href={notification.article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => markAsRead(notification.id)}
                    className="mt-2 block group/link"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors">
                      {notification.article.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    {formatRelativeTime(notification.created_at)}
                  </p>
                </div>

                {!notification.is_read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="flex-shrink-0 px-4 py-2 text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl mb-4">
            <svg
              className="w-10 h-10 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            No {filter === 'unread' ? 'unread ' : ''}notifications
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            You're all caught up!
          </p>
        </div>
      )}
    </div>
  );
}
