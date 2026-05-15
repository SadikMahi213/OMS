"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Zap, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/lib/store/app-store"

export default function LoginPage() {
  const router = useRouter()
  const { staff, setUser } = useAppStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 800))

    // Demo auto-login: find user by email or use first staff
    const found = staff.find((s) => s.email === email) || staff[0]
    if (found) {
      setUser(found)
      router.push("/overview")
    } else {
      setError("Invalid credentials")
    }
    setLoading(false)
  }

  // Quick login for demo
  const quickLogin = async (role: string) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const found = staff.find((s) => s.role === role) || staff[0]
    setUser(found)
    router.push("/overview")
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-md mx-4"
    >
      <div className="rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your OMS dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="email"
                type="email"
                placeholder="alice@oms-demo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400">
              {error}
            </motion.p>
          )}

          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            Forgot password?
          </Link>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <p className="text-xs font-medium text-gray-400 mb-3 text-center">Demo Quick Login</p>
          <div className="flex gap-2">
            <button
              onClick={() => quickLogin("admin")}
              disabled={loading}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
            >
              Admin
            </button>
            <button
              onClick={() => quickLogin("manager")}
              disabled={loading}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
            >
              Manager
            </button>
            <button
              onClick={() => quickLogin("staff")}
              disabled={loading}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20 transition-colors"
            >
              Staff
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
