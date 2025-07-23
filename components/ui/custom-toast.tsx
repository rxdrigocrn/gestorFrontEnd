// components/ui/custom-toast.tsx
"use client"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import React from "react"
import { toast } from "sonner"

interface CustomToastProps {
    id: string | number
    title: string
    description?: string
    icon?: React.ReactNode
}

export function CustomToast({ id, title, description, icon }: CustomToastProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto w-full max-w-sm bg-background shadow-lg rounded-lg border p-4 flex items-start gap-3"
        >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 space-y-1">
                <p className="font-semibold">{title}</p>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
            <button
                onClick={() => toast.dismiss(id)}
                className="text-muted-foreground hover:text-foreground transition"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    )
}
