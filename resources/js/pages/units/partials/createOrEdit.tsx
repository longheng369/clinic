import { useForm } from 'react-hook-form'
import Input from '@/components/form/input-deprecated'
import Textarea from '@/components/form/textarea'
import { IUnit, IUnitFormData } from '@/interfaces/IUnit';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/toast'

interface UnitFormProps {
    unit?: IUnit;
    onClose: () => void;
}

const UnitForm = ({ unit, onClose }: UnitFormProps) => {
   const [isProcessing, setIsProcessing] = useState(false);
   const { toast } = useToast()
   const { control, handleSubmit } = useForm<IUnitFormData>({
      defaultValues: unit
   });

   const onSubmit = handleSubmit((data) => {
      setIsProcessing(true);
      if (unit) {
         router.put(`/settings/units/${unit.id}`, { ...data }, {
            onSuccess: () => {
               onClose();
               toast('Unit updated successfully!', { variant: 'success', description: 'The unit has been updated.' });
            },
            onFinish: () => {
               setIsProcessing(false);
            },
         });

         return;
      }

      router.post('/settings/units', { ...data }, {
         onSuccess: () => {
            onClose();
            toast('Unit created successfully!', { variant: 'success', description: 'The unit has been created.' })
         },
         onError: (errors) => {
            if (errors.name) {
               toast('Unable to create unit', {
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
               variant="outline"
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

export default UnitForm
