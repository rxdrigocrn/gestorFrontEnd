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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLogStore } from '@/store/logsStore'
import { Pagination } from '@/components/table/Pagination'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/store/userStore'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { DateRange } from "react-day-picker"


export default function LogsPage() {
    // const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(20)

    const { items: users, fetchItems: fetchUsers } = useUserStore()
    const [userId, setUserId] = useState('all')

    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

    const {
        items: logs,
        total,
        isLoading: loading,
        fetchItems,
    } = useLogStore()

    // Retirei search terms pois retirei a busca livre
    const hasFilters = userId !== 'all' || dateRange

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        const query: Record<string, any> = {
            page: currentPage,
            limit: itemsPerPage,
        }

        // if (searchTerm) query.search = searchTerm
        if (userId !== 'all') query.userId = userId
        if (dateRange?.from) query.startDate = dateRange.from.toISOString()
        if (dateRange?.to) query.endDate = dateRange.to.toISOString()

        fetchItems(query)
    }, [userId, dateRange, currentPage, itemsPerPage])
    // retirei searchterms da dependencia do useeffect

    const resetFilters = () => {
        // setSearchTerm('')
        setUserId('all')
        setDateRange(undefined)
        setCurrentPage(1)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="mb-3">Registros do Sistema</CardTitle>
                            <CardDescription>Histórico de atividades</CardDescription>
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
                    <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap justify-start">
                        {/* Busca livre */}
                        {/* <div className="flex flex-col gap-2">
                            <Label>Busca por Descrição:</Label>
                            <Input
                                placeholder="Pesquisar logs..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="max-w-md"
                            />
                        </div> */}

                        {/* Usuário */}
                        <div className="flex flex-col gap-2">
                            <Label>Usuário</Label>
                            <Select
                                value={userId}
                                onValueChange={(value) => {
                                    setUserId(value)
                                    setCurrentPage(1)
                                }}
                            >
                                <SelectTrigger className="w-full md:w-[220px]">
                                    <SelectValue placeholder="Selecionar usuário" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Período */}
                        <div className="flex flex-col gap-2">
                            <Label>Período</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full md:w-[260px] justify-start text-left font-normal',
                                            !dateRange && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange?.from
                                            ? dateRange.to
                                                ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(
                                                    dateRange.to,
                                                    'dd/MM/yyyy'
                                                )}`
                                                : format(dateRange.from, 'dd/MM/yyyy')
                                            : <span>Selecionar período</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={(range) => {
                                            setDateRange(range)
                                            setCurrentPage(1)
                                        }}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Usuário</TableHead>
                                    <TableHead className="text-right w-[180px]">Data/Hora</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    // Skeleton para logs
                                    Array.from({ length: itemsPerPage }).map((_, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                                                    <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="h-4 bg-muted rounded w-20 mx-auto animate-pulse" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : logs.length > 0 ? (
                                    logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="max-w-[300px]">
                                                <div className="line-clamp-2">{log.description}</div>
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
                                                {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
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
