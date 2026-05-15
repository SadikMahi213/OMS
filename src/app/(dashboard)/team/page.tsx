"use client"

import { motion } from "framer-motion"
import { UserCircle, Shield, Users } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { StatsCard } from "@/components/shared/stats-card"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function TeamPage() {
  const { staff } = useAppStore()

  const roleCounts = {
    admin: staff.filter((s) => s.role === "admin").length,
    manager: staff.filter((s) => s.role === "manager").length,
    staff: staff.filter((s) => s.role === "staff").length,
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Team</h1>
        <p className="text-sm text-gray-400 mt-1">{staff.length} team members</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Total Members" value={staff.length.toString()} icon={<Users className="h-4 w-4" />} gradient />
        <StatsCard title="Admins" value={roleCounts.admin.toString()} icon={<Shield className="h-4 w-4" />} />
        <StatsCard title="Staff" value={roleCounts.staff.toString()} icon={<UserCircle className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>All staff with online status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {staff.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.03] transition-colors"
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar_url} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-gray-950" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{member.name}</p>
                  <Badge variant={member.role as any}>{member.role}</Badge>
                </div>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-emerald-400">Online</span>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
