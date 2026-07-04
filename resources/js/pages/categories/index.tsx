import { usePage, router, useForm } from '@inertiajs/react'
import { Link } from '@inertiajs/react'
import { useModal } from '@/components/modal'
import { Head } from '@inertiajs/react'

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  created_at: string
}

interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

const CreateCategoryForm = ({ onClose }: { onClose: () => void }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    slug: '',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/categories', {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
        {errors["name"] && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium">
          Slug
        </label>
        <input
          id="slug"
          type="text"
          value={data.slug}
          onChange={(e) => setData('slug', e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={data.description}
          onChange={(e) => setData('description', e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded border px-4 py-2 text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={processing}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {processing ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

const Index = () => {
  const { openModal, closeModal } = useModal()

  const { categories, flash } = usePage<{
    categories: PaginatedData<Category>
    flash: { success?: string }
  }>().props

  const handleCreate = () => {
    openModal({
      title: 'New Category',
      content: <CreateCategoryForm onClose={() => closeModal()} />,
    })
  }

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete "${name}"?`)) {
      router.delete(`/categories/${id}`)
    }
  }

  return (
    <>
        <Head title="Categories" />
        <div className="p-8">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Categories</h1>
            <button
            onClick={handleCreate}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
            New Category
            </button>
        </div>

        {flash?.success && (
            <div className="mb-4 rounded border border-green-300 bg-green-50 p-4 text-green-800">
            {flash.success}
            </div>
        )}

        <div className="overflow-x-auto rounded border">
            <table className="w-full text-left">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                    Name
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                    Slug
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                    Description
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                    Created
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                    Actions
                </th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {categories.data.length === 0 ? (
                <tr>
                    <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-gray-500"
                    >
                    No categories found.
                    </td>
                </tr>
                ) : (
                categories.data.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                    <td className="px-4 py-3 text-gray-500">
                        {cat.description ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                        {new Date(cat.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                        <Link
                        href={`/categories/${cat.id}/edit`}
                        className="text-blue-600 hover:underline"
                        >
                        Edit
                        </Link>
                        <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="text-red-600 hover:underline"
                        >
                        Delete
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>

        {categories.last_page > 1 && (
            <div className="mt-4 flex justify-center gap-2">
            {Array.from(
                { length: categories.last_page },
                (_, i) => i + 1,
            ).map((page) => (
                <Link
                key={page}
                href={`/categories?page=${page}`}
                className={`rounded px-3 py-1 text-sm ${
                    page === categories.current_page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                preserveScroll
                >
                {page}
                </Link>
            ))}
            </div>
        )}
        </div>
    </>
  )
}

export default Index
