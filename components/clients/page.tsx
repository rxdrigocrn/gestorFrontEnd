import { ClientsTable } from '@/components/clients/clients-table';
import { ClientFilters } from '@/components/clients/client-filters';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddClientModal } from '@/components/clients/add-client-modal';
import { useState } from 'react';

export default function ClientsPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>
      
      <ClientFilters />
      <ClientsTable />
      
      <AddClientModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}