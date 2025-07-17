'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { createItem } from '@/services/api-services'
import { cn } from '@/lib/utils'

interface ImportExcelModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function ImportExcelModal({ open, onOpenChange, onSuccess }: ImportExcelModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)


    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0]
            if (droppedFile.name.endsWith('.xlsx')) {
                setFile(droppedFile)
            }
        }
    }, [])

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0]
            if (selectedFile.name.endsWith('.xlsx')) {
                setFile(selectedFile)
            }
        }
    }, [])

    const handleRemoveFile = useCallback(() => {
        setFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }, [])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()

        if (!file) {
            console.error('Nenhum arquivo selecionado.')
            return
        }

        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await createItem('/clients/import/excel', formData)

            if (!res.ok) {
                throw new Error(await res.text())
            }

            setFile(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }

            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            console.error('Erro ao importar arquivo:', error)

        } finally {
            setIsLoading(false)
        }
    }, [file, onOpenChange, onSuccess])

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Importar Clientes via Excel"
            description="Envie um arquivo .xlsx para importar vários clientes de uma vez"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div
                    className={cn(
                        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                        isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-muted-foreground/50',
                        file ? 'border-green-500 bg-green-500/10' : ''
                    )}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx"
                        className="hidden"
                    />

                    <div className="flex flex-col items-center justify-center space-y-2">
                        <UploadIcon className="w-10 h-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            {file ? (
                                <span className="font-medium text-green-600">{file.name}</span>
                            ) : (
                                <>
                                    <span className="font-medium text-primary">Clique para selecionar</span> ou arraste e solte
                                </>
                            )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Apenas arquivos .xlsx são aceitos
                        </p>
                    </div>
                </div>

                {file && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <div className="flex items-center space-x-2">
                            <FileIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveFile}
                            className="text-red-500 hover:text-red-600"
                        >
                            Remover
                        </Button>
                    </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={!file || isLoading}
                    >
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