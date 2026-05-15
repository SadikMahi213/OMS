"use client"

import { motion } from "framer-motion"
import { Activity, Filter } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatRelativeTime } from "@/lib/utils/cn"

export default function ActivityPage() {
  const { activityLogs } = useAppStore()

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Activity Log</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time system activity feed</p>
      </motion.div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Activity</CardTitle>
            <CardDescription>{activityLogs.length} events recorded</CardDescription>
          </div>
          <Badge variant="default" className="text-xs gap-1.5 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {activityLogs.slice(0, 50).map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.01 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors"
              >
                <Avatar className="h-8 w-8 mt-0.5">
                  <AvatarImage src={log.user_avatar} />
                  <AvatarFallback className="text-xs">{log.user_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium text-white">{log.user_name}</span>
                    {" "}
                    <span className="text-gray-500">{log.action}</span>
                    {" "}
                    <span className="text-indigo-400 font-medium">{log.entity_id}</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{log.details}</p>
                </div>
                <span className="text-[10px] text-gray-600 whitespace-nowrap mt-1">
                  {formatRelativeTime(log.created_at)}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
