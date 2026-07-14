import { Link } from '@inertiajs/react'
import { FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { type ReactNode } from 'react'

interface PaginationMeta {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
}

export interface Column<T> {
    header: string
    cell: (row: T) => ReactNode
    className?: string
}

interface DataTableProps<T> {
    data: T[]
    keyExtractor: (row: T) => string | number
    columns: Column<T>[]
    emptyMessage?: string
    emptyDescription?: string
    pagination?: PaginationMeta
    baseUrl?: string
    onRowClick?: (row: T) => void
}

export default function DataTable<T>({
    data,
    keyExtractor,
    columns,
    emptyMessage = 'No results found',
    emptyDescription = 'Get started by creating a new entry.',
    pagination,
    baseUrl = '',
    onRowClick,
}: DataTableProps<T>) {
    return (
        <>
            <div className="w-full border border-gray-300 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className='bg-white'>
                        <tr className="border-b border-gray-300">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 ${col.className ?? ''}`}
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
                            data.map((row, rowIndex) => (
                                <tr
                                    key={keyExtractor(row)}
                                    className={`transition-all duration-150 ${
                                        rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                                    } ${
                                        onRowClick
                                            ? 'cursor-pointer hover:bg-primary-50/60 hover:[&>td]:text-gray-900'
                                            : ''
                                    }`}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                >
                                    {columns.map((col, i) => (
                                        <td
                                            key={i}
                                            className={`px-6 py-4 text-sm text-gray-600 transition-colors duration-150 ${col.className ?? ''}`}
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

function Pagination({ meta, baseUrl }: { meta: PaginationMeta; baseUrl: string }) {
    const separator = baseUrl.includes('?') ? '&' : '?'

    return (
        <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-500">
                Page {meta.current_page} of {meta.last_page}
            </p>
            <div className="flex items-center gap-1">
                <Link
                    href={`${baseUrl}${separator}page=${meta.current_page - 1}`}
                    className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
                        meta.current_page === 1
                            ? 'pointer-events-none text-gray-300'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    preserveScroll
                    aria-disabled={meta.current_page === 1}
                >
                    <ChevronLeft size={16} />
                    Previous
                </Link>
                {Array.from(
                    { length: meta.last_page },
                    (_, i) => i + 1,
                ).map((page) => (
                    <Link
                        key={page}
                        href={`${baseUrl}${separator}page=${page}`}
                        className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
                            page === meta.current_page
                                ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        preserveScroll
                    >
                        {page}
                    </Link>
                ))}
                <Link
                    href={`${baseUrl}${separator}page=${meta.current_page + 1}`}
                    className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
                        meta.current_page === meta.last_page
                            ? 'pointer-events-none text-gray-300'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    preserveScroll
                    aria-disabled={meta.current_page === meta.last_page}
                >
                    Next
                    <ChevronRight size={16} />
                </Link>
            </div>
        </div>
    )
}
