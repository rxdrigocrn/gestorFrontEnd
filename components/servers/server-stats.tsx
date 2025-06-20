"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Server, HardDrive, Cpu, Activity } from 'lucide-react'

export function ServerStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-sm">Total Servers</span>
            <span className="text-2xl font-bold">12</span>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Server className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-sm">Storage Used</span>
            <span className="text-2xl font-bold">6.2 TB</span>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <HardDrive className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-sm">Average CPU</span>
            <span className="text-2xl font-bold">42%</span>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Cpu className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-sm">Uptime</span>
            <span className="text-2xl font-bold">99.8%</span>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}