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
import { PlanFormData } from '@/lib/schemas/planSchema'

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

    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingItem, setEditingItem] = useState<PlanResponse | null>(null)

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
            } else {
                await createItem(data as PlanCreate)
            }
            setShowAddModal(false)
            setEditingItem(null)
            fetchPlans()
        } catch (error) {
            console.error('Erro ao salvar método de pagamento:', error)
        }
    }

    const handleEdit = (plan: PlanResponse) => {
        setEditingItem(plan)
        setShowAddModal(true)
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteItem(id)
            fetchPlans()
        } catch (error) {
            console.error('Erro ao excluir plano:', error)
        }
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
                <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
                <Button onClick={() => setShowAddModal(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Plan
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
                onRowClick={(row) => router.push(`/plans/${row.id}`)}
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
                                handleDelete(plan.id)
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
        </div>
    )
}
