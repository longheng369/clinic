import { useState } from 'react'
import { usePage, router } from '@inertiajs/react'
import { Link, Head } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Pencil, Trash2, FolderOpen, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import CategoryForm from './partials/createOrEdit'
import { ICategory } from '@/interfaces/ICategory'
import Button from '@/components/button'

interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

const Index = () => {
  const { openModal, closeModal } = useModal()

  const { categories, flash } = usePage<{
    categories: PaginatedData<ICategory>
    flash: { success?: string }
  }>().props

  const handleCreate = () => {
    openModal({
      title: 'New Category',
      content: <CategoryForm onClose={() => closeModal()} />,
    })
  }

  const handleEdit = (category: ICategory) => {
    openModal({
      title: `Edit ${category.name}`,
      content: <CategoryForm category={category} onClose={() => closeModal()} />,
    })
  }

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete "${name}"? This action cannot be undone.`)) {
      router.delete(`/settings/categories/${id}`)
    }
  }

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
          <Button
            onClick={handleCreate}
            startIcon={<Plus size={20} />}
          >
            New Category
          </Button>
        </div>

        {flash?.success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {flash.success}
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {categories.total > 0 && (
            <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-3">
              <p className="text-sm text-gray-600">
                Showing{' '}
                <span className="font-medium text-gray-900">{categories.from}</span>{' '}
                to{' '}
                <span className="font-medium text-gray-900">{categories.to}</span>{' '}
                of{' '}
                <span className="font-medium text-gray-900">{categories.total}</span>{' '}
                results
              </p>
            </div>
          )}

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <FolderOpen size={40} strokeWidth={1.5} />
                      <p className="text-sm font-medium text-gray-500">
                        No categories found
                      </p>
                      <p className="text-xs text-gray-400">
                        Get started by creating a new category.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.data.map((cat) => (
                  <tr
                    key={cat.id}
                    className="even:bg-gray-50/40 hover:bg-primary-50/30 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-900">
                      {cat.name}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-500 max-w-xs truncate">
                      {cat.description ?? (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(cat.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer"
                          aria-label={`Edit ${cat.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          aria-label={`Delete ${cat.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {categories.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {categories.current_page} of {categories.last_page}
            </p>
            <div className="flex items-center gap-1">
              <Link
                href={`/settings/categories?page=${categories.current_page - 1}`}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  categories.current_page === 1
                    ? 'pointer-events-none text-gray-300'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                preserveScroll
                aria-disabled={categories.current_page === 1}
              >
                <ChevronLeft size={16} />
                Previous
              </Link>
              {Array.from(
                { length: categories.last_page },
                (_, i) => i + 1,
              ).map((page) => (
                <Link
                  key={page}
                  href={`/settings/categories?page=${page}`}
                  className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    page === categories.current_page
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  preserveScroll
                >
                  {page}
                </Link>
              ))}
              <Link
                href={`/settings/categories?page=${categories.current_page + 1}`}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  categories.current_page === categories.last_page
                    ? 'pointer-events-none text-gray-300'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                preserveScroll
                aria-disabled={categories.current_page === categories.last_page}
              >
                Next
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Index
