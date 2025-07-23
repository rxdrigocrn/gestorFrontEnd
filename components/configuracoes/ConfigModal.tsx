import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/modal'
import { api } from '@/services/api'
import { Button } from '../ui/button'
import { RefreshCcw, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useSimpleToast } from '@/hooks/use-toast'

interface ConfigModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

type ConfigSection = 'whatsapp' | 'mensagens' | 'pagamento' | 'outros'

const ConfigModal = ({ open, onOpenChange }: ConfigModalProps) => {
    const [activeSection, setActiveSection] = useState<ConfigSection>('whatsapp')
    const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null)
    const [state, setState] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const { showToast } = useSimpleToast()

    const isConnected = state === 'connected' || state === 'open'

    const fetchStatus = async () => {
        try {
            setLoading(true)
            const res = await api.get('/whatsapp-session/status')
            const status = res.data.instance.state
            const qrBase64 = res.data.qrcode?.base64 || null
            setState(status)

            if (status === 'waiting_qrcode' && qrBase64) {
                setQrCodeBase64(qrBase64)
            } else {
                setQrCodeBase64(null)
            }
        } catch (error) {
            console.error('Erro ao buscar status:', error)
            setQrCodeBase64(null)
            setState('error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (open) fetchStatus()
    }, [open])

    const connectWpp = async () => {
        try {
            setLoading(true)
            const res = await api.post('/whatsapp-session/connect')
            const qrBase64 = res.data.data.qrcode.base64
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

    const renderStatus = () => {
        switch (state) {
            case 'connected':
            case 'open':
                return (
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Conectado - Você já está online no WhatsApp</span>
                    </div>
                )
            case 'disconnected':
            case 'not_connected':
            case 'close':
                return (
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                        <XCircle className="h-4 w-4" />
                        <span>Desconectado - Clique em conectar para iniciar</span>
                    </div>
                )
            case 'waiting_qrcode':
                return (
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Aguardando leitura do QR Code</span>
                    </div>
                )
            case 'error':
                return (
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                        <XCircle className="h-4 w-4" />
                        <span>Erro na conexão - Tente novamente</span>
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

    const renderContent = () => {
        if (activeSection === 'whatsapp') {
            return (
                <div>
                    <h3 className="text-xl font-semibold mb-2">Configurações do WhatsApp</h3>

                    <div className="flex justify-between w-full items-center mb-4">
                        {isConnected ? (
                            <div className="flex-1">
                                <Button
                                    variant="destructive"
                                    onClick={disconnectWpp}
                                    disabled={loading}
                                    className="w-full md:w-auto"
                                >
                                    {loading ? 'Desconectando...' : 'Desconectar WhatsApp'}
                                </Button>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Você já está conectado. Use este botão apenas se quiser desconectar.
                                </p>
                            </div>
                        ) : (
                            <Button
                                onClick={connectWpp}
                                disabled={loading}
                                className="w-full md:w-auto"
                            >
                                {loading ? 'Conectando...' : 'Conectar WhatsApp'}
                            </Button>
                        )}

                        <button
                            onClick={disconnectWpp}
                            disabled={loading}
                            className="ml-4 p-2 rounded-md hover:bg-muted transition-colors"
                            title="Atualizar status"
                        >
                            <RefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {renderStatus()}

                    {qrCodeBase64 && (
                        <div className="mx-auto">
                            <p className="mb-2">Escaneie o QR Code com o seu app WhatsApp para conectar:</p>
                            <img src={qrCodeBase64} alt="QR Code para conexão WhatsApp" className="max-w-xs" />
                        </div>
                    )}
                </div>
            )
        }

        if (activeSection === 'mensagens') {
            return (
                <div>
                    <h3 className="text-xl font-semibold mb-2">Mensagens Automáticas</h3>
                    <p className="text-sm text-muted-foreground">Configure as mensagens que serão enviadas automaticamente</p>
                </div>
            )
        }

        if (activeSection === 'pagamento') {
            return (
                <div>
                    <h3 className="text-xl font-semibold mb-2">Configurações de Pagamento</h3>
                    <p className="text-sm text-muted-foreground">Defina as opções de pagamento disponíveis</p>
                </div>
            )
        }

        return <div className="text-sm text-muted-foreground">Selecione uma seção</div>
    }

    const menuItemClass = (section: ConfigSection) =>
        `cursor-pointer px-4 py-2 rounded-md transition font-medium 
     ${activeSection === section
            ? 'bg-muted text-primary'
            : 'hover:bg-muted/60 text-muted-foreground'}`

    return (
        <Modal open={open} onOpenChange={onOpenChange} title="Configurações" maxWidth="4xl">
            <div className="flex flex-col md:flex-row gap-6 min-h-[300px]">
                <aside className="md:w-1/4 border-b md:border-b-0 md:border-r pr-0 md:pr-4 flex md:block">
                    <ul className="flex md:flex-col overflow-x-auto md:overflow-visible">
                        <li className={menuItemClass('whatsapp')} onClick={() => setActiveSection('whatsapp')}>WhatsApp</li>
                        <li className={menuItemClass('mensagens')} onClick={() => setActiveSection('mensagens')}>Mensagens</li>
                        <li className={menuItemClass('pagamento')} onClick={() => setActiveSection('pagamento')}>Pagamento</li>
                    </ul>
                </aside>

                <section className="flex-1 overflow-y-auto pr-2">
                    {renderContent()}
                </section>
            </div>
        </Modal>
    )
}

export default ConfigModal
