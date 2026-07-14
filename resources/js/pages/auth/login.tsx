import InputError from '@/components/inputError'
import InputLabel from '@/components/inputLabel'
import { Button } from '@/components/ui/button'
import TextInput from '@/components/textInput'
import { Head, Link, useForm } from '@inertiajs/react'
import { LogIn, Mail, Lock, Stethoscope } from 'lucide-react'

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('login'), {
            onFinish: () => reset('password'),
        })
    }

    return (
        <>
            <Head title="Log in" />

            <div className="text-center">
                <div className="mx-auto mb-4 flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20">
                    <Stethoscope className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                <p className="mt-1 text-sm text-gray-500">Sign in to your clinic account</p>
            </div>

            {status && (
                <div className="mt-4 rounded-xl bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700 border border-primary-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full pl-10"
                            autoComplete="username"
                            isFocused={true}
                            placeholder="you@clinic.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full pl-10"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded-lg border-primary-300 text-primary-600 focus:ring-primary-500 accent-primary-600"
                        />
                        <span className="text-sm text-gray-600">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <Button className="w-full justify-center py-2.5" disabled={processing}>
                    {processing ? (
                        <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Signing in...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <LogIn className="h-4 w-4" />
                            Sign in
                        </span>
                    )}
                </Button>
            </form>
        </>
    )
}
