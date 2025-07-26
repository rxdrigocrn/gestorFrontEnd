// components/ui/pagination.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useEffect, useState } from "react"

interface PaginationProps {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
}

export function Pagination({
    page,
    limit,
    total,
    onPageChange,
    onLimitChange,
}: PaginationProps) {
    const totalPages = Math.ceil(total / limit)
    const [inputPage, setInputPage] = useState(String(page))

    // Atualiza o input quando a página muda externamente
    useEffect(() => {
        setInputPage(String(page))
    }, [page])

    const handlePageJump = (e: React.FormEvent) => {
        e.preventDefault()
        const newPage = Math.max(1, Math.min(Number(inputPage), totalPages))
        onPageChange(newPage)
        setInputPage(String(newPage))
    }

    const getVisiblePages = () => {
        const visiblePages = []
        const maxVisible = 5 // Número máximo de páginas visíveis

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                visiblePages.push(i)
            }
        } else {
            let start = Math.max(1, page - 2)
            let end = Math.min(totalPages, page + 2)

            if (page <= 3) {
                end = maxVisible
            } else if (page >= totalPages - 2) {
                start = totalPages - maxVisible + 1
            }

            for (let i = start; i <= end; i++) {
                visiblePages.push(i)
            }

            if (start > 1) {
                if (start > 2) {
                    visiblePages.unshift('...')
                }
                visiblePages.unshift(1)
            }

            if (end < totalPages) {
                if (end < totalPages - 1) {
                    visiblePages.push('...')
                }
                visiblePages.push(totalPages)
            }
        }

        return visiblePages
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
                <span className="text-sm">Itens por página:</span>
                <Select value={String(limit)} onValueChange={(val) => onLimitChange(Number(val))}>
                    <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Itens" />
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 25, 50, 100].map((opt) => (
                            <SelectItem key={opt} value={String(opt)}>
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={page === 1}
                >
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">Primeira página</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Página anterior</span>
                </Button>

                <div className="flex gap-1">
                    {getVisiblePages().map((p, index) => (
                        p === '...' ? (
                            <Button key={`ellipsis-${index}`} variant="outline" size="sm" disabled>
                                ...
                            </Button>
                        ) : (
                            <Button
                                key={p}
                                variant={p === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(Number(p))}
                            >
                                {p}
                            </Button>
                        )
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próxima página</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={page === totalPages}
                >
                    <ChevronsRight className="h-4 w-4" />
                    <span className="sr-only">Última página</span>
                </Button>
            </div>

            <form onSubmit={handlePageJump} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ir para:</span>
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={inputPage}
                    onChange={(e) => setInputPage(e.target.value)}
                    className="w-16 px-2 py-1 border border-input rounded text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background focus:outline-none transition"
                />
                <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 border-accent"
                >
                    Ir
                </Button>
            </form>
        </div>
    )
}