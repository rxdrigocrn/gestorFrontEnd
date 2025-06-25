"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLeadSourceStore } from '@/store/leadStore'
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
import { AddLeadModal } from '@/components/leads/add-leads-modal'
import { LeadSourceCreate, LeadSourceResponse } from '@/types/lead'
import { LeadValues } from '@/lib/schemas/leadSchema'

export default function LeadsTable() {
    const router = useRouter()

    // Desestruture da store tudo que precisa
    const {
        items: leads,
        fetchItems: fetchLeads,
        isLoading,
        error,
        createItem,  // precisa para criar o lead!
        // você pode desestruturar updateItem, deleteItem etc aqui conforme precisar
    } = useLeadSourceStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        fetchLeads()
    }, [fetchLeads])

    const filteredLeads = leads.filter((lead) => {
        const matchesSearch =
            lead.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.type && lead.type.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesSearch
    })

    // Aqui chamamos a função createItem da store (que já está tipada e atualiza o estado interno da store)
    const handleSubmit = async (data: LeadValues) => {
        try {
            await createItem(data)
            setShowAddModal(false)
            fetchLeads() // se quiser garantir que a lista está atualizada (geralmente não precisa porque a store já atualiza)
        } catch (error) {
            console.error('Erro ao criar lead:', error)
        }
    }

    if (isLoading) return <p>Carregando leads...</p>
    if (error) return <p className="text-red-600">Erro: {error}</p>

    return (
        <div className="space-y-4">
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
                <Button onClick={() => setShowAddModal(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Lead
                </Button>
            </div>

            {/* Filtros */}
            <GenericFilters
                searchPlaceholder="Buscar leads..."
                onSearchChange={setSearchTerm}
                onReset={() => {
                    setSearchTerm('')
                    setFilters({})
                }}
            />

            {/* Tabela */}
            <GenericTable<LeadSourceResponse>
                data={filteredLeads}
                rowKey={(row) => row.id}
                onRowClick={(row) => router.push(`/leads/${row.id}`)}
                columns={[
                    {
                        header: 'Lead',
                        accessor: (lead) => (
                            <div className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarFallback>{lead.type.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{lead.type}</p>
                                </div>
                            </div>
                        ),
                    },
                ]}
                actions={(lead) => (
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
                            <DropdownMenuItem onClick={() => router.push(`/leads/${lead.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/leads/${lead.id}/edit`)}>
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
                <AddLeadModal open={showAddModal} onOpenChange={setShowAddModal} onConfirm={handleSubmit} />
            )}
        </div>
    )
}

