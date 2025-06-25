"use client"

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useClientStore } from '@/store/clientStore'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, Trash2, MessageCircle, PlusCircle } from 'lucide-react'
import { GenericTable } from '@/components/table/GenericTable'
import { GenericFilters } from '@/components/table/GenericFilters'
import { AddClientModal } from '@/components/clients/add-client-modal'
import { createItem } from '@/services/api-services'
import { ClientResponse, } from '@/types/client'

export default function ClientsTable() {
  const router = useRouter()
  const { clients, fetchClients, isLoading, error } = useClientStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<{ [key: string]: string }>({})
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  const planOptions = useMemo(() => {
    const uniquePlans = new Map<string, string>()
    clients.forEach((client) => {
      if (client.plan?.id && client.plan?.name) {
        uniquePlans.set(client.plan.id, client.plan.name)
      }
    })
    return Array.from(uniquePlans).map(([value, label]) => ({ value, label }))
  }, [clients])

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesPlan = filters.planId ? client.plan?.id === filters.planId : true

    return matchesSearch && matchesPlan
  })

  const handleSubmit = async (data: any) => {
    try {
      await createItem('/clients', data)
      setShowAddModal(false)
      fetchClients()
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
    }
  }

  if (isLoading) return <p>Carregando clientes...</p>
  if (error) return <p className="text-red-600">Erro: {error}</p>

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>

      {/* Filtros */}
      <GenericFilters
        searchPlaceholder="Buscar clientes..."
        onSearchChange={setSearchTerm}
        onFilterChange={(name: string, value: string) => setFilters((prev) => ({ ...prev, [name]: value }))}
        onReset={() => {
          setSearchTerm('')
          setFilters({})
        }}
        filters={[
          {
            label: 'Plano',
            name: 'planId',
            options: planOptions,
          },
          // {
          //   label: 'Status',
          //   name: 'status',
          //   options: [
          //     { value: 'active', label: 'Ativo' },
          //     { value: 'inactive', label: 'Inativo' },
          //     { value: 'pending', label: 'Pendente' },
          //   ],
          // },
        ]}
      />

      {/* Tabela */}
      <GenericTable<ClientResponse>
        data={filteredClients}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/clients/${row.id}`)}
        columns={[
          {
            header: 'Cliente',
            accessor: (client) => (
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-xs text-muted-foreground">{client.email}</p>
                </div>
              </div>
            ),
          },
          {
            header: 'Plano',
            accessor: (client) => client.plan?.name ?? 'Sem plano',
          },
        ]}
        actions={(client) => (
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
              <DropdownMenuItem onClick={() => router.push(`/clients/${client.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/clients/${client.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* Modal */}
      {showAddModal && (
        <AddClientModal open={showAddModal} onOpenChange={setShowAddModal} onConfirm={handleSubmit} />
      )}
    </div>
  )
}
