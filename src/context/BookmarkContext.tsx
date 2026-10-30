'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { NewsArticle } from '@/types';

export interface SavedArticle {
  id: string;
  title: string;
  imageUrl?: string;
  category?: string;
  publishedAt?: string;
}

interface BookmarkContextType {
  bookmarks: SavedArticle[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (article: Partial<NewsArticle>) => boolean;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const BookmarkContext = createContext<BookmarkContextType>({
  bookmarks: [],
  isBookmarked: () => false,
  toggleBookmark: () => false,
  drawerOpen: false,
  setDrawerOpen: () => {},
});

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<SavedArticle[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('dk_bookmarks');
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load bookmarks', e);
    }
  }, []);

  const isBookmarked = (id: string) => {
    return bookmarks.some((b) => b.id === id);
  };

  const toggleBookmark = (article: Partial<NewsArticle>): boolean => {
    if (!article.id) return false;

    let updated: SavedArticle[];
    let nowSaved = false;

    if (isBookmarked(article.id)) {
      updated = bookmarks.filter((b) => b.id !== article.id);
      nowSaved = false;
    } else {
      const item: SavedArticle = {
        id: article.id,
        title: article.title || 'Untitled Story',
        imageUrl: article.imageUrl,
        category: article.category,
        publishedAt:
          typeof article.publishedAt === 'string'
            ? article.publishedAt
            : new Date().toISOString(),
      };
      updated = [item, ...bookmarks];
      nowSaved = true;
    }

    setBookmarks(updated);
    try {
      localStorage.setItem('dk_bookmarks', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return nowSaved;
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        isBookmarked,
        toggleBookmark,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => useContext(BookmarkContext);
