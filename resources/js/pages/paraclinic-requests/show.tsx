import { Head, Link, router } from '@inertiajs/react'
import { IParaclinicRequest } from '@/interfaces/IParaclinicRequest'
import { ArrowLeft, FileText, Image, File, Upload, Trash2, Calendar } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useModal } from '@/components/modal'
import { useToast } from '@/components/toast'
import { usePage } from '@inertiajs/react'

const STATUS_BADGES: Record<string, string> = {
    Draft: 'bg-gray-100 text-gray-700',
    Requested: 'bg-blue-100 text-blue-700',
    'Waiting Result': 'bg-amber-100 text-amber-700',
    'Result Received': 'bg-green-100 text-green-700',
    Reviewed: 'bg-indigo-100 text-indigo-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-red-100 text-red-700',
}

const PAYMENT_BADGES: Record<string, string> = {
    Unpaid: 'bg-red-50 text-red-600',
    Partial: 'bg-amber-50 text-amber-600',
    Paid: 'bg-green-50 text-green-600',
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
    Draft: ['Requested', 'Cancelled'],
    Requested: ['Waiting Result', 'Cancelled'],
    'Waiting Result': ['Result Received', 'Cancelled'],
    'Result Received': ['Reviewed', 'Completed'],
    Reviewed: ['Completed'],
    Completed: [],
    Cancelled: [],
}

const fileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image size={20} className="text-blue-500" />
    if (mimeType.includes('pdf')) return <FileText size={20} className="text-red-500" />
    return <File size={20} className="text-gray-500" />
}

