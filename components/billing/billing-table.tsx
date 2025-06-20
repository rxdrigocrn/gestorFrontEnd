"use client"

import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'

interface Billing {
  id: string
  name: string
  message: string
  server: string
  device: string
  plan: string
  app: string
  paymentMethod: string
  intervalMin: number
  intervalMax: number
  billingType: string
  clientStatus: string
  periodType: string
  registrationPeriod: string
  duePeriod: string
  status: 'active' | 'inactive'
}

// Sample data - would come from API in production
const billings: Billing[] = [
  {
    id: 'BIL001',
    name: 'Cobrança Mensal Padrão',
    message: 'Lembrete de Pagamento',
    server: 'ELITE',
    device: 'Smart TV',
    plan: 'Mensal',
    app: 'QuickPlayer',
    paymentMethod: 'PIX',
    intervalMin: 3,
    intervalMax: 5,
    billingType: 'Automática',
    clientStatus: 'Ativo',
    periodType: 'Dias',
    registrationPeriod: '30',
    duePeriod: '5',
    status: 'active'
  }
]

export function BillingTable() {
  const [currentBillings, setCurrentBillings] = useState(billings)

  const getStatusBadge = (status: Billing['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inativo</Badge>
      default:
        return null
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Mensagem</TableHead>
            <TableHead>Servidor</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBillings.map((billing) => (
            <TableRow key={billing.id}>
              <TableCell>{billing.name}</TableCell>
              <TableCell>{billing.message}</TableCell>
              <TableCell>{billing.server}</TableCell>
              <TableCell>{billing.plan}</TableCell>
              <TableCell>{getStatusBadge(billing.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}