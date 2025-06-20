"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'

interface AddMessageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMessageModal({ open, onOpenChange }: AddMessageModalProps) {
  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange} 
      title="Nova Mensagem"
    >
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" placeholder="Nome da mensagem" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Conteúdo</Label>
          <Textarea 
            id="content" 
            placeholder="Digite o conteúdo da mensagem..."
            className="min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Variáveis disponíveis:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside">
            <li>{`{cliente}`} - Nome do cliente</li>
            <li>{`{dias_vencimento}`} - Dias até o vencimento</li>
            <li>{`{valor}`} - Valor da cobrança</li>
            <li>{`{data_vencimento}`} - Data de vencimento</li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button>Salvar</Button>
      </div>
    </Modal>
  )
}