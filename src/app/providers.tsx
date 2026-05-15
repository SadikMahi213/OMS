"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store/app-store"
import { ToastContainer } from "@/components/ui/toast"
import { CommandPalette } from "@/components/layout/command-palette"

export function Providers({ children }: { children: React.ReactNode }) {
  const { init, theme, setTheme } = useAppStore()

  useEffect(() => {
    setTheme("dark")
    document.documentElement.classList.add("dark")
    init()
  }, [init, setTheme])

  return (
    <>
      {children}
      <ToastContainer />
      <CommandPalette />
    </>
  )
}
