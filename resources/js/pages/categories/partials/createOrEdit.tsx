import { useForm } from 'react-hook-form'
import Input from '@/components/form/input'
import Textarea from '@/components/form/textarea'
import { ICategory, ICategoryFormData } from '@/interfaces/ICategory';
import { useState } from 'react';
import { router } from '@inertiajs/react'
import Button from '@/components/button';

interface CategoryFormProps {
    category?: ICategory;
    onClose: () => void;
}

const CategoryForm = ({ category, onClose }: CategoryFormProps) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const { control, handleSubmit } = useForm<ICategoryFormData>({
        defaultValues: category
    });

    const onSubmit = handleSubmit((data) => {
        setIsProcessing(true);
        if (category) {
            router.put(`/settings/categories/${category.id}`, { ...data }, {
                onSuccess: () => onClose(),
                onFinish: () => setIsProcessing(false),
            });

            return;
        }

        router.post('/settings/categories', { ...data }, {
            onSuccess: () => onClose(),
            onFinish: () => setIsProcessing(false),
        })
    })

    return (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Input
                label="Name"
                control={control}
                placeholder='Enter name'
                name='name'
                rules={{ required: 'This field is required' }}
            />

            <Textarea
                label="Description"
                control={control}
                name='description'
            />

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="button"
                    onClick={onClose}
                    color='secondary'
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isProcessing}
                >
                    Submit
                </Button>
            </div>
        </form>
    )
}

export default CategoryForm

