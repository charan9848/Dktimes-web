import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleById, getLatestNews, getLatestShorts } from '@/lib/news-service';
import CommentSection from '@/components/CommentSection';
import ArticleClientActions from '@/components/ArticleClientActions';
import { formatTimeAgo, formatEditorialDate } from '@/lib/date-utils';
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Flame,
  Play,
  MessageCircle,
  Share2,
  Tag,
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) return { title: 'Article Not Found — DK Times' };

  return {
    title: `${article.title} — DK Times`,
    description: article.summary,
    authors: [{ name: article.author || 'DK Times Editorial' }],
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `https://dktimesnews.com/article/${article.id}`,
      siteName: 'DK Times',
      images: [
        {
          url: article.imageUrl || 'https://dktimesnews.com/assets/logo.jpg',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const [article, latestNews, shorts] = await Promise.all([
    getArticleById(id),
    getLatestNews(8),
    getLatestShorts(4),
  ]);

  if (!article) {
    notFound();
  }

  // Filter out current story from sidebar and related
  const sidebarStories = latestNews.filter((n) => n.id !== article.id).slice(0, 5);
  const bottomRelated = latestNews.filter((n) => n.id !== article.id).slice(5, 9);

  // Check if content is distinct from summary to avoid exact repetition
  const hasDistinctContent =
    article.content &&
    article.content.trim().replace(/\s+/g, '') !== article.summary?.trim().replace(/\s+/g, '');

  // JSON-LD structured data for Google News
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.imageUrl],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: [
      {
        '@type': 'Person',
        name: article.author || 'DK Times Editorial',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'DK Times',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dktimesnews.com/assets/logo.jpg',
      },
    },
    description: article.summary,
  };

  return (
    <main className="mx-auto max-w-[1400px] px-4 md:px-6 py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#6F675C] dark:text-slate-400 mb-6 font-medium">
        <Link href="/" className="hover:text-[#1C3D5A] dark:hover:text-sky-400 transition">Home</Link>
        <ChevronRight size={13} className="text-[#6F675C]/50 dark:text-slate-500" />
        <Link
          href={`/news/${encodeURIComponent((article.category || 'news').toLowerCase())}`}
          className="hover:text-[#1C3D5A] dark:hover:text-sky-400 capitalize transition"
        >
          {article.category || 'News'}
        </Link>
        {article.region && (
          <>
            <ChevronRight size={13} className="text-[#6F675C]/50 dark:text-slate-500" />
            <span className="capitalize">{article.region}</span>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= MAIN ARTICLE COLUMN (8 COLS) ================= */}
        <article className="lg:col-span-8 bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-6 md:p-10 shadow-sm transition-colors">
          {/* Category & Region Eyebrow */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-[#1C3D5A] dark:bg-sky-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded">
              {article.category || 'News'}
            </span>
            {article.region && (
              <span className="bg-[#F5F1E8] dark:bg-white/10 text-[#1C3D5A] dark:text-sky-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-[rgba(33,29,24,0.1)] dark:border-white/10">
                {article.region}
              </span>
            )}
            {article.isBreaking && (
              <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded animate-pulse">
                Breaking Alert
              </span>
            )}
            <span className="text-[11px] text-[#6F675C] dark:text-slate-400 ml-auto flex items-center gap-1 font-medium">
              <Clock size={12} /> 3 min read
            </span>
          </div>

          {/* Article Main Headline */}
          <h1 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-[#211D18] dark:text-white leading-[1.2] tracking-tight">
            {article.title}
          </h1>

          {/* Lead Standfirst / Summary Deck */}
          {article.summary && (
            <div className="my-5 p-4 rounded-xl bg-[#F5F1E8] dark:bg-white/5 border-l-4 border-[#1C3D5A] dark:border-sky-500 text-[#211D18] dark:text-slate-200 text-base md:text-lg leading-relaxed font-medium">
              {article.summary}
            </div>
          )}

          {/* Author Byline Card & Interactive Actions Bar */}
          <ArticleClientActions article={article} />

          {/* Hero Featured Image — Clean Natural Aspect Ratio */}
          {article.imageUrl && (
            <figure className="my-6">
              <div className="rounded-xl overflow-hidden border border-[rgba(33,29,24,0.1)] dark:border-white/10 bg-[#F5F1E8] dark:bg-black/50 shadow-sm">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-auto max-h-[520px] object-cover object-top"
                />
              </div>
              <figcaption className="text-[11px] text-[#6F675C] dark:text-slate-400 mt-2 px-1 flex items-center justify-between font-medium">
                <span>Photo: DK Times Newsroom / {article.source || 'Editorial Desk'}</span>
                <span>Hyderabad, Telangana</span>
              </figcaption>
            </figure>
          )}

          {/* Main Article Body */}
          <div className="prose prose-lg max-w-none text-[#211D18] dark:text-slate-200 text-base md:text-lg leading-[1.75] font-normal my-8 space-y-5">
            {hasDistinctContent ? (
              <div
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="space-y-4"
              />
            ) : (
              <div className="space-y-4">
                <p>
                  {article.summary}
                </p>
                <p className="text-base text-[#6F675C] dark:text-slate-400">
                  మరిన్ని వివరాలు త్వరలో అప్‌డేట్ చేయబడతాయి. తాజా వార్తలు, ఎప్పటికప్పుడు బ్రేకింగ్ అప్‌డేట్స్ కోసం డికే టైమ్స్ యాప్‌ను డౌన్‌లోడ్ చేసుకోండి.
                </p>
              </div>
            )}
          </div>

          {/* Article Tags */}
          <div className="pt-6 border-t border-[rgba(33,29,24,0.08)] dark:border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#6F675C] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Tag size={13} /> Tags:
            </span>
            {[
              article.category,
              article.region,
              'Telangana News',
              'Andhra Pradesh',
              'DK Times Exclusive',
            ]
              .filter(Boolean)
              .map((tag) => (
                <span
                  key={tag}
                  className="bg-[#F5F1E8] dark:bg-white/10 hover:bg-[#1C3D5A]/10 dark:hover:bg-white/20 text-[#1C3D5A] dark:text-sky-300 text-xs font-semibold px-3 py-1 rounded-full border border-[rgba(33,29,24,0.1)] dark:border-white/10 transition cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
          </div>

          {/* Interactive Comment Section */}
          <CommentSection articleId={article.id} />
        </article>

        {/* ================= RIGHT SIDEBAR (4 COLS) ================= */}
        <aside className="lg:col-span-4 space-y-6">
          {/* WhatsApp Channel Card */}
          <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle size={20} className="text-emerald-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">
                Official Channel
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg leading-tight">
              Get Breaking News on WhatsApp
            </h3>
            <p className="text-white/80 text-xs mt-1 leading-relaxed">
              Join 50,000+ readers receiving instant verified alerts directly to their phone.
            </p>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-full bg-white text-emerald-900 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-emerald-50 transition shadow"
            >
              Join WhatsApp Channel →
            </a>
          </div>

          {/* Trending Stories Sidebar Card */}
          <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-5 shadow-sm transition-colors">
            <div className="flex items-center gap-2 pb-3 border-b border-[rgba(33,29,24,0.08)] dark:border-white/10 mb-4">
              <Flame size={18} className="text-red-500 fill-current" />
              <h3 className="font-serif font-black text-sm uppercase tracking-wider text-[#211D18] dark:text-white">
                Trending Stories
              </h3>
            </div>

            <div className="space-y-4">
              {sidebarStories.map((story, i) => (
                <div key={story.id} className="flex gap-3 group items-start">
                  <span className="text-base font-serif font-black text-[#1C3D5A]/40 dark:text-sky-400/40 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/article/${story.id}`}>
                      <h4 className="font-serif font-bold text-xs text-[#211D18] dark:text-slate-200 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition leading-snug line-clamp-2">
                        {story.title}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] text-[#6F675C] dark:text-slate-400 mt-1 font-medium">
                      <span>{story.category}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(story.publishedAt)}</span>
                    </div>
                  </div>
                  {story.imageUrl && (
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-[rgba(33,29,24,0.1)] dark:border-white/10">
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shorts Sidebar Card (ONLY IF SHORTS EXIST) */}
          {shorts.length > 0 && (
            <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-5 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(33,29,24,0.08)] dark:border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Play size={16} className="text-red-600 fill-current" />
                  <h3 className="font-serif font-black text-sm uppercase tracking-wider text-[#211D18] dark:text-white">
                    DK Shorts
                  </h3>
                </div>
                <Link href="/shorts" className="text-[10px] font-bold text-[#1C3D5A] dark:text-sky-400 hover:underline">
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {shorts.slice(0, 2).map((s) => (
                  <Link
                    key={s.id}
                    href="/shorts"
                    className="aspect-[9/16] rounded-xl overflow-hidden bg-black relative group block"
                  >
                    {s.thumbnailUrl && (
                      <img src={s.thumbnailUrl} alt={s.title} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <Play size={14} className="fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black via-black/70 to-transparent">
                      <p className="text-white text-[10px] font-bold line-clamp-2 leading-tight">
                        {s.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ================= MORE STORIES GRID AT BOTTOM ================= */}
      {bottomRelated.length > 0 && (
        <section className="mt-12 pt-8 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif font-black text-xl text-[#211D18] dark:text-white">
              More Stories You May Like
            </h3>
            <Link href="/news" className="text-xs font-bold text-[#1C3D5A] dark:text-sky-400 hover:underline flex items-center gap-1">
              Browse All News <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bottomRelated.map((r) => (
              <Link
                key={r.id}
                href={`/article/${r.id}`}
                className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-4 shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[16/10] bg-neutral-900 rounded-lg overflow-hidden mb-3 relative">
                    <img
                      src={r.imageUrl}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-[#6F675C] dark:text-slate-400 mb-1">
                    <span className="font-bold uppercase tracking-wider text-[#1C3D5A] dark:text-sky-400">
                      {r.category || 'News'}
                    </span>
                    <span>{formatTimeAgo(r.publishedAt)}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#211D18] dark:text-slate-100 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition line-clamp-2 leading-snug mt-1">
                    {r.title}
                  </h4>
                </div>
                <div className="mt-3 pt-3 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-[10px] text-[#6F675C] dark:text-slate-400">
                    {formatEditorialDate(r.publishedAt)}
                  </span>
                  <span className="font-bold text-xs text-[#1C3D5A] dark:text-sky-400 group-hover:underline flex items-center gap-1">
                    Read More <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
