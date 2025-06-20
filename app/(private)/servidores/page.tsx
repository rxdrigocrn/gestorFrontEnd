"use client"

import { ServersTable } from '@/components/servers/servers-table';
import { ServerStats } from '@/components/servers/server-stats';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { AddServerModal } from '@/components/servers/add-server-modal';

export default function ServersPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Servers</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Server
        </Button>
      </div>
      
      <ServerStats />
      <ServersTable />
      
      <AddServerModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}