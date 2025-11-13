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
    compact?: boolean
    showLimitSelector?: boolean
    showJumpInput?: boolean
    maxVisiblePages?: number
}

export function Pagination({
    page,
    limit,
    total,
    onPageChange,
    onLimitChange,
    compact = false,
    showLimitSelector = true,
    showJumpInput = true,
    maxVisiblePages = 5,
}: PaginationProps) {
    const totalPages = Math.ceil(total / limit)
    const [inputPage, setInputPage] = useState(String(page))

    useEffect(() => setInputPage(String(page)), [page])

    const handlePageJump = (e: React.FormEvent) => {
        e.preventDefault()
        const newPage = Math.max(1, Math.min(Number(inputPage), totalPages))
        onPageChange(newPage)
        setInputPage(String(newPage))
    }

    const getVisiblePages = () => {
        if (compact) return [page] // só mostra a página atual

        const visiblePages: (number | '...')[] = []

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) visiblePages.push(i)
        } else {
            let start = Math.max(1, page - Math.floor(maxVisiblePages / 2))
            let end = start + maxVisiblePages - 1

            if (end > totalPages) {
                end = totalPages
                start = totalPages - maxVisiblePages + 1
            }

            for (let i = start; i <= end; i++) visiblePages.push(i)

            if (start > 1) {
                if (start > 2) visiblePages.unshift('...')
                visiblePages.unshift(1)
            }

            if (end < totalPages) {
                if (end < totalPages - 1) visiblePages.push('...')
                visiblePages.push(totalPages)
            }
        }

        return visiblePages
    }

    return (
        <div className="flex flex-col  sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 px-2 py-2 w-full overflow-x-auto">

            {showLimitSelector && !compact && (
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm whitespace-nowrap">Itens por página:</span>
                    <Select value={String(limit)} onValueChange={(val) => onLimitChange(Number(val))}>
                        <SelectTrigger className="w-[70px] sm:w-[80px]">
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
            )}

            <div className="flex flex-wrap justify-center gap-1 flex-shrink-0">
                <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={page === 1}>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {getVisiblePages().map((p, idx) =>
                    p === '...' ? (
                        <Button key={`ellipsis-${idx}`} variant="outline" size="sm" disabled>...</Button>
                    ) : (
                        <Button key={p} variant={p === page ? 'default' : 'outline'} size="sm" onClick={() => onPageChange(Number(p))}>
                            {p}
                        </Button>
                    )
                )}

                <Button variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>

            {showJumpInput && !compact && (
                <form onSubmit={handlePageJump} className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm text-muted-foreground">Ir para:</span>
                    <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={inputPage}
                        onChange={(e) => setInputPage(e.target.value)}
                        className="w-16 px-2 py-1 border border-input rounded text-sm bg-background text-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background focus:outline-none transition"
                    />
                    <Button type="submit" size="sm" variant="outline">Ir</Button>
                </form>
            )}
        </div>
    )
}
