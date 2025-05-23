import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  positive: boolean
}

export function StatsCard({ title, value, change, icon, positive }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{title}</p>
          {icon}
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-bold">{value}</h3>
          <p className={cn("text-xs mt-1", positive ? "text-green-600" : "text-red-600")}>{change}</p>
        </div>
      </CardContent>
    </Card>
  )
}
