import { formatDistanceToNow, format } from 'date-fns';

export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return 'Unknown date';
  }
}

export function formatDate(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM d, yyyy');
  } catch (error) {
    return 'Unknown date';
  }
}

export function normalizeAuthorName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    return 'Unknown source';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
}

export function getBiasColor(bias: string): string {
  switch (bias) {
    case 'Left':
      return 'text-blue-600 dark:text-blue-400';
    case 'Center-Left':
      return 'text-blue-400 dark:text-blue-300';
    case 'Center':
      return 'text-gray-600 dark:text-gray-400';
    case 'Center-Right':
      return 'text-red-400 dark:text-red-300';
    case 'Right':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-500 dark:text-gray-500';
  }
}

export function getReliabilityColor(score: number): string {
  if (score >= 8) {
    return 'text-green-600 dark:text-green-400';
  } else if (score >= 6) {
    return 'text-yellow-600 dark:text-yellow-400';
  } else if (score >= 4) {
    return 'text-orange-600 dark:text-orange-400';
  } else {
    return 'text-red-600 dark:text-red-400';
  }
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function cleanHtml(html: string): string {
  // Basic HTML tag removal - in production, use a proper sanitizer like DOMPurify
  return html.replace(/<[^>]*>/g, '').trim();
}

export function generateAvatarUrl(name: string): string {
  // Generate a deterministic avatar URL based on name
  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=${(hash % 16).toString(16)}${((hash / 16) % 16)
    .toString(16)
    .charAt(0)}${((hash / 256) % 16).toString(16).charAt(0)}&color=fff`;
}

export function calculateSimilarity(text1: string, text2: string): number {
  // Simple word-based similarity calculation
  const words1 = new Set(
    text1
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
  const words2 = new Set(
    text2
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );

  const intersection = new Set([...words1].filter((w) => words2.has(w)));
  const union = new Set([...words1, ...words2]);

  return union.size > 0 ? intersection.size / union.size : 0;
}
