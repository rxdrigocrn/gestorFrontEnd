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
import { PlanCreate, PlanResponse } from '@/types/plan'
import { PlanValues } from '@/lib/schemas/planSchema'

export default function PlansTable() {
    const router = useRouter()

    // Desestruture da store tudo que precisa
    const {
        items: plans,
        fetchItems: fetchPlans,
        isLoading,
        error,
        createItem,  // precisa para criar o plano!
        // você pode desestruturar updateItem, deleteItem etc aqui conforme precisar
    } = usePlanStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        fetchPlans()
    }, [fetchPlans])

    const filteredPlans = plans.filter((plan) => {
        const matchesSearch =
            plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesSearch
    })

    // Aqui chamamos a função createItem da store (que já está tipada e atualiza o estado interno da store)
    const handleSubmit = async (data: PlanValues) => {
        try {
            await createItem(data)
            setShowAddModal(false)
            fetchPlans() // se quiser garantir que a lista está atualizada (geralmente não precisa porque a store já atualiza)
        } catch (error) {
            console.error('Erro ao criar plano:', error)
        }
    }

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
                            <DropdownMenuItem onClick={() => router.push(`/plans/${plan.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/plans/${plan.id}/edit`)}>
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
                <AddPlanModal open={showAddModal} onOpenChange={setShowAddModal} onConfirm={handleSubmit} />
            )}
        </div>
    )
}
