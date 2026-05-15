"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | React.ReactNode
  change?: string | React.ReactNode
  trend?: "up" | "down" | "neutral"
  icon?: React.ReactNode
  className?: string
  gradient?: boolean
}

export function StatsCard({ title, value, change, trend, icon, className, gradient }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border border-white/[0.06] p-5 backdrop-blur-xl shadow-xl",
        gradient
          ? "bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent"
          : "bg-gradient-to-b from-white/[0.08] to-white/[0.02]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-white tracking-tight"
          >
            {value}
          </motion.p>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />}
              {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-red-400" />}
              <span className={cn(
                "text-xs font-medium",
                trend === "up" && "text-emerald-400",
                trend === "down" && "text-red-400",
                trend === "neutral" && "text-gray-400"
              )}>
                {change}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
