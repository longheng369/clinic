import React from 'react';
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationMeta } from "@/interfaces/IPagination";

interface Props {
    meta: PaginationMeta;
    baseUrl: string;
}

const Pagination = ({ meta, baseUrl }: Props) => {
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

export default Pagination;
