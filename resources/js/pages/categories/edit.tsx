import { Link, useForm, usePage } from '@inertiajs/react'

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
    put(`/categories/${category.id}`)
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/categories" className="text-blue-600 hover:underline">
          &larr; Back to Categories
        </Link>
      </div>

      <h1 className="mb-6 text-2xl font-bold">Edit Category</h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
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
          {errors.name && (
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

        <button
          type="submit"
          disabled={processing}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {processing ? 'Saving...' : 'Update Category'}
        </button>
      </form>
    </div>
  )
}

export default Edit
