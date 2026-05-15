"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

interface StatusPieChartProps {
  data: { name: string; value: number }[]
}

const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444"]

export default function StatusPieChart({ data }: StatusPieChartProps) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-xs text-gray-400">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
