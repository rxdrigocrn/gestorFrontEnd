'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Modal } from '@/components/ui/modal'

interface AddServerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddServerModal({ open, onOpenChange }: AddServerModalProps) {
  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange} 
      title="Adicionar Novo Servidor"
      maxWidth="sm"
    >
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" placeholder="Nome do servidor" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="creditValue">Valor do Crédito</Label>
          <Input 
            id="creditValue" 
            placeholder="0.00"
            type="number"
            step="0.01"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="credits">Créditos (Opcional)</Label>
          <Input 
            id="credits" 
            placeholder="0"
            type="number"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Sessão WhatsApp</Label>
          <RadioGroup defaultValue="no">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="whatsapp-yes" />
              <Label htmlFor="whatsapp-yes">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="whatsapp-no" />
              <Label htmlFor="whatsapp-no">Não</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="panelLink">Link do Painel</Label>
          <Input id="panelLink" placeholder="https://" />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button>Salvar Servidor</Button>
      </div>
    </Modal>
  )
}