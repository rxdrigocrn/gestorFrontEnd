'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useUserStore } from '@/store/userStore'
import { GenericTable } from '@/components/table/GenericTable'
import { GenericFilters } from '@/components/table/GenericFilters'
import { AddUserModal } from '@/components/users/add-users-modal'
import { ConfirmationDialog } from '@/components/ui/confirmModal'
import { useSimpleToast } from '@/hooks/use-toast'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { MoreHorizontal, Eye, Edit, Trash2, PlusCircle } from 'lucide-react'
import { CreateUserFormData } from '@/schemas/userSchema'
import { UserUpdate } from '@/types/user'
import { Role } from '@/types/user'

export default function UsersPage() {
    const router = useRouter()
    const {
        items: users,
        fetchItems: fetchUsers,
        isLoading,
        error,
        createItem,
        updateItem,
        deleteItem,
    } = useUserStore()

    const { showToast } = useSimpleToast()

    const [searchTerm, setSearchTerm] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingUser, setEditingUser] = useState<CreateUserFormData | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSubmit = async (data: CreateUserFormData) => {
        try {
            if (data.id) {
                await updateItem(data.id, data as UserUpdate)
                showToast('success', 'Usuário atualizado', {
                    description: 'As alterações foram salvas com sucesso',
                })
            } else {
                await createItem(data)
                showToast('success', 'Usuário criado', {
                    description: 'Novo usuário adicionado ao sistema',
                })
            }
            setShowAddModal(false)
            setEditingUser(null)
            fetchUsers()
        } catch (error) {
            showToast('error', 'Erro ao salvar', {
                description: 'Ocorreu um erro ao salvar o usuário',
            })
            console.error('Erro ao salvar usuário:', error)
        }
    }

    const handleEdit = (user: CreateUserFormData) => {
        setEditingUser(user)
        setShowAddModal(true)
    }

    const handleDelete = async () => {
        try {
            if (editingUser?.id) {
                await deleteItem(editingUser.id)
                showToast('success', 'Usuário excluído', {
                    description: 'O usuário foi removido com sucesso',
                })
                setEditingUser(null)
                fetchUsers()
            }
        } catch (error) {
            showToast('error', 'Erro ao excluir', {
                description: 'Ocorreu um erro ao excluir o usuário',
            })
            console.error('Erro ao excluir usuário:', error)
        }
    }

    const handleOpenDialog = (user: CreateUserFormData) => {
        setIsDialogOpen(true)
        setEditingUser(user)
    }

    const handleModalChange = (isOpen: boolean) => {
        setShowAddModal(isOpen)
        if (!isOpen) setEditingUser(null)
    }

    if (isLoading) return <p>Carregando usuários...</p>
    if (error) return <p className="text-red-600">Erro: {error}</p>

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
                <Button onClick={() => setShowAddModal(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Funcionário
                </Button>
            </div>

            <GenericFilters
                searchPlaceholder="Buscar usuários..."
                onSearchChange={setSearchTerm}
                onReset={() => setSearchTerm('')}
            />

            <GenericTable<CreateUserFormData>
                data={filteredUsers}
                isLoading={isLoading}
                error={error ?? undefined}
                rowKey={(row) => row.id ?? ''}
                columns={[
                    { header: 'Nome', accessor: 'name' },
                    { header: 'Email', accessor: 'email' },
                    {
                        header: 'Cargo',
                        accessor: (user) =>
                            user.role === Role.ADMIN ? 'Administrador' : 'Funcionário',
                    },
                ]}
                actions={(user) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* <DropdownMenuItem onClick={() => router.push(`/usuarios/${user.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Detalhes
                            </DropdownMenuItem> */}
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(user)
                            }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={(e) => {
                                e.stopPropagation()
                                handleOpenDialog(user)
                            }}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            />

            <AddUserModal
                open={showAddModal}
                onOpenChange={handleModalChange}
                onConfirm={handleSubmit}
                defaultValues={editingUser ?? undefined}
            />

            <ConfirmationDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleDelete}
                title="Excluir Usuário"
                description="Tem certeza de que deseja excluir este usuário?"
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="destructive"
            />
        </div>
    )
}
