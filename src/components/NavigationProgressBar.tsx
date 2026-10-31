'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete progress bar whenever route or searchParams change
  useEffect(() => {
    setProgress(100);
    const timer = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 250);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Listen to all link clicks to trigger progress immediately
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Ignore external links, downloads, new tabs, hash-only anchors, or javascript:
      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        targetAttr === '_blank' ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if clicking current URL exactly
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      // Start navigation bar immediately
      setIsNavigating(true);
      setProgress(25);

      const t1 = setTimeout(() => setProgress(60), 150);
      const t2 = setTimeout(() => setProgress(85), 450);

      // Clean up if navigation aborts
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true });
    };
  }, []);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none overflow-hidden bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#1C3D5A] via-sky-500 to-amber-500 transition-all ease-out duration-300 shadow-[0_0_8px_rgba(28,61,90,0.6)]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionProperty: 'width, opacity',
        }}
      />
    </div>
  );
}
