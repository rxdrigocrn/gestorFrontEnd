'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Modal } from '@/components/ui/modal'
import {
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui/select'
import { Pagination } from './Pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { useClientStore } from '@/store/clientStore'

type Column<T> = {
    key: keyof T
    label: string
    render?: (value: T) => React.ReactNode
}

type Props<T> = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (row: T) => void
}

export function SearchClientTable<T extends { id: string | number }>({
    open,
    onOpenChange,
    onSelect,
}: Props<T>) {
    const { fetchItems, items: clientList, total: clientTotal, isLoading } = useClientStore()

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const currentPageRef = useRef(page)

    const fetchDataWithLoading = async () => {
        try {
            await fetchItems({
                page: currentPageRef.current,
                limit,
                name: search.trim() || undefined,
            })
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (!open) return
        fetchDataWithLoading()
    }, [open, search, page, limit])

    const handlePageChange = (newPage: number) => {
        currentPageRef.current = newPage
        setPage(newPage)
    }

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setPage(1)
    }

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Selecionar Cliente"
            maxWidth="3xl"
        >
            <div className="flex flex-col gap-4 min-h-[400px] ">
                <Input
                    placeholder="Buscar cliente..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1)
                    }}
                />

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading
                                ? Array.from({ length: limit }).map((_, i) => (
                                    <TableRow key={i} className="h-10">
                                        <TableCell>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))
                                : clientList.length > 0
                                    ? clientList.map((client: any) => (
                                        <TableRow
                                            key={client.id}
                                            className="cursor-pointer hover:bg-muted"
                                            onClick={() => {
                                                onSelect(client)
                                                onOpenChange(false)
                                            }}
                                        >
                                            <TableCell>{client.name}</TableCell>
                                            <TableCell>{client.email || ''}</TableCell>
                                        </TableRow>
                                    ))
                                    : Array.from({ length: limit }).map((_, i) => (
                                        <TableRow key={i} className="h-10">
                                            <TableCell colSpan={2} className="text-center">
                                                Nenhum resultado encontrado
                                            </TableCell>
                                        </TableRow>
                                    ))}
                        </TableBody>
                    </Table>
                </div>

                <Pagination page={page}
                    limit={limit}
                    total={clientTotal}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    showLimitSelector={false}
                    showJumpInput />


            </div>
        </Modal>
    )
}
