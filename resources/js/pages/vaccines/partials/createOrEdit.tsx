import { useForm, useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import type { FormDataConvertible } from '@inertiajs/core'
import Input from '@/components/form/input'
import Textarea from '@/components/form/textarea'
import { IVaccine, IVaccineFormData, IVaccineRule } from '@/interfaces/IVaccine'
import { useState } from 'react'
import { router } from '@inertiajs/react'
import { useToast } from '@/components/toast'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button';

interface VaccineFormProps {
    vaccine?: IVaccine
    onClose: () => void
}

const defaultRule: IVaccineRule = {
    min_age_months: 0,
    max_age_months: null,
    doses: [{ dose_number: 1, interval_days: 0 }],
}

const VaccineForm = ({ vaccine, onClose }: VaccineFormProps) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const { toast } = useToast()
    const { control, handleSubmit, register } = useForm<IVaccineFormData>({
        defaultValues: vaccine ?? {
            name: '',
            description: '',
            rules: [defaultRule],
        },
    })

    const { fields: ruleFields, append: appendRule, remove: removeRule } = useFieldArray({
        control,
        name: 'rules',
    })

    const onSubmit = handleSubmit((data) => {
        setIsProcessing(true)
        const payload = {
            name: data.name,
            description: data.description ?? '',
            rules: data.rules,
        }

        if (vaccine) {
            router.put(`/vaccines/${vaccine.id}`, payload as unknown as Record<string, FormDataConvertible>, {
                onSuccess: () => {
                    onClose()
                    toast('Vaccine updated successfully!', { variant: 'success', description: 'The vaccine has been updated.' })
                },
                onFinish: () => setIsProcessing(false),
            })
            return
        }

        router.post('/vaccines', payload as Record<string, FormDataConvertible>, {
            onSuccess: () => {
                onClose()
                toast('Vaccine created successfully!', { variant: 'success', description: 'The vaccine has been created.' })
            },
            onError: (errs) => {
                if (errs.name) {
                    toast('Unable to create vaccine', {
                        variant: 'error',
                        description: errs.name,
                    })
                }
            },
            onFinish: () => setIsProcessing(false),
        })
    })

    return (
        <form onSubmit={onSubmit} className="border-t border-slate-300" noValidate>
            <div className="space-y-4 p-6">
                <Input
                    label="Name"
                    control={control}
                    placeholder="Enter vaccine name"
                    name="name"
                    rules={{ required: 'This field is required' }}
                />

                <Textarea
                    label="Description"
                    control={control}
                    name="description"
                />

                <div className="border rounded-lg border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">Age Rules &amp; Dose Schedule</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendRule(defaultRule)}
                        >
                            <Plus size={16} /> Add Age Rule
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {ruleFields.map((ruleField, ruleIndex) => (
                            <RuleBlock
                                key={ruleField.id}
                                control={control}
                                register={register}
                                ruleIndex={ruleIndex}
                                onRemove={() => removeRule(ruleIndex)}
                                canRemove={ruleFields.length > 1}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 p-2 border-t border-slate-300">
                <Button type="button" onClick={onClose} variant="outline">
                    Cancel
                </Button>
                <Button type="submit" disabled={isProcessing}>
                    Submit
                </Button>
            </div>
        </form>
    )
}

interface RuleBlockProps {
    control: Control<IVaccineFormData>
    register: UseFormRegister<IVaccineFormData>
    ruleIndex: number
    onRemove: () => void
    canRemove: boolean
}

const RuleBlock = ({ control, register, ruleIndex, onRemove, canRemove }: RuleBlockProps) => {
    const { fields: doseFields, append: appendDose, remove: removeDose } = useFieldArray({
        control,
        name: `rules.${ruleIndex}.doses` as const,
    })

    return (
        <div className="border border-gray-200 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-600">Age Rule #{ruleIndex + 1}</h4>
                {canRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                        <Trash2 size={14} /> Remove
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Min Age (months)</label>
                    <input
                        type="number"
                        min={0}
                        {...register(`rules.${ruleIndex}.min_age_months`, {
                            required: 'Required',
                            valueAsNumber: true,
                        })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Max Age (months) — leave empty for no limit</label>
                    <input
                        type="number"
                        min={0}
                        {...register(`rules.${ruleIndex}.max_age_months`, { setValueAs: (v) => (v === '' || v === null ? null : Number(v)) })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Doses</span>
                    <button
                        type="button"
                        onClick={() => {
                            const nextNumber = doseFields.length + 1
                            appendDose({ dose_number: nextNumber, interval_days: 0 })
                        }}
                        className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1"
                    >
                        <Plus size={12} /> Add Dose
                    </button>
                </div>

                <div className="space-y-2">
                    {doseFields.map((doseField, doseIndex) => (
                        <div key={doseField.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-1">
                                <span className="text-sm font-medium text-gray-500">#{doseIndex + 1}</span>
                                <input type="hidden" {...register(`rules.${ruleIndex}.doses.${doseIndex}.dose_number`, { valueAsNumber: true })} />
                            </div>
                            <div className="col-span-5">
                                <label className="block text-xs text-gray-400 mb-0.5">Interval (days)</label>
                                <input
                                    type="number"
                                    min={0}
                                    {...register(`rules.${ruleIndex}.doses.${doseIndex}.interval_days`, {
                                        required: 'Required',
                                        valueAsNumber: true,
                                    })}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div className="col-span-4">
                                <label className="block text-xs text-gray-400 mb-0.5">Due (approx)</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={doseIndex === 0 ? 'Birth' : `Day ${doseIndex > 0 ? (doseFields[doseIndex]?.interval_days ?? 0) : 0}`}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                                />
                            </div>
                            <div className="col-span-2 flex items-end justify-end pb-0.5">
                                {doseFields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDose(doseIndex)}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default VaccineForm
