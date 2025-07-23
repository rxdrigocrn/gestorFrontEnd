"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMessageStore } from '@/store/messageStore' // Presumed store for messages
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
import { AddMessageTemplateModal } from '@/components/message/add-message-modal' // Presumed modal for adding messages
import { MessageTemplateCreate, MessageTemplateResponse, MessageTemplateUpdate } from '@/types/message' // Presumed types for message
import { MessageTemplateFormData } from '@/lib/schemas/messageTemplateSchema' // Presumed schema for message
import { ConfirmationDialog } from '@/components/ui/confirmModal'
import { useSimpleToast } from '@/hooks/use-toast'

export default function MessagesTable() {
  const router = useRouter()

  const {
    items: messages,
    fetchItems: fetchMessages,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
  } = useMessageStore()

  const { showToast } = useSimpleToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<{ [key: string]: string }>({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MessageTemplateResponse | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleSubmit = async (data: MessageTemplateFormData) => {
    try {
      if (data.id) {
        await updateItem(data.id, data as MessageTemplateUpdate)
        showToast("success", "Mensagem atualizada", {
          description: "As alterações foram salvas com sucesso",
        })
      } else {
        await createItem(data as MessageTemplateCreate)
        showToast("success", "Mensagem criada", {
          description: "A mensagem foi criada com sucesso",
        })
      }
      setShowAddModal(false)
      setEditingItem(null)
      fetchMessages()
    } catch (error) {
      showToast("error", "Erro ao salvar mensagem", {

      })
      console.error('Erro ao salvar mensagem:', error)
    }
  }

  const handleEdit = (message: MessageTemplateResponse) => {
    setEditingItem(message)
    setShowAddModal(true)
  }

  const handleDelete = async () => {
    try {
      if (editingItem && editingItem.id) {
        await deleteItem(editingItem.id)
        showToast("success", "Mensagem excluida", {
          description: "A mensagem foi excluida com sucesso",
        })
        setEditingItem(null)
        fetchMessages()
      } else {
        console.error('Nenhuma mensagem selecionada para exclusão.')

      }
    } catch (error) {
      showToast("error", "Erro ao excluir mensagem", {
        description: "Ocorreu um erro ao excluir a mensagem",
      })
      console.error('Erro ao excluir mensagem:', error)
    }
  }

  const handleOpenDialog = (message: MessageTemplateResponse) => {
    setIsDialogOpen(true);
    setEditingItem(message);
  }

  const handleModalChange = (isOpen: boolean) => {
    setShowAddModal(isOpen);
    if (!isOpen) {
      setEditingItem(null);
    }
  };

  if (isLoading) return <p>Carregando mensagens...</p>
  if (error) return <p className="text-red-600">Erro: {error}</p>

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Mensagens</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Mensagem
        </Button>
      </div>

      <GenericFilters
        searchPlaceholder="Buscar mensagens..."
        onSearchChange={setSearchTerm}
        onReset={() => {
          setSearchTerm('')
          setFilters({})
        }}
      />

      <GenericTable<MessageTemplateResponse>
        data={filteredMessages}
        rowKey={(row) => row.id}
        columns={[
          {
            header: 'Titulo',
            accessor: (message) => (
              <div className="flex items-center space-x-3">
                <div>
                  <p className="font-medium">{message.name}</p>
                </div>
              </div>
            ),
          },
          {
            header: 'Conteúdo da Mensagem',
            accessor: (message) => (
              <div className="flex items-center space-x-3">

                <div>
                  <p className="font-medium">{message.content}</p>
                </div>
              </div>
            ),
          },
        ]}
        actions={(message) => (
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
                handleEdit(message)
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => {
                e.preventDefault()
                handleOpenDialog(message)
              }} className="text-destructive cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {showAddModal && (
        <AddMessageTemplateModal open={showAddModal} onOpenChange={handleModalChange} onConfirm={handleSubmit} defaultValues={editingItem ?? undefined} />
      )}

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleDelete}
        title="Excluir Mensagem"
        description="Tem certeza de que deseja excluir a mensagem?"
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  )
}

