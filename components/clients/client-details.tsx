'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  AlertCircle,
  Edit2,
  Trash2,
  CreditCard,
  MessageCircle,
  Clock,
  Users,
  DollarSign,
  MoreVertical
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { AddPaymentModal } from "@/components/clients/add-payment-modal"
import { ClientCreate, ClientPayment, ClientResponse, ClientUpdate } from '@/types/client'
import { format, set } from 'date-fns'
import { ClientFormData } from '@/lib/schemas/clientFormSchema'
import { AddClientModal } from './add-client-modal'
import { useClientStore } from '@/store/clientStore'
import { ConfirmationDialog } from '../ui/confirmModal'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

interface ClientDetailsProps {
  clientData: ClientResponse
}

export function ClientDetails({ clientData }: ClientDetailsProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ClientResponse | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showPaymentDetail, setShowPaymentDetail] = useState(false)
  const [editingPayment, setEditingPayment] = useState<ClientPayment | null>(null)
  const [isDialogPayment, setIsDialogPayment] = useState(false);
  const router = useRouter()
  const payments: ClientPayment[] = clientData?.payments ?? [];

  const { fetchItems: fetchClients, items: clients, isLoading, error, createItem, updateItem, deleteItem, addPaymentToClient, updatePaymentToClient, deletePaymentToClient } = useClientStore()

  useEffect(() => {
    fetchClients()
  }, [])

  const renderField = (value: any, isDate = false) => {
    if (!value) return '-'
    if (isDate && value instanceof Date) return value.toLocaleDateString()
    return value
  }

  const handleSubmit = async (formData: ClientFormData) => {
    try {
      if (clientData.id) {
        await updateItem(clientData.id, formData as ClientUpdate)
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

  const handleEdit = () => {
    setEditingItem(clientData)
    setShowAddModal(true)
  }

  const handleDelete = async () => {
    try {
      await deleteItem(clientData.id)
      router.push('/clientes')
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao deletar cliente:', error)
      setIsDialogOpen(false);
    }
  }

  const handleAddPayment = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSubmit = async (data: ClientPayment) => {
    try {
      if (!clientData) {
        throw new Error('Nenhum cliente selecionado para adicionar pagamento.')
      }
      if (editingPayment && editingPayment.id) {
        await updatePaymentToClient(editingPayment.id, data as ClientPayment)
      } else {
        await addPaymentToClient(clientData.id, data)
      }
      setShowPaymentModal(false)
      setEditingPayment(null)
      setEditingItem(null)
      fetchClients()
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error)
    }
  }

  const handleModalChange = (isOpen: boolean) => {
    setShowAddModal(isOpen)

  }

  const handlePaymentModalChange = (isOpen: boolean) => {
    setShowPaymentModal(isOpen)

  }

  const viewDetails = (payment: ClientPayment) => {
    setEditingPayment(payment)
    setShowPaymentDetail(true)
  }

  const handleEditPayment = (payment: ClientPayment) => {
    setEditingPayment(payment)
    setShowPaymentModal(true)
  }



  const handleDeletePayment = async () => {
    try {
      if (editingPayment && editingPayment.id) {
        await deletePaymentToClient(editingPayment.id)
        setEditingPayment(null)
      } else {
        console.error('Nenhum cliente selecionado para exclusão.')
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
    }
  }

  const handleOpenDialog = (payment: ClientPayment) => {
    setIsDialogPayment(true);
    setEditingPayment(payment);
  }


  return (
    <div className="container mx-auto px-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Detalhes do Cliente</h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
            <MessageSquare className="w-4 h-4 mr-2" />
            Enviar Mensagem
          </Button>
          <Button
            variant="outline"
            className="flex-1 sm:flex-none bg-green-500/10 text-green-500 hover:bg-green-500/20"
            onClick={handleAddPayment}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Add Pagamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg sm:text-xl font-bold">Informações do Cliente</CardTitle>
            <div className="flex gap-2">
              {/* <Button variant="outline" size="icon" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                <AlertCircle className="h-4 w-4" />
              </Button> */}
              <Button variant="outline" size="icon" onClick={handleEdit} className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsDialogOpen(true)} className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          {clientData && (
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome do Cliente</p>
                  <p className="font-medium break-words">{renderField(clientData.name)}</p>
                </div>
                {clientData.username && (
                  <div>
                    <p className="text-sm text-muted-foreground">Usuário</p>
                    <p className="font-medium break-words">{clientData.username}</p>
                  </div>
                )}
                {clientData.expiresAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Vencimento</p>
                    <p className="font-medium break-words">{clientData.expiresAt ? format(new Date(clientData.expiresAt), 'dd/MM/yyyy') : 'N/A'}</p>
                  </div>
                )}
                {clientData?.leadSource?.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Forma de Captação</p>
                    <p className="font-medium break-words">{renderField(clientData.leadSource.description)}</p>
                  </div>
                )}
                {clientData.server && (
                  <div>
                    <p className="text-sm text-muted-foreground">Servidor</p>
                    <p className="font-medium break-words">{renderField(clientData.server.name)}</p>
                  </div>
                )}
                {clientData.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium break-words">{renderField(clientData.phone)}</p>
                  </div>
                )}
                {clientData.device?.name && (
                  <div>
                    <p className="text-sm text-muted-foreground">Dispositivo</p>
                    <p className="font-medium break-words">{renderField(clientData.device?.name)}</p>
                  </div>
                )}
                {clientData.application && (
                  <div>
                    <p className="text-sm text-muted-foreground">Aplicativo</p>
                    <p className="font-medium break-words">{renderField(clientData.application.name)}</p>
                  </div>
                )}
                {clientData.plan && (
                  <div>
                    <p className="text-sm text-muted-foreground">Plano</p>
                    <p className="font-medium break-words">{renderField(clientData.plan?.name)}</p>
                  </div>
                )}
                {clientData.paymentMethodId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                    <p className="font-medium break-words">{renderField(clientData.paymentMethod?.name)}</p>
                  </div>
                )}
                {clientData?.screens && (
                  <div>
                    <p className="text-sm text-muted-foreground">Telas</p>
                    <p className="font-medium break-words">{clientData?.screens}</p>
                  </div>
                )}
                {clientData.createdAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                    <p className="font-medium break-words">{renderField(clientData.createdAt ? format(new Date(clientData.createdAt), 'dd/MM/yyyy') : 'N/A')}</p>
                  </div>
                )}
                {clientData.status && (
                  <div>
                    <p className="text-sm text-muted-foreground">Situação</p>
                    <Badge variant="default" className="bg-green-500">
                      {renderField(clientData.status)}
                    </Badge>
                  </div>
                )}
                {clientData.mac && (
                  <div>
                    <p className="text-sm text-muted-foreground">MAC</p>
                    <p className="font-medium break-words">{renderField(clientData.mac)}</p>
                  </div>
                )}
                {clientData.deviceKey && (
                  <div>
                    <p className="text-sm text-muted-foreground">Device Key | OTP Code</p>
                    <p className="font-medium break-words">{renderField(clientData.deviceKey)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        <div className="space-y-6">
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            {clientData?.stats ? (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">LIV</p>
                    <p className="text-xl sm:text-2xl font-bold">{renderField(clientData.stats.livValue)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">LIV Indicados</p>
                    <p className="text-xl sm:text-2xl font-bold">{renderField(clientData.stats.livIndicados)}</p>
                  </div>
                </div>

                {clientData.stats.clientAge && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cliente há</span>
                      <span className="font-medium">{renderField(clientData.stats.clientAge)}</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                )}

                {clientData.stats.daysUntilDue && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Dias até vencimento</span>
                      <span className="font-medium">{renderField(clientData.stats.daysUntilDue)}</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                )}

                {clientData.stats.cost && (
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Custo</span>
                    <span className="text-lg sm:text-xl font-bold text-red-500">{renderField(clientData.stats.cost)}</span>
                  </div>
                )}
              </CardContent>
            ) : (
              <CardContent className="flex items-center justify-center">
                <p className="text-lg text-muted-foreground">Nenhuma Estatística encontrada</p>
              </CardContent>
            )}
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full text-sm sm:text-base">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button variant="outline" className="w-full text-sm sm:text-base">
                  <Clock className="w-4 h-4 mr-2" />
                  Histórico
                </Button>
                <Button variant="outline" className="w-full text-sm sm:text-base">
                  <Users className="w-4 h-4 mr-2" />
                  Indicados
                </Button>
                <Button variant="outline" className="w-full text-sm sm:text-base">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Faturas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {payments.length > 0 ? (
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left align-middle text-xs">Valor</th>
                    <th className="h-12 px-4 text-left align-middle text-xs">Data Pagamento</th>
                    <th className="h-12 px-4 text-left align-middle text-xs">Desconto</th>
                    <th className="h-12 px-4 text-left align-middle text-xs">Acréscimo</th>
                    <th className="h-12 px-4 text-left align-middle text-xs">Observações</th>
                    <th className="h-12 px-4 text-left align-middle text-xs">Enviar Recibo</th>
                    <th className="h-12 px-4 text-left align-middle text-xs">Renovar Cliente</th>
                    <th className="h-12 px-4 text-center align-middle text-xs">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id} className="border-b text-xs">
                      <td className="p-4">{`R$ ${renderField(payment.amount.toFixed(2))}`}</td>
                      <td className="p-4">{renderField(new Date(payment.paidAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))}</td>
                      <td className="p-4">{`R$ ${renderField(payment.discount.toFixed(2)) || 0}`}</td>
                      <td className="p-4">{`R$ ${renderField(payment.surcharge.toFixed(2)) || 0}`}</td>
                      <td className="p-4">{renderField(payment.notes)}</td>
                      <td className="p-4">{renderField(payment.sendReceipt ? 'Sim' : 'Não')}</td>
                      <td className="p-4">{renderField(payment.renewClient ? 'Sim' : 'Não')}</td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="bottom" align="end">
                            <DropdownMenuItem onClick={() => viewDetails(payment)}>Visualizar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditPayment(payment)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenDialog(payment)} className="text-destructive">Excluir</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">Nenhum pagamento encontrado</p>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        variant="destructive"
      />

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
          defaultValues={editingPayment || undefined}
        />
      )}

      <ConfirmationDialog
        isOpen={isDialogPayment}
        onOpenChange={setIsDialogPayment}
        onConfirm={handleDeletePayment}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este pagamento? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        variant="destructive"
      />
    </div>
  )
}