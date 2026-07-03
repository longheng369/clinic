import { forwardRef, useEffect, useImperativeHandle, useRef, type InputHTMLAttributes } from 'react'

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref: React.Ref<{ focus: () => void }>,
) {
    const localRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }))

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus()
        }
    }, [isFocused])

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md border border-gray-300 px-3 py-2.5 shadow-sm outline-hidden focus:outline-2 focus:outline-primary-500 focus:border-primary-500 ' +
                className
            }
            ref={localRef}
        />
    )
})
