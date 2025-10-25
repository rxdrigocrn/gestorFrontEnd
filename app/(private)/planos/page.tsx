"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePlanStore } from '@/store/planStore'
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
import { AddPlanModal } from '@/components/planos/add-plan-modal'
import { PlanCreate, PlanResponse, PlanUpdate } from '@/types/plan'
import { PlanFormData } from '@/schemas/planSchema'
import { ConfirmationDialog } from '@/components/ui/confirmModal'
import { useSimpleToast } from '@/hooks/use-toast'

export default function PlansTable() {
    const router = useRouter()

    const {
        items: plans,
        fetchItems: fetchPlans,
        isLoading,
        error,
        createItem,
        updateItem,
        deleteItem
    } = usePlanStore()

    const { showToast } = useSimpleToast()

    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingItem, setEditingItem] = useState<PlanResponse | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchPlans()
    }, [fetchPlans])

    const filteredPlans = plans.filter((plan) => {
        const matchesSearch =
            plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesSearch
    })

    const handleSubmit = async (data: PlanFormData) => {
        try {
            if (data.id) {
                await updateItem(data.id, data as PlanUpdate)
                showToast("success", "Plano atualizado", {
                    description: "As alterações foram salvas com sucesso",
                })
            } else {
                await createItem(data as PlanCreate)
                showToast("success", "Plano criado", {
                    description: "O novo plano foi registrado no sistema",
                })
            }
            setShowAddModal(false)
            setEditingItem(null)
            fetchPlans()
        } catch (error) {
            showToast("error", "Erro ao salvar plano", {
                description: "Ocorreu um erro ao salvar o plano",
            })
            console.error('Erro ao salvar método de pagamento:', error)
        }
    }

    const handleEdit = (plan: PlanResponse) => {
        setEditingItem(plan)
        setShowAddModal(true)
    }

    const handleDelete = async () => {
        try {
            if (editingItem && editingItem.id) {
                await deleteItem(editingItem.id)
                showToast("success", "Plano excluido", {
                    description: "O plano foi excluido com sucesso",
                })
                setEditingItem(null)
                fetchPlans()
            } else {
                console.error('Nenhum cliente selecionado para exclusão.')
            }
        } catch (error) {
            showToast("error", "Erro ao excluir", {
                description: "Ocorreu um erro ao excluir o plano",
            })
            console.error('Erro ao excluir cliente:', error)
        }
    }

    const handleOpenDialog = (plan: PlanResponse) => {
        setIsDialogOpen(true);
        setEditingItem(plan);
    }

    const handleModalChange = (isOpen: boolean) => {
        setShowAddModal(isOpen);
        if (!isOpen) {
            setEditingItem(null);
        }
    };

    if (isLoading) return <p>Carregando planos...</p>
    if (error) return <p className="text-red-600">Erro: {error}</p>

    return (
        <div className="space-y-4">
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Planos</h1>
                <Button onClick={() => setShowAddModal(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Plano
                </Button>
            </div>

            {/* Filtros */}
            <GenericFilters
                searchPlaceholder="Buscar planos..."
                onSearchChange={setSearchTerm}
                onReset={() => {
                    setSearchTerm('')
                    setFilters({})
                }}
            />

            {/* Tabela */}
            <GenericTable<PlanResponse>
                data={filteredPlans}
                rowKey={(row) => row.id}
                isLoading={isLoading}
                error={error ?? undefined}
                // onRowClick={(row) => router.push(`/plans/${row.id}`)}
                columns={[
                    {
                        header: 'Plano',
                        accessor: (plan) => (
                            <div className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarFallback>{plan.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{plan.name}</p>
                                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                                </div>
                            </div>
                        ),
                    },
                ]}
                actions={(plan) => (
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
                                e.stopPropagation()
                                handleEdit(plan)
                            }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={(e) => {
                                e.stopPropagation() // Impede o clique de "borbulhar" para a linha
                                handleOpenDialog(plan)
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
                <AddPlanModal open={showAddModal} onOpenChange={handleModalChange} onConfirm={handleSubmit} defaultValues={editingItem ?? undefined} />
            )}

            <ConfirmationDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleDelete}
                title="Confirmar exclusão"
                description="Tem certeza de que deseja excluir este plano?"
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="destructive"
            />
        </div>
    )
}
