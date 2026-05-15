export type Role = "admin" | "manager" | "staff"

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled"

export type PaymentStatus = "unpaid" | "paid" | "refunded"

export interface Profile {
  id: string
  email: string
  name: string
  role: Role
  avatar_url: string
  created_at: string
  is_online: boolean
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: "active" | "inactive" | "vip"
  total_orders: number
  total_spent: number
  created_at: string
}

export interface Order {
  id: string
  display_id: string
  customer_id: string
  customer_name: string
  customer_email: string
  amount: number
  status: OrderStatus
  payment_status: PaymentStatus
  assigned_staff_id: string
  assigned_staff_name: string
  items: number
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  user_name: string
  user_avatar: string
  action: string
  entity_type: string
  entity_id: string
  details: string
  created_at: string
}

export interface AnalyticsData {
  total_revenue: number
  total_orders: number
  active_customers: number
  completion_rate: number
  pending_orders: number
  processing_orders: number
  revenue_trend: { date: string; value: number }[]
  order_trend: { date: string; value: number }[]
  status_distribution: { name: string; value: number }[]
  revenue_by_day: { day: string; revenue: number; orders: number }[]
  top_customers: { name: string; revenue: number; orders: number }[]
  recent_revenue: { current: number; previous: number }
  recent_orders_count: { current: number; previous: number }
}

export interface Notification {
  id: string
  title: string
  description: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  created_at: string
}

export interface OnlineUser {
  id: string
  name: string
  avatar: string
  role: Role
  is_online: boolean
  current_page?: string
}
