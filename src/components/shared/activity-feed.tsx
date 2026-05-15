"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore } from "@/lib/store/app-store"
import { formatRelativeTime } from "@/lib/utils/cn"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ActivityFeed() {
  const { activityLogs } = useAppStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const recentLogs = activityLogs.slice(0, 20)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [activityLogs.length])

  return (
    <ScrollArea className="h-full" ref={scrollRef}>
      <div className="space-y-1 p-1">
        <AnimatePresence initial={false}>
          {recentLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors"
            >
              <Avatar className="h-7 w-7 mt-0.5">
                <AvatarImage src={log.user_avatar} />
                <AvatarFallback className="text-[10px]">{log.user_name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">{log.user_name}</span>{" "}
                  <span className="text-gray-400">{log.action}</span>
                  {" "}
                  <span className="text-indigo-400 font-medium">{log.entity_id}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>
              </div>
              <span className="text-[10px] text-gray-600 whitespace-nowrap mt-1">
                {formatRelativeTime(log.created_at)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  )
}
