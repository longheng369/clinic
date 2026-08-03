import { useController, type Control, type FieldValues, type Path, type RegisterOptions } from 'react-hook-form'
import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, Grid } from '@mui/material'
import { cn } from '@/utils/cn'
import { type OptionType } from '../consultationTemplate'

const KHMER_REGEX = /[\u1780-\u17FF\u19E0-\u19FF]/

const hasKhmer = (text?: string): boolean => KHMER_REGEX.test(text ?? '')

type CheckboxGroupProps<T extends FieldValues = FieldValues> = {
    control: Control<T>
    name: Path<T>
    rules?: Omit<RegisterOptions<T, Path<T>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
    options: OptionType[]
    label?: string
    disabled?: boolean
}

const ConsultationCheckboxGroup = <T extends FieldValues = FieldValues>({
    control,
    name,
    rules,
    options,
    label,
    disabled,
}: CheckboxGroupProps<T>) => {
    const { field, fieldState: { error } } = useController({ control, name, rules })

    const value: string[] = Array.isArray(field.value) ? field.value : []
    const isNormal = value.includes('NORMAL')
    const checkDisabled = disabled || isNormal

    const handleChange = (option: OptionType) => {
        if (!option.value) return
        if (value.includes(option.value)) {
            field.onChange(value.filter((v) => v !== option.value))
        } else {
            field.onChange([...value.filter((v) => v !== 'NORMAL'), option.value])
        }
    }

    return (
        <FormControl component="fieldset" sx={{ width: '100%' }}>
            {label && (
                <Box component="legend" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary' }}>
                    {label} {rules?.required && <Box component="span" sx={{ color: 'error.main' }}>*</Box>}
                </Box>
            )}
            <Grid container spacing={0.5}>
                {options.map((option, idx) => {
                    if (option.text || !option.value) {
                        return (
                            <Grid key={idx} size={12}>
                                <Box
                                    component="span"
                                    className={cn('text-base font-semibold text-gray-800', hasKhmer(option.text) && 'font-khmer')}
                                >
                                    {option.text}
                                </Box>
                            </Grid>
                        )
                    }

                    const isChecked = value.includes(option.value)

                    return (
                        <Grid key={option.value} size={option.colSpan ?? 3}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isChecked}
                                        disabled={checkDisabled}
                                        onChange={() => handleChange(option)}
                                        size="small"
                                        sx={{ p: 0.5 }}
                                    />
                                }
                                label={
                                    <span className={cn('text-base', hasKhmer(option.label) && 'font-khmer')}>
                                        {option.label}
                                    </span>
                                }
                                sx={{ m: 0, gap: 0.5 }}
                            />
                        </Grid>
                    )
                })}
            </Grid>
            {error?.message && <FormHelperText error>{error.message}</FormHelperText>}
        </FormControl>
    )
}

export default ConsultationCheckboxGroup