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
    const [mode, setMode] = useState<'template' | 'custom'>('template')

    useEffect(() => {
        fetchItems()
    }, [])

    useEffect(() => {
        if (isOpen) {
            setSelectedTemplate('')
            setCustomMessage('')
            setMode('template')
        }
    }, [isOpen])

    const handleSendMessage = async () => {
        let messageToSend = ''
        if (mode === 'template') {
            if (!selectedTemplate) {
                alert('Selecione um template.')
                return
            }
            messageToSend = items.find(t => t.id === selectedTemplate)?.content || ''
        } else {
            if (!customMessage.trim()) {
                alert('Digite uma mensagem personalizada.')
                return
            }
            messageToSend = customMessage
        }

        try {
            const res = await createItem(`whatsapp-session/send-message`, {
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
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Modo de envio</label>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={`px-3 py-1 rounded ${mode === 'template' ? 'bg-primary text-white' : 'bg-muted'}`}
                            onClick={() => { setMode('template'); setCustomMessage('') }}
                        >
                            Template
                        </button>
                        <button
                            type="button"
                            className={`px-3 py-1 rounded ${mode === 'custom' ? 'bg-primary text-white' : 'bg-muted'}`}
                            onClick={() => { setMode('custom'); setSelectedTemplate('') }}
                        >
                            Mensagem personalizada
                        </button>
                    </div>
                </div>

                {mode === 'template' ? (
                    <div>
                        <label className="block mb-1 text-sm font-medium">Selecionar template</label>
                        <Select
                            onValueChange={value => setSelectedTemplate(value)}
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
                ) : (
                    <div>
                        <label className="block mb-1 text-sm font-medium">Mensagem personalizada</label>
                        <Textarea
                            value={customMessage}
                            onChange={e => setCustomMessage(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            rows={4}
                        />
                    </div>
                )}

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
