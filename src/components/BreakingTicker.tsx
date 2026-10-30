'use client';

import { useState, useEffect } from 'react';
import { NewsArticle } from '@/types';
import Link from 'next/link';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Props {
  breakingNews?: NewsArticle[];
  latestNews?: NewsArticle[];
}

export default function BreakingTicker({ breakingNews, latestNews = [] }: Props) {
  const [articles, setArticles] = useState<NewsArticle[]>(
    breakingNews && breakingNews.length > 0 ? breakingNews : latestNews
  );

  useEffect(() => {
    if (articles.length === 0) {
      const loadLiveHeadlines = async () => {
        try {
          const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'), limit(12));
          const snap = await getDocs(q);
          const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as NewsArticle[];
          if (data.length > 0) {
            setArticles(data);
          }
        } catch (err) {
          console.error('Error fetching breaking ticker items:', err);
        }
      };
      loadLiveHeadlines();
    }
  }, [articles.length]);

  const displayItems =
    articles.length > 0
      ? articles.map((b) => ({ id: b.id, title: b.title }))
      : [
          {
            id: '',
            title: 'DK Times Digital Newsroom — Live updates from Telangana & Andhra Pradesh',
          },
        ];

  return (
    <div className="bg-white dark:bg-[#141414] border-b border-[rgba(33,29,24,0.08)] dark:border-white/10 overflow-hidden transition-colors">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 flex items-center gap-3 md:gap-4 py-2">
        {/* Urgent Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-red-600 pulse-dot" />
          <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.16em] px-2.5 py-0.5 rounded shadow-sm">
            Breaking
          </span>
        </div>

        {/* Ticker marquee with 100% Real Headlines */}
        <div className="overflow-hidden flex-1 relative">
          <div className="flex whitespace-nowrap ticker-animate">
            {displayItems.concat(displayItems).map((story, i) => (
              <span key={i} className="flex items-center">
                {story.id ? (
                  <Link
                    href={`/article/${story.id}`}
                    className="text-xs md:text-sm font-semibold text-[#211D18]/90 dark:text-white/90 hover:text-[#1C3D5A] dark:hover:text-sky-400 transition mr-8"
                  >
                    {story.title}
                  </Link>
                ) : (
                  <span className="text-xs md:text-sm font-semibold text-[#211D18]/90 dark:text-white/90 mr-8">
                    {story.title}
                  </span>
                )}
                <span className="text-[#6F675C]/40 dark:text-white/30 mr-8">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
