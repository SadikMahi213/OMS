"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowUpDown, ChevronDown, Filter, MoreHorizontal } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { formatCurrency, formatRelativeTime, cn } from "@/lib/utils/cn"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type SortKey = "display_id" | "customer_name" | "amount" | "status" | "created_at"

export function OrdersTable() {
  const { orders, staff } = useAppStore()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortKey, setSortKey] = useState<SortKey>("created_at")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const filtered = useMemo(() => {
    let result = [...orders]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.display_id.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.assigned_staff_name.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter)
    }
    result.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case "display_id":
          cmp = a.display_id.localeCompare(b.display_id)
          break
        case "customer_name":
          cmp = a.customer_name.localeCompare(b.customer_name)
          break
        case "amount":
          cmp = a.amount - b.amount
          break
        case "status":
          cmp = a.status.localeCompare(b.status)
          break
        case "created_at":
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
      }
      return sortDir === "asc" ? cmp : -cmp
    })
    return result
  }, [orders, search, statusFilter, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("desc")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search orders, customers, staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <Filter className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <Th sortable onClick={() => toggleSort("display_id")} active={sortKey === "display_id"} dir={sortDir}>
                  Order
                </Th>
                <Th sortable onClick={() => toggleSort("customer_name")} active={sortKey === "customer_name"} dir={sortDir}>
                  Customer
                </Th>
                <Th sortable onClick={() => toggleSort("amount")} active={sortKey === "amount"} dir={sortDir}>
                  Amount
                </Th>
                <Th sortable onClick={() => toggleSort("status")} active={sortKey === "status"} dir={sortDir}>
                  Status
                </Th>
                <Th>Payment</Th>
                <Th>Staff</Th>
                <Th sortable onClick={() => toggleSort("created_at")} active={sortKey === "created_at"} dir={sortDir}>
                  Created
                </Th>
                <Th><span className="sr-only">Actions</span></Th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filtered.slice(0, 25).map((order, i) => (
                  <motion.tr
                    key={order.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-white">{order.display_id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-white">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{order.items} items</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-white">{formatCurrency(order.amount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <motion.div layout>
                        <StatusBadge status={order.status} />
                      </motion.div>
                    </td>
                    <td className="px-4 py-3">
                      <motion.div layout>
                        <PaymentBadge status={order.payment_status} />
                      </motion.div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[9px]">{order.assigned_staff_name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-300">{order.assigned_staff_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">{formatRelativeTime(order.created_at)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1 rounded-md text-gray-500 opacity-0 group-hover:opacity-100 hover:text-white transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No orders found</p>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Showing {Math.min(filtered.length, 25)} of {filtered.length} orders
      </p>
    </div>
  )
}

function Th({
  children,
  sortable,
  active,
  dir,
  onClick,
}: {
  children: React.ReactNode
  sortable?: boolean
  active?: boolean
  dir?: "asc" | "desc"
  onClick?: () => void
}) {
  return (
    <th
      onClick={onClick}
      className={cn(
        "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider",
        sortable ? "cursor-pointer select-none hover:text-white" : "text-gray-500",
        active ? "text-white" : "text-gray-500"
      )}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && <ArrowUpDown className="h-3 w-3" />}
      </div>
    </th>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <motion.span
      layout
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        status === "pending" && "text-amber-400 bg-amber-500/10 border-amber-500/20",
        status === "processing" && "text-blue-400 bg-blue-500/10 border-blue-500/20",
        status === "completed" && "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        status === "cancelled" && "text-red-400 bg-red-500/10 border-red-500/20"
      )}
    >
      {status}
    </motion.span>
  )
}

function PaymentBadge({ status }: { status: string }) {
  return (
    <motion.span
      layout
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        status === "paid" && "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        status === "unpaid" && "text-amber-400 bg-amber-500/10 border-amber-500/20",
        status === "refunded" && "text-purple-400 bg-purple-500/10 border-purple-500/20"
      )}
    >
      {status}
    </motion.span>
  )
}
