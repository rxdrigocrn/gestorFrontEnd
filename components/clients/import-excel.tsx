'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { createItem } from '@/services/api-services'
import { cn } from '@/lib/utils'
import { useSimpleToast } from '@/hooks/use-toast'

interface ImportExcelModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function ImportExcelModal({ open, onOpenChange, onSuccess }: ImportExcelModalProps) {
    const { showToast } = useSimpleToast()
    const [clientsFile, setClientsFile] = useState<File | null>(null)
    const [isDraggingClients, setIsDraggingClients] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const clientsFileInputRef = useRef<HTMLInputElement>(null)

    const commonPrevent = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragEnter = useCallback(() => (e: React.DragEvent<HTMLDivElement>) => {
        commonPrevent(e)
        if (isLoading) return
        setIsDraggingClients(true)
    }, [isLoading])

    const handleDragLeave = useCallback(() => (e: React.DragEvent<HTMLDivElement>) => {
        commonPrevent(e)
        if (isLoading) return
        setIsDraggingClients(false)
    }, [isLoading])

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        commonPrevent(e)
    }, [])

    const handleDrop = useCallback(() => (e: React.DragEvent<HTMLDivElement>) => {
        commonPrevent(e)
        if (isLoading) return
        setIsDraggingClients(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0]
            if (droppedFile.name.endsWith('.xlsx')) {
                setClientsFile(droppedFile)
            }
        }
    }, [isLoading])

    

    const handleClientsFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (isLoading) return
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0]
            if (selectedFile.name.endsWith('.xlsx')) {
                setClientsFile(selectedFile)
            }
        }
    }, [isLoading])

    const handleRemoveClientsFile = useCallback(() => {
        if (isLoading) return
        setClientsFile(null)
        if (clientsFileInputRef.current) clientsFileInputRef.current.value = ''
    }, [isLoading])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        if (isLoading) return

        if (!clientsFile) {
            console.error('Arquivo clientsFile é obrigatório.')
            return
        }

        setIsLoading(true)
        // close modal immediately to avoid double submit and show an info toast
        onOpenChange(false)
        showToast('info', 'Importação iniciada', {
            description: 'Aguarde um momento, estamos processando a planilha',
            duration: 10000,
            position: 'top-right',
        })

        try {
            const formData = new FormData()
            formData.append('clientsFile', clientsFile as Blob)

            const res = await createItem('/clients/import/excel', formData)

            setClientsFile(null)
            if (clientsFileInputRef.current) clientsFileInputRef.current.value = ''
            showToast('success', 'Importação enviada', { description: 'Arquivo enviado com sucesso. Processamento em andamento.' })
            onSuccess?.()
        } catch (error) {
            console.error('Erro ao importar arquivo:', error)
            showToast('error', 'Erro na importação', { description: 'Ocorreu um erro ao enviar o arquivo. Tente novamente.' })
        } finally {
            setIsLoading(false)
        }
    }, [clientsFile, isLoading, onOpenChange, onSuccess])

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Importar Clientes via Excel"
            description="Envie um arquivo .xlsx para importar vários clientes de uma vez"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {/* Clients file dropzone */}
                    <div
                        className={cn(
                            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                            isDraggingClients ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-muted-foreground/50',
                            clientsFile ? 'border-green-500 bg-green-500/10' : '',
                            isLoading && 'opacity-60 pointer-events-none'
                        )}
                        onDragEnter={handleDragEnter()}
                        onDragLeave={handleDragLeave()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop()}
                        onClick={() => !isLoading && clientsFileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={clientsFileInputRef}
                            onChange={handleClientsFileChange}
                            accept=".xlsx"
                            className="hidden"
                            disabled={isLoading}
                        />

                        <div className="flex flex-col items-center justify-center space-y-2">
                            <UploadIcon className="w-10 h-10 text-muted-foreground" />
                            <Label className="text-sm">Arquivo de Clientes (clientsFile)</Label>
                            <p className="text-sm text-muted-foreground">
                                {clientsFile ? (
                                    <span className="font-medium text-green-600">{clientsFile.name}</span>
                                ) : (
                                    <>
                                        <span className="font-medium text-primary">Clique para selecionar</span> ou arraste e solte
                                    </>
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground">Apenas arquivos .xlsx são aceitos</p>
                        </div>
                    </div>

                    {/* second column intentionally left empty (payments file removed) */}
                </div>

                {/* Selected files summary */}
                {clientsFile && (
                    <div className="space-y-2">
                        {clientsFile && (
                            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                                <div className="flex items-center space-x-2">
                                    <FileIcon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{clientsFile.name}</span>
                                    <span className="text-xs text-muted-foreground">{(clientsFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={handleRemoveClientsFile} disabled={isLoading} className="text-red-500 hover:text-red-600">Remover</Button>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancelar</Button>
                    <Button type="submit" disabled={!clientsFile || isLoading}>
                        {isLoading ? 'Importando...' : 'Importar'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    )
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    )
}
