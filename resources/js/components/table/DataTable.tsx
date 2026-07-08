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
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {pagination && pagination.total > 0 && (
                    <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-3">
                        <p className="text-sm text-gray-600">
                            Showing{' '}
                            <span className="font-medium text-gray-900">{pagination.from}</span>{' '}
                            to{' '}
                            <span className="font-medium text-gray-900">{pagination.to}</span>{' '}
                            of{' '}
                            <span className="font-medium text-gray-900">{pagination.total}</span>{' '}
                            results
                        </p>
                    </div>
                )}

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/80">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 ${col.className ?? ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-16">
                                    <div className="flex flex-col items-center gap-3 text-gray-400">
                                        <FolderOpen size={40} strokeWidth={1.5} />
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
                                    className={`even:bg-gray-50 hover:bg-primary-100 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                >
                                    {columns.map((col, i) => (
                                        <td
                                            key={i}
                                            className={`px-6 py-3.5 text-sm text-gray-500 ${col.className ?? ''}`}
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
        <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
                Page {meta.current_page} of {meta.last_page}
            </p>
            <div className="flex items-center gap-1">
                <Link
                    href={`${baseUrl}${separator}page=${meta.current_page - 1}`}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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
                        className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            page === meta.current_page
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        preserveScroll
                    >
                        {page}
                    </Link>
                ))}
                <Link
                    href={`${baseUrl}${separator}page=${meta.current_page + 1}`}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
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
