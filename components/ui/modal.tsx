"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface ModalProps extends DialogPrimitive.DialogProps {
  title?: string
  description?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full"
  children: React.ReactNode
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "full": "max-w-full"
}

export function Modal({
  children,
  title,
  description,
  maxWidth = "lg",
  open,
  onOpenChange,
  ...props
}: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
      <DialogPrimitive.Portal >
        {/* Overlay */}
        <AnimatePresence>
          {open && (
            <>
              <DialogPrimitive.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                />
              </DialogPrimitive.Overlay>

              {/* Content */}
              <DialogPrimitive.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  className={cn(
                    "fixed left-1/2 top-1/2 z-50 grid w-full gap-4 border bg-background p-6 shadow-lg rounded-lg ",
                    maxWidthClasses[maxWidth]
                  )}
                >
                  {title && (
                    <div className="flex flex-col space-y-1.5">
                      <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                        {title}
                      </DialogPrimitive.Title>
                      {description && (
                        <DialogPrimitive.Description className="text-sm text-muted-foreground">
                          {description}
                        </DialogPrimitive.Description>
                      )}
                    </div>
                  )}
                  {children}
                  <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Fechar</span>
                  </DialogPrimitive.Close>
                </motion.div>
              </DialogPrimitive.Content>
            </>
          )}
        </AnimatePresence>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
