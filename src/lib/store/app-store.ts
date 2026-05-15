"use client"

import { create } from "zustand"
import type { Order, Customer, Profile, ActivityLog, AnalyticsData, OnlineUser, Notification } from "@/types"
import { generateStaff, generateCustomers, generateOrders, generateActivityLogs, generateAnalytics, generateNotifications, generateOnlineUsers } from "@/lib/simulation/data"
import { SimulationEngine } from "@/lib/simulation/engine"

interface AppState {
  theme: "dark" | "light"
  setTheme: (theme: "dark" | "light") => void

  user: Profile | null
  setUser: (user: Profile | null) => void

  staff: Profile[]
  customers: Customer[]
  orders: Order[]
  activityLogs: ActivityLog[]
  analytics: AnalyticsData
  onlineUsers: OnlineUser[]
  notifications: Notification[]

  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void

  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void

  simulationEngine: SimulationEngine | null
  isSimulating: boolean

  toasts: Array<{ id: string; title: string; description: string; type: "info" | "success" | "warning" | "error" }>
  addToast: (toast: { title: string; description: string; type: "info" | "success" | "warning" | "error" }) => void
  removeToast: (id: string) => void

  selectedRole: string | null
  setSelectedRole: (role: string | null) => void

  initialized: boolean

  init: () => void
  addOrder: (order: Order) => void
  updateOrder: (order: Order) => void
  addActivityLog: (log: ActivityLog) => void
  toggleTheme: () => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: "dark",
  setTheme: (theme) => {
    set({ theme })
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(theme)
    }
  },

  user: null,
  setUser: (user) => set({ user }),

  staff: [],
  customers: [],
  orders: [],
  activityLogs: [],
  analytics: {
    total_revenue: 0,
    total_orders: 0,
    active_customers: 0,
    completion_rate: 0,
    pending_orders: 0,
    processing_orders: 0,
    revenue_trend: [],
    order_trend: [],
    status_distribution: [],
    revenue_by_day: [],
    top_customers: [],
    recent_revenue: { current: 0, previous: 0 },
    recent_orders_count: { current: 0, previous: 0 },
  },
  onlineUsers: [],
  notifications: [],

  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  simulationEngine: null,
  isSimulating: false,

  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    setTimeout(() => {
      get().removeToast(id)
    }, 4000)
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  selectedRole: null,
  setSelectedRole: (role) => set({ selectedRole: role }),

  initialized: false,

  init: () => {
    if (get().initialized) return
    const staff = generateStaff()
    const customers = generateCustomers(50)
    const orders = generateOrders(customers, staff, 80)
    const activityLogs = generateActivityLogs(orders, staff, 200)
    const analytics = generateAnalytics(orders)
    const onlineUsers = generateOnlineUsers(staff)
    const notifications = generateNotifications()

    const engine = new SimulationEngine(orders)
    engine.subscribe((event) => {
      const store = get()
      switch (event.type) {
        case "NEW_ORDER":
          store.addOrder(event.order)
          store.addToast({ title: "New Order", description: `${event.order.display_id} - ${event.order.customer_name}`, type: "info" })
          break
        case "UPDATE_ORDER":
          store.updateOrder(event.order)
          break
        case "STATUS_CHANGE":
          store.addToast({ title: "Status Updated", description: `${event.orderId} → ${event.status}`, type: "info" })
          break
        case "ASSIGN_STAFF":
          store.addToast({ title: "Staff Assigned", description: `${event.staffName} → ${event.orderId}`, type: "info" })
          break
        case "PAYMENT_UPDATE":
          store.addToast({ title: "Payment Updated", description: `${event.orderId} → ${event.status}`, type: "success" })
          break
        case "ACTIVITY":
          store.addActivityLog(event.log)
          break
      }
    })

    set({
      staff,
      customers,
      orders,
      activityLogs,
      analytics,
      onlineUsers,
      notifications,
      simulationEngine: engine,
      initialized: true,
    })

    setTimeout(() => {
      const current = get()
      if (current.simulationEngine) {
        current.simulationEngine.start()
        set({ isSimulating: true })
      }
    }, 1000)
  },

  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
      analytics: generateAnalytics([order, ...state.orders]),
    })),

  updateOrder: (order) =>
    set((state) => {
      const updatedOrders = state.orders.map((o) => (o.id === order.id ? order : o))
      return {
        orders: updatedOrders,
        analytics: generateAnalytics(updatedOrders),
      }
    }),

  addActivityLog: (log) =>
    set((state) => ({
      activityLogs: [log, ...state.activityLogs].slice(0, 500),
    })),

  toggleTheme: () => {
    const current = get().theme
    const next = current === "dark" ? "light" : "dark"
    get().setTheme(next)
  },

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  clearNotifications: () => set({ notifications: [] }),
}))