const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const Show = ({ request }: { request: IParaclinicRequest }) => {
    const { openAlert } = useModal()
    const { toast } = useToast()
    const [isUploading, setIsUploading] = useState(false)
    const [resultSummary, setResultSummary] = useState(request.results?.[0]?.result_summary ?? '')
    const [doctorInterpretation, setDoctorInterpretation] = useState(request.results?.[0]?.doctor_interpretation ?? '')

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        router.post(`/paraclinic-requests/${request.id}/attachments`, formData, {
            onSuccess: () => toast('File uploaded successfully!', { variant: 'success' }),
            onError: (err) => toast(Object.values(err).join(', ') || 'Upload failed', { variant: 'error' }),
            onFinish: () => setIsUploading(false),
        })

        e.target.value = ''
    }

    const handleDeleteAttachment = (attachment: { id: number; file_name: string }) => {
        openAlert({
            message: `Delete ${attachment.file_name}?`,
            description: 'This action cannot be undone.',
            variant: 'danger',
            confirmLabel: 'Delete',
            onConfirm: () => router.delete(`/paraclinic-requests/${request.id}/attachments/${attachment.id}`),
        })
    }

    const handleStatusChange = (status: string) => {
        router.patch(`/paraclinic-requests/${request.id}/status`, { status }, {
            onSuccess: () => toast(`Status updated to ${status}`, { variant: 'success' }),
        })
    }

    const handleSaveReview = () => {
        router.post(`/paraclinic-requests/${request.id}/results`, {
            result_summary: resultSummary,
            doctor_interpretation: doctorInterpretation,
        }, {
            onSuccess: () => toast('Review saved!', { variant: 'success' }),
            onError: (err) => toast('Failed to save review', { variant: 'error' }),
        })
    }

    const transitions = STATUS_TRANSITIONS[request.status] ?? []

    return (
        <div className='h-screen overflow-y-auto'>
            <Head title={`Request ${request.request_number}`} />

            {/* Header */}
            <div className="border-b border-gray-200 bg-white px-8 py-4 sticky top-0">
                <div className="flex items-center gap-4">
                    <Link
                        href="/paraclinic-requests"
                        className="flex items-center justify-center size-9 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-gray-900">{request.request_number}</h1>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGES[request.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                {request.status}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PAYMENT_BADGES[request.payment_status] ?? 'bg-gray-100 text-gray-700'}`}>
                                {request.payment_status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {request.request_date} &middot; Created by {request.created_by ?? 'N/A'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {request.status !== 'Completed' && request.status !== 'Cancelled' && (
                            <>
                                {request.status === 'Waiting Result' && (
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors">
                                        <Upload size={16} />
                                        Upload Result
                                        <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
                                    </label>
                                )}
                                <div className="relative group">
                                    <Button variant="outline">Update Status</Button>
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                        <div className="py-1">
                                            {transitions.map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleStatusChange(s)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    Mark as {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        <Link href={`/paraclinic-requests/${request.id}`} className="no-underline">
                            <Button variant="outline">Print</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-6">
                {/* General Information */}
                <Section title="General Information">
                    <div className="grid grid-cols-3 gap-6">
                        <InfoItem label="Patient" value={request.patient ? `${request.patient.khmer_last_name} ${request.patient.khmer_first_name}` : null} />
                        <InfoItem label="Doctor" value={request.doctor?.name ?? null} />
                        <InfoItem label="External Facility" value={request.external_facility_name} />
                        <InfoItem label="Request Date" value={request.request_date} />
                        <InfoItem label="Provisional Diagnosis" value={request.provisional_diagnosis} />
                    </div>
                    {request.clinical_reason && (
                        <div className="mt-4">
                            <dt className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Clinical Reason</dt>
                            <dd className="text-sm text-gray-900">{request.clinical_reason}</dd>
                        </div>
                    )}
                    {request.notes && (
                        <div className="mt-4">
                            <dt className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Notes</dt>
                            <dd className="text-sm text-gray-900">{request.notes}</dd>
                        </div>
                    )}
                </Section>

                {/* Diagnostic Tests */}
                <Section title={`Diagnostic Tests (${request.tests.length})`}>
                    {request.tests.length === 0 ? (
                        <p className="text-sm text-gray-400">No tests added.</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Category</th>
                                    <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Test Name</th>
                                    <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Priority</th>
                                    <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Instruction</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {request.tests.map((t, i) => (
                                    <tr key={t.id ?? i} className="even:bg-slate-100/60">
                                        <td className="px-4 py-2.5 text-sm text-gray-700">{t.test_category}</td>
                                        <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{t.test_name}</td>
                                        <td className="px-4 py-2.5 text-sm">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                t.priority === 'STAT' ? 'bg-red-100 text-red-700' :
                                                t.priority === 'Urgent' ? 'bg-amber-100 text-amber-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {t.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-sm text-gray-500">{t.instruction ?? <span className="text-gray-300">&mdash;</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Section>

                {/* Attachments */}
                <Section title="Attachments">
                    <div className="mb-4">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors">
                            <Upload size={16} />
                            Upload File
                            <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
                        </label>
                        <p className="text-xs text-gray-400 mt-1">Max file size: 20 MB</p>
                    </div>
                    {request.attachments.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">No files uploaded yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {request.attachments.map((a) => (
                                <div key={a.id} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                    {fileIcon(a.mime_type)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{a.file_name}</p>
                                        <p className="text-xs text-gray-400">
                                            {formatSize(a.file_size)}
                                            {a.uploaded_by && ` • by ${a.uploaded_by}`}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <a
                                            href={`/paraclinic-requests/attachments/${a.id}/view`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50"
                                        >
                                            View
                                        </a>
                                        <button
                                            onClick={() => handleDeleteAttachment(a)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                {/* Results / Doctor Review */}
                <Section title="Results & Interpretation">
                    <div className="space-y-4">
                        {request.results.length > 0 && (
                            <div className="space-y-3">
                                {request.results.map((r) => (
                                    <div key={r.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                                        <p className="text-xs text-gray-400 mb-2">
                                            {r.result_date && <><Calendar size={12} className="inline mr-1" />{r.result_date} &middot; </>}
                                            Reviewed by {r.reviewed_by ?? 'N/A'}
                                            {r.reviewed_at && ` at ${new Date(r.reviewed_at).toLocaleString()}`}
                                        </p>
                                        {r.result_summary && (
                                            <div className="mb-2">
                                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Summary</p>
                                                <p className="text-sm text-gray-900">{r.result_summary}</p>
                                            </div>
                                        )}
                                        {r.doctor_interpretation && (
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Interpretation</p>
                                                <p className="text-sm text-gray-900">{r.doctor_interpretation}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {(request.status === 'Waiting Result' || request.status === 'Result Received') && (
                            <div className="space-y-4 border-t border-gray-200 pt-4">
                                <h4 className="text-sm font-semibold text-gray-900">Doctor Review</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Result Summary</label>
                                    <textarea
                                        value={resultSummary}
                                        onChange={(e) => setResultSummary(e.target.value)}
                                        rows={4}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                        placeholder="Enter result summary..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Interpretation</label>
                                    <textarea
                                        value={doctorInterpretation}
                                        onChange={(e) => setDoctorInterpretation(e.target.value)}
                                        rows={4}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                        placeholder="Enter interpretation..."
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleStatusChange('Reviewed')}>Mark as Reviewed</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Section>

                {/* Billing */}
                <Section title="Billing">
                    <div className="grid grid-cols-3 gap-6">
                        <InfoItem label="Subtotal" value={`$${(request.subtotal ?? 0).toFixed(2)}`} />
                        <InfoItem label="Discount" value={`$${(request.discount ?? 0).toFixed(2)}`} />
                        <InfoItem label="Total Amount" value={<span className="font-semibold">${(request.total_amount ?? 0).toFixed(2)}</span>} />
                        <InfoItem label="Payment Status" value={
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PAYMENT_BADGES[request.payment_status] ?? 'bg-gray-100 text-gray-700'}`}>
                                {request.payment_status}
                            </span>
                        } />
                        <InfoItem label="Payment Date" value={request.payment_date} />
                    </div>
                </Section>

                {/* Timeline */}
                <Section title="Timeline">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="size-2 rounded-full bg-primary-500" />
                            <span className="text-gray-600">Created</span>
                            <span className="text-gray-400">{new Date(request.created_at).toLocaleString()}</span>
                            {request.created_by && <span className="text-gray-400">by {request.created_by}</span>}
                        </div>
                        {request.updated_at !== request.created_at && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="size-2 rounded-full bg-gray-400" />
                                <span className="text-gray-600">Last updated</span>
                                <span className="text-gray-400">{new Date(request.updated_at).toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </Section>
            </div>
        </div>
    )
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">{title}</h2>
        {children}
    </div>
)

const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
        <dt className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">{label}</dt>
        <dd className={`text-sm ${value !== null && value !== undefined ? 'text-gray-900' : 'text-gray-300'}`}>
            {value ?? <span>&mdash;</span>}
        </dd>
    </div>
)

export default Show
