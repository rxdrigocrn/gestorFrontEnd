"use client"

import { Card, CardContent } from '@/components/ui/card'
import { ServerIcon, HardDrive, Cpu } from 'lucide-react'
import { Server } from '@/types/server'
import { formatCurrency } from '@/formatters/formatCurrency'


interface ServerStatsProps {
  servers: Server[]
}

export function ServerStats({ servers }: ServerStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-sm">Total Servers</span>
            <span className="text-2xl font-bold">{servers.length}</span>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <ServerIcon className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-sm">Credits Used</span>
            <span className="text-2xl font-bold">{servers.reduce((total, server) => total + (server.credits ?? 0), 0)}</span>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <HardDrive className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-sm">Average Cost</span>
            <span className="text-2xl font-bold">
              {formatCurrency(
                servers.length > 0
                  ? servers.reduce((total, server) => total + (server.cost ?? 0), 0) / servers.length
                  : 0
              )}
            </span>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Cpu className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}