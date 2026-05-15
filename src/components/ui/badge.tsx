import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-800 text-gray-300",
        pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        processing: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
        paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        unpaid: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        refunded: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        active: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        inactive: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
        vip: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
        admin: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        manager: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        staff: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
