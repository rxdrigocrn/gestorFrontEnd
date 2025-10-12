'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Frown } from 'lucide-react'

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 text-center"
            >
                {/* Ícone animado */}
                <motion.div
                    initial={{ rotate: -20, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{
                        rotate: { type: 'spring', stiffness: 300, damping: 10 },
                        scale: { duration: 0.5 }
                    }}
                    className="flex justify-center items-center mb-6"
                >
                    <Frown
                        size={80}
                        className="text-red-500"
                        strokeWidth={1.5}
                    />
                </motion.div>


                {/* Texto com animação de entrada */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h1 className="text-5xl font-bold text-red-500 mb-3">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Página não encontrada
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Sentimos muito, mas a página que você procura não existe mais ou foi movida.
                    </p>
                </motion.div>

                {/* Botões animados */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Button
                            onClick={() => router.back()}
                            className="w-full bg-red-500 hover:bg-red-600 text-white shadow-md"
                            size="lg"
                        >
                            Voltar à página anterior
                        </Button>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Button
                            onClick={() => router.push('/dashboard')}
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                            size="lg"
                        >
                            Ir para o Dashboard
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}