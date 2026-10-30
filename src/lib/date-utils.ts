/**
 * DK Times Editorial Date & Time Utilities
 * Formats dates adhering to Indian English & Telugu newspaper standards.
 */

export function parseDate(dateInput: any): Date | null {
  if (!dateInput) return null;
  if (dateInput instanceof Date) return isNaN(dateInput.getTime()) ? null : dateInput;
  if (typeof dateInput === 'number') return new Date(dateInput);
  if (typeof dateInput === 'string') {
    const d = new Date(dateInput);
    if (!isNaN(d.getTime())) return d;
  }
  if (typeof dateInput === 'object' && dateInput.seconds) {
    return new Date(dateInput.seconds * 1000);
  }
  return null;
}

export function formatTimeAgo(dateInput: any): string {
  const date = parseDate(dateInput);
  if (!date) return 'Recently';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  // Beyond a week, show clean Month Day, Year
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatEditorialDate(dateInput: any): string {
  const date = parseDate(dateInput);
  if (!date) return 'Latest';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatFullDateTime(dateInput: any): string {
  const date = parseDate(dateInput);
  if (!date) return 'Published Recently';

  const dateStr = date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const timeStr = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${dateStr} · ${timeStr} IST`;
}

export function getTodayMastheadDate(): string {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
