import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Pagination } from './Pagination'
import { Skeleton } from '../ui/skeleton'
import ErrorBadge from '@/components/ui/error-badge'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import React from 'react'

export interface Column<T> {
    header: string
    accessor: keyof T | ((row: T) => React.ReactNode)
    className?: string
    sortKey?: string  
}

interface GenericTableProps<T> {
    data: T[]
    columns: Column<T>[]
    rowKey: (row: T) => string
    actions?: (row: T) => React.ReactNode
    onRowClick?: (row: T) => void
    pagination?: {
        page: number
        limit: number
        total: number
        onPageChange: (page: number) => void
        onLimitChange: (limit: number) => void
    }
    isLoading?: boolean
    error?: boolean | string
    sortConfig?: {
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
    }
    onSort?: (key: string) => void
}

export function GenericTable<T>({
    data,
    columns,
    rowKey,
    actions,
    onRowClick,
    pagination,
    isLoading,
    error,
    sortConfig,
    onSort
}: GenericTableProps<T>) {
    if (error) return <ErrorBadge message={typeof error === 'string' ? error : 'Erro ao carregar dados.'} />
    const skeletonRows = pagination?.limit || 5

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader className='bg-primary'>
                    <TableRow>
                        {columns.map((col, i) => {
                            const isSorted = sortConfig?.sortBy === col.sortKey;
                            const isAsc = sortConfig?.sortOrder === 'asc';
                            const canSort = !!col.sortKey && !!onSort;

                            return (
                                <TableHead
                                    key={i}
                                    className={`${col.className} text-black select-none transition-colors`}
                                    onClick={() => canSort && onSort(col.sortKey!)}
                                    style={{ cursor: canSort ? 'pointer' : 'default' }}
                                >
                                    <div className={`flex items-center gap-2 ${col.className?.includes('text-right') ? 'justify-end' :
                                        col.className?.includes('text-center') ? 'justify-center' : 'justify-start'
                                        }`}>
                                        {col.header}

                                        {canSort && (
                                            <span className="ml-1">
                                                {isSorted ? (
                                                    isAsc ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                                                ) : (
                                                    <ArrowUpDown className="h-4 w-4 opacity-30 hover:opacity-100" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </TableHead>
                            )
                        })}
                        {actions && <TableHead className="text-right text-black">Ações</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading
                        ? Array.from({ length: skeletonRows }).map((_, idx) => (
                            <TableRow key={idx}>
                                {columns.map((col, i) => (
                                    <TableCell key={i} className={col.className ?? ''}>
                                        <Skeleton className="h-4 w-full rounded animate-pulse" />
                                    </TableCell>
                                ))}
                                {actions && (
                                    <TableCell className="text-right">
                                        <Skeleton className="h-4 w-12 rounded animate-pulse" />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                        : data.map((row) => (
                            <TableRow
                                key={rowKey(row)}
                                className={onRowClick ? 'hover:bg-muted/50 cursor-pointer' : ''}
                                onClick={() => onRowClick?.(row)}
                            >
                                {columns.map((col, i) => (
                                    <TableCell key={i} className={col.className ?? ''}>
                                        {typeof col.accessor === 'function'
                                            ? col.accessor(row)
                                            : String(row[col.accessor])}
                                    </TableCell>
                                ))}
                                {actions && (
                                    <TableCell className="text-right">{actions(row)}</TableCell>
                                )}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

            {pagination && (
                <Pagination
                    page={pagination.page}
                    limit={pagination.limit}
                    total={pagination.total}
                    onPageChange={pagination.onPageChange}
                    onLimitChange={pagination.onLimitChange}
                />
            )}
        </div>
    )
}