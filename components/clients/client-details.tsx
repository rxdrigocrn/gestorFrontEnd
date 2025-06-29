'use client'

import { useState } from 'react'
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
  DollarSign
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { AddPaymentModal } from "@/components/clients/add-payment-modal"
import { ClientResponse } from '@/types/client'

interface ClientDetailsProps {
  clientData: ClientResponse
}

export function ClientDetails({ clientData }: ClientDetailsProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const renderField = (value: any, isDate = false) => {
    if (!value) return 'Não informado'
    if (isDate && value instanceof Date) return value.toLocaleDateString()
    return value
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
            onClick={() => setShowPaymentModal(true)}
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
              <Button variant="outline" size="icon" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                <AlertCircle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
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
                {clientData.dueDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Vencimento</p>
                    <p className="font-medium break-words">{renderField(clientData.dueDate, true)}</p>
                  </div>
                )}
                {clientData.leadSourceId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Forma de Captação</p>
                    <p className="font-medium break-words">{renderField(clientData.leadSourceId)}</p>
                  </div>
                )}
                {clientData.serverId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Servidor</p>
                    <p className="font-medium break-words">{renderField(clientData.serverId)}</p>
                  </div>
                )}
                {clientData.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium break-words">{renderField(clientData.phone)}</p>
                  </div>
                )}
                {clientData.deviceId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Dispositivo</p>
                    <p className="font-medium break-words">{renderField(clientData.deviceId)}</p>
                  </div>
                )}
                {clientData.applicationId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Aplicativo</p>
                    <p className="font-medium break-words">{renderField(clientData.applicationId)}</p>
                  </div>
                )}
                {clientData.planId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Plano</p>
                    <p className="font-medium break-words">{renderField(clientData.planId)}</p>
                  </div>
                )}
                {clientData.amount && (
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Combinado</p>
                    <p className="font-medium break-words">R$ {renderField(clientData.amount)}</p>
                  </div>
                )}
                {clientData.paymentMethodId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                    <p className="font-medium break-words">{renderField(clientData.paymentMethodId)}</p>
                  </div>
                )}
                {clientData.screens && (
                  <div>
                    <p className="text-sm text-muted-foreground">Telas</p>
                    <p className="font-medium break-words">{renderField(clientData.screens)}</p>
                  </div>
                )}
                {clientData.dueDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                    <p className="font-medium break-words">{renderField(clientData.dueDate, true)}</p>
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
          <Card>
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
          </Card>

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

      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {clientData?.payments?.length > 0 ? (
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Plano</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Valor</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Forma De Pagamento</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Custo</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Créditos Gastos</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Telas</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Data Pagamento</th>
                    <th className="h-12 px-4 text-right align-middle font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientData.payments.map(payment => (
                    <tr key={payment.id} className="border-b">
                      <td className="p-4">{renderField(payment.id)}</td>
                      <td className="p-4">{renderField(payment.plan)}</td>
                      <td className="p-4">R$ {renderField(payment.amount)}</td>
                      <td className="p-4">{renderField(payment.paymentMethod)}</td>
                      <td className="p-4">R$ {renderField(payment.cost)}</td>
                      <td className="p-4">{renderField(payment.creditsSpent)}</td>
                      <td className="p-4">{renderField(payment.screens)}</td>
                      <td className="p-4">{renderField(payment.paymentDate, true)}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="destructive" size="sm">Excluir</Button>
                        </div>
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
      </Card> */}

      <AddPaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
      />
    </div>
  )
}