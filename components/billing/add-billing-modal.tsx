"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AddBillingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddBillingModal({ open, onOpenChange }: AddBillingModalProps) {
  // Sample data - would come from API
  const messages = [
    { id: '1', name: 'Lembrete de Pagamento' },
    { id: '2', name: 'Boas-vindas' }
  ]

  const servers = [
    { id: '1', name: 'ELITE' },
    { id: '2', name: 'VIP' }
  ]

  const devices = [
    { id: '1', name: 'Smart TV' },
    { id: '2', name: 'TV Box' }
  ]

  const plans = [
    { id: '1', name: 'Mensal' },
    { id: '2', name: 'Trimestral' }
  ]

  const apps = [
    { id: '1', name: 'QuickPlayer' },
    { id: '2', name: 'IPTV Pro' }
  ]

  const paymentMethods = [
    { id: '1', name: 'PIX' },
    { id: '2', name: 'Cartão' }
  ]

  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange} 
      title="Nova Cobrança"
      maxWidth="3xl"
    >
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="advanced">Configurações Avançadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Nome da cobrança" />
            </div>
            
            <div className="space-y-2">
              <Label>Mensagem</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma mensagem" />
                </SelectTrigger>
                <SelectContent>
                  {messages.map(message => (
                    <SelectItem key={message.id} value={message.id}>
                      {message.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Servidor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um servidor" />
                </SelectTrigger>
                <SelectContent>
                  {servers.map(server => (
                    <SelectItem key={server.id} value={server.id}>
                      {server.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Dispositivo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um dispositivo" />
                </SelectTrigger>
                <SelectContent>
                  {devices.map(device => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Plano</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Aplicativo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um aplicativo" />
                </SelectTrigger>
                <SelectContent>
                  {apps.map(app => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intervalMin">Intervalo Mínimo</Label>
              <Input id="intervalMin" type="number" min="0" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="intervalMax">Intervalo Máximo</Label>
              <Input id="intervalMax" type="number" min="0" />
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Cobrança</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automática</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Situação do Cliente</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Período</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Dias</SelectItem>
                  <SelectItem value="months">Meses</SelectItem>
                  <SelectItem value="years">Anos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registrationPeriod">Período de Cadastro</Label>
              <Input id="registrationPeriod" type="number" min="0" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duePeriod">Período de Vencimento</Label>
              <Input id="duePeriod" type="number" min="0" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button>Salvar</Button>
      </div>
    </Modal>
  )
}