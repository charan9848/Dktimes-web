/**
 * DK Times Editorial Date & Time Utilities
 * Formats dates adhering to Indian English & Telugu newspaper standards.
 */

export function parseDate(dateInput: any): Date | null {
  if (!dateInput) return null;
  if (dateInput instanceof Date) return isNaN(dateInput.getTime()) ? null : dateInput;
  
  if (typeof dateInput === 'number') {
    // If it's in seconds (like 1793409840), convert to ms
    if (dateInput < 10000000000) {
      return new Date(dateInput * 1000);
    }
    return new Date(dateInput);
  }
  
  if (typeof dateInput === 'string') {
    const d = new Date(dateInput);
    if (!isNaN(d.getTime())) return d;
    const num = Number(dateInput);
    if (!isNaN(num)) {
      if (num < 10000000000) return new Date(num * 1000);
      return new Date(num);
    }
  }
  
  if (typeof dateInput === 'object') {
    if (typeof dateInput.toDate === 'function') {
      return dateInput.toDate();
    }
    if (typeof dateInput.seconds === 'number') {
      return new Date(dateInput.seconds * 1000);
    }
    if (typeof dateInput._seconds === 'number') {
      return new Date(dateInput._seconds * 1000);
    }
  }
  
  return null;
}

export function formatTimeAgo(dateInput: any): string {
  const date = parseDate(dateInput);
  if (!date) return 'Recently';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // If future timestamp or published within the last 90 seconds
  if (diffInSeconds <= 90) {
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

  // Beyond a week, show clean Indian editorial date
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatEditorialDate(dateInput: any): string {
  let date = parseDate(dateInput);
  if (!date) return 'Latest';

  const now = new Date();
  // Never show future dates for articles
  if (date.getTime() > now.getTime()) {
    date = now;
  }

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatFullDateTime(dateInput: any): string {
  let date = parseDate(dateInput);
  if (!date) return 'Published Recently';

  const now = new Date();
  // Never show future time for published articles (clamp to current moment)
  if (date.getTime() > now.getTime()) {
    date = now;
  }

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
