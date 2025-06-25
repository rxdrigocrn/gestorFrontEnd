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
import { DeviceCreate, DeviceResponse } from '@/types/device'
import { DeviceValues } from '@/lib/schemas/deviceSchema'

export default function DevicesTable() {
    const router = useRouter()

    // Desestruture da store tudo que precisa
    const {
        items: devices,
        fetchItems: fetchDevices,
        isLoading,
        error,
        createItem,  // precisa para criar o dispositivo!
        // você pode desestruturar updateItem, deleteItem etc aqui conforme precisar
    } = useDeviceStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        fetchDevices()
    }, [fetchDevices])

    const filteredDevices = devices.filter((device) => {
        const matchesSearch =
            device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (device.name && device.name.toLowerCase().includes(searchTerm.toLowerCase()))
        return matchesSearch
    })

    // Aqui chamamos a função createItem da store (que já está tipada e atualiza o estado interno da store)
    const handleSubmit = async (data: DeviceValues) => {
        try {
            await createItem(data)
            setShowAddModal(false)
            fetchDevices() // se quiser garantir que a lista está atualizada (geralmente não precisa porque a store já atualiza)
        } catch (error) {
            console.error('Erro ao criar dispositivo:', error)
        }
    }

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
                rowKey={(row) => row.id}
                onRowClick={(row) => router.push(`/dispositivos/${row.id}`)}
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
                            <DropdownMenuItem onClick={() => router.push(`/dispositivos/${device.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dispositivos/${device.id}/edit`)}>
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
                <AddDeviceModal open={showAddModal} onOpenChange={setShowAddModal} onConfirm={handleSubmit} />
            )}
        </div>
    )
}

