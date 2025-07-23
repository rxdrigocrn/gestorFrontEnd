"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBillingRuleStore } from '@/store/billingRulesStore'
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
import { AddBillingRuleModal } from '@/components/billing/add-billing-modal'
import { BillingRuleCreate, BillingRuleResponse, BillingRuleUpdate } from '@/types/billingRules'
import { BillingRuleFormData } from '@/lib/schemas/billingRulesSchema'
import { ConfirmationDialog } from '@/components/ui/confirmModal'
import { useSimpleToast } from '@/hooks/use-toast'

export default function BillingRulesTable() {
    const router = useRouter()

    const {
        items: billingRules,
        fetchItems: fetchBillingRules,
        isLoading,
        error,
        createItem,
        updateItem,
        deleteItem,
    } = useBillingRuleStore()

    const { showToast } = useSimpleToast()


    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingItem, setEditingItem] = useState<BillingRuleResponse | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchBillingRules()
    }, [fetchBillingRules])

    const filteredBillingRules = billingRules.filter((billingRule) => {
        const matchesSearch =
            billingRule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (billingRule.name && billingRule.name.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesSearch
    })

    const handleSubmit = async (data: BillingRuleFormData) => {
        try {
            if (data.id) {
                await updateItem(data.id, data as BillingRuleUpdate)
                showToast("success", "Regra de cobrança atualizada", {
                    description: "As alterações foram salvas com sucesso",
                })
            } else {
                await createItem(data as BillingRuleCreate)
                showToast("success", "Regra de cobrança criada", {
                    description: "A nova regra de cobrança foi registrado no sistema",
                })
            }
            setShowAddModal(false)
            setEditingItem(null)
            fetchBillingRules()
        } catch (error) {
            showToast("error", "Erro ao salvar regra de cobrança", {
                description: "Ocorreu um erro ao salvar a regra de cobrança",
            })
            console.error('Erro ao salvar regra de cobrança:', error)
        }
    }

    const handleEdit = (billingRule: BillingRuleResponse) => {
        setEditingItem(billingRule)
        setShowAddModal(true)
    }

    const handleDelete = async () => {
        try {
            if (editingItem && editingItem.id) {
                await deleteItem(editingItem.id)
                showToast("success", "Regra de cobrança excluida", {
                    description: "A regra de cobrança foi excluida com sucesso",
                })
                setEditingItem(null)
                fetchBillingRules()
            } else {
                console.error('Nenhuma regra de cobrança selecionada para exclusão.')
            }
        } catch (error) {
            showToast("error", "Erro ao excluir regra de cobrança", {
                description: "Ocorreu um erro ao excluir a regra de cobrança",
            })
            console.error('Erro ao excluir regra de cobrança:', error)
        }
    }

    const handleOpenDialog = (billingRule: BillingRuleResponse) => {
        setIsDialogOpen(true);
        setEditingItem(billingRule);
    }

    const handleModalChange = (isOpen: boolean) => {
        setShowAddModal(isOpen);
        if (!isOpen) {
            setEditingItem(null);
        }
    };

    if (isLoading) return <p>Carregando regras de cobrança...</p>
    if (error) return <p className="text-red-600">Erro: {error}</p>

    return (
        <div className="space-y-4">
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Regras de Cobrança</h1>
                <Button onClick={() => setShowAddModal(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Regra de Cobrança
                </Button>
            </div>

            {/* Filtros */}
            <GenericFilters
                searchPlaceholder="Buscar regras de cobrança..."
                onSearchChange={setSearchTerm}
                onReset={() => {
                    setSearchTerm('')
                    setFilters({})
                }}
            />

            {/* Tabela */}
            <GenericTable<BillingRuleResponse>
                data={filteredBillingRules}
                rowKey={(row) => row.id}
                // onRowClick={(row) => router.push(`/regras-de-cobranca/${row.id}`)}
                columns={[
                    {
                        header: 'Regra de Cobrança',
                        accessor: (billingRule) => (
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="font-medium">{billingRule.name}</p>
                                </div>
                            </div>
                        ),
                    },
                    {
                        header: 'Dias',
                        accessor: (billingRule) => (
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="font-medium">{billingRule.maxIntervalDays}</p>
                                </div>
                            </div>
                        ),
                    },
                ]}
                actions={(billingRule) => (
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

                            <DropdownMenuItem onClick={(e) => {
                                e.preventDefault()
                                handleEdit(billingRule)
                            }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => {
                                e.preventDefault()
                                handleOpenDialog(billingRule)
                            }} className="text-destructive cursor-pointer">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            />

            {/* Modal */}
            {showAddModal && (
                <AddBillingRuleModal open={showAddModal} onOpenChange={handleModalChange} onConfirm={handleSubmit} defaultValues={editingItem ?? undefined} />
            )}

            <ConfirmationDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleDelete}
                title="Excluir Regra de Cobrança"
                description="Tem certeza de que deseja excluir a regra de cobrança?"
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="destructive"
            />
        </div>
    )
}

