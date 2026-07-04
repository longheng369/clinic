import { useForm } from 'react-hook-form'
import Input from '@/components/form/input'
import Textarea from '@/components/form/textarea'
import { ICategory, ICategoryFormData } from '@/interfaces/ICategory';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import Button from '@/components/button/button';
import { useToast } from '@/components/toast'

interface CategoryFormProps {
    category?: ICategory;
    onClose: () => void;
}

const CategoryForm = ({ category, onClose }: CategoryFormProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast()
    const { control, handleSubmit } = useForm<ICategoryFormData>({
        defaultValues: category
    });

    const onSubmit = handleSubmit((data) => {
        setIsProcessing(true);
        if (category) {
            router.put(`/settings/categories/${category.id}`, { ...data }, {
                onSuccess: () => {
                    onClose();
                    toast('Category updated successfully!', { variant: 'success', description: 'The category has been updated.' });
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            });

            return;
        }

        router.post('/settings/categories', { ...data }, {
            onSuccess: () => {
                onClose();
                toast('Category created successfully!', { variant: 'success', description: 'The category has been updated.' })
            },
            onError: (errors) => {
                if (errors.name) {
                    toast('Unable to create category', {
                        variant: 'error',
                        description: errors.name,
                    });
                }
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        })
    })

    return (
        <form onSubmit={onSubmit} className="border-t border-slate-300" noValidate>
            <div className="space-y-4 p-6">
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
            </div>

            <div className="flex justify-end gap-2 p-2 border-t border-slate-300">
                <Button
                    type="button"
                    onClick={onClose}
                    color='secondary'
                    variant='outlined'
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

