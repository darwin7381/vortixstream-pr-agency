/**
 * PR Templates API Client
 * 獨立文件避免污染主 client.ts
 */

import { PUBLIC_API } from '../config/api';

// ==================== Types ====================

export interface PRTemplate {
  id: number;
  title: string;
  description: string;
  category: string;
  category_color: string;
  icon: string;
  content: string;
  industry_tags: string[];
  use_cases: string[];
  includes: string[];
  download_count: number;
  email_request_count: number;
  preview_count: number;
  waitlist_count: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface WaitlistRequest {
  template_id: number;
  email: string;
  name?: string;
  subscribe_newsletter?: boolean;
}

export interface EmailRequest {
  email: string;
}

// ==================== API Methods ====================

export const templateAPI = {
  /**
   * 獲取所有啟用的模板
   */
  async getTemplates(params?: {
    category?: string;
    industry?: string;
    search?: string;
    sort?: string;
  }): Promise<PRTemplate[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.industry) query.append('industry', params.industry);
    if (params?.search) query.append('search', params.search);
    if (params?.sort) query.append('sort', params.sort);
    
    const url = `${PUBLIC_API}/templates${query.toString() ? '?' + query.toString() : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch templates');
    return response.json();
  },

  /**
   * 獲取單一模板（自動記錄 preview_count）
   */
  async getTemplate(id: number): Promise<PRTemplate> {
    const response = await fetch(`${PUBLIC_API}/templates/${id}`);
    if (!response.ok) throw new Error('Failed to fetch template');
    return response.json();
  },

  /**
   * 獲取統計數據
   */
  async getStats(): Promise<{
    overview: {
      total_templates: number;
      total_downloads: number;
      total_previews: number;
      total_waitlist: number;
    };
    popular_templates: Array<{
      id: number;
      title: string;
      category: string;
      download_count: number;
    }>;
  }> {
    const response = await fetch(`${PUBLIC_API}/templates/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  /**
   * 加入 AI Editor Waitlist
   */
  async joinWaitlist(data: WaitlistRequest): Promise<{
    success: boolean;
    message: string;
    template_title?: string;
    already_exists?: boolean;
  }> {
    const response = await fetch(`${PUBLIC_API}/templates/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to join waitlist');
    return response.json();
  },

  /**
   * 請求 Email 發送模板
   */
  async requestEmail(templateId: number, data: EmailRequest): Promise<{
    success: boolean;
    message: string;
    tracking_id?: string;
  }> {
    const response = await fetch(`${PUBLIC_API}/templates/${templateId}/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to request email');
    return response.json();
  },
};

