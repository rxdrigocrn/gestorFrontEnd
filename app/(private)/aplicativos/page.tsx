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
import { ApplicationResponse } from '@/types/application'
import { ApplicationValues } from '@/lib/schemas/applicationSchema'

export default function ApplicationsTable() {
    const router = useRouter()

    // Desestruture da store tudo que precisa
    const {
        items: applications,
        fetchItems: fetchApplications,
        isLoading,
        error,
        createItem,  // precisa para criar o aplicativo!
    } = useApplicationStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        fetchApplications()
    }, [fetchApplications])

    const filteredApplications = applications.filter((application) => {
        const matchesSearch =
            application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (application.name && application.name.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesSearch
    })

    // Aqui chamamos a função createItem da store (que já está tipada e atualiza o estado interno da store)
    const handleSubmit = async (data: ApplicationValues) => {
        try {
            await createItem(data)
            setShowAddModal(false)
            fetchApplications() // se quiser garantir que a lista está atualizada (geralmente não precisa porque a store já atualiza)
        } catch (error) {
            console.error('Erro ao criar aplicativo:', error)
        }
    }

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
                            <DropdownMenuItem onClick={() => router.push(`/applications/${application.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/applications/${application.id}/edit`)}>
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
                <AddApplicationModal open={showAddModal} onOpenChange={setShowAddModal} onConfirm={handleSubmit} />
            )}
        </div>
    )
}

