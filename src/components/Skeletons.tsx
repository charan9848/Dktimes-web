'use client';

// Reusable News Card Skeleton with Shimmer
export function NewsCardSkeleton() {
  return (
    <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm flex flex-col justify-between skeleton-shimmer">
      <div>
        {/* Image Frame Placeholder */}
        <div className="aspect-[16/10] bg-neutral-200 dark:bg-neutral-800 w-full relative">
          <div className="absolute top-3 left-3 w-16 h-4 bg-neutral-300 dark:bg-neutral-700 rounded" />
        </div>

        {/* Card Body Placeholder */}
        <div className="p-5 space-y-3">
          {/* Eyebrow / Timestamp */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="w-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="w-20 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>

          {/* Headline (2 lines) */}
          <div className="space-y-2 pt-1">
            <div className="w-full h-4 bg-neutral-300 dark:bg-neutral-700 rounded" />
            <div className="w-3/4 h-4 bg-neutral-300 dark:bg-neutral-700 rounded" />
          </div>

          {/* Excerpt (3 lines) */}
          <div className="space-y-1.5 pt-2">
            <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="w-5/6 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="w-2/3 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5 pt-3 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between">
        <div className="w-24 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="w-16 h-3 bg-neutral-300 dark:bg-neutral-700 rounded" />
      </div>
    </div>
  );
}

// News Archive Grid Skeleton
export function NewsArchiveSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-8">
      {/* Header Skeleton */}
      <div className="border-b border-[rgba(33,29,24,0.1)] dark:border-white/10 pb-5 mb-8 space-y-3 skeleton-shimmer">
        <div className="flex items-center gap-2">
          <div className="w-28 h-3 bg-neutral-300 dark:bg-neutral-700 rounded" />
          <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <div className="w-36 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
        <div className="w-72 sm:w-96 h-10 bg-neutral-300 dark:bg-neutral-700 rounded-lg" />
        <div className="w-full max-w-lg h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>

      {/* Filter Pills Skeleton */}
      <div className="flex items-center gap-2 pb-4 mb-8 overflow-hidden skeleton-shimmer">
        <div className="w-14 h-4 bg-neutral-200 dark:bg-neutral-800 rounded mr-1" />
        {[80, 72, 96, 68, 88, 64].map((width, i) => (
          <div
            key={i}
            style={{ width: `${width}px` }}
            className="h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0"
          />
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Article Detail Page Skeleton
export function ArticleDetailSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-6 md:py-8">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center gap-3 mb-6 skeleton-shimmer">
        <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="w-3 h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
        <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="w-3 h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
        <div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Article Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 skeleton-shimmer">
            <div className="w-20 h-5 bg-neutral-300 dark:bg-neutral-700 rounded" />
            <div className="w-24 h-5 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-800 rounded ml-auto" />
          </div>

          {/* Headline */}
          <div className="space-y-3 skeleton-shimmer">
            <div className="w-full h-8 sm:h-10 bg-neutral-300 dark:bg-neutral-700 rounded-lg" />
            <div className="w-11/12 h-8 sm:h-10 bg-neutral-300 dark:bg-neutral-700 rounded-lg" />
            <div className="w-2/3 h-8 sm:h-10 bg-neutral-300 dark:bg-neutral-700 rounded-lg" />
          </div>

          {/* Standfirst Deck */}
          <div className="p-4 rounded-xl bg-[#FFFDF7] dark:bg-[#141414] border-l-4 border-[#1C3D5A] dark:border-sky-500 space-y-2 skeleton-shimmer">
            <div className="w-full h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="w-4/5 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>

          {/* Author Byline Bar */}
          <div className="flex items-center justify-between border-y border-[rgba(33,29,24,0.08)] dark:border-white/10 py-3.5 gap-4 skeleton-shimmer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <div className="space-y-1.5">
                <div className="w-32 h-4 bg-neutral-300 dark:bg-neutral-700 rounded" />
                <div className="w-24 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-14 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="w-16 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              <div className="w-14 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-[16/9] w-full rounded-2xl bg-neutral-200 dark:bg-neutral-800 overflow-hidden skeleton-shimmer" />

          {/* Paragraphs */}
          <div className="space-y-4 pt-4 skeleton-shimmer">
            <div className="space-y-2">
              <div className="w-full h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="w-full h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="w-11/12 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="w-4/5 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="w-full h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="w-full h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="w-3/4 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
            </div>
          </div>
        </div>

        {/* Sidebar Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-5 space-y-4 skeleton-shimmer">
            <div className="w-36 h-4 bg-neutral-300 dark:bg-neutral-700 rounded pb-3 border-b border-[rgba(33,29,24,0.08)] dark:border-white/10" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-[rgba(33,29,24,0.06)] dark:border-white/5 last:border-0">
                <div className="w-5 h-6 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-full h-3.5 bg-neutral-300 dark:bg-neutral-700 rounded" />
                  <div className="w-4/5 h-3.5 bg-neutral-300 dark:bg-neutral-700 rounded" />
                  <div className="w-16 h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded" />
                </div>
                <div className="w-14 h-14 rounded-lg bg-neutral-200 dark:bg-neutral-800 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Homepage Skeleton
export function HomePageSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-6 md:py-8 space-y-12">
      {/* Hero Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lead Story (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm flex flex-col justify-between skeleton-shimmer">
          <div className="h-[320px] sm:h-[400px] bg-neutral-200 dark:bg-neutral-800 w-full" />
          <div className="p-6 md:p-8 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-20 h-3.5 bg-neutral-300 dark:bg-neutral-700 rounded" />
              <div className="w-24 h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded" />
            </div>
            <div className="w-full h-8 bg-neutral-300 dark:bg-neutral-700 rounded-lg" />
            <div className="w-5/6 h-8 bg-neutral-300 dark:bg-neutral-700 rounded-lg" />
            <div className="w-full h-4 bg-neutral-200 dark:bg-neutral-800 rounded pt-2" />
            <div className="w-4/5 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>
        </div>

        {/* Secondary Stories & Trending (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-4 flex gap-4 skeleton-shimmer"
            >
              <div className="w-28 sm:w-36 aspect-[16/10] bg-neutral-200 dark:bg-neutral-800 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-16 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="w-full h-4 bg-neutral-300 dark:bg-neutral-700 rounded" />
                <div className="w-3/4 h-4 bg-neutral-300 dark:bg-neutral-700 rounded" />
              </div>
            </div>
          ))}
          <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-5 flex-1 space-y-3 skeleton-shimmer">
            <div className="w-28 h-4 bg-neutral-300 dark:bg-neutral-700 rounded mb-2" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 py-2 border-b border-[rgba(33,29,24,0.06)] dark:border-white/5 last:border-0">
                <div className="w-5 h-5 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="flex-1 space-y-1">
                  <div className="w-full h-3.5 bg-neutral-300 dark:bg-neutral-700 rounded" />
                  <div className="w-2/3 h-3.5 bg-neutral-300 dark:bg-neutral-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
