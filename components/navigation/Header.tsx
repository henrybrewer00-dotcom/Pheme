'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { classNames } from '@/lib/utils/helpers';
import { getDarkMode, toggleDarkMode } from '@/lib/utils/user';
import LiveSearch from './LiveSearch';

export default function Header() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    setDarkMode(getDarkMode());

    // Fetch notification count
    const fetchNotificationCount = async () => {
      try {
        const userId = localStorage.getItem('pheme_user_id');
        if (!userId) return;

        const response = await fetch(
          `/api/user/notifications?userId=${userId}&unreadOnly=true`
        );
        const data = await response.json();
        setNotificationCount(data.notifications?.length || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDarkModeToggle = () => {
    const newMode = toggleDarkMode();
    setDarkMode(newMode);
  };

  const navLinks = [
    { href: '/', label: 'All News', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
      </svg>
    )},
    { href: '/personalized', label: 'For You', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
      </svg>
    )},
    { href: '/trending', label: 'Trending', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    )},
    { href: '/following', label: 'Following', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    )},
    { href: '/bookmarks', label: 'Saved', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>
    )},
    { href: '/recap', label: 'Daily Recap', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    )},
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-20 gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              Pheme
            </span>
          </Link>

          {/* Search bar */}
          <LiveSearch />

          {/* Right side actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Notifications */}
            <Link
              href="/notifications"
              className="relative p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-300"
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
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Link>

            {/* Dark mode toggle */}
            <button
              onClick={handleDarkModeToggle}
              className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg
                  className="w-6 h-6 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={classNames(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all',
                isActive(link.href)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
