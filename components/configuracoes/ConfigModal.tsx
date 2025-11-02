'use client'
import React, { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../ui/modal'
import { Button } from '../ui/button'
import { api } from '@/services/api'
import { useSimpleToast } from '@/hooks/use-toast'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

import { useMessageStore } from '@/store/messageStore'
import { WhatsAppSection } from './WhatsappSession'
import { RevendasSection } from './RevendasSection'
import { FidelidadeSection } from './FidelidadeSection'
import { ArquivamentoSection } from './ArquivamentoSection'
import { MensagensSection } from './MensagensSection'

type ConfigSection = 'whatsapp' | 'mensagens' | 'pagamento' | 'revendas' | 'fidelidade' | 'arquivamento'

interface ConfigModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

// -----------------------------
// 🔸 SCHEMA ZOD
// -----------------------------
const settingsSchema = z.object({
    // Revendas
    resellerSubtractCredits: z.boolean().optional().nullable(),
    resellerLowCreditsWarning: z.boolean().optional().nullable(),
    resellerMinCreditsThreshold: z.coerce.number().min(0).optional().nullable(),

    // Pontos de Fidelidade
    loyaltyPointsEnabled: z.boolean().optional().nullable(),
    loyaltyPointsAllowDelays: z.boolean().optional().nullable(),
    loyaltyPointsDiscountPercent: z.coerce.number().min(0).optional().nullable(),
    loyaltyPointsNeeded: z.coerce.number().min(0).optional().nullable(),

    // Arquivamento Automático
    autoArchiveClients: z.boolean().optional().nullable(),
    autoArchiveClientDays: z.coerce.number().min(1).optional().nullable(),

    // Relações com templates
    paymentMessageTemplateId: z.string().uuid().optional().nullable(),
    resellerCreditMessageTemplateId: z.string().uuid().optional().nullable(),
    trialCreatedMessageTemplateId: z.string().uuid().optional().nullable(),
})

type SettingsFormData = z.infer<typeof settingsSchema>

const ConfigModal = ({ open, onOpenChange }: ConfigModalProps) => {
    const [activeSection, setActiveSection] = useState<ConfigSection>('whatsapp')
    const { items: messageTemplates, fetchItems: fetchMessageTemplates } = useMessageStore()
    const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null)
    const [state, setState] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const { showToast } = useSimpleToast()

    const form = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {},
    })

    const isConnected = state === 'connected' || state === 'open'

    // -----------------------------
    // 🔹 Fetch Configurações e Status WhatsApp
    // -----------------------------
    const fetchStatus = async () => {
        try {
            setLoading(true)
            const res = await api.get('/whatsapp-session/status')
            const status = res.data.instance.state
            const qrBase64 = res.data.qrcode?.base64 || null
            setState(status)
            if (status === 'waiting_qrcode' && qrBase64) setQrCodeBase64(qrBase64)
            else setQrCodeBase64(null)
        } catch (error) {
            console.error('Erro ao buscar status:', error)
            setQrCodeBase64(null)
            setState('error')
        } finally {
            setLoading(false)
        }
    }

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/organization-settings')
            form.reset(data)
        } catch (error) {
            console.error('Erro ao carregar configurações:', error)
        }
    }

    useEffect(() => {
        if (open) {
            fetchStatus()
            fetchSettings()
        }
    }, [open])

    useEffect(() => {
        if (open && activeSection === 'mensagens' && messageTemplates.length === 0) {
            fetchMessageTemplates()
        }
    }, [open, activeSection])

    // -----------------------------
    // 🔹 WhatsApp Actions
    // -----------------------------
    const connectWpp = async () => {
        try {
            setLoading(true)
            const res = await api.post('/whatsapp-session/connect')
            const qrBase64 = res.data.data?.qrcode?.base64 || res.data.data.base64 || null
            if (qrBase64) {
                setQrCodeBase64(qrBase64)
                setState('waiting_qrcode')
            }
            showToast('success', 'WhatsApp conectado', {
                description: 'O WhatsApp foi conectado com sucesso',
            })
        } catch (err) {
            showToast('error', 'Erro ao conectar', {
                description: 'Ocorreu um erro ao conectar o WhatsApp',
            })
            console.error('Erro ao conectar:', err)
            setQrCodeBase64(null)
            setState('error')
        } finally {
            setLoading(false)
        }
    }

    const disconnectWpp = async () => {
        try {
            setLoading(true)
            await api.delete('/whatsapp-session/logout')
            showToast('success', 'WhatsApp desconectado', {
                description: 'O WhatsApp foi desconectado com sucesso',
            })
            setQrCodeBase64(null)
            setState('close')
        } catch (err) {
            showToast('error', 'Erro ao desconectar', {
                description: 'Ocorreu um erro ao desconectar o WhatsApp',
            })
            console.error('Erro ao desconectar:', err)
            setState('error')
        } finally {
            setLoading(false)
        }
    }

    // -----------------------------
    // 🔹 Salvar Configurações
    // -----------------------------
    const onSubmit = async (data: SettingsFormData) => {
        try {
            setLoading(true)
            await api.patch('/organization-settings', data)
            showToast('success', 'Configurações salvas', {
                description: 'As configurações foram atualizadas com sucesso.',
            })
        } catch (error) {
            console.error('Erro ao salvar configurações:', error)
            showToast('error', 'Erro ao salvar', {
                description: 'Não foi possível salvar as configurações.',
            })
        } finally {
            setLoading(false)
        }
    }

    // -----------------------------
    // 🔹 Renderizadores
    // -----------------------------
    const renderStatus = () => {
        switch (state) {
            case 'connected':
            case 'open':
                return (
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Conectado</span>
                    </div>
                )
            case 'close':
                return (
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                        <XCircle className="h-4 w-4" />
                        <span>Desconectado</span>
                    </div>
                )
            case 'waiting_qrcode':
                return (
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Aguardando leitura do QR Code</span>
                    </div>
                )
            default:
                return (
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Verificando status...</span>
                    </div>
                )
        }
    }

    const onInvalid = (errors: any) => {
        console.log('Erros de validação:', errors)
    }

    const renderSection = () => {
        switch (activeSection) {
            case 'whatsapp':
                return (
                    <WhatsAppSection
                        isConnected={isConnected}
                        state={state}
                        qrCodeBase64={qrCodeBase64}
                        loading={loading}
                        connectWpp={connectWpp}
                        disconnectWpp={disconnectWpp}
                        fetchStatus={fetchStatus}
                    />
                )
            case 'revendas':
                return <RevendasSection form={form} />
            case 'fidelidade':
                return <FidelidadeSection form={form} />
            case 'arquivamento':
                return <ArquivamentoSection form={form} />
            case 'mensagens':
                return <MensagensSection form={form} messageTemplates={messageTemplates} />
            default:
                return <p>Selecione uma seção</p>
        }
    }


    const menuItemClass = (section: ConfigSection) =>
        `cursor-pointer px-4 py-2 rounded-md transition font-medium 
   ${activeSection === section ? 'bg-muted text-primary' : 'hover:bg-muted/60 text-muted-foreground'}`


    return (
        <Modal open={open} onOpenChange={onOpenChange} title="Configurações" maxWidth="5xl">
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
                <div className="flex flex-col md:flex-row gap-6 min-h-[400px]">
                    <aside className="md:w-1/4 border-b md:border-b-0 md:border-r pr-0 md:pr-4 flex md:block">
                        <ul className="flex md:flex-col overflow-x-auto md:overflow-visible">
                            <li className={menuItemClass('whatsapp')} onClick={() => setActiveSection('whatsapp')}>
                                WhatsApp
                            </li>
                            <li className={menuItemClass('revendas')} onClick={() => setActiveSection('revendas')}>
                                Revendas
                            </li>
                            <li className={menuItemClass('fidelidade')} onClick={() => setActiveSection('fidelidade')}>
                                Fidelidade
                            </li>
                            <li className={menuItemClass('arquivamento')} onClick={() => setActiveSection('arquivamento')}>
                                Arquivamento
                            </li>
                            <li className={menuItemClass('mensagens')} onClick={() => setActiveSection('mensagens')}>
                                Mensagens
                            </li>
                        </ul>
                    </aside>

                    <section className="flex-1 overflow-y-auto pr-2">{renderSection()}</section>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar alterações'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default ConfigModal
