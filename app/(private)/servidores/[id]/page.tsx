'use client'

import { useParams } from 'next/navigation'
import { useServerStore } from '@/store/serverStore'
import { ServerDetails } from '@/components/servers/server-details'
import { ServerResponse } from '@/types/server'
import { useEffect, useState } from 'react'

export default function ServerDetailsPage() {
  const { id } = useParams()
  const [server, setServer] = useState<ServerResponse | null>(null)

  const { getItem } = useServerStore()

  useEffect(() => {
    if (id && typeof id === 'string') {
      getItem(id).then((data) => {
        if (data) {
          setServer(data)
        } else {
          setServer(null)
        }
      }).catch((error) => {
        console.error('Erro ao buscar cliente:', error)
        setServer(null)
      })
    }
  }, [id])

  if (!server) {
    return <div>Carregando...</div>
  }

  return <ServerDetails serverData={server} />
}
