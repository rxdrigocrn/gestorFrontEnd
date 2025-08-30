'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLogStore } from '@/store/logsStore'
import { Pagination } from '@/components/table/Pagination'

export default function LogsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [actionTypeFilter, setActionTypeFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const {
        items: logs,
        total,
        isLoading: loading,
        fetchItems,
    } = useLogStore()


    const hasFilters = searchTerm || actionTypeFilter !== 'all'

    useEffect(() => {
        const query: Record<string, any> = {
            page: currentPage,
            limit: itemsPerPage,
        }

        if (searchTerm) query.search = searchTerm
        if (actionTypeFilter !== 'all') query.actionType = actionTypeFilter

        fetchItems(query)
    }, [searchTerm, actionTypeFilter, currentPage, itemsPerPage])


    const resetFilters = () => {
        setSearchTerm('')
        setActionTypeFilter('all')
        setCurrentPage(1)
    }

    const getActionTypeBadge = (actionType: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            create: 'default',
            update: 'secondary',
            delete: 'destructive',
            login: 'outline',
            system: 'outline',
        }

        const labels: Record<string, string> = {
            create: 'Criação',
            update: 'Atualização',
            delete: 'Exclusão',
            login: 'Login',
            system: 'Sistema',
        }

        return (
            <Badge variant={variants[actionType] || 'outline'}>
                {labels[actionType] || actionType}
            </Badge>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="mb-3">Registros do Sistema</CardTitle>
                            <CardDescription>
                                Histórico de atividades
                            </CardDescription>
                        </div>
                        {hasFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                                className="flex items-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                Limpar filtros
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <Input
                            placeholder="Pesquisar logs..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="max-w-md"
                        />
                        {/* <Select
                            value={actionTypeFilter}
                            onValueChange={(value) => {
                                setActionTypeFilter(value)
                                setCurrentPage(1)
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar por ação" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas ações</SelectItem>
                                <SelectItem value="create">Criações</SelectItem>
                                <SelectItem value="update">Atualizações</SelectItem>
                                <SelectItem value="delete">Exclusões</SelectItem>
                                <SelectItem value="login">Logins</SelectItem>
                                <SelectItem value="system">Sistema</SelectItem>
                            </SelectContent>
                        </Select> */}
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead className="w-[120px]">Ação</TableHead> */}
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Usuário</TableHead>
                                    <TableHead className="text-right w-[180px]">Data/Hora</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!loading && logs.length > 0 ? (
                                    logs.map((log) => (
                                        <TableRow key={log.id}>
                                            {/* <TableCell>{getActionTypeBadge(log?.actionType)}</TableCell> */}
                                            <TableCell className="max-w-[300px]">
                                                <div className="line-clamp-2">
                                                    {log.description}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>
                                                            {log.user?.name
                                                                ?.split(' ')
                                                                .map((n) => n[0])
                                                                .join('')
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{log.user?.name}</p>
                                                       
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm', {
                                                    locale: ptBR,
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            {loading ? 'Carregando logs...' : (
                                                hasFilters ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span>Nenhum registro encontrado com os filtros atuais</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={resetFilters}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <X className="h-4 w-4" />
                                                            Limpar filtros
                                                        </Button>
                                                    </div>
                                                ) : 'Nenhum registro encontrado'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {total > itemsPerPage && (
                        <Pagination
                            page={currentPage}
                            limit={itemsPerPage}
                            total={total}
                            onPageChange={setCurrentPage}
                            onLimitChange={setItemsPerPage}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
