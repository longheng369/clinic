import { Link, useForm, usePage, Head } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

const Edit = () => {
  const { category } = usePage<{ category: Category }>().props

  const { data, setData, put, processing, errors } = useForm({
    name: category.name,
    slug: category.slug,
    description: category.description ?? '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/settings/categories/${category.id}`)
  }

  return (
    <>
      <Head title={`Edit ${category.name}`} />
      <div className="p-8">
        <div className="mb-6">
          <Link
            href="/settings/categories"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Categories
          </Link>
        </div>

        <h1 className="mb-8 text-2xl font-bold text-gray-900">Edit Category</h1>

        <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              value={data.slug}
              onChange={(e) => setData('slug', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/settings/categories"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {processing ? 'Saving...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Edit
