'use client'

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePaymentStore } from '@/store/paymentsStore'
import { Pagination } from '@/components/table/Pagination'
import { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { usePaymentMethodStore } from '@/store/paymentMethodStore'
import { cn } from '@/lib/utils'
import { useClientStore } from '@/store/clientStore'
import { PaymentMethodResponse } from '@/types/paymentMethod'
import { SearchClientTable } from '@/components/table/SearchTableClient'
import { ClientResponse } from '@/types/client'

export default function PaymentsPage() {
  const [status, setStatus] = useState('all')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { items: paymentMethods, fetchItems: fetchPaymentMethods } = usePaymentMethodStore()
  const { items: payments, total, isLoading, fetchItems } = usePaymentStore()
  const [paymentMethodId, setPaymentMethodId] = useState('all')

  const [clientModalOpen, setClientModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null)
  const [clientId, setClientId] = useState<string | number>('all')

  const hasFilters = clientId !== 'all' || status !== 'all'

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  useEffect(() => {
    const query: Record<string, any> = {
      page: currentPage,
      limit: itemsPerPage,
    }

    if (clientId !== 'all') query.clientId = clientId
    if (status !== 'all') query.status = status
    if (paymentMethodId !== 'all') query.paymentMethodId = paymentMethodId
    if (dateRange?.from) query.startDate = dateRange.from.toISOString()
    if (dateRange?.to) query.endDate = dateRange.to.toISOString()

    fetchItems(query)
  }, [clientId, status, paymentMethodId, dateRange, currentPage, itemsPerPage])

  const resetFilters = () => {
    setClientId('all')
    setStatus('all')
    setPaymentMethodId('all')
    setDateRange(undefined)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="mb-3">Pagamentos</CardTitle>
              <CardDescription>Histórico de pagamentos realizados</CardDescription>
            </div>
            {hasFilters ? (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Limpar filtros
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">

            {/* Cliente */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Cliente</label>
              <Button
                variant="outline"
                className="w-[200px] justify-start"
                onClick={() => setClientModalOpen(true)}
              >
                {selectedClient ? selectedClient.name : 'Selecionar cliente'}
              </Button>
            </div>

            {/* Método de pagamento */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Método de pagamento</label>
              <Select
                value={paymentMethodId}
                onValueChange={(value) => {
                  setPaymentMethodId(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {paymentMethods.map((method: PaymentMethodResponse) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Status</label>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Período */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Período</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[260px] justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from
                      ? dateRange.to
                        ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`
                        : format(dateRange.from, 'dd/MM/yyyy')
                      : <span>Selecionar período</span>
                    }
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
                  <TableHead>Cliente</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!isLoading && payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.client?.name}</TableCell>
                      <TableCell>{payment.paymentMethod?.name}</TableCell>
                      <TableCell>{payment.status}</TableCell>
                      <TableCell className="text-right">R$ {payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        {payment.date ? format(new Date(payment.date), 'dd/MM/yyyy') : ''}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {isLoading ? 'Carregando pagamentos...' : hasFilters ? (
                        <div className="flex flex-col items-center gap-2">
                          <span>Nenhum pagamento encontrado com os filtros atuais</span>
                          <Button variant="ghost" size="sm" onClick={resetFilters} className="flex items-center gap-2">
                            <X className="h-4 w-4" />
                            Limpar filtros
                          </Button>
                        </div>
                      ) : 'Nenhum pagamento encontrado'}
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

      {/* Usando o SearchClientTable */}
      <SearchClientTable
        open={clientModalOpen}
        onOpenChange={setClientModalOpen}
        onSelect={(client) => {
          setSelectedClient(client as ClientResponse)
          setClientId(client.id)
          setCurrentPage(1)
        }}
      />
    </div>
  )
}
