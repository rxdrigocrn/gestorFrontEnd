"use client"

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
}

function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
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
        <div className="flex items-center text-xs text-muted-foreground">
          {trend && (
            <>
              <span className={cn(
                "mr-1 flex items-center",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}>
                {trend.isPositive ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                )}
                {trend.value}
              </span>
            </>
          )}
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardStats() {
  // This would normally come from an API or state
  const stats = [
    {
      title: "Total Revenue",
      value: "R$ 45.231,89",
      description: "compared to last month",
      icon: <DollarSign className="h-5 w-5" />,
      trend: {
        value: "12.5%",
        isPositive: true
      }
    },
    {
      title: "Active Clients",
      value: "853",
      description: "active subscribers",
      icon: <Users className="h-5 w-5" />,
      trend: {
        value: "7.2%",
        isPositive: true
      }
    },
    {
      title: "Growth Rate",
      value: "15.8%",
      description: "monthly growth rate",
      icon: <TrendingUp className="h-5 w-5" />,
      trend: {
        value: "2.3%",
        isPositive: true
      }
    },
    {
      title: "Average Retention",
      value: "9.2 months",
      description: "client retention period",
      icon: <Clock className="h-5 w-5" />,
      trend: {
        value: "5.5%",
        isPositive: true
      }
    }
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  )
}