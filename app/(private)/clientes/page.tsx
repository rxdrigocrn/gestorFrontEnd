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
import { ClientFormData } from '@/schemas/clientFormSchema'
import { AddPaymentModal } from '@/components/clients/add-payment-modal'
import { ConfirmationDialog } from '@/components/ui/confirmModal'
import { File } from 'lucide-react'
import { createItem, fetchAll } from '@/services/api-services'
import { api } from '@/services/api'
import { ImportExcelModal } from '@/components/clients/import-excel'
import { useSimpleToast } from '@/hooks/use-toast'
import { useDeviceStore } from '@/store/deviceStore'
import { usePlanStore } from '@/store/planStore'
import { useApplicationStore } from '@/store/applicationStore'
import { useLeadSourceStore } from '@/store/leadStore'
import { usePaymentMethodStore } from '@/store/paymentMethodStore'
import { useServerStore } from '@/store/serverStore'
import SendMessageModal from '@/components/clients/send-message-modal'

export default function ClientsTable() {
  const router = useRouter()
  const { fetchItems: fetchClients, items: clients, total, isLoading, error, createItem: createClient, updateItem, deleteItem, addPaymentToClient } = useClientStore()
  const { fetchItems: fetchDevices, items: devices } = useDeviceStore()
  const { fetchItems: fetchPlans, items: plans } = usePlanStore()
  const { fetchItems: fetchApplications, items: applications } = useApplicationStore()
  const { fetchItems: fetchLeadSources, items: leadSources } = useLeadSourceStore()
  const { fetchItems: fetchPaymentMethods, items: paymentMethods } = usePaymentMethodStore()
  const { fetchItems: fetchServers, items: servers } = useServerStore()


  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ClientResponse | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  const { showToast } = useSimpleToast();

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<{ [key: string]: string }>({})
  const [appliedFilters, setAppliedFilters] = useState<{ [key: string]: string }>({})

  const [hasLoadedPlans, setHasLoadedPlans] = useState(false)
  const [hasLoadedServers, setHasLoadedServers] = useState(false)
  const [hasLoadedApplications, setHasLoadedApplications] = useState(false)
  const [hasLoadedDevices, setHasLoadedDevices] = useState(false)
  const [hasLoadedPaymentMethods, setHasLoadedPaymentMethods] = useState(false)
  const [hasLoadedLeadSources, setHasLoadedLeadSources] = useState(false)

  const handleFiltersOpen = () => {
    if (!hasLoadedPlans) {
      fetchPlans()
      setHasLoadedPlans(true)
    }
    if (!hasLoadedServers) {
      fetchServers()
      setHasLoadedServers(true)
    }
    if (!hasLoadedApplications) {
      fetchApplications()
      setHasLoadedApplications(true)
    }
    if (!hasLoadedDevices) {
      fetchDevices()
      setHasLoadedDevices(true)
    }
    if (!hasLoadedPaymentMethods) {
      fetchPaymentMethods()
      setHasLoadedPaymentMethods(true)
    }
    if (!hasLoadedLeadSources) {
      fetchLeadSources()
      setHasLoadedLeadSources(true)
    }
  }

  useEffect(() => {
    const params: { [key: string]: string | number } = {
      page,
      limit,
    };

    if (searchTerm.trim()) {
      params.name = searchTerm.trim();
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params[key] = value;
      }
    });

    fetchClients(params);

  }, [searchTerm, filters, page, limit]);

  const planOptions = useMemo(() => {
    return plans.map(({ id, name }) => ({
      value: id,
      label: name,
    }))
  }, [plans])

  const serverOptions = useMemo(() => {
    return servers.map(({ id, name }) => ({
      value: id,
      label: name,
    }))
  }, [servers])

  const applicationOptions = useMemo(() => {
    return applications.map(({ id, name }) => ({
      value: id,
      label: name,
    }))
  }, [applications])

  const deviceOptions = useMemo(() => {
    return devices.map(({ id, name }) => ({
      value: id,
      label: name,
    }))
  }, [devices])

  const paymentMethodOptions = useMemo(() => {
    return paymentMethods.map(({ id, name }) => ({
      value: id,
      label: name,
    }))
  }, [paymentMethods])

  const leadSourceOptions = useMemo(() => {
    return leadSources.map(({ id, type }) => ({
      value: id,
      label: type,
    }))
  }, [leadSources])


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
        showToast("success", "Cliente atualizado", {
          description: "As alterações foram salvas com sucesso",
        })
      } else {
        await createClient(formData as ClientCreate)
        showToast("success", "Cliente criado", {
          description: "O novo cliente foi registrado no sistema",
        })
      }

      setShowAddModal(false)
      setEditingItem(null)
      fetchClients()
    } catch (error) {
      showToast("error", "Erro ao salvar", {
        description: "Ocorreu um erro ao salvar o cliente",
      })
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
        showToast("success", "Cliente excluido", {
          description: "O cliente foi excluido com sucesso",
        })
        setEditingItem(null)
        fetchClients()
      } else {
        console.error('Nenhum cliente selecionado para exclusão.')
      }
    } catch (error) {
      showToast("error", "Erro ao excluir", {
        description: "Ocorreu um erro ao excluir o cliente",
      })
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

  const handleOpenMessageModal = (client: ClientResponse) => {
    setEditingItem(client)
    setShowMessageModal(true)
  }

  const handlePaymentSubmit = async (data: ClientPayment) => {
    try {
      if (!editingItem) {
        throw new Error('Nenhum cliente selecionado para adicionar pagamento.')
      }
      await addPaymentToClient(editingItem.id, data)
      showToast("success", "Pagamento adicionado", {
        description: "O pagamento foi adicionado com sucesso",
      })
      setShowPaymentModal(false)
      setEditingItem(null)
      fetchClients()
    } catch (error) {
      showToast("error", "Erro ao adicionar pagamento", {
        description: "Ocorreu um erro ao adicionar o pagamento",
      })
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
    try {
      const res = await api.get('/clients/export/excel', {
        responseType: 'blob',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });
      showToast("success", "Excel gerado", {
        description: "O Excel foi gerado com sucesso",
      })
      const blob = res.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clientes_${new Date().toISOString()}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showToast("error", "Erro ao gerar Excel", {
        description: "Ocorreu um erro ao gerar o Excel",
      })
      console.error('Erro ao gerar Excel:', error)
    }
  }





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
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <GenericFilters
        searchPlaceholder="Buscar clientes..."
        onSearchChange={setSearchTerm}
        onFilterChange={(name, value) => setFilters((prev) => ({ ...prev, [name]: value }))}
        onFiltersOpen={handleFiltersOpen}
        onReset={() => {
          setSearchTerm('');
          setFilters({});
        }}
        filters={[
          {
            label: 'Plano',
            name: 'planId',
            options: planOptions,
          },
          {
            label: 'Servidor',
            name: 'serverId',
            options: serverOptions,
          },
          {
            label: 'Aplicação',
            name: 'applicationId',
            options: applicationOptions,
          },
          {
            label: 'Dispositivo',
            name: 'deviceId',
            options: deviceOptions,
          },
          {
            label: 'Método de Pagamento',
            name: 'paymentMethodId',
            options: paymentMethodOptions,
          },
          {
            label: 'Origem do Lead',
            name: 'leadSourceId',
            options: leadSourceOptions,
          },
        ]}
      />



      {/* Tabela */}
      <GenericTable<ClientResponse>
        data={filteredClients}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/clientes/${row.id}`)}
        isLoading={isLoading}
        error={error ?? undefined}
        pagination={{
          page,
          limit,
          total,
          onPageChange: setPage,
          onLimitChange: (newLimit) => {
            setLimit(newLimit)
            setPage(1)
          },
        }}
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
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                handleOpenMessageModal(client)
              }}>
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

      <SendMessageModal
        client={editingItem || undefined}
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
      />
    </div>
  )
}