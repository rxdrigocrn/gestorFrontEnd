'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

interface LogEntry {
  id: string
  description: string
  timestamp: string // ISO string
  user?: {
    name: string
  }
}

interface SystemLogsProps {
  logs: LogEntry[]
}

const getLogBadge = () => {
  return <Badge variant="outline">Info</Badge>
}

export default function SystemLogs({ logs }: SystemLogsProps) {
  const router = useRouter()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Registros do Sistema</CardTitle>
        <CardDescription>Eventos e atividades recentes do sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 sm:space-x-4">
            {log.user ? (
              <Avatar className="hidden sm:flex">
                <AvatarFallback>{log.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="hidden sm:flex">
                <AvatarFallback>SIS</AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium break-words">{log.description}</p>
                  {getLogBadge()}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(log.timestamp), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push('/logs')}
        >
          Ver Todos os Registros
        </Button>
      </CardFooter>
    </Card>
  )
}