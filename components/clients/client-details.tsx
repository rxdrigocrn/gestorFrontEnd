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

interface ClientDetailsProps {
  clientData: {
    id: string
    name: string
    username: string
    dueDate: string
    source: string
    server: string
    phone: string
    device: string
    application: string
    plan: string
    amount: string
    paymentMethod: string
    screens: string
    registrationDate: string
    status: string
    mac: string
    deviceKey: string
    notes: string
    stats: {
      livValue: string
      livIndicados: string
      indicados: string
      clientAge: string
      daysUntilDue: string
      cost: string
    }
  }
}

export function ClientDetails({ clientData }: ClientDetailsProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

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
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome do Cliente</p>
                <p className="font-medium break-words">{clientData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuário</p>
                <p className="font-medium break-words">{clientData.username}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vencimento</p>
                <p className="font-medium break-words">{clientData.dueDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Forma de Captação</p>
                <p className="font-medium break-words">{clientData.source}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Servidor</p>
                <p className="font-medium break-words">{clientData.server}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium break-words">{clientData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dispositivo</p>
                <p className="font-medium break-words">{clientData.device}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aplicativo</p>
                <p className="font-medium break-words">{clientData.application}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plano</p>
                <p className="font-medium break-words">{clientData.plan}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Combinado</p>
                <p className="font-medium break-words">R$ {clientData.amount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                <p className="font-medium break-words">{clientData.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telas</p>
                <p className="font-medium break-words">{clientData.screens}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                <p className="font-medium break-words">{clientData.registrationDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Situação</p>
                <Badge variant="default" className="bg-green-500">
                  {clientData.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MAC</p>
                <p className="font-medium break-words">{clientData.mac}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Device Key | OTP Code</p>
                <p className="font-medium break-words">{clientData.deviceKey}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">LIV</p>
                  <p className="text-xl sm:text-2xl font-bold">{clientData.stats.livValue}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">LIV Indicados</p>
                  <p className="text-xl sm:text-2xl font-bold">{clientData.stats.livIndicados}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cliente há</span>
                  <span className="font-medium">{clientData.stats.clientAge}</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Dias até vencimento</span>
                  <span className="font-medium">{clientData.stats.daysUntilDue}</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Custo</span>
                <span className="text-lg sm:text-xl font-bold text-red-500">{clientData.stats.cost}</span>
              </div>
            </CardContent>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
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
                <tr className="border-b">
                  <td className="p-4">2715100</td>
                  <td className="p-4">Mensal</td>
                  <td className="p-4">R$ 49.90</td>
                  <td className="p-4">PIX</td>
                  <td className="p-4">R$ 13.00</td>
                  <td className="p-4">1.0</td>
                  <td className="p-4">1</td>
                  <td className="p-4">2025-04-23</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="destructive" size="sm">Excluir</Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AddPaymentModal 
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
      />
    </div>
  )
}