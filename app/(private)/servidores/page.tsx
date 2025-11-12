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
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, Trash2, PlusCircle } from 'lucide-react'
import { GenericTable } from '@/components/table/GenericTable'
import { GenericFilters } from '@/components/table/GenericFilters'
import { AddServerModal } from '@/components/servers/add-server-modal'
import { ServerCreate, ServerResponse, ServerUpdate } from '@/types/server'
import { ServerStats } from '@/components/servers/server-stats'
import { ServerFormData } from '@/schemas/serverFormSchema'
import { ConfirmationDialog } from '@/components/ui/confirmModal'
import { useSimpleToast } from '@/hooks/use-toast'

export default function ServersPage() {
  const router = useRouter()
  const { items: servers, fetchItems: fetchServers, isLoading, error, createItem, updateItem, deleteItem } = useServerStore()

  const { showToast } = useSimpleToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ServerResponse | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchServers()
  }, [])

  // Seu objeto não tem status e tipo definidos, entao esses filtros só funcionam se estiverem na store
  const filteredServers = servers.filter((server) => {
    const matchesSearch =
      server.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })


  // Aqui chamamos a função createItem da store (que já está tipada e atualiza o estado interno da store)
  const handleSubmit = async (data: ServerFormData) => {
    try {
      if (data.id) {
        await updateItem(data.id, data as ServerUpdate)
        showToast("success", "Servidor atualizado", {
          description: "As alterações foram salvas com sucesso",
        })
      } else {
        await createItem(data as ServerCreate)
        showToast("success", "Servidor criado", {
          description: "O novo servidor foi registrado no sistema",
        })
      }
      setShowAddModal(false)
      setEditingItem(null)
      fetchServers()
    } catch (error) {
      showToast("error", "Erro ao salvar método de pagamento", {
        description: "Ocorreu um erro ao salvar o método de pagamento",
      })
      console.error('Erro ao salvar método de pagamento:', error)

    }
  }

  const handleEdit = (server: ServerResponse) => {
    setEditingItem(server)
    setShowAddModal(true)
  }

  const handleDelete = async () => {
    try {
      if (editingItem && editingItem.id) {
        await deleteItem(editingItem.id)
        showToast("success", "Servidor excluido", {
          description: "O servidor foi excluido com sucesso",
        })
        setEditingItem(null)
        fetchServers()
      } else {
        console.error('Nenhum cliente selecionado para exclusão.')
      }
    } catch (error) {
      showToast("error", "Erro ao excluir", {
        description: "Ocorreu um erro ao excluir o servidor",
      })
      console.error('Erro ao excluir cliente:', error)
    }
  }

  const handleOpenDialog = (server: ServerResponse) => {
    setIsDialogOpen(true);
    setEditingItem(server);
  }

  const handleModalChange = (isOpen: boolean) => {
    setShowAddModal(isOpen);
    if (!isOpen) {
      setEditingItem(null);
    }
  };

  if (isLoading) return <p>Carregando servidores...</p>
  if (error) return <p className="text-red-600">Erro: {error}</p>

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Servidores</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo servidor
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
        isLoading={isLoading}
        error={error ?? undefined}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/servidores/${row.id}`)}
        columns={[
          {
            header: 'Nome',
            accessor: 'name',
          },
          {
            header: 'Valor Crédito',
            accessor: (server) => (
              server.cost
                ? new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(server.cost)
                : '-'
            ),
          },
          {
            header: 'Créditos',
            accessor: (server) => (
              server.credits !== null ? server.credits : '-'
            ),
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
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/servidores/${server.id}`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
                  e.stopPropagation()
                  handleEdit(server)
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={(e) => {
                  e.stopPropagation()
                  handleOpenDialog(server)
                }}>
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
        <AddServerModal
          open={showAddModal}
          onOpenChange={handleModalChange}
          onConfirm={handleSubmit}
          defaultValues={editingItem ?? undefined}
        />
      )}

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDelete}
        title="Excluir Server"
        description="Tem certeza de que deseja excluir este Server?"
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  )
}
