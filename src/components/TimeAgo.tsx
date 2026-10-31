'use client';

import { useState, useEffect } from 'react';
import { formatTimeAgo } from '@/lib/date-utils';

interface Props {
  timestamp: any;
  className?: string;
  prefix?: string;
}

export default function TimeAgo({ timestamp, className = '', prefix = '' }: Props) {
  const [formatted, setFormatted] = useState<string>(() => formatTimeAgo(timestamp));

  useEffect(() => {
    // Recompute immediately on mount with reader's local system time
    setFormatted(formatTimeAgo(timestamp));

    // Update every 30 seconds so time ago progresses naturally
    const interval = setInterval(() => {
      setFormatted(formatTimeAgo(timestamp));
    }, 30000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <span className={className} suppressHydrationWarning>
      {prefix}
      {formatted}
    </span>
  );
}
