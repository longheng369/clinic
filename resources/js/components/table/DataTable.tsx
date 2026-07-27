import { Link } from '@inertiajs/react'
import { FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { type ReactNode } from 'react'
import { clsx } from "clsx";
import Pagination from "@/components/table/Pagination";
import { PaginationMeta } from "@/interfaces/IPagination";

export interface Column<T> {
    header: string
    cell: (row: T) => ReactNode
    classNames?: {
        header?: string;
        body?: string;
    }
}

interface Props<T> {
    data: T[]
    keyExtractor: (row: T) => string | number
    columns: Column<T>[]
    emptyMessage?: string
    emptyDescription?: string
    pagination?: PaginationMeta
    baseUrl?: string
    onRowClick?: (row: T) => void
}

const DataTable = <T, >({
    data,
    keyExtractor,
    columns,
    emptyMessage = 'No results found',
    emptyDescription = 'Get started by creating a new entry.',
    pagination,
    baseUrl = '',
    onRowClick,
}: Props<T>) => {
    return (
        <>
            <div className="w-full border border-gray-300 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className='bg-white'>
                        <tr className="border-b border-gray-300">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={clsx('px-6 py-4 text-gray-500 text-sm', col.classNames?.header)}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-20">
                                    <div className="flex flex-col items-center gap-3 text-gray-400">
                                        <FolderOpen size={44} strokeWidth={1.5} className="text-gray-300" />
                                        <p className="text-sm font-medium text-gray-500">
                                            {emptyMessage}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {emptyDescription}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={keyExtractor(row)}
                                    className={`transition-all duration-150 bg-white hover:bg-primary-50 ${
                                        onRowClick
                                            ? 'cursor-pointer hover:bg-primary-50/60 hover:[&>td]:text-gray-900'
                                            : ''
                                    }`}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                >
                                    {columns.map((col, i) => (
                                        <td
                                            key={i}
                                            className={`px-6 py-3 text-sm transition-colors duration-150 ${col.classNames?.body ?? ''}`}
                                        >
                                            {col.cell(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>


            {pagination && pagination.last_page > 1 && (
                <Pagination meta={pagination} baseUrl={baseUrl} />
            )}
        </>
    )
}

export default DataTable;
