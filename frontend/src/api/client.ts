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
const ADMIN_API = `${API_BASE_URL}/admin`;

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

