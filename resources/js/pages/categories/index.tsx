import { usePage, router } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, Plus } from 'lucide-react'
import CategoryForm from './partials/createOrEdit'
import { ICategory } from '@/interfaces/ICategory'
import { Button } from '@/components/ui/button'
import IconButton from '@/components/button/iconButton'
import DataTable, { type Column } from '@/components/table/DataTable'
import { useState, useEffect } from 'react'
import SearchBar from '@/components/searchBar'
import { formatCreatedDateTime } from '@/utils/date'

interface PaginatedData<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
}

const Category = () => {
   const { openModal, closeModal, openAlert } = useModal()

   const { categories, search: searchProp } = usePage<{
        categories: PaginatedData<ICategory>
        search: string | null
    }>().props

   const [searchTerm, setSearchTerm] = useState(searchProp ?? '')

   useEffect(() => {
      const timeout = setTimeout(() => {
         if ((searchTerm || '') === (searchProp || '')) return
         if (searchTerm) {
            router.get('/settings/categories', { search: searchTerm }, { preserveState: true, replace: true })
         } else {
            router.get('/settings/categories', {}, { preserveState: true, replace: true })
         }
      }, 300)

      return () => clearTimeout(timeout)
   }, [searchTerm])

   const baseUrl = searchProp
      ? `/settings/categories?search=${encodeURIComponent(searchProp)}`
      : '/settings/categories'

   const handleCreate = () => {
      openModal({
         title: 'New Category',
         content: <CategoryForm onClose={() => closeModal()} />,
         config: { preventClickAway: true }
      })
   }

   const handleEdit = (category: ICategory) => {
      openModal({
         title: `Edit ${category.name}`,
         content: <CategoryForm category={category} onClose={() => closeModal()} />,
         config: { preventClickAway: true }
      })
   }

   const handleDelete = (cat: ICategory) => {
      openAlert({
         message: 'Delete this category?',
         description: 'This action cannot be undone.',
         variant: 'danger',
         confirmLabel: 'Delete',
         onConfirm: () => router.delete(`/settings/categories/${cat.id}`)
      })
   }

   const columns: Column<ICategory>[] = [
      {
         header: 'ឈ្មោះ',
         classNames: { header: 'font-khmer tracking-wide' },
         cell: (cat) => cat.name,
      },
      {
         header: 'ការពិពណ៌នា',
         classNames: { header: 'font-khmer tracking-wide' },
         cell: (cat) => cat.description ?? <span className="text-gray-300">&mdash;</span>,
      },
      {
         header: 'បានបង្កើត',
         classNames: { header: 'font-khmer tracking-wide' },
         cell: (cat) => formatCreatedDateTime(cat.created_at),
      },
      {
         header: 'សកម្មភាព',
         classNames: { header: 'font-khmer text-end tracking-wide' },
         cell: (cat) => (
            <div className="flex items-center justify-end">
               <IconButton onClick={() => handleEdit(cat)} aria-label={`Edit ${cat.name}`}>
                  <Pencil size={16} />
               </IconButton>
               <IconButton color="error" onClick={() => handleDelete(cat)} aria-label={`Delete ${cat.name}`}>
                  <Trash2 size={16} />
               </IconButton>
            </div>
         ),
      },
   ]

   const { data, ...pagination } = categories

   return (
      <>
         <Head title="Categories" />
         <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                  <p className="mt-1 text-sm text-gray-500">
                            Manage your clinic categories
                  </p>
               </div>
               <div className="flex items-center gap-3">
                  <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search category'/>
                  <Button
                     onClick={handleCreate}
                     size="lg"
                  >
                     <Plus size={20} /> New Category
                  </Button>
               </div>
            </div>

            <DataTable
               data={data}
               keyExtractor={(cat) => cat.id}
               columns={columns}
               emptyMessage="No categories found"
               emptyDescription="Get started by creating a new category."
               pagination={pagination}
               baseUrl={baseUrl}
            />
         </div>
      </>
   )
}

export default Category
