'use client'

import { Button } from '../ui/button'
import { RefreshCcw, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

interface WhatsAppSectionProps {
    isConnected: boolean
    state: string
    qrCodeBase64: string | null
    loading: boolean
    connectWpp: () => Promise<void>
    disconnectWpp: () => Promise<void>
    fetchStatus: () => Promise<void>
}

export const WhatsAppSection = ({
    isConnected,
    state,
    qrCodeBase64,
    loading,
    connectWpp,
    disconnectWpp,
    fetchStatus,
}: WhatsAppSectionProps) => {

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

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">Configurações do WhatsApp</h3>

            <div className="flex justify-between w-full items-center mb-4">
                {isConnected ? (
                    <Button variant="destructive" onClick={disconnectWpp} disabled={loading}>
                        {loading ? 'Desconectando...' : 'Desconectar'}
                    </Button>
                ) : (
                    <Button onClick={connectWpp} disabled={loading}>
                        {loading ? 'Conectando...' : 'Conectar'}
                    </Button>
                )}
                <button
                    onClick={fetchStatus}
                    disabled={loading}
                    className="ml-4 p-2 rounded-md hover:bg-muted transition-colors"
                >
                    <RefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {renderStatus()}

            {qrCodeBase64 && (
                <div className="mx-auto">
                    <p className="mb-2">Escaneie o QR Code:</p>
                    <img src={qrCodeBase64} alt="QR Code" className="max-w-xs" />
                </div>
            )}
        </div>
    )
}
