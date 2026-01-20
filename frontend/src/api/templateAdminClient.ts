/**
 * Template Admin API Client
 * 需要認證的 Template 管理 API
 * 使用統一的 authenticatedFetch（自動處理 token 刷新）
 */

import { ADMIN_API } from '../config/api';
import { authenticatedPut, authenticatedDelete, authenticatedPost } from '../utils/apiClient';
import { PRTemplate } from './templateClient';

export const templateAdminAPI = {
  /**
   * 更新模板
   */
  async updateTemplate(id: number, data: Partial<PRTemplate>): Promise<PRTemplate> {
    const response = await authenticatedPut(`${ADMIN_API}/templates/${id}`, data);
    
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
    const response = await authenticatedDelete(`${ADMIN_API}/templates/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete template');
    }
  },

  /**
   * 創建模板
   */
  async createTemplate(data: Omit<PRTemplate, 'id' | 'created_at' | 'updated_at' | 'download_count' | 'email_request_count' | 'preview_count' | 'waitlist_count' | 'is_active' | 'display_order'>): Promise<PRTemplate> {
    const response = await authenticatedPost(`${ADMIN_API}/templates`, data);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create template');
    }
    
    return response.json();
  },
};
