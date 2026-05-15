"use client"

import { motion } from "framer-motion"
import { DollarSign, ShoppingCart, TrendingUp, PieChart } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { formatCurrency } from "@/lib/utils/cn"
import { StatsCard } from "@/components/shared/stats-card"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import { useCounterAnimation } from "@/hooks/use-counter-animation"

const RevenueChart = dynamic(() => import("@/components/analytics/revenue-chart"), { ssr: false })
const OrderTrendChart = dynamic(() => import("@/components/analytics/order-trend-chart"), { ssr: false })
const StatusPieChart = dynamic(() => import("@/components/analytics/status-pie-chart"), { ssr: false })
const RevenueByDayChart = dynamic(() => import("@/components/analytics/revenue-by-day-chart"), { ssr: false })

function AnimatedValue({ value, prefix = "" }: { value: number; prefix?: string }) {
  const count = useCounterAnimation(value)
  return <span>{prefix}{count}</span>
}

export default function AnalyticsPage() {
  const { analytics } = useAppStore()

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">Performance metrics and business intelligence</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(analytics.total_revenue)}
          change="+12.5% vs last month"
          trend="up"
          icon={<DollarSign className="h-4 w-4" />}
          gradient
        />
        <StatsCard
          title="Total Orders"
          value={<AnimatedValue value={analytics.total_orders} />}
          change={`${analytics.completion_rate}% completed`}
          trend="neutral"
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <StatsCard
          title="Completion Rate"
          value={`${analytics.completion_rate}%`}
          change="+5.2% improvement"
          trend="up"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Customers"
          value={<AnimatedValue value={analytics.active_customers} />}
          change="+8 new this month"
          trend="up"
          icon={<PieChart className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>30-day revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={analytics.revenue_trend} />
          </CardContent>
        </Card>
        <Card>
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
          <CardHeader>
            <CardTitle>Revenue by Day</CardTitle>
            <CardDescription>Weekly breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueByDayChart data={analytics.revenue_by_day} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Order status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={analytics.status_distribution} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>Highest revenue customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.top_customers.map((c, i) => (
              <div key={c.name} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.orders} orders</p>
                </div>
                <span className="text-sm font-semibold text-white">{formatCurrency(c.revenue)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
