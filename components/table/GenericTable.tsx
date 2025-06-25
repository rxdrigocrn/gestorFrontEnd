import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'

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
}

export function GenericTable<T>({
    data,
    columns,
    rowKey,
    actions,
    onRowClick
}: GenericTableProps<T>) {
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
        </div>
    )
}
