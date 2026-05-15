"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Users, TrendingUp, DollarSign } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { formatCurrency, formatDate } from "@/lib/utils/cn"
import { StatsCard } from "@/components/shared/stats-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils/cn"

export default function CustomersPage() {
  const { customers } = useAppStore()
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    if (!search) return customers
    const q = search.toLowerCase()
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
    )
  }, [customers, search])

  const totalSpent = customers.reduce((s, c) => s + c.total_spent, 0)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-sm text-gray-400 mt-1">{customers.length} registered customers</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Total Customers" value={customers.length.toString()} icon={<Users className="h-4 w-4" />} gradient />
        <StatsCard title="Active Customers" value={customers.filter((c) => c.status === "active" || c.status === "vip").length.toString()} icon={<TrendingUp className="h-4 w-4" />} />
        <StatsCard title="Total Revenue" value={formatCurrency(totalSpent)} icon={<DollarSign className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Customers</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filtered.map((customer, i) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.03] transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm bg-indigo-500/20 text-indigo-400">
                    {customer.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{customer.name}</p>
                    <Badge variant={customer.status as any}>{customer.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{customer.email} · {customer.company}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white">{formatCurrency(customer.total_spent)}</p>
                  <p className="text-xs text-gray-500">{customer.total_orders} orders</p>
                </div>
                <div className="text-xs text-gray-500 hidden md:block">
                  {formatDate(customer.created_at)}
                </div>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">No customers found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
