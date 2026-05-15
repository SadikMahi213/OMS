"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"
import { Header } from "@/components/layout/header"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils/cn"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, user } = useAppStore()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <MobileSidebar open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <Header onMenuClick={() => setMobileSidebarOpen(true)} />
      <main className={cn(
        "pt-16 min-h-screen transition-all duration-300",
        sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
      )}>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
