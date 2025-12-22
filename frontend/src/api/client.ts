/**
 * API Client for VortixPR Backend
 * 
 * API 路徑分類：
 * - /public/ - 公開資料（可快取）
 * - /write/ - 寫入操作（不快取）
 * - /admin/ - 管理操作（需認證，不快取）
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const PUBLIC_API = `${API_BASE_URL}/public`;
const WRITE_API = `${API_BASE_URL}/write`;

// ==================== Types ====================

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  read_time: number;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PricingPackage {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  currency: string;
  billing_period: string;
  features: string[];
  is_popular: boolean;
  badge_text: string | null;
  display_order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MediaLogo {
  url: string;
  name: string;
}

export interface DetailSection {
  title: string;
  items: string[];
}

export interface DetailedInfo {
  sections: DetailSection[];
  note?: string;
  cta_text?: string;
}

export interface PRPackage {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string;
  badge: string | null;
  guaranteed_publications: number | null;
  media_logos: MediaLogo[];
  features: string[];
  detailed_info: DetailedInfo | null;
  category_id: string;
  status: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PRPackageCategory {
  id: string;
  title: string;
  badges: string[];
  packages: PRPackage[];
}

// ==================== Blog API ====================

export const blogAPI = {
  /**
   * 取得文章列表（Public API - 可快取）
   */
  async getPosts(params?: {
    page?: number;
    page_size?: number;
    category?: string;
    search?: string;
  }): Promise<BlogPostsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(`${PUBLIC_API}/blog/posts?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch blog posts');
    return response.json();
  },

  /**
   * 取得單篇文章（Public API - 可快取）
   */
  async getPost(slug: string): Promise<BlogPost> {
    const response = await fetch(`${PUBLIC_API}/blog/posts/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch blog post');
    return response.json();
  },

  /**
   * 取得分類列表（Public API - 可快取）
   */
  async getCategories(): Promise<Array<{ name: string; count: number }>> {
    const response = await fetch(`${PUBLIC_API}/blog/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },
};

// ==================== Pricing API ====================

export const pricingAPI = {
  /**
   * 取得所有定價方案（Public API - 可快取）
   */
  async getPackages(status: string = 'active'): Promise<PricingPackage[]> {
    const response = await fetch(`${PUBLIC_API}/pricing/packages?status=${status}`);
    if (!response.ok) throw new Error('Failed to fetch pricing packages');
    return response.json();
  },

  /**
   * 取得單個定價方案（Public API - 可快取）
   */
  async getPackage(slug: string): Promise<PricingPackage> {
    const response = await fetch(`${PUBLIC_API}/pricing/packages/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch pricing package');
    return response.json();
  },
};

// ==================== PR Packages API ====================

export const prPackagesAPI = {
  /**
   * 取得所有 PR Packages（按分類）（Public API - 可快取）
   */
  async getPackagesByCategory(status: string = 'active'): Promise<PRPackageCategory[]> {
    const response = await fetch(`${PUBLIC_API}/pr-packages/?status=${status}`);
    if (!response.ok) throw new Error('Failed to fetch PR packages');
    return response.json();
  },

  /**
   * 取得單個 PR Package（Public API - 可快取）
   */
  async getPackage(slug: string): Promise<PRPackage> {
    const response = await fetch(`${PUBLIC_API}/pr-packages/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch PR package');
    return response.json();
  },
};

// ==================== Contact API ====================

export const contactAPI = {
  /**
   * 提交聯絡表單（Write API - 不快取）
   */
  async submit(data: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message: string;
  }): Promise<void> {
    const response = await fetch(`${WRITE_API}/contact/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit contact form');
  },
};

// ==================== Newsletter API ====================

export const newsletterAPI = {
  /**
   * 訂閱 Newsletter（Write API - 不快取）
   */
  async subscribe(email: string, source?: string): Promise<{ message: string }> {
    const response = await fetch(`${WRITE_API}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    });
    if (!response.ok) throw new Error('Failed to subscribe');
    return response.json();
  },
};

