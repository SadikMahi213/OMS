"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Zap, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSent(true)
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
          <h1 className="text-2xl font-bold text-white">Reset password</h1>
          <p className="text-sm text-gray-400 mt-1">
            {sent ? "Check your email for the reset link" : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <p className="text-sm text-gray-400 mb-6">
              If an account exists with that email, you&apos;ll receive a password reset link shortly.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </Button>
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input id="email" type="email" placeholder="you@company.com" className="pl-10" />
              </div>
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>

            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </form>
        )}
      </div>
    </motion.div>
  )
}
