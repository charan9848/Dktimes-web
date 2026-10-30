'use client';

import { useState, useEffect } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Check,
  Copy,
  Globe,
  Loader2,
  ThumbsUp,
} from 'lucide-react';
import { NewsArticle } from '@/types';
import { useBookmarks } from '@/context/BookmarkContext';
import { formatFullDateTime } from '@/lib/date-utils';

interface Props {
  article: NewsArticle;
}

export default function ArticleClientActions({ article }: Props) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [copied, setCopied] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [transTitle, setTransTitle] = useState('');
  const [transSummary, setTransSummary] = useState('');

  // Real like count from backend Firestore article record
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(article.likes || 0);

  useEffect(() => {
    if (typeof window !== 'undefined' && article.id) {
      const savedLike = localStorage.getItem(`dk_like_${article.id}`);
      if (savedLike === 'true') {
        setLiked(true);
      }
    }
  }, [article.id]);

  const handleToggleLike = () => {
    const nextState = !liked;
    setLiked(nextState);
    setLikeCount((c) => (nextState ? c + 1 : Math.max(0, c - 1)));
    if (typeof window !== 'undefined' && article.id) {
      localStorage.setItem(`dk_like_${article.id}`, String(nextState));
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share not supported
      }
    } else {
      handleCopyLink();
    }
  };

  const scrollToComments = () => {
    const el = document.getElementById('comments-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const saved = isBookmarked(article.id);

  const handleTranslate = async () => {
    if (translated) {
      setTranslated(false);
      return;
    }

    if (transTitle && transSummary) {
      setTranslated(true);
      return;
    }

    setTranslating(true);
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(
        article.title
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data[0]) {
        setTransTitle(data[0].map((item: any) => item[0]).join(''));
      }

      if (article.summary) {
        const sumUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(
          article.summary
        )}`;
        const sRes = await fetch(sumUrl);
        const sData = await sRes.json();
        if (sData && sData[0]) {
          setTransSummary(sData[0].map((item: any) => item[0]).join(''));
        }
      }

      setTranslated(true);
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div>
      {/* Author and Social Engagement Bar */}
      <div className="flex flex-wrap items-center justify-between border-y border-[rgba(33,29,24,0.08)] dark:border-white/10 py-3.5 my-4 gap-4 text-xs text-[#6F675C] dark:text-slate-400">
        {/* Author Bio */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1C3D5A] dark:bg-sky-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            {(article.author || 'DK')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-[#211D18] dark:text-white text-sm leading-tight">
              {article.author || 'DK Times Editorial'}
            </p>
            <p className="text-[11px] text-[#6F675C] dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
              <span className="font-medium text-[#211D18] dark:text-slate-200">
                {formatFullDateTime(article.publishedAt)}
              </span>
            </p>
          </div>
        </div>

        {/* Interactive Action Buttons (Like, Comment, Save, Share, Translate) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Like / Heart Button */}
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs transition cursor-pointer active:scale-95 ${
              liked
                ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800'
                : 'bg-[#F5F1E8] dark:bg-white/10 text-[#6F675C] dark:text-slate-300 hover:text-red-600 border-[rgba(33,29,24,0.1)] dark:border-white/10'
            }`}
            title={liked ? 'Unlike article' : 'Like article'}
          >
            <Heart
              size={14}
              className={liked ? 'fill-current text-red-600 dark:text-red-400 scale-110' : ''}
            />
            <span>{likeCount}</span>
          </button>

          {/* Jump to Comments Button */}
          <button
            onClick={scrollToComments}
            className="flex items-center gap-1.5 bg-[#F5F1E8] dark:bg-white/10 hover:bg-[#1C3D5A]/10 text-[#6F675C] dark:text-slate-300 px-3 py-1.5 rounded-lg border border-[rgba(33,29,24,0.1)] dark:border-white/10 font-bold text-xs transition cursor-pointer"
            title="View Comments & Discussion"
          >
            <MessageSquare size={13} />
            <span className="hidden sm:inline">Discuss</span>
          </button>

          {/* Save / Bookmark Button */}
          <button
            onClick={() => toggleBookmark(article)}
            className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
              saved
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700'
                : 'bg-[#F5F1E8] dark:bg-white/10 text-[#6F675C] dark:text-slate-300 hover:text-[#211D18] border-[rgba(33,29,24,0.1)] dark:border-white/10'
            }`}
            title={saved ? 'Remove from saved' : 'Save article'}
          >
            <Bookmark
              size={14}
              className={saved ? 'fill-current text-amber-600 dark:text-amber-300' : ''}
            />
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Translate Button */}
          <button
            onClick={handleTranslate}
            disabled={translating}
            className="flex items-center gap-1 bg-[#F5F1E8] dark:bg-white/10 hover:bg-[#1C3D5A]/10 text-[#1C3D5A] dark:text-sky-400 font-bold text-xs px-3 py-1.5 rounded-lg border border-[rgba(33,29,24,0.1)] dark:border-white/10 transition cursor-pointer"
            title="Translate article to English"
          >
            {translating ? <Loader2 size={13} className="animate-spin" /> : <Globe size={13} />}
            {translated ? 'Original' : 'English'}
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="p-2 bg-[#F5F1E8] dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-[#6F675C] dark:text-slate-300 rounded-lg border border-[rgba(33,29,24,0.1)] dark:border-white/10 transition cursor-pointer"
            title="Copy link to clipboard"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          </button>

          {/* WhatsApp Direct Share */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `${article.title}\n\nRead on DK Times: https://dktimesnews.com/article/${article.id}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            title="Share on WhatsApp"
          >
            <Share2 size={12} /> WhatsApp
          </a>
        </div>
      </div>

      {/* Instant Translation Box if Active */}
      {translated && (
        <div className="mb-6 p-5 bg-sky-50 dark:bg-sky-950/50 border-2 border-sky-200 dark:border-sky-800 rounded-2xl shadow-sm animate-in fade-in space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1">
              <Globe size={12} /> English Translation (Live)
            </span>
            <button
              onClick={() => setTranslated(false)}
              className="text-xs text-sky-700 dark:text-sky-400 hover:underline font-bold cursor-pointer"
            >
              Hide
            </button>
          </div>
          <h3 className="font-serif font-black text-xl text-[#1C3D5A] dark:text-white">
            {transTitle || article.title}
          </h3>
          <p className="text-sm text-[#211D18]/90 dark:text-slate-200 leading-relaxed font-normal">
            {transSummary || article.summary}
          </p>
        </div>
      )}
    </div>
  );
}
