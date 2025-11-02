'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Loader from '@/components/loaders/loader'

export default function BillingSuccessPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // if (!sessionId) return
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])
    // tinha sessionId na dependecias, removi pq n ta sendo usado no abacate pay

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <Loader />
            </div>)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <h1 className="text-2xl font-bold">Compra finalizada com sucesso!</h1>
            <p>Obrigado pela sua compra. Você pode voltar ao login para acessar sua conta.</p>
            <Button onClick={() => router.push('/auth/login')}>Voltar ao Login</Button>
        </div>
    )
}
