// components/table/SkeletonTable.tsx
"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableProps {
    rows: number;
    columns: number;
    rowHeight?: string;
}

export function SkeletonTable({
    rows,
    columns,
    rowHeight = "h-12",
}: SkeletonTableProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <TableRow key={`skeleton-row-${rowIdx}`}>
                    {Array.from({ length: columns }).map((_, colIdx) => (
                        <TableCell key={`skeleton-col-${rowIdx}-${colIdx}`} className={rowHeight}>
                            <Skeleton className="h-4 w-3/4" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}
