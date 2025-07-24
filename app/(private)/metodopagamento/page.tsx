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
import { PaymentMethodCreate, PaymentMethodResponse, PaymentMethodUpdate } from '@/types/paymentMethod'
import { PaymentMethodFormData } from '@/lib/schemas/paymentMethod'
import { ConfirmationDialog } from '@/components/ui/confirmModal'
import { useSimpleToast } from '@/hooks/use-toast'

export default function PaymentMethodsTable() {
    const router = useRouter()

    // Desestruture da store tudo que precisa
    const {
        items: paymentMethods,
        fetchItems: fetchPaymentMethods,
        isLoading,
        error,
        createItem,
        updateItem,
        deleteItem
    } = usePaymentMethodStore()

    const { showToast } = useSimpleToast()

    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingItem, setEditingItem] = useState<PaymentMethodResponse | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    const handleSubmit = async (data: PaymentMethodFormData) => {
        try {
            if (data.id) {
                await updateItem(data.id, data as PaymentMethodUpdate) 
                showToast("success", "Método de pagamento atualizado", {
                    description: "As alterações foram salvas com sucesso",
                })
            } else {
                await createItem(data as PaymentMethodCreate)
                showToast("success", "Método de pagamento criado", {
                    description: "O método de pagamento foi criado com sucesso",
                })
            }
            setShowAddModal(false)
            setEditingItem(null)
            fetchPaymentMethods()
        } catch (error) {
            showToast("error", "Erro ao salvar método de pagamento", {
                description: "Ocorreu um erro ao salvar o método de pagamento",
            })
            console.error('Erro ao salvar método de pagamento:', error)
        }
    }


    const handleEdit = (method: PaymentMethodResponse) => {
        setEditingItem(method)
        setShowAddModal(true)
    }

    const handleDelete = async () => {
        try {
            if (editingItem && editingItem.id) {
                await deleteItem(editingItem.id)
                showToast("success", "Método de pagamento excluido", {
                    description: "O método de pagamento foi excluido com sucesso",
                })
                setEditingItem(null)
                fetchPaymentMethods()
            } else {
                console.error('Nenhum cliente selecionado para exclusão.')
            }
        } catch (error) {
            showToast("error", "Erro ao excluir", {
                description: "Ocorreu um erro ao excluir o cliente",
            })
            console.error('Erro ao excluir cliente:', error)
        }
    }

    const handleOpenDialog = (payMethod: PaymentMethodResponse) => {
        setIsDialogOpen(true);
        setEditingItem(payMethod);
    }



    const handleModalChange = (isOpen: boolean) => {
        setShowAddModal(isOpen);
        if (!isOpen) {
            setEditingItem(null);
        }
    };

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
                 isLoading={isLoading}
        error={error ?? undefined}
                // onRowClick={(row) => router.push(`/payment-methods/${row.id}`)}
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
                            <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
                                e.stopPropagation(); // Impede o clique de "borbulhar" para a linha
                                handleEdit(method);
                            }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={(e) => {
                                e.stopPropagation(); // Impede o clique de "borbulhar" para a linha
                                handleOpenDialog(method);
                            }}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            />

            {/* Modal */}
            {showAddModal && (
                <AddPaymentMethodModal
                    open={showAddModal}
                    onOpenChange={handleModalChange}
                    onConfirm={handleSubmit}
                    defaultValues={editingItem ?? undefined}
                />
            )}

            <ConfirmationDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleDelete}
                title="Excluir Metódo de Pagamento"
                description="Tem certeza de que deseja excluir este Metódo de Pagamento?"
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="destructive"
            />
        </div>
    )
}

