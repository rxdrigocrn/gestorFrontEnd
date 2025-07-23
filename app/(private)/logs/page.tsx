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
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination'
import { Filter, X } from 'lucide-react'
import { useState } from 'react'

// Dados mockados para exemplo
const mockLogs = Array.from({ length: 50 }, (_, i) => ({
    id: `log-${i + 1}`,
    description: [
        'O usuário admin criou um novo cliente',
        'O sistema atualizou as configurações',
        'Usuário teste fez login no sistema',
        'Registro de erro no processamento',
        'Backup automático realizado',
        'Atualização de permissões do usuário'
    ][Math.floor(Math.random() * 6)],
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
        name: ['Admin', 'Usuário Teste', 'Sistema', 'Backend'][Math.floor(Math.random() * 4)],
        email: ['admin@exemplo.com', 'teste@exemplo.com', 'sistema@exemplo.com'][Math.floor(Math.random() * 3)]
    },
    actionType: ['create', 'update', 'delete', 'login', 'system'][Math.floor(Math.random() * 5)]
}))

export default function LogsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [actionTypeFilter, setActionTypeFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Filtros client-side
    const filteredLogs = mockLogs.filter(log => {
        const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesActionType = actionTypeFilter === 'all' || log.actionType === actionTypeFilter

        return matchesSearch && matchesActionType
    })

    // Paginação
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

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

    const hasFilters = searchTerm || actionTypeFilter !== 'all'

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className='mb-3'>Registros do Sistema</CardTitle>
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
                        <Select
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
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">Ação</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Usuário</TableHead>
                                    <TableHead className="text-right w-[180px]">Data/Hora</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedLogs.length > 0 ? (
                                    paginatedLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>{getActionTypeBadge(log.actionType)}</TableCell>
                                            <TableCell className="max-w-[300px]">
                                                <div className="line-clamp-2">
                                                    {log.description}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>
                                                            {log.user.name
                                                                .split(' ')
                                                                .map((n) => n[0])
                                                                .join('')
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{log.user.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {log.user.email}
                                                        </p>
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
                                            {hasFilters ? (
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
                                            ) : (
                                                'Nenhum registro encontrado'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {totalPages > 1 && (
                        <Pagination className="mt-6">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (currentPage > 1) setCurrentPage(currentPage - 1)
                                        }}
                                        isActive={currentPage > 1}
                                    />
                                </PaginationItem>

                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum
                                    if (totalPages <= 5) {
                                        pageNum = i + 1
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i
                                    } else {
                                        pageNum = currentPage - 2 + i
                                    }

                                    return (
                                        <PaginationItem key={pageNum}>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setCurrentPage(pageNum)
                                                }}
                                                isActive={pageNum === currentPage}
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                                        }}
                                        isActive={currentPage < totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}