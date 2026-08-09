import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Stack } from '@mui/material'
import { FolderOpen } from 'lucide-react'
import { type ReactNode } from 'react'
import Pagination from '@/components/table/Pagination'
import { PaginationMeta } from '@/interfaces/IPagination'

export interface Column<T> {
   header: string
   cell: (row: T) => ReactNode
   classNames?: {
      header?: string
      body?: string
   }
}

type Props<T> = {
   data: T[]
   keyExtractor: (row: T) => string | number
   columns: Column<T>[]
   emptyMessage?: string
   emptyDescription?: string
   pagination?: PaginationMeta
   baseUrl?: string
   onRowClick?: (row: T) => void
}

const DataTable = <T,>({
   data,
   keyExtractor,
   columns,
   emptyMessage = 'No results found',
   emptyDescription = 'Get started by creating a new entry.',
   pagination,
   baseUrl = '',
   onRowClick,
}: Props<T>) => (
      <>
         <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Table>
               <TableHead>
                  <TableRow>
                     {columns.map((column) => (
                        <TableCell key={column.header} sx={{ color: 'text.secondary', fontSize: 14, fontWeight: 500 }}>
                           {column.header}
                        </TableCell>
                     ))}
                  </TableRow>
               </TableHead>
               <TableBody>
                  {data.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={columns.length} sx={{ py: 10 }}>
                           <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
                              <FolderOpen size={44} strokeWidth={1.5} color="#cbd5e1" />
                              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{emptyMessage}</Typography>
                              <Typography variant="caption" color="text.disabled">{emptyDescription}</Typography>
                           </Stack>
                        </TableCell>
                     </TableRow>
                  ) : data.map((row) => (
                     <TableRow
                        key={keyExtractor(row)}
                        hover={!!onRowClick}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                        sx={onRowClick ? { cursor: 'pointer' } : undefined}
                     >
                        {columns.map((column) => (
                           <TableCell key={column.header} sx={{ fontSize: 14 }}>
                              {column.cell(row)}
                           </TableCell>
                        ))}
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
         {pagination && pagination.last_page > 1 && <Pagination meta={pagination} baseUrl={baseUrl} />}
      </>
   )

export default DataTable
