"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard, ShoppingCart, Users, BarChart3, UserCircle,
  Activity, Settings, ChevronLeft, ChevronRight, Zap
} from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { useAppStore } from "@/lib/store/app-store"

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/team", label: "Team", icon: UserCircle },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      className={cn(
        "fixed left-0 top-0 z-40 h-full border-r border-white/[0.06] bg-black/40 backdrop-blur-2xl",
        "flex flex-col"
      )}
    >
      <div className={cn("flex items-center h-16 px-4 border-b border-white/[0.06]", sidebarCollapsed ? "justify-center" : "justify-between")}>
        {!sidebarCollapsed && (
          <Link href="/overview" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">OMS</span>
              <span className="text-[10px] block text-gray-500 -mt-0.5">Dashboard</span>
            </div>
          </Link>
        )}
        {sidebarCollapsed && (
          <Link href="/overview">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
          </Link>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border border-indigo-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-400 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-indigo-400")} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className={cn("p-3 border-t border-white/[0.06]", sidebarCollapsed && "flex justify-center")}>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            "flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-200",
            sidebarCollapsed ? "w-10 h-10" : "w-full h-10 gap-2"
          )}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  )
}
