"use client"

import { motion } from "framer-motion"
import { DollarSign, ShoppingCart, Users, TrendingUp, Clock, Activity } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { formatCurrency } from "@/lib/utils/cn"
import { StatsCard } from "@/components/shared/stats-card"
import { OnlineUsersList } from "@/components/shared/online-users"
import { ActivityFeed } from "@/components/shared/activity-feed"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCounterAnimation } from "@/hooks/use-counter-animation"
import dynamic from "next/dynamic"

const RevenueChart = dynamic(() => import("@/components/analytics/revenue-chart"), { ssr: false })
const OrderTrendChart = dynamic(() => import("@/components/analytics/order-trend-chart"), { ssr: false })
const StatusPieChart = dynamic(() => import("@/components/analytics/status-pie-chart"), { ssr: false })

function AnimatedValue({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const count = useCounterAnimation(value)
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>
}

export default function OverviewPage() {
  const { analytics, orders, onlineUsers, activityLogs } = useAppStore()
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time dashboard of your order management system</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(analytics.total_revenue)}
          change={`+${formatCurrency(analytics.recent_revenue.current - analytics.recent_revenue.previous)}`}
          trend="up"
          icon={<DollarSign className="h-4 w-4" />}
          gradient
        />
        <StatsCard
          title="Total Orders"
          value={<AnimatedValue value={analytics.total_orders} />}
          change={`+${analytics.recent_orders_count.current - analytics.recent_orders_count.previous} this period`}
          trend={analytics.recent_orders_count.current >= analytics.recent_orders_count.previous ? "up" : "down"}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Customers"
          value={<AnimatedValue value={analytics.active_customers} />}
          change={`${analytics.completion_rate}% completion rate`}
          trend="neutral"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="In Progress"
          value={<AnimatedValue value={analytics.processing_orders} />}
          change={`${analytics.pending_orders} pending`}
          trend="neutral"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={analytics.revenue_trend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Online Team</CardTitle>
            <CardDescription>{onlineUsers.length} members active</CardDescription>
          </CardHeader>
          <CardContent>
            <OnlineUsersList />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={analytics.status_distribution} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Order Trend</CardTitle>
            <CardDescription>Daily order volume</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderTrendChart data={analytics.order_trend} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest 5 orders</CardDescription>
            </div>
            <Badge variant="default" className="text-xs">
              <Activity className="h-3 w-3 mr-1" /> Live
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold">
                      {order.display_id.replace("#", "")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{order.assigned_staff_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{formatCurrency(order.amount)}</p>
                    <Badge variant={order.status}>{order.status}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>Real-time system activity</CardDescription>
            </div>
            <Badge variant="default" className="text-xs">
              <Activity className="h-3 w-3 mr-1" /> Live
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[340px]">
              <ActivityFeed />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
