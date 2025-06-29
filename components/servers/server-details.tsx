'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    RefreshCw,
    Power,
    Settings,
    AlertCircle,
    ExternalLink,
} from 'lucide-react'
import { ServerResponse } from '@/types/server'

interface ServerDetailsProps {
    serverData: ServerResponse
}

export function ServerDetails({ serverData }: ServerDetailsProps) {
    const renderField = (value: any, isCurrency = false) => {
        if (value === null || value === undefined) return 'Não informado'
        if (isCurrency) return `R$ ${value.toFixed(2)}`
        return value
    }

    const renderUrlField = (url: string | null, label: string) => {
        if (!url) return null

        return (
            <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className="flex items-center gap-2">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium break-all text-blue-500 hover:underline flex items-center"
                    >
                        {url} <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Detalhes do Servidor</h1>
                {/* <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Atualizar Sessão
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        <Power className="w-4 h-4 mr-2" />
                        Reiniciar Servidor
                    </Button>
                </div> */}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg sm:text-xl font-bold">Informações do Servidor</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                            <AlertCircle className="h-4 w-4" />
                        </Button>
                        {/* <Button variant="outline" size="icon" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                            <Settings className="h-4 w-4" />
                        </Button> */}
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Nome do Servidor</p>
                            <p className="font-medium">{renderField(serverData.name)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Custo</p>
                            <p className="font-medium">{renderField(serverData.cost, true)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Data de Criação</p>
                            <p className="font-medium">
                                {new Date(serverData.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Última Atualização</p>
                            <p className="font-medium">
                                {new Date(serverData.updatedAt).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Créditos</p>
                            <p className="font-medium">{renderField(serverData.credits)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Sessão WhatsApp</p>
                            <Badge variant={serverData.whatsappSession ? 'default' : 'destructive'}>
                                {serverData.whatsappSession ? 'Ativa' : 'Inativa'}
                            </Badge>
                        </div>

                        {renderUrlField(serverData.panelLink ?? null, 'Link do Painel')}
                        {renderUrlField(serverData.androidAppUrl ?? null, 'Android App URL')}
                        {renderUrlField(serverData.androidAppUrlSec ?? null, 'Android App URL Secundária')}
                        {renderUrlField(serverData.iosAppUrl ?? null, 'iOS App URL')}
                        {renderUrlField(serverData.lgAppUrl ?? null, 'LG App URL')}
                        {renderUrlField(serverData.rokuAppUrl ?? null, 'Roku App URL')}
                        {renderUrlField(serverData.samsungAppUrl ?? null, 'Samsung App URL')}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}