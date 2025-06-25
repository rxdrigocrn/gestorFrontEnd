"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePaymentMethodStore } from '@/store/paymentMethodStore'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, Trash2, MessageCircle, PlusCircle } from 'lucide-react'
import { GenericTable } from '@/components/table/GenericTable'
import { GenericFilters } from '@/components/table/GenericFilters'
import { AddPaymentMethodModal } from '@/components/paymentMethod/add-paymentmethod-modal'
import { PaymentMethodCreate, PaymentMethodResponse } from '@/types/paymentMethod'
import { PaymentMethodValues } from '@/lib/schemas/paymentMethod'

export default function PaymentMethodsTable() {
    const router = useRouter()

    // Desestruture da store tudo que precisa
    const {
        items: paymentMethods,
        fetchItems: fetchPaymentMethods,
        isLoading,
        error,
        createItem,  // precisa para criar o método de pagamento!
        // você pode desestruturar updateItem, deleteItem etc aqui conforme precisar
    } = usePaymentMethodStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        fetchPaymentMethods()
    }, [fetchPaymentMethods])

    const filteredPaymentMethods = paymentMethods.filter((method) => {
        const matchesSearch =
            method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (method.description && method.description.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesSearch
    })

    // Aqui chamamos a função createItem da store (que já está tipada e atualiza o estado interno da store)
    const handleSubmit = async (data: PaymentMethodValues) => {
        try {
            await createItem(data)
            setShowAddModal(false)
            fetchPaymentMethods() // se quiser garantir que a lista está atualizada (geralmente não precisa porque a store já atualiza)
        } catch (error) {
            console.error('Erro ao criar método de pagamento:', error)
        }
    }

    if (isLoading) return <p>Carregando métodos de pagamento...</p>
    if (error) return <p className="text-red-600">Erro: {error}</p>

    return (
        <div className="space-y-4">
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
                <Button onClick={() => setShowAddModal(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Payment Method
                </Button>
            </div>

            {/* Filtros */}
            <GenericFilters
                searchPlaceholder="Buscar métodos de pagamento..."
                onSearchChange={setSearchTerm}
                onReset={() => {
                    setSearchTerm('')
                    setFilters({})
                }}
            />

            {/* Tabela */}
            <GenericTable<PaymentMethodResponse>
                data={filteredPaymentMethods}
                rowKey={(row) => row.id}
                onRowClick={(row) => router.push(`/payment-methods/${row.id}`)}
                columns={[
                    {
                        header: 'Método de Pagamento',
                        accessor: (method) => (
                            <div className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarFallback>{method.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{method.name}</p>
                                    <p className="text-xs text-muted-foreground">{method.description}</p>
                                </div>
                            </div>
                        ),
                    },
                ]}
                actions={(method) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/payment-methods/${method.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/payment-methods/${method.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Enviar Mensagem
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            />

            {/* Modal */}
            {showAddModal && (
                <AddPaymentMethodModal open={showAddModal} onOpenChange={setShowAddModal} onConfirm={handleSubmit} />
            )}
        </div>
    )
}

