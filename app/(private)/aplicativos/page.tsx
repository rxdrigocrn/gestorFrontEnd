"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore } from '@/store/applicationStore'
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
import AddApplicationModal from '@/components/application/add-app-modal'
import { ApplicationCreate, ApplicationResponse, ApplicationUpdate } from '@/types/application'
import { ApplicationFormData } from '@/lib/schemas/applicationSchema'
import { ConfirmationDialog } from '@/components/ui/confirmModal'

export default function ApplicationsTable() {
    const router = useRouter()

    const {
        items: applications,
        fetchItems: fetchApplications,
        isLoading,
        error,
        createItem,
        updateItem,
        deleteItem,
    } = useApplicationStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingItem, setEditingItem] = useState<ApplicationResponse | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchApplications()
    }, [fetchApplications])

    const filteredApplications = applications.filter((application) => {
        const matchesSearch =
            application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (application.name && application.name.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesSearch
    })
    const handleSubmit = async (data: ApplicationFormData) => {
        try {
            if (data.id) {
                await updateItem(data.id, data as ApplicationUpdate)
            } else {
                await createItem(data as ApplicationCreate)
            }
            setShowAddModal(false)
            setEditingItem(null)
            fetchApplications()
        } catch (error) {
            console.error('Erro ao salvar aplicativo:', error)

        }
    }

    const handleEdit = (application: ApplicationResponse) => {
        setEditingItem(application)
        setShowAddModal(true)
    }

    const handleDelete = async () => {
        try {
            if (editingItem && editingItem.id) {
                await deleteItem(editingItem.id)
                setEditingItem(null)
                fetchApplications()
            } else {
                console.error('Nenhum cliente selecionado para exclusão.')
            }
        } catch (error) {
            console.error('Erro ao excluir cliente:', error)
        }
    }

    const handleOpenDialog = (app: ApplicationResponse) => {
        setIsDialogOpen(true);
        setEditingItem(app);
    }

    const handleModalChange = (isOpen: boolean) => {
        setShowAddModal(isOpen);
        if (!isOpen) {
            setEditingItem(null);
        }
    };

    if (isLoading) return <p>Carregando aplicativos...</p>
    if (error) return <p className="text-red-600">Erro: {error}</p>

    return (
        <div className="space-y-4">
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
                <Button onClick={() => setShowAddModal(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Application
                </Button>
            </div>

            {/* Filtros */}
            <GenericFilters
                searchPlaceholder="Buscar aplicativos..."
                onSearchChange={setSearchTerm}
                onReset={() => {
                    setSearchTerm('')
                    setFilters({})
                }}
            />

            {/* Tabela */}
            <GenericTable<ApplicationResponse>
                data={filteredApplications}
                rowKey={(row) => row.id}
                onRowClick={(row) => router.push(`/applications/${row.id}`)}
                columns={[
                    {
                        header: 'Application',
                        accessor: (application) => (
                            <div className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarFallback>{application.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{application.name}</p>
                                </div>
                            </div>
                        ),
                    },
                ]}
                actions={(application) => (
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
                            {/* <DropdownMenuItem onClick={() => router.push(`/applications/${application.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Detalhes
                            </DropdownMenuItem> */}
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(application)
                            }
                            }>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDialog(application);
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
                <AddApplicationModal open={showAddModal} onOpenChange={handleModalChange} onConfirm={handleSubmit} defaultValues={editingItem ?? undefined} />
            )}

            <ConfirmationDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleDelete}
                title="Excluir aplicativo"
                description="Tem certeza de que deseja excluir este aplicativo?"
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="destructive"
            />
        </div>
    )
}

