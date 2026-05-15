import type { Profile, Customer, Order, ActivityLog, AnalyticsData, OnlineUser } from "@/types"
import { generateId } from "@/lib/utils/cn"

const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry", "Iris", "Jack", "Kate", "Liam", "Mia", "Noah", "Olivia", "Peter", "Quinn", "Rachel", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xander", "Yara", "Zack"]
const lastNames = ["Anderson", "Brooks", "Chen", "Davis", "Edwards", "Foster", "Garcia", "Hughes", "Ito", "Johnson", "Kim", "Lee", "Martinez", "Nakamura", "Owens", "Patel", "Quinn", "Reed", "Smith", "Taylor", "Ueda", "Vega", "Walker", "Xu", "Young", "Zhang"]
const companies = ["Acme Corp", "Globex Inc", "Initech", "Umbrella Corp", "Stark Industries", "Wayne Enterprises", "Cyberdyne Systems", "Hooli", "Dunder Mifflin", "Pied Piper", "Massive Dynamic", "Wonka Industries", "Oscorp", "Soylent Corp", "Aperture Science", "Black Mesa", "Tyrell Corp", "Weyland-Yutani", "LexCorp", "Spacely Sprockets"]
const streets = ["Main St", "Oak Ave", "Elm St", "Park Blvd", "Broadway", "Market St", "Highland Dr", "Lake View Rd", "River Rd", "Cedar Ln"]
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"]

const staffNames = [
  { name: "Alice Chen", role: "admin" as const },
  { name: "Bob Martinez", role: "manager" as const },
  { name: "Charlie Kim", role: "manager" as const },
  { name: "Diana Patel", role: "staff" as const },
  { name: "Edward Brooks", role: "staff" as const },
  { name: "Fiona Walker", role: "staff" as const },
  { name: "George Zhang", role: "staff" as const },
  { name: "Helen Davis", role: "staff" as const },
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomAmount(): number {
  return Number((Math.random() * 9950 + 50).toFixed(2))
}

function randomDate(daysBack: number): string {
  const d = new Date()
  d.setDate(d.getDate() - randomInt(0, daysBack))
  d.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59))
  return d.toISOString()
}

const productItems = ["Widget A", "Widget B", "Gadget X", "Gadget Y", "Component Z", "Deluxe Set", "Pro Bundle", "Starter Kit", "Premium Pack", "Enterprise Suite", "Accessory Pack", "Basic Plan", "Standard Plan", "Premium Plan", "Cloud Storage Add-on", "API Access", "Integration Module", "Support Package"]

export function generateStaff(): Profile[] {
  return staffNames.map((s, i) => ({
    id: `staff-${i + 1}`,
    email: `${s.name.toLowerCase().replace(" ", ".")}@oms-demo.com`,
    name: s.name,
    role: s.role,
    avatar_url: `https://api.dicebear.com/9.x/initials/svg?seed=${s.name.replace(" ", "")}`,
    created_at: randomDate(90),
    is_online: true,
  }))
}

export function generateCustomers(count: number): Customer[] {
  return Array.from({ length: count }, (_, i) => {
    const fn = pick(firstNames)
    const ln = pick(lastNames)
    return {
      id: `cust-${i + 1}`,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
      phone: `+1${randomInt(200, 999)}${randomInt(100, 999)}${randomInt(1000, 9999)}`,
      company: pick(companies),
      status: pick(["active", "active", "active", "inactive", "vip"] as const),
      total_orders: randomInt(0, 45),
      total_spent: randomAmount(),
      created_at: randomDate(180),
    }
  })
}

export function generateOrders(customers: Customer[], staff: Profile[], count: number): Order[] {
  return Array.from({ length: count }, (_, i) => {
    const customer = pick(customers)
    const staffMember = pick(staff)
    const statuses: Array<Order["status"]> = ["pending", "processing", "completed", "cancelled"]
    const weights = [0.15, 0.2, 0.5, 0.15]
    let r = Math.random()
    let status = statuses[0]
    for (let j = 0; j < statuses.length; j++) {
      if (r < weights[j]) { status = statuses[j]; break }
      r -= weights[j]
    }
    const paymentStatuses: Array<Order["payment_status"]> = ["paid", "unpaid", "refunded"]
    const paymentWeights = [0.7, 0.2, 0.1]
    let pr = Math.random()
    let paymentStatus = paymentStatuses[0]
    for (let j = 0; j < paymentStatuses.length; j++) {
      if (pr < paymentWeights[j]) { paymentStatus = paymentStatuses[j]; break }
      pr -= paymentWeights[j]
    }

    const created = randomDate(60)
    const updated = new Date(new Date(created).getTime() + randomInt(0, 86400000 * 3)).toISOString()

    return {
      id: `ord-${i + 1}`,
      display_id: `#${String(1000 + i).padStart(4, "0")}`,
      customer_id: customer.id,
      customer_name: customer.name,
      customer_email: customer.email,
      amount: randomAmount(),
      status,
      payment_status: paymentStatus,
      assigned_staff_id: staffMember.id,
      assigned_staff_name: staffMember.name,
      items: randomInt(1, 8),
      created_at: created,
      updated_at: updated,
    }
  })
}

