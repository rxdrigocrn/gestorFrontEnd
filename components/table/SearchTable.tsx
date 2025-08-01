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

type Column<T> = {
    key: keyof T
    label: string
    render?: (value: T) => React.ReactNode
}

type Props<T> = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    columns: Column<T>[]
    fetchData: (params: {
        search: string
        searchKey: keyof T
        page: number
        limit: number
    }) => Promise<{ data: T[]; total: number }>
    onSelect: (row: T) => void
}

export function SearchTable<T extends { id: string | number }>({
    open,
    onOpenChange,
    title = 'Buscar',
    columns,
    fetchData,
    onSelect,
}: Props<T>) {
    const [search, setSearch] = useState('')
    const [searchKey, setSearchKey] = useState<keyof T>(columns[0].key)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [data, setData] = useState<T[]>([])
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const currentPageRef = useRef(page)

    const fetchDataWithLoading = async () => {
        setIsLoading(true)
        try {
            const result = await fetchData({
                search,
                searchKey,
                page: currentPageRef.current,
                limit,
            })
            if (currentPageRef.current === page) {
                setData(result.data)
                setTotal(result.total)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!open) return
        fetchDataWithLoading()
    }, [open, search, searchKey, page, limit])

    const handlePageChange = (newPage: number) => {
        currentPageRef.current = newPage
        setPage(newPage)
    }

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setPage(1)
    }
    return (
        <Modal open={open} onOpenChange={onOpenChange} title={title} maxWidth="3xl">
            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <Select
                        value={String(searchKey)}
                        onValueChange={(val) => {
                            setSearchKey(val as keyof T)
                            setPage(1)
                        }}
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Campo" />
                        </SelectTrigger>
                        <SelectContent>
                            {columns.map((col) => (
                                <SelectItem key={String(col.key)} value={String(col.key)}>
                                    {col.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                    />
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={String(col.key)}>{col.label}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Exibe esqueletos de carregamento
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell key={String(col.key)}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((item) => (
                                <TableRow
                                    key={String(item.id)}
                                    className="cursor-pointer hover:bg-muted"
                                    onClick={() => {
                                        onSelect(item)
                                        close()
                                    }}
                                >
                                    {columns.map((col) => (
                                        <TableCell key={String(col.key)}>
                                            {col.render ? col.render(item) : String(item[col.key])}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    Nenhum resultado encontrado
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Pagination
                    page={page}
                    limit={limit}
                    total={total}
                    onPageChange={handlePageChange}
                    onLimitChange={(newLimit) => {
                        setLimit(newLimit)
                        setPage(1)
                    }}
                />
            </div>
        </Modal>
    )
}