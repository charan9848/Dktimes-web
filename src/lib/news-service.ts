import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  addDoc,
  getCountFromServer,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { NewsArticle, ShortVideo, JobListing, MarketplaceListing, PosterAd } from '@/types';

export function serializeData<T>(docData: any): T {
  const result: any = { ...docData };
  for (const key in result) {
    if (result[key] && typeof result[key].toDate === 'function') {
      result[key] = result[key].toDate().toISOString();
    }
  }
  return result as T;
}

// 1. Fetch Breaking News (resilient to composite index requirements)
export async function getBreakingNews(): Promise<NewsArticle[]> {
  try {
    const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'), limit(25));
    const snap = await getDocs(q);
    const all = snap.docs.map((d) => serializeData<NewsArticle>({ id: d.id, ...d.data() }));
    return all.filter((a) => !a.isDraft && a.isBreaking).slice(0, 5);
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    return [];
  }
}

// 2. Fetch Latest Articles
export async function getLatestNews(pageSize = 12): Promise<NewsArticle[]> {
  try {
    const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'), limit(pageSize * 2));
    const snap = await getDocs(q);
    const all = snap.docs.map((d) => serializeData<NewsArticle>({ id: d.id, ...d.data() }));
    return all.filter((a) => !a.isDraft).slice(0, pageSize);
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }
}

// 3. Paginated News Across All 500+ Articles
export async function getPaginatedNews(page = 1, pageSize = 24): Promise<{
  articles: NewsArticle[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}> {
  try {
    const coll = collection(db, 'news');
    const countSnapshot = await getCountFromServer(coll);
    const totalCount = countSnapshot.data().count;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const currentPage = Math.max(1, Math.min(page, totalPages));

    // Fetch up to the current page boundary
    const q = query(
      coll,
      orderBy('publishedAt', 'desc'),
      limit(currentPage * pageSize)
    );
    const snap = await getDocs(q);
    const all = snap.docs.map((d) => serializeData<NewsArticle>({ id: d.id, ...d.data() }));
    const startIndex = (currentPage - 1) * pageSize;
    const articles = all.slice(startIndex, startIndex + pageSize);

    return {
      articles,
      totalCount,
      totalPages,
      currentPage,
    };
  } catch (error) {
    console.error('Error fetching paginated news:', error);
    return {
      articles: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: 1,
    };
  }
}

// 4. Fetch Single Article by ID
export async function getArticleById(id: string): Promise<NewsArticle | null> {
  try {
    const ref = doc(db, 'news', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return serializeData<NewsArticle>({ id: snap.id, ...snap.data() });
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// 5. Fetch Category Articles (Searches across 120 latest to find all category stories)
export async function getCategoryNews(category: string, pageSize = 24, page = 1): Promise<{
  articles: NewsArticle[];
  totalCategoryCount: number;
}> {
  try {
    const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'), limit(300));
    const snap = await getDocs(q);
    const all = snap.docs.map((d) => serializeData<NewsArticle>({ id: d.id, ...d.data() }));
    const target = category.toLowerCase().trim();
    const filtered = all.filter((a) => {
      if (a.isDraft) return false;
      const cat = (a.category || '').toLowerCase();
      const cats = (a.categories || []).map((c) => c.toLowerCase());
      const reg = (a.region || '').toLowerCase();
      const regs = (a.regions || []).map((r) => r.toLowerCase());
      return (
        cat.includes(target) ||
        cats.includes(target) ||
        reg.includes(target) ||
        regs.includes(target)
      );
    });

    const startIndex = (page - 1) * pageSize;
    const articles = filtered.slice(startIndex, startIndex + pageSize);
    return {
      articles,
      totalCategoryCount: filtered.length,
    };
  } catch (error) {
    console.error('Error fetching category news:', error);
    return { articles: [], totalCategoryCount: 0 };
  }
}

// 6. Fetch Shorts Videos
export async function getLatestShorts(count = 8): Promise<ShortVideo[]> {
  try {
    const q = query(collection(db, 'shorts'), orderBy('createdAt', 'desc'), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => serializeData<ShortVideo>({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching shorts:', error);
    return [];
  }
}

// 7. Fetch Active Job Listings
export async function getJobListings(pageSize = 6): Promise<JobListing[]> {
  try {
    const q = query(collection(db, 'jobs'), orderBy('postedAt', 'desc'), limit(pageSize * 2));
    const snap = await getDocs(q);
    const all = snap.docs.map((d) => serializeData<JobListing>({ id: d.id, ...d.data() }));
    return all.filter((j) => j.isActive !== false).slice(0, pageSize);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

// 8. Fetch Marketplace Classifieds
export async function getMarketplaceListings(pageSize = 6): Promise<MarketplaceListing[]> {
  try {
    const q = query(collection(db, 'marketplace'), orderBy('postedAt', 'desc'), limit(pageSize));
    const snap = await getDocs(q);
    return snap.docs.map((d) => serializeData<MarketplaceListing>({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    return [];
  }
}

// 9. Fetch Active Sponsored Posters
export async function getActivePosters(): Promise<PosterAd[]> {
  try {
    const q = query(collection(db, 'posters'), orderBy('priority', 'desc'), limit(10));
    const snap = await getDocs(q);
    const all = snap.docs.map((d) => serializeData<PosterAd>({ id: d.id, ...d.data() }));
    return all.filter((p) => p.active !== false).slice(0, 4);
  } catch (error) {
    console.error('Error fetching posters:', error);
    return [];
  }
}

// 10. Post Reader Comment
export async function addArticleComment(articleId: string, userName: string, text: string) {
  return await addDoc(collection(db, 'comments'), {
    articleId,
    userName: userName.trim() || 'DK Reader',
    text: text.trim(),
    likes: 0,
    isLiked: false,
    createdAt: serverTimestamp(),
  });
}
