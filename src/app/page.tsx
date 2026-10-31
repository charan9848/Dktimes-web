import Link from 'next/link';
import BreakingTicker from '@/components/BreakingTicker';
import TimeAgo from '@/components/TimeAgo';
import {
  getBreakingNews,
  getLatestNews,
  getLatestShorts,
  getJobListings,
  getMarketplaceListings,
  getActivePosters,
} from '@/lib/news-service';
import { formatTimeAgo, formatEditorialDate, formatFullDateTime } from '@/lib/date-utils';
import { ShortVideo, NewsArticle } from '@/types';
import {
  Flame,
  Play,
  Briefcase,
  ShoppingBag,
  Clock,
  Share2,
  ChevronRight,
  MessageCircle,
  ArrowRight,
  Newspaper,
  Compass,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [breaking, allArticles, shorts, jobs, marketplace, posters] = await Promise.all([
    getBreakingNews(),
    getLatestNews(36),
    getLatestShorts(8),
    getJobListings(4),
    getMarketplaceListings(3),
    getActivePosters(),
  ]);

  // Lead article from live DB or fallback
  const leadArticle: NewsArticle = allArticles[0] || {
    id: 'corridor-lead',
    title: 'Telangana Cabinet Greenlights ₹24,000 Cr Semiconductor Tech Corridor Near Hyderabad',
    summary:
      'The state government announced a landmark initiative to establish a world-class semiconductor manufacturing hub on the outskirts of Hyderabad, aiming to create over 50,000 direct jobs.',
    category: 'Politics',
    region: 'Telangana',
    author: 'DK Times Editorial',
    publishedAt: new Date().toISOString(),
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  };

  const secondaryArticles = allArticles.slice(1, 4);
  const trendingArticles = allArticles.slice(4, 9);

  // Category-wise filtered sets
  const isMatch = (story: NewsArticle, terms: string[]) => {
    const text = `${story.title} ${story.summary} ${story.category} ${story.region} ${(story.categories || []).join(' ')}`.toLowerCase();
    return terms.some((t) => text.includes(t.toLowerCase()));
  };

  const telanganaStories = allArticles
    .filter((a) => isMatch(a, ['telangana', 'hyderabad', 'తెలంగాణ', 'హైదరాబాద్', 'వరంగల్', 'కేటీఆర్', 'రేవంత్']))
    .slice(0, 4);

  const apStories = allArticles
    .filter((a) => isMatch(a, ['andhra', 'amaravati', 'vijayawada', 'visakhapatnam', 'ఆంధ్ర', 'అమరావతి', 'పవన్', 'చంద్రబాబు', 'వైసీపీ']))
    .slice(0, 4);

  const politicsStories = allArticles
    .filter((a) => isMatch(a, ['politics', 'కాంగ్రెస్', 'బిజెపి', 'బీఆర్ఎస్', 'రాజకీయం', 'మంత్రులు', 'ఎన్నికలు', 'పార్లమెంట్']))
    .slice(0, 4);

  // All remaining news for continuous stream
  const continuousAllNews = allArticles.slice(9, 21);

  return (
    <main>
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-6 md:py-8 space-y-12">
        {/* ================= HERO EDITORIAL GRID ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEAD STORY (7 cols) */}
          <div className="lg:col-span-7">
            <article className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm h-full flex flex-col justify-between hover:shadow-md transition">
              <div>
                {/* High-Clarity Framed Image Container */}
                <div className="relative w-full h-[320px] sm:h-[400px] bg-neutral-900 overflow-hidden flex items-center justify-center">
                  {leadArticle.imageUrl && (
                    <div
                      className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
                      style={{ backgroundImage: `url(${leadArticle.imageUrl})` }}
                    />
                  )}
                  <img
                    src={leadArticle.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=85'}
                    alt={leadArticle.title}
                    className="relative z-10 max-h-full max-w-full object-contain sm:object-cover sm:w-full sm:h-full transition duration-500 hover:scale-[1.02]"
                    loading="eager"
                  />
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.16em] px-2.5 py-1 rounded shadow-sm">
                      Lead Story
                    </span>
                    <span className="bg-[#1C3D5A] dark:bg-sky-600 text-white text-[9px] font-bold uppercase tracking-[0.12em] px-2 py-1 rounded shadow-sm">
                      {leadArticle.category || 'General'}
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {/* Category & Proper Date / Time */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] mb-2 font-medium text-[#6F675C] dark:text-slate-400">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#1C3D5A] dark:text-sky-400">
                      {leadArticle.region ? `${leadArticle.region} · ` : ''}{leadArticle.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-[#211D18] dark:text-slate-200">
                      <Clock size={12} /> <TimeAgo timestamp={leadArticle.publishedAt} />
                    </span>
                    <span>•</span>
                    <span>{formatEditorialDate(leadArticle.publishedAt)}</span>
                  </div>

                  <Link href={`/article/${leadArticle.id}`}>
                    <h2 className="font-serif font-black text-2xl md:text-3xl lg:text-4xl leading-[1.18] text-[#211D18] dark:text-white hover:text-[#1C3D5A] dark:hover:text-sky-400 transition">
                      {leadArticle.title}
                    </h2>
                  </Link>
                  <p className="text-[#6F675C] dark:text-slate-300 text-sm md:text-base leading-relaxed mt-3 font-normal line-clamp-3">
                    {leadArticle.summary}
                  </p>

                  {/* Prominent Read Full Story Button */}
                  <div className="mt-5">
                    <Link
                      href={`/article/${leadArticle.id}`}
                      className="inline-flex items-center gap-2 bg-[#1C3D5A] hover:bg-[#142A3E] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition"
                    >
                      Read Full Story <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="px-6 md:px-8 pb-6 pt-4 border-t border-[rgba(33,29,24,0.08)] dark:border-white/10 flex items-center justify-between text-xs text-[#6F675C] dark:text-slate-400">
                <div>
                  <span className="font-bold text-[#211D18] dark:text-white">{leadArticle.author || 'DK Times Editorial'}</span>
                  <span className="mx-2">•</span>
                  <span>{formatFullDateTime(leadArticle.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/article/${leadArticle.id}`} className="hover:text-[#1C3D5A] dark:hover:text-sky-400 transition" title="Share">
                    <Share2 size={15} />
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* SECONDARY STORIES + TRENDING (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* 3 Stacked Secondary Cards */}
            {secondaryArticles.map((story) => (
              <div
                key={story.id}
                className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-3.5 flex gap-4 shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition group"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-neutral-900 border border-[rgba(33,29,24,0.1)] dark:border-white/10 relative">
                  <img
                    src={story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80'}
                    alt={story.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-[#6F675C] dark:text-slate-400 mb-1">
                      <span className="font-bold uppercase tracking-[0.16em] text-[#1C3D5A] dark:text-sky-400">
                        {story.category || 'News'}
                      </span>
                      <TimeAgo timestamp={story.publishedAt} />
                    </div>
                    <Link href={`/article/${story.id}`}>
                      <h3 className="font-serif font-bold text-sm md:text-base leading-snug text-[#211D18] dark:text-white group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition line-clamp-2">
                        {story.title}
                      </h3>
                    </Link>
                  </div>

                  {/* Read More link */}
                  <div className="mt-2 flex items-center justify-end">
                    <Link
                      href={`/article/${story.id}`}
                      className="text-xs font-bold text-[#1C3D5A] dark:text-sky-400 group-hover:underline inline-flex items-center gap-1"
                    >
                      Read More <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* TRENDING STORIES WIDGET */}
            <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-5 shadow-sm flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Flame size={16} className="text-red-500 fill-current" />
                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                  Trending Now
                </h3>
              </div>

              <div className="space-y-3">
                {trendingArticles.map((t, idx) => (
                  <div key={t.id} className="border-b border-[rgba(33,29,24,0.06)] dark:border-white/5 pb-3 last:border-0 last:pb-0">
                    <Link href={`/article/${t.id}`} className="flex items-start gap-3 group">
                      <span className="text-lg font-serif font-black text-[#1C3D5A]/40 dark:text-sky-400/40 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs md:text-sm font-semibold text-[#211D18] dark:text-slate-100 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition leading-snug line-clamp-2">
                          {t.title}
                        </p>
                        <div className="text-[10px] text-[#6F675C] dark:text-slate-400 mt-1 font-medium">
                          <TimeAgo timestamp={t.publishedAt} />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= CATEGORY 1: TELANGANA & HYDERABAD ================= */}
        {telanganaStories.length > 0 && (
          <section className="pt-6 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-6 bg-[#1C3D5A] dark:bg-sky-500 rounded-sm" />
                <div>
                  <h2 className="font-serif font-black text-2xl text-[#211D18] dark:text-white">
                    Telangana & Hyderabad
                  </h2>
                  <p className="text-xs text-[#6F675C] dark:text-slate-400">
                    రాష్ట్ర పాలన, రాజధాని విశేషాలు మరియు జిల్లా వార్తలు
                  </p>
                </div>
              </div>
              <Link
                href="/news/telangana"
                className="text-xs font-bold text-[#1C3D5A] dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                View All Telangana News <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {telanganaStories.map((story) => (
                <article
                  key={story.id}
                  className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[16/10] bg-neutral-900 overflow-hidden relative">
                      <img
                        src={story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between text-[10px] text-[#6F675C] dark:text-slate-400 mb-1.5 font-medium">
                        <span className="font-bold uppercase tracking-wider text-[#1C3D5A] dark:text-sky-400">
                          {story.region || 'Telangana'}
                        </span>
                        <TimeAgo timestamp={story.publishedAt} />
                      </div>
                      <Link href={`/article/${story.id}`}>
                        <h3 className="font-serif font-bold text-sm text-[#211D18] dark:text-slate-100 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition line-clamp-2 leading-snug">
                          {story.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#6F675C] dark:text-slate-400 font-medium">
                      {formatEditorialDate(story.publishedAt)}
                    </span>
                    <Link
                      href={`/article/${story.id}`}
                      className="font-bold text-xs text-[#1C3D5A] dark:text-sky-400 group-hover:underline flex items-center gap-1"
                    >
                      Read More <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ================= CATEGORY 2: ANDHRA PRADESH ================= */}
        {apStories.length > 0 && (
          <section className="pt-6 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-6 bg-amber-600 rounded-sm" />
                <div>
                  <h2 className="font-serif font-black text-2xl text-[#211D18] dark:text-white">
                    Andhra Pradesh Focus
                  </h2>
                  <p className="text-xs text-[#6F675C] dark:text-slate-400">
                    అమరావతి, ఉత్తరాంధ్ర, సీమ తాజా పరిణామాలు మరియు సంక్షేమం
                  </p>
                </div>
              </div>
              <Link
                href="/news/andhra_pradesh"
                className="text-xs font-bold text-[#1C3D5A] dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                View All AP News <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {apStories.map((story) => (
                <article
                  key={story.id}
                  className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[16/10] bg-neutral-900 overflow-hidden relative">
                      <img
                        src={story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between text-[10px] text-[#6F675C] dark:text-slate-400 mb-1.5 font-medium">
                        <span className="font-bold uppercase tracking-wider text-[#1C3D5A] dark:text-sky-400">
                          {story.region || 'Andhra Pradesh'}
                        </span>
                        <TimeAgo timestamp={story.publishedAt} />
                      </div>
                      <Link href={`/article/${story.id}`}>
                        <h3 className="font-serif font-bold text-sm text-[#211D18] dark:text-slate-100 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition line-clamp-2 leading-snug">
                          {story.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#6F675C] dark:text-slate-400 font-medium">
                      {formatEditorialDate(story.publishedAt)}
                    </span>
                    <Link
                      href={`/article/${story.id}`}
                      className="font-bold text-xs text-[#1C3D5A] dark:text-sky-400 group-hover:underline flex items-center gap-1"
                    >
                      Read More <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ================= CATEGORY 3: POLITICS & POLICY ================= */}
        {politicsStories.length > 0 && (
          <section className="pt-6 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-6 bg-red-600 rounded-sm" />
                <div>
                  <h2 className="font-serif font-black text-2xl text-[#211D18] dark:text-white">
                    Politics & Governance
                  </h2>
                  <p className="text-xs text-[#6F675C] dark:text-slate-400">
                    పార్టీలు, రాజకీయ వ్యూహాలు మరియు విధాన నిర్ణయాలు
                  </p>
                </div>
              </div>
              <Link
                href="/news/politics"
                className="text-xs font-bold text-[#1C3D5A] dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                View All Politics News <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {politicsStories.map((story) => (
                <article
                  key={story.id}
                  className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[16/10] bg-neutral-900 overflow-hidden relative">
                      <img
                        src={story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between text-[10px] text-[#6F675C] dark:text-slate-400 mb-1.5 font-medium">
                        <span className="font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                          {story.category || 'Politics'}
                        </span>
                        <TimeAgo timestamp={story.publishedAt} />
                      </div>
                      <Link href={`/article/${story.id}`}>
                        <h3 className="font-serif font-bold text-sm text-[#211D18] dark:text-slate-100 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition line-clamp-2 leading-snug">
                          {story.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#6F675C] dark:text-slate-400 font-medium">
                      {formatEditorialDate(story.publishedAt)}
                    </span>
                    <Link
                      href={`/article/${story.id}`}
                      className="font-bold text-xs text-[#1C3D5A] dark:text-sky-400 group-hover:underline flex items-center gap-1"
                    >
                      Read More <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ================= SHOW ALL NEWS CONTINUOUS STREAM ================= */}
        <section className="pt-8 border-t-2 border-[rgba(33,29,24,0.15)] dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Newspaper size={20} className="text-[#1C3D5A] dark:text-sky-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C3D5A] dark:text-sky-400">
                  Continuous Dispatch Stream
                </span>
              </div>
              <h2 className="font-serif font-black text-2xl md:text-3xl text-[#211D18] dark:text-white mt-1">
                Show All News (తాజా వార్తల సమాహారం)
              </h2>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 bg-[#1C3D5A] hover:bg-[#142A3E] dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition shrink-0"
            >
              Browse All 500 Stories Archive <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {continuousAllNews.map((story) => (
              <article
                key={story.id}
                className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] bg-neutral-900 overflow-hidden relative">
                    <img
                      src={story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between text-[10px] text-[#6F675C] dark:text-slate-400 mb-1.5 font-medium">
                      <span className="font-bold uppercase tracking-wider text-[#1C3D5A] dark:text-sky-400">
                        {story.region || story.category || 'News'}
                      </span>
                      <TimeAgo timestamp={story.publishedAt} />
                    </div>
                    <Link href={`/article/${story.id}`}>
                      <h3 className="font-serif font-bold text-base text-[#211D18] dark:text-slate-100 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition line-clamp-2 leading-snug">
                        {story.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {story.summary}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#6F675C] dark:text-slate-400 font-medium">
                    {formatEditorialDate(story.publishedAt)}
                  </span>
                  <Link
                    href={`/article/${story.id}`}
                    className="font-bold text-xs text-[#1C3D5A] dark:text-sky-400 group-hover:underline flex items-center gap-1"
                  >
                    Read More <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ================= DK SHORTS SECTION (ONLY DISPLAYED IF SHORTS EXIST) ================= */}
        {shorts && shorts.length > 0 && (
          <section className="pt-6 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="bg-red-600 text-white p-2 rounded-lg shadow-sm">
                  <Play size={16} className="fill-current" />
                </div>
                <div>
                  <h2 className="font-serif font-black text-xl text-[#211D18] dark:text-white">DK Shorts</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6F675C] dark:text-slate-400">
                    Quick Vertical Video Bulletins
                  </p>
                </div>
              </div>
              <Link
                href="/shorts"
                className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#1C3D5A] dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                View all <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {shorts.map((s) => (
                <div
                  key={s.id}
                  className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm group cursor-pointer hover:border-red-500 transition"
                >
                  <div className="aspect-[9/16] bg-slate-900 relative">
                    {s.thumbnailUrl && (
                      <img
                        src={s.thumbnailUrl}
                        alt={s.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-red-600 transition shadow-lg">
                        <Play size={16} className="text-white fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                      <p className="text-white text-[11px] font-semibold leading-tight line-clamp-2">
                        {s.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= JOBS & MARKETPLACE SPLIT ================= */}
        <section className="pt-6 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* JOBS BOARD */}
          <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="bg-[#1C3D5A] dark:bg-sky-700 text-white p-2 rounded-lg">
                  <Briefcase size={16} />
                </div>
                <h2 className="font-serif font-black text-lg text-[#211D18] dark:text-white">Local Careers & Jobs</h2>
              </div>
              <Link href="/jobs" className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#1C3D5A] dark:text-sky-400">
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {(jobs.length > 0
                ? jobs
                : [
                    { id: 'j1', title: 'Senior React / Next.js Developer', company: 'TCS Innovation Hub', location: 'Hyderabad', salary: '₹45,000/mo' },
                    { id: 'j2', title: 'Staff Reporter — Telugu News', company: 'Sakshi Media Corp', location: 'Vijayawada', salary: '₹30,000/mo' },
                    { id: 'j3', title: 'DevOps & Cloud Engineer', company: 'Infosys SEZ', location: 'Hyderabad', salary: '₹65,000/mo' },
                    { id: 'j4', title: 'Hospital Accounts Administrator', company: 'KIMS Hospitals', location: 'Secunderabad', salary: '₹28,000/mo' },
                  ]
              ).map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-[rgba(33,29,24,0.08)] dark:border-white/10 hover:border-[#1C3D5A]/40 transition"
                >
                  <div>
                    <h3 className="text-xs md:text-sm font-bold text-[#211D18] dark:text-white">{job.title}</h3>
                    <p className="text-[11px] text-[#6F675C] dark:text-slate-400">
                      {job.company} · {job.location}
                    </p>
                  </div>
                  <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {job.salary || 'Competitive'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MARKETPLACE CLASSIFIEDS */}
          <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="bg-amber-600 text-white p-2 rounded-lg">
                  <ShoppingBag size={16} />
                </div>
                <h2 className="font-serif font-black text-lg text-[#211D18] dark:text-white">Marketplace Classifieds</h2>
              </div>
              <Link href="/marketplace" className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#1C3D5A] dark:text-sky-400">
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {(marketplace.length > 0
                ? marketplace
                : [
                    { id: 'm1', title: '3 BHK Luxury Apartment in Gachibowli', location: 'Hyderabad', price: '₹1.2 Cr', whatsappNumber: '919876543210' },
                    { id: 'm2', title: 'Honda City 2024 — Single Owner 12K km', location: 'Visakhapatnam', price: '₹11.5 Lakh', whatsappNumber: '919876543211' },
                    { id: 'm3', title: 'Commercial Office Space 2,400 sq.ft', location: 'Vijayawada', price: '₹85,000/mo', whatsappNumber: '919876543212' },
                  ]
              ).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-[rgba(33,29,24,0.08)] dark:border-white/10 hover:border-amber-300 transition"
                >
                  <div>
                    <h3 className="text-xs md:text-sm font-bold text-[#211D18] dark:text-white">{item.title}</h3>
                    <p className="text-[11px] text-[#6F675C] dark:text-slate-400">{item.location}</p>
                    <p className="text-xs font-black text-amber-700 dark:text-amber-400 mt-0.5">{item.price}</p>
                  </div>
                  <a
                    href={`https://wa.me/${(item as any).whatsappNumber || ''}?text=Hi,%20I%20am%20inquiring%20about%20your%20listing%20"${encodeURIComponent(item.title || '')}"%20on%20DK%20Times`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm"
                  >
                    <MessageCircle size={12} /> WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= SPONSORED BANNER ================= */}
        <section className="pt-6">
          <div className="bg-gradient-to-r from-[#1C3D5A] to-[#142A3E] dark:from-[#0F172A] dark:to-[#1E293B] text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/50 mb-1 block">
                Sponsored Partner
              </span>
              <h3 className="font-serif font-bold text-xl md:text-2xl">
                HMDA Approved Plots in Greater Hyderabad
              </h3>
              <p className="text-white/70 text-xs md:text-sm mt-1">
                Gated community layouts starting from ₹18 Lakhs near Shamshabad Regional Ring Road.
              </p>
            </div>
            <button className="bg-white text-[#1C3D5A] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-white/90 transition shrink-0 cursor-pointer">
              Enquire Now →
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
