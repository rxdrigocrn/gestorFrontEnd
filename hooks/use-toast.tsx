// hooks/useSimpleToast.tsx
"use client"

import { toast } from "sonner"
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"
import React from "react"
import { CustomToast } from "@/components/ui/custom-toast"

type ToastType = "success" | "error" | "info" | "warning"

interface ToastOptions {
    description?: string
    duration?: number
    position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
}

export function useSimpleToast() {
    const showToast = (
        type: ToastType,
        title: string,
        options?: ToastOptions
    ) => {
        const {
            description,
            duration = 5000,
            position = "top-right"
        } = options || {}

        const iconMap: Record<ToastType, React.ReactNode> = {
            success: <CheckCircle className="text-green-500" size={22} />,
            error: <XCircle className="text-red-500" size={22} />,
            info: <Info className="text-blue-500" size={22} />,
            warning: <AlertTriangle className="text-yellow-500" size={22} />
        }

        toast.custom((id) => (
            <CustomToast
                id={id}
                title={title}
                description={description}
                icon={iconMap[type]}
            />
        ), {
            duration,
            position
        })
    }

    return { showToast }
}
