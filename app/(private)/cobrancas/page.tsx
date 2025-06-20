"use client"

import { BillingTable } from '@/components/billing/billing-table'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { AddBillingModal } from '@/components/billing/add-billing-modal'

export default function BillingPage() {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Cobranças</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Cobrança
        </Button>
      </div>
      
      <BillingTable />
      
      <AddBillingModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  )
}