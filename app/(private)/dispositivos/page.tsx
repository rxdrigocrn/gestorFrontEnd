"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDeviceStore } from '@/store/deviceStore'
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
import { AddDeviceModal } from '@/components/dispositivos/add-dispositivos-modal'
import { DeviceCreate, DeviceResponse, DeviceUpdate } from '@/types/device'
import { DeviceFormData } from '@/lib/schemas/deviceSchema'
import { ConfirmationDialog } from '@/components/ui/confirmModal'
import { useSimpleToast } from '@/hooks/use-toast'

export default function DevicesTable() {
    const router = useRouter()

    // Desestruture da store tudo que precisa
    const {
        items: devices,
        fetchItems: fetchDevices,
        isLoading,
        error,
        createItem,
        updateItem,
        deleteItem,
    } = useDeviceStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingItem, setEditingItem] = useState<DeviceResponse | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { showToast } = useSimpleToast();

    useEffect(() => {
        fetchDevices()
    }, [fetchDevices])

    const filteredDevices = devices.filter((device) => {
        const matchesSearch =
            device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (device.name && device.name.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesSearch
    })

    const handleSubmit = async (data: DeviceFormData) => {
        try {
            if (data.id) {
                await updateItem(data.id, data as DeviceUpdate)
                showToast("success", "Dispositivo atualizado", {
                    description: "As alterações foram salvas com sucesso",
                });
            } else {
                await createItem(data as DeviceCreate)
                showToast("success", "Dispositivo criado", {
                    description: "O novo dispositivo foi registrado no sistema",
                });
            }
            setShowAddModal(false)
            setEditingItem(null)
            fetchDevices()
        } catch (error) {
            showToast("error", "Erro ao salvar", {
                description: "Ocorreu um erro ao salvar o dispositivo",
            })
            console.error('Erro ao salvar dispositivo:', error)
        }
    }

    const handleEdit = (device: DeviceResponse) => {
        setEditingItem(device)
        setShowAddModal(true)
    }

    const handleDelete = async () => {
        try {
            if (editingItem && editingItem.id) {
                await deleteItem(editingItem.id)
                showToast("success", "Dispositivo excluido", {
                    description: "O dispositivo foi excluido com sucesso",
                })
                setEditingItem(null)
                fetchDevices()
            } else {
                console.error('Nenhum cliente selecionado para exclusão.')
            }
        } catch (error) {
            showToast("error", "Erro ao excluir", {
                description: "Ocorreu um erro ao excluir o dispositivo",
            })
            console.error('Erro ao excluir cliente:', error)
        }
    }

    const handleOpenDialog = (device: DeviceResponse) => {
        setIsDialogOpen(true);
        setEditingItem(device);
    }

    const handleModalChange = (isOpen: boolean) => {
        setShowAddModal(isOpen);
        if (!isOpen) {
            setEditingItem(null);
        }
    };

    if (isLoading) return <p>Carregando dispositivos...</p>
    if (error) return <p className="text-red-600">Erro: {error}</p>

    return (
        <div className="space-y-4">
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Dispositivos</h1>
                <Button onClick={() => setShowAddModal(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Dispositivo
                </Button>
            </div>

            {/* Filtros */}
            <GenericFilters
                searchPlaceholder="Buscar dispositivos..."
                onSearchChange={setSearchTerm}
                onReset={() => {
                    setSearchTerm('')
                    setFilters({})
                }}
            />

            {/* Tabela */}
            <GenericTable<DeviceResponse>
                data={filteredDevices}
                isLoading={isLoading}
                error={error ?? undefined}
                rowKey={(row) => row.id}
                // onRowClick={(row) => router.push(`/dispositivos/${row.id}`)}
                columns={[
                    {
                        header: 'Dispositivo',
                        accessor: (device) => (
                            <div className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarFallback>{device.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{device.name}</p>
                                </div>
                            </div>
                        ),
                    },
                ]}
                actions={(device) => (
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
                                handleEdit(device)
                            }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => {
                                e.preventDefault()
                                handleOpenDialog(device)
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
                <AddDeviceModal open={showAddModal} onOpenChange={handleModalChange} onConfirm={handleSubmit} defaultValues={editingItem ?? undefined} />
            )}

            <ConfirmationDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleDelete}
                title="Excluir Dispositivo"
                description="Tem certeza de que deseja excluir o dispositivo?"
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="destructive"
            />
        </div>
    )
}

