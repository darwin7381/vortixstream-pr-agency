/**
 * Template Admin API Client
 * 需要認證的 Template 管理 API
 */

import { ADMIN_API } from '../config/api';
import { PRTemplate } from './templateClient';

export const templateAdminAPI = {
  /**
   * 更新模板
   */
  async updateTemplate(id: number, data: Partial<PRTemplate>): Promise<PRTemplate> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('未登入或 token 已過期');
    }

    const response = await fetch(`${ADMIN_API}/templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update template');
    }
    
    return response.json();
  },

  /**
   * 刪除模板
   */
  async deleteTemplate(id: number): Promise<void> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('未登入或 token 已過期');
    }

    const response = await fetch(`${ADMIN_API}/templates/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete template');
    }
  },

  /**
   * 創建模板
   */
  async createTemplate(data: Omit<PRTemplate, 'id' | 'created_at' | 'updated_at' | 'download_count' | 'email_request_count' | 'preview_count' | 'waitlist_count' | 'is_active' | 'display_order'>): Promise<PRTemplate> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('未登入或 token 已過期');
    }

    const response = await fetch(`${ADMIN_API}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create template');
    }
    
    return response.json();
  },
};

