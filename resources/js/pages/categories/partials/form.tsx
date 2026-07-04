import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Input from '@/components/form/input'

interface CategoryFormData {
  name: string
  slug: string
  description: string
}

interface CategoryFormProps {
  defaultValues: CategoryFormData
  errors: Record<string, string>
  processing: boolean
  onSubmit: (data: CategoryFormData) => void
  onCancel: () => void
  submitLabel: string
}

const CategoryForm = ({
  defaultValues,
  errors: serverErrors,
  processing,
  onSubmit,
  onCancel,
  submitLabel,
}: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    control
  } = useForm<CategoryFormData>({
    defaultValues,
  })

  useEffect(() => {
    Object.entries(serverErrors).forEach(([field, message]) => {
      setError(field as keyof CategoryFormData, { message })
    })
  }, [serverErrors, setError])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
                label="Name"
                control={control}
                placeholder='Enter name'
                name='name'
                rules={{ required: 'This field is required' }}
            />

            <Input
                label="Slug"
                control={control}
                name='slug'
                rules={{ required: 'This field is required' }}
            />


            <div className="flex justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                    {processing ? 'Saving...' : submitLabel}
                </button>
            </div>
        </form>
    )
}

export default CategoryForm

