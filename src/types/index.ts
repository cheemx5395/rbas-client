import type React from "react";

// User types
export type UserRole = 'ADMIN' | 'MANAGER' | 'USER';
export type UserGrade = 'GRADE1' | 'GRADE2' | 'GRADE3' | 'NA';

export type ToastVariant = "default" | "destructive"

export interface ToastModel {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant
  duration?: number
  open?: boolean
}


export interface User {
  id: number;
  username: string;
  email?: string;
  role: UserRole;
  grade: UserGrade;
  created_at?: string;
  updated_at?: string;
}

// Auth types
export interface RegisterRequest {
  username: string;
  email?: string;
  password: string;
  role?: UserRole;
  grade?: UserGrade;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  refresh: string;
  access: string;
  user: User;
}

// Request types
export type RequestType = 'LEAVE' | 'EXPENSE' | 'DISCOUNT';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW' | 'CANCELLED';
export type LeaveType = 'SICK' | 'PAID' | 'UNPAID';
export type ExpenseCategory = 'FOOD' | 'TRAVEL' | 'ACCOMMODATION' | 'OTHER';
export type DiscountCategory = 'LOAN' | 'FESTIVE' | 'OTHER';
export type ActionType = 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW';

export interface LeaveRequestDetails {
  leave_type: LeaveType;
  from_date: string;
  to_date: string;
  reason: string;
}

export interface ExpenseRequestDetails {
  amount: number;
  category: ExpenseCategory;
  description?: string;
}

export interface DiscountRequestDetails {
  discount_percentage: number;
  discount_category?: DiscountCategory;
  description?: string;
}

export interface ApprovalRequest {
  id: number;
  user: number;
  username: string;
  request_type: RequestType;
  status: RequestStatus;
  decision_reason?: string;
  is_flagged: boolean;
  created_at: string;
  details: LeaveRequestDetails | ExpenseRequestDetails | DiscountRequestDetails;
}

export interface LeaveRequestCreate {
  leave_type: LeaveType;
  from_date: string;
  to_date: string;
  reason: string;
}

export interface ExpenseRequestCreate {
  amount: number;
  category: ExpenseCategory;
  description?: string;
}

export interface DiscountRequestCreate {
  discount_percentage: number;
  discount_category?: DiscountCategory;
  description?: string;
}

export interface RequestAction {
  action: ActionType;
  reason?: string;
}

export interface FlagRequest {
  is_flagged: boolean;
}

// Policy types
export type ViolationAction = 'AUTO_REJECT' | 'FLAG' | 'NEEDS_REVIEW' | 'AUTO_APPROVE';

export interface Policy {
  id?: number;
  request_type: RequestType;
  policy_key: string;
  value: string;
  policy_grade?: string;
  violation_action: string;
  is_active: boolean;
}

// Analytics types
export interface FinancialSummary {
  total_expense_amount: number;
  avg_discount_percentage: number;
}

export interface PerformanceMetrics {
  avg_processing_time_hours: number | null;
}

export interface AnalyticsSummary {
  total_requests: number;
  status_counts: Record<string, number>;
  type_counts: Record<string, number>;
  financial_summary: FinancialSummary;
  performance_metrics: PerformanceMetrics;
  flagged_count: number;
}

export interface AnalyticsFilters {
  user_id?: number;
  grade?: string;
  month?: number;
  year?: number;
  request_type?: RequestType;
}

// API response types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
