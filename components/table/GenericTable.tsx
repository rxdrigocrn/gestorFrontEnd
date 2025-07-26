import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'

import Loader from '@/components/loaders/loader'
import ErrorBadge from '@/components/ui/error-badge'
import { Pagination } from './Pagination'
import { Button } from '../ui/button'

export interface Column<T> {
    header: string
    accessor: keyof T | ((row: T) => React.ReactNode)
    className?: string
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
}: GenericTableProps<T>) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader />
            </div>
        )
    }

    if (error) {
        const message = typeof error === 'string' ? error : 'Erro ao carregar os dados.'
        return (
            <div className="flex justify-center items-center min-h-[30vh]">
                <ErrorBadge message={message} />
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col, i) => (
                            <TableHead key={i} className={col.className}>
                                {col.header}
                            </TableHead>
                        ))}
                        {actions && <TableHead className="text-right">Ações</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row) => (
                        <TableRow
                            key={rowKey(row)}
                            className="hover:bg-muted/50 cursor-pointer"
                            onClick={() => onRowClick?.(row)}
                        >
                            {columns.map((col, i) => (
                                <TableCell key={i}>
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
