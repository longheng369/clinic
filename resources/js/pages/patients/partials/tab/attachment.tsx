import { Box } from '@mui/material'
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
   if (type.startsWith('image/')) return <Image size={20} />
   if (type.includes('pdf')) return <FileText size={20} />
   return <File size={20} />
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
      <Box>
         <Box>
            <Box>
               {selectedVisit ? 'Files attached to this visit' : 'All patient files'}
            </Box>
            <Box>
               {!selectedVisit && (
                  <Box>No visit selected — files will not be tied to a visit.</Box>
               )}
               <Box component="label">
                  <Upload size={18} />
                  Upload File
                  <input
                     type="file"
                     onChange={handleUpload}
                     disabled={isUploading}
                  />
               </Box>
            </Box>
         </Box>

         {attachments.length === 0 ? (
            <Box>No files uploaded yet.</Box>
         ) : (
            <Box>
               {attachments.map((a) => (
                  <Box
                     key={a.id}

                  >
                     {fileIcon(a.file_type)}
                     <Box>
                        <Box>{a.file_name}</Box>
                        <Box>
                           {formatSize(a.file_size)}
                           {a.uploaded_by && ` • by ${a.uploaded_by.name}`}
                        </Box>
                     </Box>
                     <Box>
                        <Box
                           onClick={() => setPreview(a)}

                        >
                           <Eye size={16} />
                        </Box>
                        <Box
                           onClick={() => handleDelete(a)}

                        >
                           <Trash2 size={16} />
                        </Box>
                     </Box>
                  </Box>
               ))}
            </Box>
         )}
         {preview && preview.file_type.includes('pdf') && (
            <Modal open={!!preview} onClose={() => setPreview(null)} title={preview.file_name} fullScreen>
               <Box
                  component="iframe"
                  src={`/patients/attachments/${preview.id}/view`}
               />
            </Modal>
         )}
         {preview && !preview.file_type.includes('pdf') && (
            <Modal open={!!preview} onClose={() => setPreview(null)} title={preview.file_name} maxWidth="4xl">
               {preview.file_type.startsWith('image/') ? (
                  <Box>
                     <Box
                        component="img"
                        src={`/patients/attachments/${preview.id}/view`}
                        alt={preview.file_name}
                     />
                  </Box>
               ) : (
                  <Box>
                     <File size={48} />
                     <Box>Preview not available for this file type.</Box>
                     <Box
                        component="a"
                        href={`/patients/attachments/${preview.id}/view`}
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        Download instead
                     </Box>
                  </Box>
               )}
            </Modal>
         )}
      </Box>
   )
}

export default AttachmentsTab
