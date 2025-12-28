/**
 * API 配置 - 統一管理所有 API URL
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const PUBLIC_API = `${API_BASE_URL}/public`;
export const WRITE_API = `${API_BASE_URL}/write`;
export const ADMIN_API = `${API_BASE_URL}/admin`;

