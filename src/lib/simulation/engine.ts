import type { Order, ActivityLog, OnlineUser } from "@/types"
import { generateId } from "@/lib/utils/cn"

const staffNames = [
  "Alice Chen", "Bob Martinez", "Charlie Kim", "Diana Patel",
  "Edward Brooks", "Fiona Walker", "George Zhang", "Helen Davis",
]

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Christopher", "Karen"]

const lastNames = ["Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez"]

const statuses: Array<Order["status"]> = ["pending", "processing", "completed", "cancelled"]
const paymentStatuses: Array<Order["payment_status"]> = ["unpaid", "paid", "refunded"]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomAmount(): number {
  return Number((Math.random() * 4950 + 50).toFixed(2))
}

let orderCounter = 1100

function generateFakeOrder(): Order {
  const fn = pick(firstNames)
  const ln = pick(lastNames)
  const staff = pick(staffNames)
  orderCounter++
  const now = new Date().toISOString()
  return {
    id: `ord-${generateId()}`,
    display_id: `#${orderCounter}`,
    customer_id: `cust-${generateId()}`,
    customer_name: `${fn} ${ln}`,
    customer_email: `${fn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
    amount: randomAmount(),
    status: "pending",
    payment_status: "unpaid",
    assigned_staff_id: `staff-${Math.floor(Math.random() * 8) + 1}`,
    assigned_staff_name: staff,
    items: Math.floor(Math.random() * 8) + 1,
    created_at: now,
    updated_at: now,
  }
}

export type RealtimeEvent =
  | { type: "NEW_ORDER"; order: Order }
  | { type: "UPDATE_ORDER"; order: Order }
  | { type: "STATUS_CHANGE"; orderId: string; status: Order["status"]; userName: string }
  | { type: "ASSIGN_STAFF"; orderId: string; staffName: string; userName: string }
  | { type: "PAYMENT_UPDATE"; orderId: string; status: Order["payment_status"]; userName: string }
  | { type: "ACTIVITY"; log: ActivityLog }
  | { type: "USER_ONLINE"; user: OnlineUser }
  | { type: "USER_OFFLINE"; userId: string }

type EventCallback = (event: RealtimeEvent) => void

export class SimulationEngine {
  private intervalId: ReturnType<typeof setInterval> | null = null
  private callbacks: EventCallback[] = []
  private orders: Order[] = []
  private running = false

  constructor(initialOrders: Order[]) {
    this.orders = [...initialOrders]
  }

  subscribe(callback: EventCallback) {
    this.callbacks.push(callback)
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    }
  }

  private emit(event: RealtimeEvent) {
    this.callbacks.forEach((cb) => cb(event))
  }

  start() {
    if (this.running) return
    this.running = true

    this.intervalId = setInterval(() => {
      const rand = Math.random()

      if (rand < 0.25) {
        this.simulateNewOrder()
      } else if (rand < 0.55) {
        this.simulateStatusChange()
      } else if (rand < 0.75) {
        this.simulateStaffAssignment()
      } else {
        this.simulatePaymentUpdate()
      }
    }, 4000)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.running = false
  }

  private simulateNewOrder() {
    const order = generateFakeOrder()
    this.orders.push(order)
    this.emit({ type: "NEW_ORDER", order })

    this.emit({
      type: "ACTIVITY",
      log: {
        id: `log-${generateId()}`,
        user_id: order.assigned_staff_id,
        user_name: order.assigned_staff_name,
        user_avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${order.assigned_staff_name.replace(" ", "")}`,
        action: "created order",
        entity_type: "order",
        entity_id: order.display_id,
        details: `${order.customer_name} - $${order.amount.toFixed(2)}`,
        created_at: new Date().toISOString(),
      },
    })
  }

  private simulateStatusChange() {
    const activeOrders = this.orders.filter((o) => o.status !== "completed" && o.status !== "cancelled")
    if (activeOrders.length === 0) return

    const order = pick(activeOrders)
    const currentIndex = statuses.indexOf(order.status)
    if (currentIndex >= statuses.length - 2) return

    const newStatus = statuses[currentIndex + 1]
    const staff = pick(staffNames)

    order.status = newStatus
    order.updated_at = new Date().toISOString()

    this.emit({ type: "STATUS_CHANGE", orderId: order.id, status: newStatus, userName: staff })
    this.emit({ type: "UPDATE_ORDER", order })

    this.emit({
      type: "ACTIVITY",
      log: {
        id: `log-${generateId()}`,
        user_id: `staff-${Math.floor(Math.random() * 8) + 1}`,
        user_name: staff,
        user_avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${staff.replace(" ", "")}`,
        action: "updated status",
        entity_type: "order",
        entity_id: order.display_id,
        details: `→ ${newStatus}`,
        created_at: new Date().toISOString(),
      },
    })
  }

  private simulateStaffAssignment() {
    const order = pick(this.orders)
    const newStaff = pick(staffNames.filter((s) => s !== order.assigned_staff_name))
    if (!newStaff) return

    const oldStaff = order.assigned_staff_name
    order.assigned_staff_name = newStaff
    order.updated_at = new Date().toISOString()

    this.emit({ type: "ASSIGN_STAFF", orderId: order.id, staffName: newStaff, userName: pick(staffNames) })
    this.emit({ type: "UPDATE_ORDER", order })

    this.emit({
      type: "ACTIVITY",
      log: {
        id: `log-${generateId()}`,
        user_id: `staff-${Math.floor(Math.random() * 8) + 1}`,
        user_name: pick(staffNames),
        user_avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${newStaff.replace(" ", "")}`,
        action: "assigned staff",
        entity_type: "order",
        entity_id: order.display_id,
        details: `${oldStaff} → ${newStaff}`,
        created_at: new Date().toISOString(),
      },
    })
  }

  private simulatePaymentUpdate() {
    const unpaidOrders = this.orders.filter((o) => o.payment_status !== "paid")
    if (unpaidOrders.length === 0) return

    const order = pick(unpaidOrders)
    order.payment_status = "paid"
    order.updated_at = new Date().toISOString()

    this.emit({ type: "PAYMENT_UPDATE", orderId: order.id, status: "paid", userName: pick(staffNames) })
    this.emit({ type: "UPDATE_ORDER", order })

    this.emit({
      type: "ACTIVITY",
      log: {
        id: `log-${generateId()}`,
        user_id: `staff-${Math.floor(Math.random() * 8) + 1}`,
        user_name: pick(staffNames),
        user_avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${pick(staffNames).replace(" ", "")}`,
        action: "updated payment",
        entity_type: "payment",
        entity_id: order.display_id,
        details: `→ paid`,
        created_at: new Date().toISOString(),
      },
    })
  }

  getOrders() {
    return this.orders
  }
}
