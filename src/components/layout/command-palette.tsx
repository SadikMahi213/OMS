"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Command, LayoutDashboard, ShoppingCart, Users, BarChart3, UserCircle, Activity, Settings, Moon, Sun } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"

const commands = [
  { id: "overview", label: "Go to Overview", icon: LayoutDashboard, action: "/overview" },
  { id: "orders", label: "Go to Orders", icon: ShoppingCart, action: "/orders" },
  { id: "customers", label: "Go to Customers", icon: Users, action: "/customers" },
  { id: "analytics", label: "Go to Analytics", icon: BarChart3, action: "/analytics" },
  { id: "team", label: "Go to Team", icon: UserCircle, action: "/team" },
  { id: "activity", label: "Go to Activity", icon: Activity, action: "/activity" },
  { id: "settings", label: "Go to Settings", icon: Settings, action: "/settings" },
  { id: "theme", label: "Toggle Theme", icon: Sun, action: "toggle-theme" },
]

export function CommandPalette() {
  const router = useRouter()
  const { commandPaletteOpen, setCommandPaletteOpen, toggleTheme } = useAppStore()
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  const execute = useCallback((id: string) => {
    const cmd = commands.find((c) => c.id === id)
    if (!cmd) return
    if (cmd.action === "toggle-theme") {
      toggleTheme()
    } else {
      router.push(cmd.action)
    }
    setCommandPaletteOpen(false)
  }, [router, toggleTheme, setCommandPaletteOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
        setQuery("")
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!commandPaletteOpen) setQuery("")
  }, [commandPaletteOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    }
    if (e.key === "Enter" && filtered[selectedIndex]) {
      execute(filtered[selectedIndex].id)
    }
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            className="fixed left-1/2 top-[15%] -translate-x-1/2 z-[90] w-full max-w-lg"
          >
            <div className="rounded-2xl border border-white/10 bg-gray-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <Search className="h-5 w-5 text-gray-500" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
                />
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-500 bg-white/5 rounded">ESC</kbd>
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No results found</p>
                ) : (
                  filtered.map((cmd, i) => {
                    const Icon = cmd.icon
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => execute(cmd.id)}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                          i === selectedIndex
                            ? "bg-white/10 text-white"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{cmd.label}</span>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
