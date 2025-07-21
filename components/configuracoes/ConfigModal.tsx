import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/modal'
import { api } from '@/services/api'
import { Button } from '../ui/button'
import { RefreshCcw } from 'lucide-react'

interface ConfigModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

type ConfigSection = 'whatsapp' | 'mensagens' | 'pagamento' | 'outros'

const ConfigModal = ({ open, onOpenChange }: ConfigModalProps) => {
    const [activeSection, setActiveSection] = useState<ConfigSection>('whatsapp')
    const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null)
    const [connected, setConnected] = useState(false)
    const [loading, setLoading] = useState(false)

    // Função para buscar o status atual da sessão
    const fetchStatus = async () => {
        try {
            setLoading(true)
            const res = await api.get('/whatsapp-session/status')
            const status = res.data.status // adapte de acordo com o JSON retornado
            const qrBase64 = res.data.qrcode?.base64 || null

            if (status === 'connected') {
                setConnected(true)
                setQrCodeBase64(null) // já conectado, não precisa mostrar QR
            } else if (status === 'disconnected' || status === 'not_connected') {
                setConnected(false)
                setQrCodeBase64(null)
            } else if (status === 'waiting_qrcode' && qrBase64) {
                setConnected(false)
                setQrCodeBase64(qrBase64)
            }
        } catch (error) {
            console.error('Erro ao buscar status:', error)
            setConnected(false)
            setQrCodeBase64(null)
        } finally {
            setLoading(false)
        }
    }

    // Quando o modal abrir, buscar o status atual
    useEffect(() => {
        if (open) {
            fetchStatus()
        }
    }, [open])

    const connectWpp = async () => {
        try {
            setLoading(true)
            const res = await api.post("/whatsapp-session/connect")
            const qrBase64 = res.data.data.qrcode.base64
            if (qrBase64) {
                setQrCodeBase64(qrBase64)
                setConnected(false) // só estará conectado após escanear o QR e confirmar
            }
        } catch (err) {
            console.error(err)
            setConnected(false)
            setQrCodeBase64(null)
        } finally {
            setLoading(false)
        }
    }

    const disconnectWpp = async () => {
        try {
            setLoading(true)
            await api.delete("/whatsapp-session/logout")
            setConnected(false)
            setQrCodeBase64(null)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const renderContent = () => {
        switch (activeSection) {
            case 'whatsapp':
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Configurações do WhatsApp</h3>
                        <div className="flex justify-between w-full">
                            {!connected ? (
                                <Button onClick={connectWpp} disabled={loading} className="mb-4">
                                    {loading ? 'Conectando...' : 'Clique aqui para conectar seu WhatsApp'}
                                </Button>
                            ) : (
                                <Button variant="destructive" onClick={disconnectWpp} disabled={loading} className="mb-4">
                                    {loading ? 'Desconectando...' : 'Desconectar WhatsApp'}
                                </Button>
                            )}
                            <button onClick={disconnectWpp} disabled={loading} className="flex items-center justify-center text-white rounded">
                                <RefreshCcw className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="mx-auto">
                            {qrCodeBase64 && (
                                <div>
                                    <p className="mb-2">Escaneie o QR Code com o seu app WhatsApp para conectar:</p>
                                    <img src={qrCodeBase64} alt="QR Code para conexão WhatsApp" className="max-w-xs" />
                                </div>
                            )}
                            {connected && <p className="text-green-600">WhatsApp conectado com sucesso!</p>}
                        </div>
                    </div>
                )
            case 'mensagens':
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Mensagens Automáticas</h3>
                        <p className="text-sm text-muted-foreground">Configure as mensagens que serão enviadas automaticamente</p>
                    </div>
                )
            case 'pagamento':
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Configurações de Pagamento</h3>
                        <p className="text-sm text-muted-foreground">Defina as opções de pagamento disponíveis</p>
                    </div>
                )
            default:
                return <div className="text-sm text-muted-foreground">Selecione uma seção</div>
        }
    }

    const menuItemClass = (section: ConfigSection) =>
        `cursor-pointer px-4 py-2 rounded-md transition font-medium 
     ${activeSection === section
            ? 'bg-muted text-primary'
            : 'hover:bg-muted/60 text-muted-foreground'}`

    return (
        <Modal open={open} onOpenChange={onOpenChange} title="Configurações" maxWidth="4xl">
            <div className="flex flex-col md:flex-row gap-6 min-h-[300px]">
                {/* Sidebar */}
                <aside className="md:w-1/4 border-b md:border-b-0 md:border-r pr-0 md:pr-4 flex md:block">
                    {/* Mobile: Menu horizontal */}
                    <ul className="flex md:flex-col overflow-x-auto md:overflow-visible">
                        <li
                            className={menuItemClass('whatsapp')}
                            onClick={() => setActiveSection('whatsapp')}
                        >
                            WhatsApp
                        </li>
                        <li
                            className={menuItemClass('mensagens')}
                            onClick={() => setActiveSection('mensagens')}
                        >
                            Mensagens
                        </li>
                        <li
                            className={menuItemClass('pagamento')}
                            onClick={() => setActiveSection('pagamento')}
                        >
                            Pagamento
                        </li>
                    </ul>
                </aside>

                {/* Conteúdo */}
                <section className="flex-1 overflow-y-auto pr-2">
                    {renderContent()}
                </section>
            </div>
        </Modal>
    )
}

export default ConfigModal
