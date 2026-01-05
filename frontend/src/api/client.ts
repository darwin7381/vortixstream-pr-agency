/**
 * API Client for VortixPR Backend
 * 
 * API 路徑分類：
 * - /public/ - 公開資料（可快取）
 * - /write/ - 寫入操作（不快取）
 * - /admin/ - 管理操作（需認證，不快取）
 * 
 * 注意：統一使用 config/api.ts 中的配置
 */

import { API_BASE_URL, PUBLIC_API, WRITE_API, ADMIN_API } from '../config/api';

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

export interface PRCategory {
  id: number;
  category_id: string;
  title: string;
  badges: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PRCategoryWithPackages extends PRCategory {
  packages_count: number;
  packages: Array<{
    id: number;
    name: string;
    slug: string;
    price: string;
    badge: string | null;
    status: string;
  }>;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  status: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  source?: string;
  status: string;
  ip_address?: string;
  subscribed_at: string;
  unsubscribed_at?: string;
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
   * 取得單篇文章（通過 ID - Admin 專用）
   */
  async getPostById(id: number): Promise<BlogPost> {
    const response = await fetch(`${ADMIN_API}/blog/posts/by-id/${id}`);
    if (!response.ok) throw new Error('Failed to fetch blog post');
    return response.json();
  },

  /**
   * 創建文章（Admin 專用）
   */
  async createPost(data: Omit<BlogPost, 'id' | 'slug' | 'created_at' | 'updated_at' | 'published_at'>): Promise<BlogPost> {
    const response = await fetch(`${ADMIN_API}/blog/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create blog post');
    return response.json();
  },

  /**
   * 更新文章（Admin 專用）
   */
  async updatePost(id: number, data: Partial<BlogPost>): Promise<BlogPost> {
    const response = await fetch(`${ADMIN_API}/blog/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update blog post');
    return response.json();
  },

  /**
   * 刪除文章（Admin 專用）
   */
  async deletePost(id: number): Promise<void> {
    const response = await fetch(`${ADMIN_API}/blog/posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete blog post');
  },

  /**
   * 取得單篇文章（通過 slug - Public API - 可快取）
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

  /**
   * 取得單個定價方案（通過 ID - Admin 專用）
   */
  async getPackageById(id: number): Promise<PricingPackage> {
    const response = await fetch(`${ADMIN_API}/pricing/packages/by-id/${id}`);
    if (!response.ok) throw new Error('Failed to fetch pricing package');
    return response.json();
  },

  /**
   * 創建定價方案（Admin 專用）
   */
  async createPackage(data: Omit<PricingPackage, 'id' | 'slug' | 'created_at' | 'updated_at'>): Promise<PricingPackage> {
    const response = await fetch(`${ADMIN_API}/pricing/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create pricing package');
    return response.json();
  },

  /**
   * 更新定價方案（Admin 專用）
   */
  async updatePackage(id: number, data: Partial<PricingPackage>): Promise<PricingPackage> {
    const response = await fetch(`${ADMIN_API}/pricing/packages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update pricing package');
    return response.json();
  },

  /**
   * 刪除定價方案（Admin 專用）
   */
  async deletePackage(id: number): Promise<void> {
    const response = await fetch(`${ADMIN_API}/pricing/packages/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete pricing package');
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

  /**
   * 取得單個 PR Package（通過 ID - Admin 專用）
   */
  async getPackageById(id: number): Promise<PRPackage> {
    const response = await fetch(`${ADMIN_API}/pr-packages/by-id/${id}`);
    if (!response.ok) throw new Error('Failed to fetch PR package');
    return response.json();
  },

  /**
   * 創建 PR Package（Admin 專用）
   */
  async createPackage(data: Omit<PRPackage, 'id' | 'slug' | 'created_at' | 'updated_at'>): Promise<PRPackage> {
    const response = await fetch(`${ADMIN_API}/pr-packages/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create PR package');
    return response.json();
  },

  /**
   * 更新 PR Package（Admin 專用）
   */
  async updatePackage(id: number, data: Partial<PRPackage>): Promise<PRPackage> {
    const response = await fetch(`${ADMIN_API}/pr-packages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update PR package');
    return response.json();
  },

  /**
   * 刪除 PR Package（Admin 專用）
   */
  async deletePackage(id: number): Promise<void> {
    const response = await fetch(`${ADMIN_API}/pr-packages/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete PR package');
  },

  /**
   * 更新 Package 的分類和順序（Admin 專用）
   */
  async updatePackageCategory(id: number, categoryId: string, displayOrder: number = 0): Promise<any> {
    const response = await fetch(
      `${ADMIN_API}/pr-packages/${id}/category?category_id=${categoryId}&display_order=${displayOrder}`,
      { method: 'PATCH' }
    );
    if (!response.ok) throw new Error('Failed to update package category');
    return response.json();
  },

  /**
   * 取得所有 Packages（不分類，Admin 專用）
   */
  async getAllPackages(status: string = 'all'): Promise<PRPackage[]> {
    const response = await fetch(`${ADMIN_API}/pr-packages/all?status=${status}`);
    if (!response.ok) throw new Error('Failed to fetch all packages');
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

// ==================== Admin - Contact API ====================

export const contactAdminAPI = {
  /**
   * 取得聯絡表單提交列表（Admin 專用）
   */
  async getSubmissions(params?: {
    status?: string;
    limit?: number;
    search?: string;
  }): Promise<ContactSubmission[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(`${ADMIN_API}/contact/submissions?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch contact submissions');
    return response.json();
  },

  /**
   * 取得單個聯絡表單提交（Admin 專用）
   */
  async getSubmission(id: number): Promise<ContactSubmission> {
    const response = await fetch(`${ADMIN_API}/contact/submissions/${id}`);
    if (!response.ok) throw new Error('Failed to fetch contact submission');
    return response.json();
  },

  /**
   * 更新聯絡表單狀態（Admin 專用）
   */
  async updateStatus(id: number, status: string): Promise<{ message: string; submission: ContactSubmission }> {
    const response = await fetch(`${ADMIN_API}/contact/submissions/${id}/status?status=${status}`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to update submission status');
    return response.json();
  },

  /**
   * 刪除聯絡表單提交（Admin 專用）
   */
  async deleteSubmission(id: number): Promise<void> {
    const response = await fetch(`${ADMIN_API}/contact/submissions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete submission');
  },
};

// ==================== Admin - Newsletter API ====================

export const newsletterAdminAPI = {
  /**
   * 取得訂閱者列表（Admin 專用）
   */
  async getSubscribers(params?: {
    status?: string;
    limit?: number;
    search?: string;
  }): Promise<NewsletterSubscriber[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(`${ADMIN_API}/newsletter/subscribers?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch subscribers');
    return response.json();
  },

  /**
   * 取得單個訂閱者（Admin 專用）
   */
  async getSubscriber(id: number): Promise<NewsletterSubscriber> {
    const response = await fetch(`${ADMIN_API}/newsletter/subscribers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch subscriber');
    return response.json();
  },

  /**
   * 更新訂閱者狀態（Admin 專用）
   */
  async updateStatus(id: number, status: string): Promise<{ message: string; subscriber: NewsletterSubscriber }> {
    const response = await fetch(`${ADMIN_API}/newsletter/subscribers/${id}/status?status=${status}`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to update subscriber status');
    return response.json();
  },

  /**
   * 刪除訂閱者（Admin 專用）
   */
  async deleteSubscriber(id: number): Promise<void> {
    const response = await fetch(`${ADMIN_API}/newsletter/subscribers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete subscriber');
  },

  /**
   * 取得訂閱統計（Admin 專用）
   */
  async getStats(): Promise<{ active_count: number; unsubscribed_count: number; total_count: number }> {
    const response = await fetch(`${ADMIN_API}/newsletter/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};

// ==================== Admin - PR Categories API ====================

export const prCategoryAdminAPI = {
  /**
   * 取得所有分類及其 packages（Admin 專用）
   */
  async getCategories(): Promise<PRCategoryWithPackages[]> {
    const response = await fetch(`${ADMIN_API}/pr-package-categories/`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  /**
   * 取得單個分類（Admin 專用）
   */
  async getCategory(categoryId: string): Promise<PRCategoryWithPackages> {
    const response = await fetch(`${ADMIN_API}/pr-package-categories/${categoryId}`);
    if (!response.ok) throw new Error('Failed to fetch category');
    return response.json();
  },

  /**
   * 創建分類（Admin 專用）
   */
  async createCategory(data: {
    category_id: string;
    title: string;
    badges: string[];
    display_order: number;
  }): Promise<PRCategory> {
    const response = await fetch(`${ADMIN_API}/pr-package-categories/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  /**
   * 更新分類（Admin 專用）
   */
  async updateCategory(categoryId: string, data: Partial<{
    category_id: string;
    title: string;
    badges: string[];
    display_order: number;
  }>): Promise<PRCategory> {
    const response = await fetch(`${ADMIN_API}/pr-package-categories/${categoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  /**
   * 刪除分類（Admin 專用）
   */
  async deleteCategory(categoryId: string): Promise<void> {
    const response = await fetch(`${ADMIN_API}/pr-package-categories/${categoryId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete category');
    }
  },
};

// ==================== Auth Types ====================

export type UserRole = 'user' | 'publisher' | 'admin' | 'super_admin';

export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

// ==================== Auth API ====================

export const authAPI = {
  /**
   * 註冊新用戶
   */
  async register(data: {
    email: string;
    password: string;
    name: string;
  }, invitationToken?: string): Promise<TokenResponse> {
    const url = invitationToken 
      ? `${API_BASE_URL}/auth/register?invitation_token=${invitationToken}`
      : `${API_BASE_URL}/auth/register`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to register');
    }
    return response.json();
  },

  /**
   * 登入
   */
  async login(data: {
    email: string;
    password: string;
  }): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to login');
    }
    return response.json();
  },

  /**
   * 獲取當前用戶資料
   */
  async getMe(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get user data');
    }
    return response.json();
  },

  /**
   * 刷新 Token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    return response.json();
  },

  /**
   * Google OAuth - 獲取登入 URL
   */
  async getGoogleLoginUrl(): Promise<{ url: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/google/login`);
    if (!response.ok) {
      throw new Error('Failed to get Google login URL');
    }
    return response.json();
  },

  /**
   * Google OAuth - 處理回調（由後端處理，前端只需導向）
   */
  googleCallback(code: string): string {
    return `${API_BASE_URL}/auth/google/callback?code=${code}`;
  },
};

// ==================== Content CMS API (Public) ====================

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  author_name: string;
  author_title: string | null;
  author_company: string | null;
  author_avatar_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  avatar_url: string | null;
  bio: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  site_logo_light: string;
  site_logo_dark: string;
  site_name: string;
  site_slogan: string;
  contact_email: string;
  contact_phone: string;
  social_twitter: string;
  social_linkedin: string;
  social_facebook: string;
  social_instagram: string;
  carousel_subtitle: string;
}

export interface Differentiator {
  id: number;
  text: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Stat {
  id: number;
  label: string;
  value: number;
  suffix: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CarouselLogo {
  id: number;
  name: string;
  logo_url: string;
  alt_text: string | null;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublisherFeature {
  id: number;
  title: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientLogo {
  id: number;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroSection {
  id: number;
  page: string;
  title_prefix: string | null;
  title_highlights: string[] | null;
  subtitle: string | null;
  cta_primary_text: string | null;
  cta_primary_url: string | null;
  cta_primary_url_mobile: string | null;
  cta_secondary_text: string | null;
  cta_secondary_url: string | null;
  center_logo_url: string | null;
  background_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroMediaLogo {
  id: number;
  hero_page: string;
  name: string;
  logo_url: string;
  size: string;
  position_top: string | null;
  position_left: string | null;
  position_right: string | null;
  opacity: number;
  animation_speed: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LyroSection {
  id: number;
  label: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  background_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LyroFeature {
  id: number;
  text: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NavItem {
  id: number;
  label: string;
  desktop_url: string;
  mobile_url?: string | null;
  target: string;
  parent_id: number | null;
  display_order: number;
}

export interface NavCTA {
  text: string;
  url: string;
}

export interface FooterLink {
  id: number;
  label: string;
  url: string;
  target: string;
  display_order: number;
}

export interface FooterSection {
  id: number;
  title: string;
  section_key: string;
  display_order: number;
  links: FooterLink[];
}

export interface FooterTextSettings {
  tagline?: string;
  description?: string;
  copyright?: string;
  newsletter_title?: string;
  newsletter_description?: string;
}

export const contentAPI = {
  // ===== Public APIs (前台讀取) =====
  
  async getFAQs(): Promise<FAQ[]> {
    const response = await fetch(`${PUBLIC_API}/content/faqs`);
    if (!response.ok) {
      throw new Error('Failed to fetch FAQs');
    }
    return response.json();
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const response = await fetch(`${PUBLIC_API}/content/testimonials`);
    if (!response.ok) {
      throw new Error('Failed to fetch testimonials');
    }
    return response.json();
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    const response = await fetch(`${PUBLIC_API}/content/team`);
    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }
    return response.json();
  },

  async getServices(): Promise<Service[]> {
    const response = await fetch(`${PUBLIC_API}/content/services`);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return response.json();
  },

  async getSiteSettings(): Promise<SiteSettings> {
    const response = await fetch(`${PUBLIC_API}/content/settings`);
    if (!response.ok) {
      throw new Error('Failed to fetch site settings');
    }
    return response.json();
  },

  async getDifferentiators(): Promise<Differentiator[]> {
    const response = await fetch(`${PUBLIC_API}/content/differentiators`);
    if (!response.ok) {
      throw new Error('Failed to fetch differentiators');
    }
    return response.json();
  },

  async getStats(): Promise<Stat[]> {
    const response = await fetch(`${PUBLIC_API}/content/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  },

  // ===== Admin APIs (後台管理) =====

  async createFAQ(data: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<FAQ> {
    const response = await fetch(`${ADMIN_API}/content/faqs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create FAQ');
    return response.json();
  },

  async updateFAQ(id: number, data: Partial<FAQ>, token: string): Promise<FAQ> {
    const response = await fetch(`${ADMIN_API}/content/faqs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update FAQ');
    return response.json();
  },

  async deleteFAQ(id: number, token: string): Promise<void> {
    const response = await fetch(`${ADMIN_API}/content/faqs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete FAQ');
  },

  async getAllFAQs(token: string): Promise<FAQ[]> {
    const response = await fetch(`${ADMIN_API}/content/faqs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch all FAQs');
    return response.json();
  },

  // Testimonials Admin
  async createTestimonial(data: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<Testimonial> {
    const response = await fetch(`${ADMIN_API}/content/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create testimonial');
    return response.json();
  },

  async updateTestimonial(id: number, data: Partial<Testimonial>, token: string): Promise<Testimonial> {
    const response = await fetch(`${ADMIN_API}/content/testimonials/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update testimonial');
    return response.json();
  },

  async deleteTestimonial(id: number, token: string): Promise<void> {
    const response = await fetch(`${ADMIN_API}/content/testimonials/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete testimonial');
  },

  async getAllTestimonials(token: string): Promise<Testimonial[]> {
    const response = await fetch(`${ADMIN_API}/content/testimonials`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch all testimonials');
    return response.json();
  },

  // Services Admin
  async createService(data: Omit<Service, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<Service> {
    const response = await fetch(`${ADMIN_API}/content/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create service');
    return response.json();
  },

  async updateService(id: number, data: Partial<Service>, token: string): Promise<Service> {
    const response = await fetch(`${ADMIN_API}/content/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update service');
    return response.json();
  },

  async deleteService(id: number, token: string): Promise<void> {
    const response = await fetch(`${ADMIN_API}/content/services/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete service');
  },

  async getAllServices(token: string): Promise<Service[]> {
    const response = await fetch(`${ADMIN_API}/content/services`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch all services');
    return response.json();
  },

  // Team Members Admin
  async createTeamMember(data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<TeamMember> {
    const response = await fetch(`${ADMIN_API}/content/team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create team member');
    return response.json();
  },

  async updateTeamMember(id: number, data: Partial<TeamMember>, token: string): Promise<TeamMember> {
    const response = await fetch(`${ADMIN_API}/content/team/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update team member');
    return response.json();
  },

  async deleteTeamMember(id: number, token: string): Promise<void> {
    const response = await fetch(`${ADMIN_API}/content/team/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete team member');
  },

  async getAllTeamMembers(token: string): Promise<TeamMember[]> {
    const response = await fetch(`${ADMIN_API}/content/team`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch all team members');
    return response.json();
  },

  // Site Settings Admin
  async updateSiteSetting(key: string, value: string, token: string): Promise<any> {
    const response = await fetch(`${ADMIN_API}/content/settings/${key}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ value }),
    });
    if (!response.ok) throw new Error('Failed to update setting');
    return response.json();
  },

  async getAllSettings(token: string): Promise<any[]> {
    const response = await fetch(`${ADMIN_API}/content/settings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch all settings');
    return response.json();
  },

  // Differentiators Admin
  async createDifferentiator(data: Omit<Differentiator, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<Differentiator> {
    const response = await fetch(`${ADMIN_API}/content/differentiators`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create differentiator');
    return response.json();
  },

  async updateDifferentiator(id: number, data: Partial<Differentiator>, token: string): Promise<Differentiator> {
    const response = await fetch(`${ADMIN_API}/content/differentiators/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update differentiator');
    return response.json();
  },

  async deleteDifferentiator(id: number, token: string): Promise<void> {
    const response = await fetch(`${ADMIN_API}/content/differentiators/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete differentiator');
  },

  async getAllDifferentiators(token: string): Promise<Differentiator[]> {
    const response = await fetch(`${ADMIN_API}/content/differentiators`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch all differentiators');
    return response.json();
  },

  // Stats Admin
  async createStat(data: Omit<Stat, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<Stat> {
    const response = await fetch(`${ADMIN_API}/content/stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create stat');
    return response.json();
  },

  async updateStat(id: number, data: Partial<Stat>, token: string): Promise<Stat> {
    const response = await fetch(`${ADMIN_API}/content/stats/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update stat');
    return response.json();
  },

  async deleteStat(id: number, token: string): Promise<void> {
    const response = await fetch(`${ADMIN_API}/content/stats/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete stat');
  },

  async getAllStats(token: string): Promise<Stat[]> {
    const response = await fetch(`${ADMIN_API}/content/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch all stats');
    return response.json();
  },

  // Carousel Logos Public
  async getCarouselLogos(): Promise<CarouselLogo[]> {
    const response = await fetch(`${PUBLIC_API}/content/carousel-logos`);
    if (!response.ok) throw new Error('Failed to fetch carousel logos');
    return response.json();
  },

  // Carousel Logos Admin
  async createCarouselLogo(data: Omit<CarouselLogo, 'id' | 'created_at' | 'updated_at'>, token: string): Promise<CarouselLogo> {
    const response = await fetch(`${ADMIN_API}/content/carousel-logos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create carousel logo');
    return response.json();
  },

  async updateCarouselLogo(id: number, data: Partial<CarouselLogo>, token: string): Promise<CarouselLogo> {
    const response = await fetch(`${ADMIN_API}/content/carousel-logos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update carousel logo');
    return response.json();
  },

  async deleteCarouselLogo(id: number, token: string): Promise<void> {
    const response = await fetch(`${ADMIN_API}/content/carousel-logos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete carousel logo');
  },

  async getAllCarouselLogos(token: string): Promise<CarouselLogo[]> {
    const response = await fetch(`${ADMIN_API}/content/carousel-logos`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch all carousel logos');
    return response.json();
  },

  // Publisher Features Public
  async getPublisherFeatures(): Promise<PublisherFeature[]> {
    const response = await fetch(`${PUBLIC_API}/content/publisher-features`);
    if (!response.ok) throw new Error('Failed to fetch publisher features');
    return response.json();
  },

  // Client Logos Public
  async getClientLogos(): Promise<ClientLogo[]> {
    const response = await fetch(`${PUBLIC_API}/content/clients`);
    if (!response.ok) throw new Error('Failed to fetch client logos');
    return response.json();
  },

  // Hero Sections Public
  async getHeroSection(page: string): Promise<HeroSection> {
    const response = await fetch(`${PUBLIC_API}/content/hero/${page}`);
    if (!response.ok) throw new Error('Failed to fetch hero section');
    return response.json();
  },

  async getHeroMediaLogos(page: string): Promise<HeroMediaLogo[]> {
    const response = await fetch(`${PUBLIC_API}/content/hero/${page}/logos`);
    if (!response.ok) throw new Error('Failed to fetch hero media logos');
    return response.json();
  },

  // Lyro Section Public
  async getLyroSection(): Promise<LyroSection> {
    const response = await fetch(`${PUBLIC_API}/content/lyro`);
    if (!response.ok) throw new Error('Failed to fetch lyro section');
    return response.json();
  },

  async getLyroFeatures(): Promise<LyroFeature[]> {
    const response = await fetch(`${PUBLIC_API}/content/lyro/features`);
    if (!response.ok) throw new Error('Failed to fetch lyro features');
    return response.json();
  },

  // Navigation Public
  async getNavigationItems(lang: string = 'en'): Promise<NavItem[]> {
    const response = await fetch(`${PUBLIC_API}/content/navigation/items?lang=${lang}`);
    if (!response.ok) throw new Error('Failed to fetch navigation items');
    return response.json();
  },

  async getNavigationCTA(lang: string = 'en'): Promise<NavCTA | null> {
    const response = await fetch(`${PUBLIC_API}/content/navigation/cta?lang=${lang}`);
    if (!response.ok) throw new Error('Failed to fetch navigation CTA');
    return response.json();
  },

  // Footer Public
  async getFooterSections(lang: string = 'en'): Promise<FooterSection[]> {
    const response = await fetch(`${PUBLIC_API}/content/footer/sections?lang=${lang}`);
    if (!response.ok) throw new Error('Failed to fetch footer sections');
    return response.json();
  },

  async getFooterTextSettings(lang: string = 'en'): Promise<FooterTextSettings> {
    const response = await fetch(`${PUBLIC_API}/content/footer/text-settings?lang=${lang}`);
    if (!response.ok) throw new Error('Failed to fetch footer text settings');
    return response.json();
  },

  // Navigation Admin
  async getAllNavigationItems(token: string): Promise<any[]> {
    const response = await fetch(`${ADMIN_API}/site/navigation/items`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch all navigation items');
    return response.json();
  },

  async createNavigationItem(data: any, token: string): Promise<any> {
    const response = await fetch(`${ADMIN_API}/site/navigation/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create navigation item');
    return response.json();
  },

  async updateNavigationItem(id: number, data: any, token: string): Promise<any> {
    const response = await fetch(`${ADMIN_API}/site/navigation/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update navigation item');
    return response.json();
  },

  async deleteNavigationItem(id: number, token: string): Promise<void> {
    const response = await fetch(`${ADMIN_API}/site/navigation/items/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete navigation item');
  },

  async getNavigationCTAAdmin(token: string): Promise<any> {
    const response = await fetch(`${ADMIN_API}/site/navigation/cta`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch navigation CTA');
    return response.json();
  },

  async updateNavigationCTA(data: any, token: string): Promise<any> {
    const response = await fetch(`${ADMIN_API}/site/navigation/cta`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update navigation CTA');
    return response.json();
  },

  // Footer Admin
  async getAllFooterSections(token: string): Promise<any[]> {
    const response = await fetch(`${ADMIN_API}/site/footer/sections`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch all footer sections');
    return response.json();
  },

  async createFooterSection(data: any, token: string): Promise<any> {
    const response = await fetch(`${ADMIN_API}/site/footer/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create footer section');
    return response.json();
  },

  async updateFooterSection(id: number, data: any, token: string): Promise<any> {
    const response = await fetch(`${ADMIN_API}/site/footer/sections/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update footer section');
    return response.json();
  },

  async deleteFooterSection(id: number, token: string): Promise<void> {
    const response = await fetch(`${ADMIN_API}/site/footer/sections/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete footer section');
  },

  async createFooterLink(data: any, token: string): Promise<any> {
    const response = await fetch(`${ADMIN_API}/site/footer/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create footer link');
    return response.json();
  },

  async updateFooterLink(id: number, data: any, token: string): Promise<any> {
    const response = await fetch(`${ADMIN_API}/site/footer/links/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update footer link');
    return response.json();
  },

  async deleteFooterLink(id: number, token: string): Promise<void> {
    const response = await fetch(`${ADMIN_API}/site/footer/links/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete footer link');
  },

  async getAllFooterTextSettings(token: string): Promise<any[]> {
    const response = await fetch(`${ADMIN_API}/site/footer/text-settings`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch footer text settings');
    return response.json();
  },

  async updateFooterTextSetting(key: string, data: any, token: string): Promise<any> {
    const response = await fetch(`${ADMIN_API}/site/footer/text-settings/${key}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update footer text setting');
    return response.json();
  },
};

