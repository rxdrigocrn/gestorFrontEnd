"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useServerStore } from '@/store/serverStore'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, Trash2, PlusCircle } from 'lucide-react'
import { GenericTable } from '@/components/table/GenericTable'
import { GenericFilters } from '@/components/table/GenericFilters'
import { AddServerModal } from '@/components/servers/add-server-modal'
import { createItem } from '@/services/api-services'
import { ServerResponse } from '@/types/server'
import { ServerStats } from '@/components/servers/server-stats'



export default function ServersPage() {
  const router = useRouter()
  const { items: servers, fetchItems: fetchServers, isLoading, error } = useServerStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchServers()
  }, [])

  // Seu objeto não tem status e tipo definidos, entao esses filtros só funcionam se estiverem na store
  const filteredServers = servers.filter((server) => {
    const matchesSearch =
      server.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const handleSubmit = async (data: any) => {
    try {
      await createItem('/servers', data)
      setShowAddModal(false)
      fetchServers()
    } catch (error) {
      console.error('Erro ao criar servidor:', error)
    }
  }

  if (isLoading) return <p>Carregando servidores...</p>
  if (error) return <p className="text-red-600">Erro: {error}</p>

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Servers</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Server
        </Button>
      </div>

      {/* Estatísticas */}
      <ServerStats servers={servers} />

      {/* Filtros */}
      <GenericFilters
        searchPlaceholder="Buscar servidores..."
        onSearchChange={setSearchTerm}
        onReset={() => {
          setSearchTerm('')
        }}
      />

      {/* Tabela */}
      <GenericTable<ServerResponse>
        data={filteredServers}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/servers/${row.id}`)}
        columns={[
          {
            header: 'Nome',
            accessor: 'name',
          },
          {
            header: 'Valor Crédito',
            accessor: (server) => server.cost ?? '-',
          },
          {
            header: 'Sessão Wpp',
            accessor: (server) => server.whatsappSession ?? '-',
          },
          {
            header: 'Link Painel',
            accessor: (server) => (
              <a
                href={server.panelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
                onClick={(e) => e.stopPropagation()}
              >
                Painel
              </a>
            ),
          },
          // Você pode adicionar mais colunas conforme necessário, por exemplo apps urls
        ]}
        actions={(server) => (
          <div className="actions-menu">
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
                <DropdownMenuItem onClick={() => router.push(`/servers/${server.id}`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/servers/${server.id}/edit`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      />

      {/* Modal */}
      {showAddModal && (
        <AddServerModal open={showAddModal} onOpenChange={setShowAddModal} onConfirm={handleSubmit} />
      )}
    </div>
  )
}
