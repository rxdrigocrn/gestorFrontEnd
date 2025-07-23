'use client'

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
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'
import { useEffect, useState } from 'react'
import { fetchAll } from '@/services/api-services'
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { DateRange } from 'react-day-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Filter, X } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface Payment {
  id: string
  amount: number
  netAmount: number
  discount: number
  surcharge: number
  createdAt: string
  paidAt: string
  status: 'PAID' | 'PENDING' | 'FAILED'
  paymentMethodId: string
  client: {
    name: string
  }
}

interface PaymentsResponse {
  data: Payment[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function PaymentsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<PaymentsResponse | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const [statusFilter, setStatusFilter] = useState<'all' | Payment['status']>('all')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1
  const limit = 10

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
          ...(statusFilter !== 'all' && { status: statusFilter }),
          ...(dateRange?.from && { from: dateRange.from.toISOString() }),
          ...(dateRange?.to && { to: dateRange.to.toISOString() }),
          ...(paymentMethodFilter !== 'all' && { paymentMethodId: paymentMethodFilter }),
        })

        const data = await fetchAll(`/payments?${queryParams.toString()}`)
        setPayments({
          ...data,
          totalPages: Math.ceil(data.total / limit)
        })
      } catch (error) {
        console.error('Erro ao carregar pagamentos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [page, debouncedSearchTerm, statusFilter, dateRange, paymentMethodFilter])

  const handlePageChange = (newPage: number) => {
    router.push(`/payments?page=${newPage}`)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateRange(undefined)
    setPaymentMethodFilter('all')
  }

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-500">Pago</Badge>
      case 'PENDING':
        return <Badge variant="outline">Pendente</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Falhou</Badge>
      default:
        return null
    }
  }

  const hasActiveFilters = 
    searchTerm || 
    statusFilter !== 'all' || 
    dateRange || 
    paymentMethodFilter !== 'all'

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>
                Todos os pagamentos registrados no sistema
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium">Busca</label>
                <Input
                  placeholder="Pesquisar por cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={statusFilter}
                  onValueChange={(value: 'all' | Payment['status']) => setStatusFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos status</SelectItem>
                    <SelectItem value="PAID">Pago</SelectItem>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="FAILED">Falhou</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                            {format(dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        <span>Selecione um período</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Método de Pagamento</label>
                <Select
                  value={paymentMethodFilter}
                  onValueChange={setPaymentMethodFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos métodos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos métodos</SelectItem>
                    <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                    <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={resetFilters}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-6 w-32" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-6 w-24" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-6 w-32" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-6 w-20" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-6 w-20" />
                      </td>
                    </tr>
                  ))
                ) : payments?.data?.length ? (
                  payments.data.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{payment.client.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold">{formatCurrency(payment.amount)}</div>
                        {payment.discount > 0 && (
                          <div className="text-xs text-red-500">
                            -{formatCurrency(payment.discount)}
                          </div>
                        )}
                        {payment.surcharge > 0 && (
                          <div className="text-xs text-green-500">
                            +{formatCurrency(payment.surcharge)}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Líquido: {formatCurrency(payment.netAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm', {
                            locale: ptBR,
                          })}
                        </div>
                        {payment.paidAt && (
                          <div className="text-xs text-muted-foreground">
                            Pago em: {format(new Date(payment.paidAt), 'dd/MM/yyyy HH:mm')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/payments/${payment.id}`)}
                        >
                          Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      {hasActiveFilters ? (
                        <div className="flex flex-col items-center gap-2">
                          <span>Nenhum pagamento encontrado com os filtros atuais</span>
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
                        'Nenhum pagamento encontrado'
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {payments && payments.total > limit && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (page > 1) handlePageChange(page - 1)
                      }}
                      isActive={page > 1}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, payments.totalPages) }, (_, i) => {
                    let pageNum
                    if (payments.totalPages <= 5) {
                      pageNum = i + 1
                    } else if (page <= 3) {
                      pageNum = i + 1
                    } else if (page >= payments.totalPages - 2) {
                      pageNum = payments.totalPages - 4 + i
                    } else {
                      pageNum = page - 2 + i
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(pageNum)
                          }}
                          isActive={pageNum === page}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {payments.totalPages > 5 && page < payments.totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (page < payments.totalPages) handlePageChange(page + 1)
                      }}
                      isActive={page < payments.totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}