"use client"

import { motion } from "framer-motion"
import { ShoppingCart, TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { StatsCard } from "@/components/shared/stats-card"
import { OrdersTable } from "@/components/orders/orders-table"
import { Badge } from "@/components/ui/badge"
import { useCounterAnimation } from "@/hooks/use-counter-animation"

function AnimatedValue({ value }: { value: number }) {
  const count = useCounterAnimation(value)
  return <span>{count}</span>
}

export default function OrdersPage() {
  const { orders } = useAppStore()
  const pending = orders.filter((o) => o.status === "pending").length
  const processing = orders.filter((o) => o.status === "processing").length
  const completed = orders.filter((o) => o.status === "completed").length
  const cancelled = orders.filter((o) => o.status === "cancelled").length

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-sm text-gray-400 mt-1">Manage and track all orders in real-time</p>
        </div>
        <Badge variant="default" className="text-xs gap-1.5 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          {orders.length} total
        </Badge>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Orders" value={<AnimatedValue value={orders.length} />} icon={<ShoppingCart className="h-4 w-4" />} gradient />
        <StatsCard title="Pending" value={<AnimatedValue value={pending} />} icon={<Clock className="h-4 w-4" />} />
        <StatsCard title="Processing" value={<AnimatedValue value={processing} />} icon={<TrendingUp className="h-4 w-4" />} />
        <StatsCard title="Completed" value={<AnimatedValue value={completed} />} icon={<CheckCircle className="h-4 w-4" />} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-6 shadow-xl">
          <OrdersTable />
        </div>
      </motion.div>
    </div>
  )
}
