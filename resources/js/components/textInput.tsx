import { forwardRef, useEffect, useImperativeHandle, useRef, type InputHTMLAttributes } from 'react'
import { TextField } from '@mui/material'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'color' | 'size' | 'className'> & {
   isFocused?: boolean
}

export default forwardRef(function TextInput(
  { type = 'text', isFocused = false, ...props }: Props,
  ref: React.Ref<{ focus: () => void }>,
) {
  const localRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => localRef.current?.focus(),
  }))

  useEffect(() => {
    if (isFocused) localRef.current?.focus()
  }, [isFocused])

  return (
    <TextField
      {...props}
      type={type}
      inputRef={localRef}
      variant="standard"
    />
  )
})
