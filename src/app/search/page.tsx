'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon, Clock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { NewsArticle } from '@/types';
import { formatTimeAgo, formatEditorialDate } from '@/lib/date-utils';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load recent articles once for client-side search index
    const loadInitial = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'), limit(50));
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as NewsArticle[];
        setArticles(data);
      } catch (err) {
        console.error('Error fetching search index:', err);
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, []);

  const results = articles.filter((a) => {
    if (!searchTerm.trim()) return false;
    const term = searchTerm.toLowerCase();
    const matchTitle = (a.title || '').toLowerCase().includes(term);
    const matchSummary = (a.summary || '').toLowerCase().includes(term);
    const matchCat = (a.category || '').toLowerCase().includes(term);
    const matchReg = (a.region || '').toLowerCase().includes(term);
    return matchTitle || matchSummary || matchCat || matchReg;
  });

  return (
    <main className="mx-auto max-w-[1000px] px-4 md:px-6 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="font-serif font-black text-3xl md:text-5xl text-[#211D18] dark:text-white mb-2">
          Search DK Times
        </h1>
        <p className="text-xs md:text-sm text-[#6F675C] dark:text-slate-400">
          Explore breaking stories, politics, local reports, jobs, and classifieds across Telangana & AP.
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-6">
        <SearchIcon
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F675C] dark:text-slate-400"
        />
        <input
          type="text"
          placeholder="Search by keywords, leaders, region, or topic..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#FFFDF7] dark:bg-[#141414] border-2 border-[rgba(33,29,24,0.15)] dark:border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium text-[#211D18] dark:text-white focus:outline-none focus:border-[#1C3D5A] dark:focus:border-sky-400 shadow-sm placeholder:text-[#6F675C]/70 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Suggested Topics / Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto mb-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F675C] dark:text-slate-400 mr-2">
          Popular:
        </span>
        {['Telangana', 'Andhra Pradesh', 'Politics', 'Hyderabad', 'Jobs', 'Tech'].map((topic) => (
          <button
            key={topic}
            onClick={() => setSearchTerm(topic)}
            className="bg-[#FFFDF7] dark:bg-[#141414] border border-[rgba(33,29,24,0.1)] dark:border-white/10 hover:border-[#1C3D5A] dark:hover:border-sky-400 px-3 py-1 rounded-full text-xs font-semibold text-[#1C3D5A] dark:text-sky-300 transition cursor-pointer"
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Search results list */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 size={32} className="animate-spin text-[#1C3D5A] dark:text-sky-400 mx-auto mb-2" />
          <p className="text-xs text-[#6F675C] dark:text-slate-400">Connecting to DK Times database...</p>
        </div>
      ) : searchTerm.trim() ? (
        <div className="space-y-4">
          <p className="text-xs font-bold text-[#6F675C] dark:text-slate-400 uppercase tracking-wider mb-2">
            Found {results.length} results for &ldquo;{searchTerm}&rdquo;
          </p>
          {results.map((story) => (
            <div
              key={story.id}
              className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-4 sm:p-5 shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition flex gap-4"
            >
              {story.imageUrl && (
                <div className="w-24 h-24 sm:w-32 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-neutral-900 border border-[rgba(33,29,24,0.1)] dark:border-white/10">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-[#6F675C] dark:text-slate-400 mb-1 font-medium">
                    <span className="font-bold uppercase tracking-wider text-[#1C3D5A] dark:text-sky-400">
                      {story.region || story.category || 'News'}
                    </span>
                    <span>{formatTimeAgo(story.publishedAt)}</span>
                  </div>
                  <Link href={`/article/${story.id}`}>
                    <h2 className="font-serif font-bold text-base text-[#211D18] dark:text-slate-100 hover:text-[#1C3D5A] dark:hover:text-sky-400 transition mt-1 line-clamp-2">
                      {story.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                    {story.summary}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#6F675C] dark:text-slate-400">
                    {formatEditorialDate(story.publishedAt)}
                  </span>
                  <Link
                    href={`/article/${story.id}`}
                    className="font-bold text-xs text-[#1C3D5A] dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    Read More <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-12 text-center text-[#6F675C] dark:text-slate-400">
              <p className="font-medium text-sm">No articles matched your search query.</p>
              <p className="text-xs text-[#6F675C] dark:text-slate-400 mt-1">Try another keyword or category name.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-8 text-center text-[#6F675C] dark:text-slate-400 text-sm">
          <p>Type keywords above to search across all published DK Times articles.</p>
        </div>
      )}
    </main>
  );
}
