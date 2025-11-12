"use client"

import React from 'react'
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Users, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
  extra?: {
    active: number
    inactive: number
    total: number
  }
}

function StatsCard({ title, value, description, icon, trend, extra }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">{value}</div>

        {/* Se tiver extra (clientes), renderiza os três números */}
        {extra ? (
          <div className="mt-3 grid grid-cols-3 text-center text-sm text-muted-foreground">
            <div>
              <p className="text-green-600 font-semibold">{extra.active}</p>
              <p>Ativos</p>
            </div>
            <div>
              <p className="text-red-500 font-semibold">{extra.inactive}</p>
              <p>Inativos</p>
            </div>
            <div>
              <p className="text-blue-500 font-semibold">{extra.total}</p>
              <p>Total</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center text-xs text-muted-foreground">
            {trend && (
              <span
                className={cn(
                  "mr-1 flex items-center",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.isPositive ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                )}
                {trend.value}
              </span>
            )}
            <CardDescription className="text-xs">{description}</CardDescription>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
interface DashboardStatsProps {
  stats: StatsCardProps[]
}
export default function DashboardStats({ stats }: DashboardStatsProps) {
  const gridCols =
    stats.length === 1
      ? 'grid-cols-1'
      : stats.length === 2
        ? 'grid-cols-2'
        : stats.length === 3
          ? 'grid-cols-3'
          : 'grid-cols-4'

  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          trend={stat.trend}
          extra={stat.extra}
        />
      ))}
    </div>
  )
}