export function generateActivityLogs(orders: Order[], staff: Profile[], count: number): ActivityLog[] {
  const actions = ["created order", "updated status", "assigned staff", "updated payment", "modified order", "cancelled order", "refunded payment"]
  const entityTypes = ["order", "customer", "payment"]

  return Array.from({ length: count }, (_, i) => {
    const order = pick(orders)
    const staffMember = pick(staff)
    return {
      id: `log-${i + 1}`,
      user_id: staffMember.id,
      user_name: staffMember.name,
      user_avatar: staffMember.avatar_url,
      action: pick(actions),
      entity_type: pick(entityTypes),
      entity_id: order.display_id,
      details: `${order.customer_name} - ${order.display_id}`,
      created_at: randomDate(7),
    }
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function generateAnalytics(orders: Order[]): AnalyticsData {
  const totalOrders = orders.length
  const completedOrders = orders.filter((o) => o.status === "completed").length
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length
  const paidOrders = orders.filter((o) => o.payment_status === "paid")
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0)

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().split("T")[0]
  })

  const revenueTrend = days.map((day) => ({
    date: day,
    value: randomAmount() * randomInt(1, 5),
  }))

  const orderTrend = days.map((day) => ({
    date: day,
    value: randomInt(5, 35),
  }))

  const statusDistribution = [
    { name: "Completed", value: completedOrders },
    { name: "Processing", value: orders.filter((o) => o.status === "processing").length },
    { name: "Pending", value: orders.filter((o) => o.status === "pending").length },
    { name: "Cancelled", value: cancelledOrders },
  ]

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const revenueByDay = weekdays.map((day) => ({
    day,
    revenue: randomAmount() * randomInt(10, 30),
    orders: randomInt(8, 40),
  }))

  const uniqueCustomers = [...new Set(orders.map((o) => o.customer_name))]
  const topCustomers = uniqueCustomers.slice(0, 5).map((name) => ({
    name,
    revenue: randomAmount() * randomInt(5, 20),
    orders: randomInt(3, 15),
  }))

  return {
    total_revenue: totalRevenue,
    total_orders: totalOrders,
    active_customers: uniqueCustomers.length,
    completion_rate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
    pending_orders: orders.filter((o) => o.status === "pending").length,
    processing_orders: orders.filter((o) => o.status === "processing").length,
    revenue_trend: revenueTrend,
    order_trend: orderTrend,
    status_distribution: statusDistribution,
    revenue_by_day: revenueByDay,
    top_customers: topCustomers,
    recent_revenue: { current: totalRevenue * 0.3, previous: totalRevenue * 0.25 },
    recent_orders_count: { current: completedOrders, previous: completedOrders - randomInt(10, 30) },
  }
}

export function generateNotifications(): Array<{ id: string; title: string; description: string; type: "info" | "success" | "warning" | "error"; read: boolean; created_at: string }> {
  return [
    { id: "n1", title: "New order received", description: "Order #1042 from Sarah Johnson", type: "info", read: false, created_at: randomDate(1) },
    { id: "n2", title: "Payment processed", description: "Order #1039 - $2,450.00", type: "success", read: false, created_at: randomDate(1) },
    { id: "n3", title: "Order completed", description: "Order #1035 marked as completed", type: "success", read: true, created_at: randomDate(2) },
    { id: "n4", title: "Staff assigned", description: "Diana Patel → Order #1040", type: "info", read: false, created_at: randomDate(1) },
    { id: "n5", title: "Payment overdue", description: "Order #1028 payment overdue", type: "warning", read: true, created_at: randomDate(3) },
    { id: "n6", title: "Order cancelled", description: "Order #1030 was cancelled", type: "error", read: true, created_at: randomDate(2) },
    { id: "n7", title: "New customer registered", description: "Michael Torres joined", type: "info", read: true, created_at: randomDate(1) },
    { id: "n8", title: "Revenue milestone", description: "Daily revenue exceeded $50k", type: "success", read: false, created_at: randomDate(1) },
  ]
}

export function generateOnlineUsers(staff: Profile[]): OnlineUser[] {
  const pages = ["/overview", "/orders", "/customers", "/analytics", "/team", "/activity", "/settings"]
  return staff.map((s) => ({
    id: s.id,
    name: s.name,
    avatar: s.avatar_url,
    role: s.role,
    is_online: true,
    current_page: pick(pages),
  }))
}
