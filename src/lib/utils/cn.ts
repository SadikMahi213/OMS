import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

export function formatRelativeTime(date: string): string {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20"
    case "processing":
      return "text-blue-500 bg-blue-500/10 border-blue-500/20"
    case "completed":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    case "cancelled":
      return "text-red-500 bg-red-500/10 border-red-500/20"
    case "paid":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    case "unpaid":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20"
    case "refunded":
      return "text-purple-500 bg-purple-500/10 border-purple-500/20"
    default:
      return "text-gray-500 bg-gray-500/10 border-gray-500/20"
  }
}
