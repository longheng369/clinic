import { useState } from 'react'
import { router } from '@inertiajs/react'
import { useToast } from '@/components/toast'
import { useModal } from '@/components/modal'
import Button from '@/components/button/button'
import { Upload, Trash2, FileText, Image, File } from 'lucide-react'
import { usePage } from '@inertiajs/react'

interface Attachment {
    id: number
    file_name: string
    file_path: string
    file_type: string
    file_size: number
    uploaded_by: { id: number; name: string } | null
    created_at: string
}

const fileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={20} className="text-blue-500" />
    if (type.includes('pdf')) return <FileText size={20} className="text-red-500" />
    return <File size={20} className="text-gray-500" />
}

const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const AttachmentsTab = ({ patientId }: { patientId: number }) => {
    const [isUploading, setIsUploading] = useState(false)
    const { toast } = useToast()
    const { openAlert } = useModal()
    const { attachments } = usePage<{ attachments: Attachment[] }>().props

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        router.post(`/patients/${patientId}/attachments`, formData, {
            onSuccess: () => toast('File uploaded successfully!', { variant: 'success' }),
            onError: (errors) => {
                const msg = Object.values(errors).join(', ') || 'Failed to upload file'
                toast(msg, { variant: 'error' })
            },
            onFinish: () => setIsUploading(false),
        })

        e.target.value = ''
    }

    const handleDelete = (attachment: Attachment) => {
        openAlert({
            message: 'Delete this attachment?',
            description: 'This action cannot be undone.',
            variant: 'danger',
            confirmLabel: 'Delete',
            onConfirm: () => router.delete(`/patients/${patientId}/attachments/${attachment.id}`),
        })
    }

    return (
        <div>
            {/* Upload */}
            <div className="mb-6">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors">
                    <Upload size={18} />
                    Upload File
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={isUploading}
                    />
                </label>
                <p className="text-xs text-gray-400 mt-1">Max file size: 20 MB</p>
            </div>

            {/* List */}
            {attachments.length === 0 ? (
                <p className="text-sm text-gray-400 py-8 text-center">No files uploaded yet.</p>
            ) : (
                <div className="space-y-2">
                    {attachments.map((a) => (
                        <div
                            key={a.id}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                            {fileIcon(a.file_type)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{a.file_name}</p>
                                <p className="text-xs text-gray-400">
                                    {formatSize(a.file_size)}
                                    {a.uploaded_by && ` • by ${a.uploaded_by.name}`}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <a
                                    href={`/patients/attachments/${a.id}/view`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50"
                                >
                                    View
                                </a>
                                <button
                                    onClick={() => handleDelete(a)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AttachmentsTab
