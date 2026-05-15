"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell, Search, Moon, Sun, LogOut, User, Settings as SettingsIcon,
  ChevronDown, Menu, Activity as ActivityIcon
} from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { useAppStore } from "@/lib/store/app-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

function SyncIndicator() {
  const { isSimulating } = useAppStore()
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative flex h-2 w-2"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </motion.span>
      <span className="text-xs font-medium text-emerald-400">
        {isSimulating ? "Live" : "Connected"}
      </span>
    </div>
  )
}

function NotificationPopover() {
  const [open, setOpen] = useState(false)
  const { notifications, markNotificationRead, clearNotifications } = useAppStore()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between p-3 border-b border-white/10">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <button onClick={clearNotifications} className="text-xs text-indigo-400 hover:text-indigo-300">
                  Clear all
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No notifications</p>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={cn(
                        "w-full text-left p-2.5 rounded-lg transition-colors text-sm",
                        n.read ? "text-gray-400" : "text-white bg-white/5"
                      )}
                    >
                      <p className="font-medium text-xs">{n.title}</p>
                      <p className="text-xs opacity-60 mt-0.5">{n.description}</p>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function UserMenu() {
  const [open, setOpen] = useState(false)
  const { user } = useAppStore()

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-white/5 transition-colors"
      >
        <Avatar className="h-7 w-7">
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-white leading-tight">{user?.name}</p>
          <p className="text-[10px] text-gray-500 capitalize">{user?.role}</p>
        </div>
        <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-gray-500" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-2xl shadow-2xl p-1"
            >
              <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5">
                <User className="h-4 w-4" /> Profile
              </Link>
              <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5">
                <SettingsIcon className="h-4 w-4" /> Settings
              </Link>
              <Separator className="my-1" />
              <button className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme, sidebarCollapsed } = useAppStore()

  return (
    <header className={cn(
      "sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 border-b border-white/[0.06] bg-black/20 backdrop-blur-2xl",
      sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
    )}>
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            placeholder="Search orders, customers... (⌘K)"
            className="h-9 w-64 rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-white/5 rounded">⌘</kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-white/5 rounded">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <SyncIndicator />

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <NotificationPopover />

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <ActivityIcon className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs text-gray-400">24 active</span>
        </div>

        <UserMenu />
      </div>
    </header>
  )
}
