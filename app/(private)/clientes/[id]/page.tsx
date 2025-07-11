'use client'

import { useParams } from 'next/navigation'
import { useClientStore } from '@/store/clientStore'
import { ClientDetails } from '@/components/clients/client-details'
import { useEffect, useState } from 'react'
import { ClientResponse } from '@/types/client'

export default function ClientDetailsPage() {
  const { id } = useParams()
  const [client, setClient] = useState<ClientResponse | null>(null)

  const { getItem } = useClientStore()

  useEffect(() => {
    if (id && typeof id === 'string') {
      getItem(id).then((data) => {
        if (data) {
          setClient(data)
        } else {
          setClient(null)
        }
      }).catch((error) => {
        console.error('Erro ao buscar cliente:', error)
        setClient(null)
      })
    }
  }, [id])



  if (!client) {
    return <div>Carregando...</div>
  }

  return <ClientDetails clientData={client} />
}
