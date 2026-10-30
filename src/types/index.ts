export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  categories?: string[];
  region: string;
  regions?: string[];
  language?: string;
  languages?: string[];
  imageUrl: string;
  youtubeUrl?: string;
  author: string;
  source: string;
  sourceUrl?: string;
  isBreaking: boolean;
  isDraft: boolean;
  isScheduled?: boolean;
  scheduledAt?: string;
  publishedAt: any;
  updatedAt?: any;
  views?: number;
  likes?: number;
}

export interface ShortVideo {
  id: string;
  title: string;
  videoUrl?: string;
  storagePath?: string;
  mimeType?: string;
  url?: string;
  videoId?: string;
  thumbnailUrl: string;
  thumbnailPath?: string;
  views: number;
  createdAt: any;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType?: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requirements?: string | string[];
  contactEmail?: string;
  applyUrl?: string;
  isActive: boolean;
  postedAt: any;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  location: string;
  region: string;
  images: string[];
  advertiserName: string;
  whatsappNumber: string;
  verified: boolean;
  postedAt: any;
}

export interface PosterAd {
  id: string;
  imageUrl: string;
  language?: string;
  region?: string;
  active: boolean;
  priority: number;
  linkUrl?: string;
  customActionEnabled?: boolean;
  customActionLabel?: string;
  customActionNumber?: string;
  customActionText?: string;
  validFrom?: string;
  validTo?: string;
}

export interface ArticleComment {
  id: string;
  articleId: string;
  userName: string;
  userEmail?: string;
  text: string;
  createdAt: any;
  replies?: {
    id: string;
    userName: string;
    text: string;
    createdAt: any;
  }[];
}
