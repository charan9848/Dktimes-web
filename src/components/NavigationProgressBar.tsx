'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const isInitialMount = useRef(true);

  // Helper to clear all scheduled timers
  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const completeAndHide = () => {
    clearAllTimers();
    setProgress(100);

    // Fade out smoothly
    const fadeTimer = setTimeout(() => {
      setOpacity(0);
    }, 150);

    // Completely reset and hide after fade finishes
    const hideTimer = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
      setOpacity(1);
    }, 350);

    timersRef.current.push(fadeTimer, hideTimer);
  };

  // Complete progress bar whenever route or searchParams change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    completeAndHide();

    return () => clearAllTimers();
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
      clearAllTimers();
      setOpacity(1);
      setIsNavigating(true);
      setProgress(30);

      const t1 = setTimeout(() => setProgress(70), 200);
      const t2 = setTimeout(() => setProgress(90), 500);

      // Failsafe auto-complete: Never stay stuck on screen under ANY circumstance
      const safetyTimer = setTimeout(() => {
        completeAndHide();
      }, 1800);

      timersRef.current.push(t1, t2, safetyTimer);
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleAnchorClick, { capture: true });
      clearAllTimers();
    };
  }, []);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none overflow-hidden bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#1C3D5A] via-sky-500 to-amber-500 shadow-[0_0_10px_rgba(28,61,90,0.8)]"
        style={{
          width: `${progress}%`,
          opacity: opacity,
          transition:
            progress === 100
              ? 'width 150ms ease-out, opacity 200ms ease-in'
              : 'width 250ms ease-out',
        }}
      />
    </div>
  );
}
