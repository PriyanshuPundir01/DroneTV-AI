export type UserType = 'Student' | 'Customer' | 'Other';
export type EnquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Closed';

export interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  interest: string;
  message: string;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnquiryInput {
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  interest: string;
  message: string;
}

export interface UpdateEnquiryInput {
  status?: EnquiryStatus;
  adminNotes?: string;
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
}

export interface EnquiryFilterParams {
  search?: string;
  userType?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EnquiryPaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface EnquiryStats {
  total: number;
  byStatus: {
    new: number;
    contacted: number;
    inProgress: number;
    closed: number;
  };
  byUserType: {
    student: number;
    customer: number;
    other: number;
  };
  recentCountLast7Days: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: EnquiryPaginationMeta;
  errors?: Record<string, string>;
}
