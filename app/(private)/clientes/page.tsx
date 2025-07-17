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
import { MoreHorizontal, Eye, Edit, Trash2, MessageCircle, PlusCircle, CreditCard } from 'lucide-react'
import { GenericTable } from '@/components/table/GenericTable'
import { GenericFilters } from '@/components/table/GenericFilters'
import { AddClientModal } from '@/components/clients/add-client-modal'
import { ClientCreate, ClientPayment, ClientResponse, ClientUpdate } from '@/types/client'
import { format } from 'date-fns'
import { ClientFormData } from '@/lib/schemas/clientFormSchema'
import { AddPaymentModal } from '@/components/clients/add-payment-modal'
import { ConfirmationDialog } from '@/components/ui/confirmModal'
import { File } from 'lucide-react'
import { fetchAll } from '@/services/api-services'
import { api } from '@/services/api'
import { ImportExcelModal } from '@/components/clients/import-excel'

export default function ClientsTable() {
  const router = useRouter()
  const { fetchItems: fetchClients, items: clients, isLoading, error, createItem, updateItem, deleteItem, addPaymentToClient } = useClientStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<{ [key: string]: string }>({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ClientResponse | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

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

  const handleSubmit = async (formData: ClientFormData) => {
    try {
      if (formData.id) {
        await updateItem(formData.id, formData as ClientUpdate)
      } else {
        await createItem(formData as ClientCreate)
      }

      setShowAddModal(false)
      setEditingItem(null)
      fetchClients()
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
    }
  }

  const handleEdit = (client: ClientResponse) => {
    setEditingItem(client)
    setShowAddModal(true)
  }

  const handleDelete = async () => {
    try {
      if (editingItem && editingItem.id) {
        await deleteItem(editingItem.id)
        setEditingItem(null)
        fetchClients()
      } else {
        console.error('Nenhum cliente selecionado para exclusão.')
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
    }
  }

  const handleOpenDialog = (client: ClientResponse) => {
    setIsDialogOpen(true);
    setEditingItem(client);
  }

  const handleAddPayment = (client: ClientResponse) => {
    setShowPaymentModal(true)
    setEditingItem(client)
  }

  const handlePaymentSubmit = async (data: ClientPayment) => {
    try {
      if (!editingItem) {
        throw new Error('Nenhum cliente selecionado para adicionar pagamento.')
      }
      await addPaymentToClient(editingItem.id, data)
      setShowPaymentModal(false)
      setEditingItem(null)
      fetchClients()
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error)
    }
  }

  const handleModalChange = (isOpen: boolean) => {
    setShowAddModal(isOpen)
    if (!isOpen) {
      setEditingItem(null)
    }
  }

  const handlePaymentModalChange = (isOpen: boolean) => {
    setShowPaymentModal(isOpen)
    if (!isOpen) {
      setEditingItem(null)
    }
  }

  const handleExportExcel = async () => {
    const res = await api.get('/clients/export/excel', {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });

    const blob = res.data;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clientes_${new Date().toISOString()}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  }



  if (isLoading) return <p>Carregando clientes...</p>
  if (error) return <p className="text-red-600">Erro: {error}</p>

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <div className='flex gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <File className="mr-2 h-4 w-4" />
                <span>Excel</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsImportModalOpen(true)}>Importar Planilha</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel}>Exportar Planilha</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setShowAddModal(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Cliente
          </Button>
        </div>
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
        ]}
      />

      {/* Tabela */}
      <GenericTable<ClientResponse>
        data={filteredClients}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/clientes/${row.id}`)}
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
          {
            header: 'Expiração',
            accessor: (client) => client.expiresAt ? format(new Date(client.expiresAt), 'dd/MM/yyyy HH:mm') : '-',
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
              <DropdownMenuItem onClick={() => router.push(`/clientes/${client.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                handleAddPayment(client)
              }}>
                <CreditCard className="mr-2 h-4 w-4" />
                Adicionar Pagamento
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                handleEdit(client)
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={(e) => {
                e.stopPropagation()
                handleOpenDialog(client)
              }}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* Modal */}
      {showAddModal && (
        <AddClientModal
          open={showAddModal}
          onOpenChange={handleModalChange}
          onConfirm={handleSubmit}
          defaultValues={editingItem || undefined}
        />
      )}

      {showPaymentModal && (
        <AddPaymentModal
          open={showPaymentModal}
          onOpenChange={handlePaymentModalChange}
          onConfirm={handlePaymentSubmit}
          defaultValues={editingItem || undefined}
        />
      )}


      <ConfirmationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        variant="destructive"
      />

      <ImportExcelModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onSuccess={() => {
          fetchClients()
          setIsImportModalOpen(false)
        }}
      />
    </div>
  )
}