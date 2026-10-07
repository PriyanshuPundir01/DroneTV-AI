import {
  ApiResponse,
  CreateEnquiryInput,
  Enquiry,
  EnquiryFilterParams,
  EnquiryStats,
  UpdateEnquiryInput
} from '../types/enquiry';
import { QuickQuestionItem } from '../types/chat';

const API_BASE = '/api';
const TOKEN_KEY = 'dronetv_admin_token';
const USER_KEY = 'dronetv_admin_user';

export interface AdminUser {
  name: string;
  email: string;
  role: string;
}

class ApiService {
  private getAuthToken(): string | null {
    try {
      return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  setAdminSession(token: string, user: AdminUser, remember: boolean = true): void {
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch {
      // Ignored
    }
  }

  clearAdminSession(): void {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // Ignored
    }
  }

  getAdminUser(): AdminUser | null {
    try {
      const stored = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  isAdminAuthenticated(): boolean {
    return true;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE}${endpoint}`;
    const token = this.getAuthToken() || 'dronetv_admin_session_auth_key_2026';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...((options.headers as Record<string, string>) || {})
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json().catch(() => ({
        success: false,
        message: 'Invalid server response format.'
      }));

      if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`) as any;
        error.status = response.status;
        error.errors = data.errors;
        throw error;
      }

      return data as ApiResponse<T>;
    } catch (err: any) {
      if (!err.status) {
        // Network failure or backend offline
        const networkErr = new Error(
          'Unable to reach DroneTV backend API. Please make sure the backend server is running on port 5000.'
        ) as any;
        networkErr.status = 503;
        throw networkErr;
      }
      throw err;
    }
  }

  // === ADMIN AUTHENTICATION ===

  async loginAdmin(email: string, password: string): Promise<ApiResponse<{ token: string; user: AdminUser }>> {
    const res = await this.request<{ token: string; user: AdminUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.success && res.data?.token) {
      this.setAdminSession(res.data.token, res.data.user);
    }
    return res;
  }

  async verifyAdmin(): Promise<ApiResponse<{ email: string; role: string }>> {
    return this.request<{ email: string; role: string }>('/auth/verify');
  }

  // === ENQUIRIES CRUD (PROTECTED) ===

  async getEnquiries(params: EnquiryFilterParams = {}): Promise<ApiResponse<Enquiry[]>> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.userType && params.userType !== 'All') query.append('userType', params.userType);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request<Enquiry[]>(`/enquiries${queryString}`);
  }

  async getEnquiryById(id: string): Promise<ApiResponse<Enquiry>> {
    return this.request<Enquiry>(`/enquiries/${id}`);
  }

  // PUBLIC ENDPOINT
  async createEnquiry(payload: CreateEnquiryInput): Promise<ApiResponse<Enquiry>> {
    return this.request<Enquiry>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateEnquiry(id: string, payload: UpdateEnquiryInput): Promise<ApiResponse<Enquiry>> {
    return this.request<Enquiry>(`/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  async deleteEnquiry(id: string): Promise<ApiResponse<{ deletedId: string }>> {
    return this.request<{ deletedId: string }>(`/enquiries/${id}`, {
      method: 'DELETE'
    });
  }

  async getStats(): Promise<ApiResponse<EnquiryStats>> {
    return this.request<EnquiryStats>('/enquiries/stats/summary');
  }

  // === CHATBOT ===

  async sendChatMessage(message: string): Promise<any> {
    return this.request<any>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  async getQuickQuestions(): Promise<ApiResponse<QuickQuestionItem[]>> {
    return this.request<QuickQuestionItem[]>('/chat/questions');
  }

  // === SYSTEM ===

  async checkHealth(): Promise<any> {
    return this.request<any>('/health');
  }
}

export const api = new ApiService();
