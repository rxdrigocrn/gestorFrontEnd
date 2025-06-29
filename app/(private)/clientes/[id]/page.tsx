'use client'

import { useParams } from 'next/navigation'
import { useClientStore } from '@/store/clientStore'
import { ClientDetails } from '@/components/clients/client-details'

export default function ClientDetailsPage() {
  const { id } = useParams()
  const client = useClientStore((state) =>
    state.items.find((c) => c.id === id)
  )

  if (!client) return <p>Cliente não encontrado...</p>

  return <ClientDetails clientData={client} />
}
