'use client';

import { useBookmarks } from '@/context/BookmarkContext';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SavedArticlesDrawer() {
  const { bookmarks, toggleBookmark, drawerOpen, setDrawerOpen } = useBookmarks();

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-md bg-[#FFFDF7] dark:bg-[#141414] h-full shadow-2xl border-l border-[rgba(33,29,24,0.12)] dark:border-white/10 flex flex-col justify-between p-6 animate-in slide-in-from-right duration-300"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(33,29,24,0.08)] dark:border-white/10">
            <div className="flex items-center gap-2">
              <Bookmark size={20} className="text-[#1C3D5A] dark:text-sky-400 fill-current" />
              <h3 className="font-serif font-black text-xl text-[#211D18] dark:text-white">
                Saved Stories ({bookmarks.length})
              </h3>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1.5 text-[#6F675C] hover:text-[#211D18] dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-xs text-[#6F675C] dark:text-slate-400 mt-2 mb-4">
            Articles saved to your reading list on this device.
          </p>

          {/* List */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
            {bookmarks.map((story) => (
              <div
                key={story.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F1E8] dark:bg-white/5 border border-[rgba(33,29,24,0.08)] dark:border-white/10 hover:border-[#1C3D5A]/40 transition group"
              >
                {story.imageUrl && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#1C3D5A] dark:text-sky-400">
                    {story.category || 'News'}
                  </span>
                  <Link
                    href={`/article/${story.id}`}
                    onClick={() => setDrawerOpen(false)}
                    className="block"
                  >
                    <h4 className="font-serif font-bold text-xs text-[#211D18] dark:text-white group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition line-clamp-2 mt-0.5 leading-snug">
                      {story.title}
                    </h4>
                  </Link>
                </div>
                <button
                  onClick={() => toggleBookmark(story as any)}
                  className="p-1.5 text-[#6F675C] hover:text-red-600 transition shrink-0"
                  title="Remove from saved"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            {bookmarks.length === 0 && (
              <div className="text-center py-12 text-[#6F675C] dark:text-slate-400">
                <Bookmark size={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold">Your reading list is empty.</p>
                <p className="text-xs mt-1">Tap the bookmark icon on any story to save it for later.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[rgba(33,29,24,0.08)] dark:border-white/10 flex justify-between items-center text-xs">
          <span className="text-[#6F675C] dark:text-slate-400">
            {bookmarks.length} {bookmarks.length === 1 ? 'article' : 'articles'} saved
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="bg-[#1C3D5A] dark:bg-sky-600 text-white font-bold px-4 py-2 rounded-lg text-xs hover:opacity-90 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
