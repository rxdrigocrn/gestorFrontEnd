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
import { LeadSourceCreate, LeadSourceResponse, LeadSourceUpdate } from '@/types/lead'
import { LeadFormData } from '@/lib/schemas/leadSchema'
import { ConfirmationDialog } from '@/components/ui/confirmModal'
import { useSimpleToast } from '@/hooks/use-toast'

export default function LeadsTable() {
    const router = useRouter()

    // Desestruture da store tudo que precisa
    const {
        items: leads,
        fetchItems: fetchLeads,
        isLoading,
        error,
        createItem,
        updateItem,
        deleteItem,
    } = useLeadSourceStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingItem, setEditingItem] = useState<LeadSourceResponse | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchLeads()
    }, [fetchLeads])

    const filteredLeads = leads.filter((lead) => {
        const matchesSearch =
            lead.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.type && lead.type.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesSearch
    })

    const handleSubmit = async (data: LeadFormData) => {
        try {
            if (data.id) {
                await updateItem(data.id, data as LeadSourceUpdate)
            } else {
                await createItem(data as LeadSourceCreate)
            }
            setShowAddModal(false)
            setEditingItem(null)
            fetchLeads()
        } catch (error) {
            console.error('Erro ao salvar lead:', error)
        }
    }

    const handleEdit = (lead: LeadSourceResponse) => {
        setEditingItem(lead)
        setShowAddModal(true)
    }

    const handleDelete = async () => {
        try {
            if (editingItem && editingItem.id) {
                await deleteItem(editingItem.id)
                setEditingItem(null)
                fetchLeads()
            } else {
                console.error('Nenhum cliente selecionado para exclusão.')
            }
        } catch (error) {
            console.error('Erro ao excluir cliente:', error)
        }
    }

    const handleOpenDialog = (lead: LeadSourceResponse) => {
        setIsDialogOpen(true);
        setEditingItem(lead);
    }


    const handleModalChange = (isOpen: boolean) => {
        setShowAddModal(isOpen);
        if (!isOpen) {
            setEditingItem(null);
        }
    };

    if (isLoading) return <p>Carregando captações...</p>
    if (error) return <p className="text-red-600">Erro: {error}</p>

    return (
        <div className="space-y-4">
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Captação</h1>
                <Button onClick={() => setShowAddModal(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Captação
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
                isLoading={isLoading}
                error={error ?? undefined}
                // onRowClick={(row) => router.push(`/leads/${row.id}`)}
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
                            {/* <DropdownMenuItem onClick={() => router.push(`/leads/${lead.id}`)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Detalhes
                                </DropdownMenuItem> */}
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(lead)
                            }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Enviar Mensagem
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={(e) => {
                                e.stopPropagation()
                                handleOpenDialog(lead)
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
                <AddLeadModal open={showAddModal} onOpenChange={handleModalChange} onConfirm={handleSubmit} defaultValues={editingItem ?? undefined} />
            )}

            <ConfirmationDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleDelete}
                title="Excluir Lead"
                description="Tem certeza de que deseja excluir este lead?"
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="destructive"
            />
        </div>
    )
}

