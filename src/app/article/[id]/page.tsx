import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleById, getLatestNews, getLatestShorts } from '@/lib/news-service';
import CommentSection from '@/components/CommentSection';
import ArticleClientActions from '@/components/ArticleClientActions';
import { formatEditorialDate } from '@/lib/date-utils';
import TimeAgo from '@/components/TimeAgo';
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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;

  // Parallel fetch: current article, trending stories for sidebar, shorts
  const [article, latestStories, shorts] = await Promise.all([
    getArticleById(id),
    getLatestNews(12),
    getLatestShorts(4),
  ]);

  if (!article) {
    notFound();
  }

  // Sidebar trending stories (excluding current article)
  const sidebarStories = latestStories.filter((s) => s.id !== article.id).slice(0, 5);
  // Bottom related stories
  const bottomRelated = latestStories.filter((s) => s.id !== article.id).slice(5, 9);

  return (
    <main className="mx-auto max-w-[1400px] px-4 md:px-6 py-6 md:py-8">
      {/* Editorial Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-[#6F675C] dark:text-slate-400 mb-6 font-medium"
      >
        <Link href="/" className="hover:text-[#1C3D5A] dark:hover:text-sky-400 transition">
          Home
        </Link>
        <ChevronRight size={12} className="text-[#6F675C]/50" />
        <Link
          href={`/news/${(article.category || 'news').toLowerCase()}`}
          className="hover:text-[#1C3D5A] dark:hover:text-sky-400 transition capitalize"
        >
          {article.category || 'News'}
        </Link>
        {article.region && (
          <>
            <ChevronRight size={12} className="text-[#6F675C]/50" />
            <span className="text-[#211D18] dark:text-slate-300 capitalize">{article.region}</span>
          </>
        )}
      </nav>

      {/* Main Grid: 8 Columns Article, 4 Columns Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* ================= LEFT MAIN ARTICLE (8 COLS) ================= */}
        <article className="lg:col-span-8">
          {/* Category & Region Eyebrow */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-[#1C3D5A] dark:bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded shadow-sm">
              {article.category || 'Breaking'}
            </span>
            {article.region && (
              <span className="bg-[#F5F1E8] dark:bg-white/10 text-[#1C3D5A] dark:text-sky-300 border border-[rgba(33,29,24,0.1)] dark:border-white/10 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {article.region}
              </span>
            )}
            <span className="text-[11px] text-[#6F675C] dark:text-slate-400 flex items-center gap-1 font-medium ml-auto">
              <Clock size={12} /> 3 min read
            </span>
          </div>

          {/* Headline (Indian Broadsheet Typography) */}
          <h1 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.2] text-[#211D18] dark:text-white tracking-[-0.02em]">
            {article.title}
          </h1>

          {/* Standfirst / Summary Deck */}
          {article.summary && (
            <p className="text-base sm:text-lg text-[#211D18]/90 dark:text-slate-300 leading-relaxed font-normal mt-4 p-4 rounded-xl bg-[#FFFDF7] dark:bg-[#141414] border-l-4 border-[#1C3D5A] dark:border-sky-500 shadow-sm">
              {article.summary}
            </p>
          )}

          {/* Interactive Byline Bar: Like, Discuss, Save, Translate, Share */}
          <ArticleClientActions article={article} />

          {/* Featured Hero Image Frame */}
          {article.imageUrl && (
            <div className="my-6 rounded-2xl overflow-hidden border border-[rgba(33,29,24,0.1)] dark:border-white/10 shadow-sm bg-neutral-900">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full max-h-[520px] object-cover"
                loading="eager"
              />
              <div className="p-3 bg-[#FFFDF7] dark:bg-[#141414] border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 text-[11px] text-[#6F675C] dark:text-slate-400 flex justify-between items-center">
                <span>Photo: DK Times Newsroom / {article.source || 'DK Times'}</span>
                <span>{article.region ? `${article.region}, ` : ''}Telangana</span>
              </div>
            </div>
          )}

          {/* Article Full Body Content */}
          <div className="prose dark:prose-invert max-w-none text-[#211D18] dark:text-slate-200 text-base sm:text-lg leading-[1.8] font-normal my-8 space-y-5">
            {article.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: article.content.replace(/\n\n/g, '<p class="my-4"></p>'),
                }}
              />
            ) : (
              <div className="space-y-4">
                <p>{article.summary}</p>
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

          {/* Live Interactive Comment Section */}
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
                <div
                  key={story.id}
                  className="flex items-start gap-3 pb-3 border-b border-[rgba(33,29,24,0.06)] dark:border-white/5 last:border-0 last:pb-0 group"
                >
                  <span className="font-serif font-black text-lg text-neutral-300 dark:text-neutral-700 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition w-5 shrink-0">
                    0{i + 1}
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
                      <TimeAgo timestamp={story.publishedAt} />
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
                    <TimeAgo timestamp={r.publishedAt} />
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
