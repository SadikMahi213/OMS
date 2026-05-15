"use client"

import { motion } from "framer-motion"
import { useAppStore } from "@/lib/store/app-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils/cn"

export function OnlineUsers() {
  const { onlineUsers } = useAppStore()

  if (onlineUsers.length === 0) return null

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {onlineUsers.slice(0, 5).map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative"
          >
            <Avatar className="h-8 w-8 border-2 border-gray-900">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-gray-900" />
          </motion.div>
        ))}
      </div>
      {onlineUsers.length > 5 && (
        <span className="ml-1.5 text-xs text-gray-500 font-medium">+{onlineUsers.length - 5}</span>
      )}
    </div>
  )
}

export function OnlineUsersList() {
  const { onlineUsers } = useAppStore()

  return (
    <div className="space-y-2">
      {onlineUsers.map((user, i) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-gray-950" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
          {user.current_page && (
            <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
              {user.current_page}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  )
}
