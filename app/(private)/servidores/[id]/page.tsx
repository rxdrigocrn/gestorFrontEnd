'use client'

import { useParams } from 'next/navigation'
import { useServerStore } from '@/store/serverStore'
import { ServerDetails } from '@/components/servers/server-details'

export default function ServerDetailsPage() {
  const { id } = useParams()
  const server = useServerStore((state) =>
    state.items.find((s) => s.id === id)
  )

  if (!server) return <p>Servidor não encontrado...</p>

  return <ServerDetails serverData={server} />
}
