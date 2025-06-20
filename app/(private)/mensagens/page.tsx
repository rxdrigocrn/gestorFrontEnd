"use client"

import { MessagesTable } from '@/components/messages/messages-table'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { AddMessageModal } from '@/components/messages/add-message-modal'

export default function MessagesPage() {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Mensagens</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Mensagem
        </Button>
      </div>
      
      <MessagesTable />
      
      <AddMessageModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  )
}