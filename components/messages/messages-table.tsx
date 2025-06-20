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

interface Message {
  id: string
  name: string
  content: string
  createdAt: string
  updatedAt: string
}

// Sample data - would come from API in production
const messages: Message[] = [
  {
    id: 'MSG001',
    name: 'Boas-vindas',
    content: 'Olá {cliente}, bem-vindo ao nosso serviço!',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20'
  },
  {
    id: 'MSG002',
    name: 'Lembrete de Pagamento',
    content: 'Olá {cliente}, seu pagamento vence em {dias_vencimento} dias.',
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19'
  }
]

export function MessagesTable() {
  const [currentMessages, setCurrentMessages] = useState(messages)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Conteúdo</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Última Atualização</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentMessages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>{message.name}</TableCell>
              <TableCell>{message.content}</TableCell>
              <TableCell>{message.createdAt}</TableCell>
              <TableCell>{message.updatedAt}</TableCell>
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