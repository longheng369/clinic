import { useState } from 'react'
import { router } from '@inertiajs/react'
import { useToast } from '@/components/toast'
import { useModal } from '@/components/modal'
import Modal from '@/components/modal/modal'
import { Upload, Trash2, FileText, Image, File, Eye } from 'lucide-react'
import { usePage } from '@inertiajs/react'
import { IVisitWithMetaData } from '@/interfaces/IVisit'

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

type Props = {
   patientId: number;
   selectedVisit: IVisitWithMetaData | null
}

const AttachmentsTab = ({ patientId, selectedVisit }: Props) => {
   const [isUploading, setIsUploading] = useState(false)
   const [preview, setPreview] = useState<Attachment | null>(null)
   const { toast } = useToast()
   const { openAlert } = useModal()
   const { attachments } = usePage<{ attachments: Attachment[] }>().props

   const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      if (selectedVisit?.id) {
         formData.append('visit_id', String(selectedVisit.id))
      }

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
         <div className="mb-6 flex justify-between items-center gap-2">
            <p className="text-xs text-gray-400">
               {selectedVisit ? 'Files attached to this visit' : 'All patient files'}
            </p>
            <div className="flex items-center gap-2">
               {!selectedVisit && (
                  <p className="text-xs text-amber-600">No visit selected — files will not be tied to a visit.</p>
               )}
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
            </div>
         </div>

         {attachments.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No files uploaded yet.</p>
         ) : (
            <div className="space-y-2">
               {attachments.map((a) => (
                  <div
                     key={a.id}
                     className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors"
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
                        <button
                           onClick={() => setPreview(a)}
                           className="text-sm text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50"
                        >
                           <Eye size={16} />
                        </button>
                        <button
                           onClick={() => handleDelete(a)}
                           className="p-1.5 rounded-lg text-red-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}
         {preview && preview.file_type.includes('pdf') && (
            <Modal open={!!preview} onClose={() => setPreview(null)} title={preview.file_name} fullScreen>
               <iframe
                  src={`/patients/attachments/${preview.id}/view`}
                  className="w-full flex-1 rounded-b-lg"
               />
            </Modal>
         )}
         {preview && !preview.file_type.includes('pdf') && (
            <Modal open={!!preview} onClose={() => setPreview(null)} title={preview.file_name} maxWidth="4xl">
               {preview.file_type.startsWith('image/') ? (
                  <div className="p-4">
                     <img
                        src={`/patients/attachments/${preview.id}/view`}
                        alt={preview.file_name}
                        className="max-w-full max-h-[80vh] mx-auto rounded"
                     />
                  </div>
               ) : (
                  <div className="p-8 text-center text-gray-400">
                     <File size={48} className="mx-auto mb-3" />
                     <p className="text-sm">Preview not available for this file type.</p>
                     <a
                        href={`/patients/attachments/${preview.id}/view`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-sm text-primary-600 underline"
                     >
                        Download instead
                     </a>
                  </div>
               )}
            </Modal>
         )}
      </div>
   )
}

export default AttachmentsTab