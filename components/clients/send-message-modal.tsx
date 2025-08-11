'use client'

import React, { useEffect, useState } from 'react'
import { createItem } from '@/services/api-services'
import { useMessageStore } from '@/store/messageStore'
import { ClientResponse } from '@/types/client'

import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface SendMessageModalProps {
    client: ClientResponse | undefined
    isOpen: boolean
    onClose: () => void
}

const SendMessageModal = ({ client, isOpen, onClose }: SendMessageModalProps) => {
    const { items, fetchItems } = useMessageStore()
    const [selectedTemplate, setSelectedTemplate] = useState<string>('')
    const [customMessage, setCustomMessage] = useState<string>('')

    useEffect(() => {
        fetchItems()
    }, [])

    const handleSendMessage = async () => {
        const messageToSend =
            selectedTemplate && !customMessage
                ? items.find(t => t.id === selectedTemplate)?.content || ''
                : customMessage

        if (!messageToSend.trim()) {
            alert('Digite ou selecione uma mensagem.')
            return
        }

        try {
            const res = await createItem(`/send-message`, {
                to: client?.phone,
                message: messageToSend,
            })
            console.log('Mensagem enviada:', res)
            onClose()
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error)
        }
    }

    return (
        <Modal open={isOpen} onOpenChange={onClose} title={`Enviar mensagem para ${client?.name}`}>
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium">Selecionar template</label>
                    <Select
                        onValueChange={value => {
                            setSelectedTemplate(value)
                            setCustomMessage('')
                        }}
                        value={selectedTemplate}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Escolha um template" />
                        </SelectTrigger>
                        <SelectContent>
                            {items.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium">Mensagem personalizada</label>
                    <Textarea
                        value={customMessage}
                        onChange={e => {
                            setCustomMessage(e.target.value)
                            setSelectedTemplate('')
                        }}
                        placeholder="Digite sua mensagem..."
                        rows={4}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSendMessage}>Enviar</Button>
                </div>
            </div>
        </Modal>
    )
}

export default SendMessageModal
