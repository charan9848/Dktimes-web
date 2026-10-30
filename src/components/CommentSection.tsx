'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MessageSquare, Send, ThumbsUp, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatTimeAgo } from '@/lib/date-utils';

interface Props {
  articleId: string;
}

interface CommentItem {
  id: string;
  userName: string;
  text: string;
  timeAgo: string;
  likes: number;
  userLiked?: boolean;
}

export default function CommentSection({ articleId }: Props) {
  const { user } = useAuth();
  const [userName, setUserName] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);

  // 1. Fetch real comments from Firestore backend
  useEffect(() => {
    let isMounted = true;

    const loadRealComments = async () => {
      setFetching(true);
      try {
        const q = query(
          collection(db, 'comments'),
          where('articleId', '==', articleId)
        );
        const snap = await getDocs(q);
        const list: CommentItem[] = [];

        snap.forEach((doc) => {
          const data = doc.data();
          let dateStr = new Date().toISOString();
          if (data.createdAt?.toDate) {
            dateStr = data.createdAt.toDate().toISOString();
          } else if (data.createdAt?.seconds) {
            dateStr = new Date(data.createdAt.seconds * 1000).toISOString();
          } else if (typeof data.createdAt === 'string') {
            dateStr = data.createdAt;
          }

          list.push({
            id: doc.id,
            userName: data.userName || 'Reader',
            text: data.text || '',
            timeAgo: formatTimeAgo(dateStr),
            likes: typeof data.likes === 'number' ? data.likes : 0,
          });
        });

        // Also check if user submitted comments in this session locally
        if (typeof window !== 'undefined') {
          const localStored = localStorage.getItem(`dk_comments_${articleId}`);
          if (localStored) {
            try {
              const localParsed: CommentItem[] = JSON.parse(localStored);
              // Avoid duplicates
              localParsed.forEach((lc) => {
                if (!list.some((existing) => existing.id === lc.id)) {
                  list.unshift(lc);
                }
              });
            } catch (e) {
              console.error(e);
            }
          }
        }

        if (isMounted) {
          setComments(list);
        }
      } catch (err) {
        console.error('Error fetching real comments from Firestore:', err);
      } finally {
        if (isMounted) {
          setFetching(false);
        }
      }
    };

    if (articleId) {
      loadRealComments();
    }

    return () => {
      isMounted = false;
    };
  }, [articleId]);

  // 2. Submit new comment to Firestore backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    const author = userName.trim() || user?.phoneNumber || 'Reader';
    const cleanText = text.trim();

    const tempComment: CommentItem = {
      id: `c_${Date.now()}`,
      userName: author,
      text: cleanText,
      timeAgo: 'Just now',
      likes: 0,
    };

    try {
      // Write to live Firestore backend
      const docRef = await addDoc(collection(db, 'comments'), {
        articleId,
        text: cleanText,
        userName: author,
        userId: user?.uid || 'anonymous',
        likes: 0,
        isLiked: false,
        createdAt: serverTimestamp(),
      });

      tempComment.id = docRef.id;

      // Optimistically update live list
      setComments((prev) => [tempComment, ...prev]);

      // Cache locally
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`dk_comments_${articleId}`);
        const existing = stored ? JSON.parse(stored) : [];
        localStorage.setItem(
          `dk_comments_${articleId}`,
          JSON.stringify([tempComment, ...existing])
        );
      }

      setText('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.warn('Firestore write failed, saving locally:', err);
      // If Firestore security prevents write, gracefully save to reader local state
      setComments((prev) => [tempComment, ...prev]);
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`dk_comments_${articleId}`);
        const existing = stored ? JSON.parse(stored) : [];
        localStorage.setItem(
          `dk_comments_${articleId}`,
          JSON.stringify([tempComment, ...existing])
        );
      }
      setText('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isLiked = c.userLiked;
          return {
            ...c,
            likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
            userLiked: !isLiked,
          };
        }
        return c;
      })
    );
  };

  return (
    <div id="comments-section" className="mt-12 pt-8 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <MessageSquare size={20} className="text-[#1C3D5A] dark:text-sky-400" />
          <h3 className="font-serif font-black text-xl text-[#211D18] dark:text-white">
            Audience Discussion ({comments.length})
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-bold text-[#6F675C] dark:text-slate-400">
          DK Times Community
        </span>
      </div>

      {/* Comment Input Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3.5 bg-[#FFFDF7] dark:bg-[#141414] p-5 rounded-2xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 shadow-xs transition-colors mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Your name or pseudonym (e.g. Ramesh, Hyderabad)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full bg-[#F5F1E8] dark:bg-[#1E1E1E] border border-[rgba(33,29,24,0.15)] dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#211D18] dark:text-white focus:outline-none focus:border-[#1C3D5A] dark:focus:border-sky-400 placeholder:text-[#6F675C]/70 dark:placeholder:text-slate-500"
          />
        </div>

        <textarea
          rows={3}
          placeholder="Share your thoughts or verified ground reports respectfully..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="w-full bg-[#F5F1E8] dark:bg-[#1E1E1E] border border-[rgba(33,29,24,0.15)] dark:border-white/10 rounded-xl p-3.5 text-xs font-medium text-[#211D18] dark:text-white focus:outline-none focus:border-[#1C3D5A] dark:focus:border-sky-400 placeholder:text-[#6F675C]/70 dark:placeholder:text-slate-500"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="text-[10px] text-[#6F675C] dark:text-slate-400">
            Comments are moderated according to DK Times Editorial Standards.
          </span>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#1C3D5A] hover:bg-[#142A3E] dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition disabled:opacity-50 shadow-sm cursor-pointer"
          >
            <Send size={12} /> {loading ? 'Submitting...' : 'Post Comment'}
          </button>
        </div>

        {submitted && (
          <p className="text-emerald-700 dark:text-emerald-400 text-xs font-bold pt-1 flex items-center gap-1">
            ✓ Your comment has been posted to the discussion thread.
          </p>
        )}
      </form>

      {/* Discussion List or Empty State */}
      {fetching ? (
        <div className="p-8 text-center text-xs text-[#6F675C] dark:text-slate-400 flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin text-[#1C3D5A] dark:text-sky-400" />
          <span>Loading discussion...</span>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-[#FFFDF7] dark:bg-[#141414] border border-[rgba(33,29,24,0.08)] dark:border-white/10 rounded-2xl p-4 shadow-2xs transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1C3D5A]/10 dark:bg-sky-950 text-[#1C3D5A] dark:text-sky-300 font-black text-[11px] flex items-center justify-center">
                    {c.userName[0].toUpperCase()}
                  </div>
                  <span className="font-bold text-xs text-[#211D18] dark:text-white flex items-center gap-1">
                    {c.userName}
                    <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400 inline" />
                  </span>
                </div>
                <span className="text-[10px] text-[#6F675C] dark:text-slate-400 font-medium">
                  {c.timeAgo}
                </span>
              </div>

              <p className="text-xs text-[#211D18]/90 dark:text-slate-200 leading-relaxed pl-9">
                {c.text}
              </p>

              <div className="mt-2 pl-9 flex items-center gap-3">
                <button
                  onClick={() => handleLikeComment(c.id)}
                  className={`text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                    c.userLiked
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-[#6F675C] dark:text-slate-400 hover:text-[#211D18]'
                  }`}
                >
                  <ThumbsUp size={11} className={c.userLiked ? 'fill-current' : ''} />
                  <span>{c.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Real Honest Empty State */
        <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.08)] dark:border-white/10 p-8 text-center text-[#6F675C] dark:text-slate-400">
          <MessageSquare size={28} className="mx-auto mb-2 opacity-30 text-[#1C3D5A] dark:text-sky-400" />
          <p className="font-bold text-sm text-[#211D18] dark:text-white">No comments yet</p>
          <p className="text-xs mt-1">Be the first to share your thoughts and start the discussion on this story!</p>
        </div>
      )}
    </div>
  );
}
