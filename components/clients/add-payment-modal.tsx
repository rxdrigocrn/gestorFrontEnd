'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface AddPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPaymentModal({ open, onOpenChange }: AddPaymentModalProps) {
  const [dueDate, setDueDate] = useState<Date>()
  const [paymentDate, setPaymentDate] = useState<Date>(new Date())

  const plans = [
    { id: '1', name: 'Mensal', value: 49.90 },
    { id: '2', name: 'Trimestral', value: 139.90 },
    { id: '3', name: 'Semestral', value: 269.90 },
    { id: '4', name: 'Anual', value: 499.90 }
  ]

  const paymentMethods = [
    { id: '1', name: 'PIX' },
    { id: '2', name: 'Cartão de Crédito' },
    { id: '3', name: 'Transferência Bancária' }
  ]

  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange} 
      title="Adicionar Pagamento"
      maxWidth="2xl"
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nova Data de Vencimento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueTime">Horário de Vencimento</Label>
            <Input id="dueTime" type="time" />
          </div>
          
          <div className="space-y-2">
            <Label>Plano</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar plano" />
              </SelectTrigger>
              <SelectContent>
                {plans.map(plan => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - R$ {plan.value.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input id="amount" type="number" step="0.01" placeholder="0,00" />
          </div>
          
          <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar forma de pagamento" />
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
          
          <div className="space-y-2">
            <Label htmlFor="creditCost">Custo de Créditos</Label>
            <Input id="creditCost" type="number" step="0.01" placeholder="0,00" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cost">Custo</Label>
            <Input id="cost" type="number" step="0.01" placeholder="0,00" />
          </div>
          
          <div className="space-y-2">
            <Label>Data do Pagamento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !paymentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {paymentDate ? format(paymentDate, "PPP") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={paymentDate}
                  onSelect={setPaymentDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea id="notes" placeholder="Observações adicionais..." />
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Atualizar Dados do Cliente</Label>
            <RadioGroup defaultValue="no">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="updateClient-yes" />
                <Label htmlFor="updateClient-yes">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="updateClient-no" />
                <Label htmlFor="updateClient-no">Não</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Enviar Mensagem</Label>
            <RadioGroup defaultValue="yes">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="sendMessage-yes" />
                <Label htmlFor="sendMessage-yes">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="sendMessage-no" />
                <Label htmlFor="sendMessage-no">Não</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button>Salvar Pagamento</Button>
      </div>
    </Modal>
  )
}