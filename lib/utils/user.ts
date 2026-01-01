import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

const USER_COOKIE_KEY = 'pheme_user_id';
const USER_COOKIE_EXPIRY = 365; // days

export function getUserId(): string {
  if (typeof window === 'undefined') {
    return ''; // Server-side
  }

  let userId = Cookies.get(USER_COOKIE_KEY);

  if (!userId) {
    userId = uuidv4();
    Cookies.set(USER_COOKIE_KEY, userId, { expires: USER_COOKIE_EXPIRY });
  }

  return userId;
}

export function clearUserId(): void {
  Cookies.remove(USER_COOKIE_KEY);
}

// Local storage helpers for preferences
export function getLocalPreference<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setLocalPreference<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

export function removeLocalPreference(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

// Reading history management
export interface ReadingHistoryItem {
  articleId: string;
  title: string;
  readAt: string;
}

export function getReadingHistory(): ReadingHistoryItem[] {
  return getLocalPreference<ReadingHistoryItem[]>('reading_history', []);
}

export function addToReadingHistory(item: ReadingHistoryItem): void {
  const history = getReadingHistory();
  const filtered = history.filter((h) => h.articleId !== item.articleId);
  filtered.unshift(item);

  // Keep only last 100 items
  const trimmed = filtered.slice(0, 100);
  setLocalPreference('reading_history', trimmed);
}

// Followed authors management
export function getFollowedAuthors(): string[] {
  return getLocalPreference<string[]>('followed_authors', []);
}

export function isAuthorFollowed(authorId: string): boolean {
  const followed = getFollowedAuthors();
  return followed.includes(authorId);
}

export function followAuthor(authorId: string): void {
  const followed = getFollowedAuthors();
  if (!followed.includes(authorId)) {
    followed.push(authorId);
    setLocalPreference('followed_authors', followed);
  }
}

export function unfollowAuthor(authorId: string): void {
  const followed = getFollowedAuthors();
  const filtered = followed.filter((id) => id !== authorId);
  setLocalPreference('followed_authors', filtered);
}

// Bookmarks management
export function getBookmarkedArticles(): string[] {
  return getLocalPreference<string[]>('bookmarked_articles', []);
}

export function isArticleBookmarked(articleId: string): boolean {
  const bookmarks = getBookmarkedArticles();
  return bookmarks.includes(articleId);
}

export function bookmarkArticle(articleId: string): void {
  const bookmarks = getBookmarkedArticles();
  if (!bookmarks.includes(articleId)) {
    bookmarks.push(articleId);
    setLocalPreference('bookmarked_articles', bookmarks);
  }
}

export function unbookmarkArticle(articleId: string): void {
  const bookmarks = getBookmarkedArticles();
  const filtered = bookmarks.filter((id) => id !== articleId);
  setLocalPreference('bookmarked_articles', filtered);
}

// Dark mode preference
export function getDarkMode(): boolean {
  return getLocalPreference<boolean>('dark_mode', false);
}

export function setDarkMode(enabled: boolean): void {
  setLocalPreference('dark_mode', enabled);

  if (typeof window !== 'undefined') {
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

export function toggleDarkMode(): boolean {
  const current = getDarkMode();
  const newValue = !current;
  setDarkMode(newValue);
  return newValue;
}
