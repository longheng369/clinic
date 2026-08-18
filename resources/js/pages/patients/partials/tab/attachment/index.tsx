import {Box, Button, IconButton, Paper, Tooltip, Typography} from '@mui/material'
import React, {useRef, useState} from 'react'
import {router} from '@inertiajs/react'
import { useToast } from '@/components/toast'
import { useModal } from '@/components/modal'
import Modal from '@/components/modal/modal'
import {Trash2, FileText, Image, File, Eye, Plus, Loader2, Download} from 'lucide-react'
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

const fileMeta = (type: string) => {
   if (type.startsWith('image/')) {
      return { icon: <Image size={22} />, bg: '#eff6ff', color: '#2563eb', label: 'Image' }
   }
   if (type.includes('pdf')) {
      return { icon: <FileText size={22} />, bg: '#fef2f2', color: '#dc2626', label: 'PDF' }
   }
   return { icon: <File size={22} />, bg: '#f1f5f9', color: '#64748b', label: 'File' }
}

const formatSize = (bytes: number) => {
   if (bytes < 1024) return `${bytes} B`
   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatDate = (date: string) => {
   return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

type Props = {
   patientId: number;
   selectedVisit: IVisitWithMetaData | null
}

const AttachmentsTab = ({ patientId, selectedVisit }: Props) => {
   const { toast } = useToast()
   const { openAlert } = useModal()
   const [isUploading, setIsUploading] = useState(false)
   const [preview, setPreview] = useState<Attachment | null>(null)
   const { attachments } = usePage<{ attachments: Attachment[] }>().props
   const inputRef = useRef<HTMLInputElement | null>(null);

   const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (file.size > 20 * 1024 * 1024) {
         toast('The file is too large. Maximum allowed size is 20 MB.', { variant: 'error' })
         e.target.value = ''
         return
      }

      const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'csv', 'txt', 'zip']

      if (!file.type && !file.name.includes('.')) {
         toast('Unrecognized file. Please choose a file with a known extension.', { variant: 'error' })
         e.target.value = ''
         return
      }

      const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
         toast('This file type is not supported. Allowed types: images (JPG, PNG, GIF, WEBP, BMP), PDF, Office documents (Word, Excel, PowerPoint), CSV, TXT, and ZIP.', { variant: 'error' })
         e.target.value = ''
         return
      }

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
         <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
               Attachments for this patient belong to selected visit
            </Typography>
            <Button
               variant="contained"
               startIcon={isUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
               onClick={() => inputRef.current?.click()}
               disabled={isUploading}
            >
               {isUploading ? 'Uploading…' : 'New Attachment'}
            </Button>
         </Box>

         <input
            ref={inputRef}
            type="file"
            onChange={handleUpload}
            hidden
            disabled={isUploading}
         />

         {attachments.length === 0 ? (
            <Paper
               variant="outlined"
               sx={{
                  py: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                  borderColor: '#e2e8f0',
                  bgcolor: '#fafafa',
               }}
            >
               <Box
                  sx={{
                     width: 52,
                     height: 52,
                     borderRadius: '50%',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     bgcolor: '#f1f5f9',
                     color: '#94a3b8',
                  }}
               >
                  <File size={24} />
               </Box>
               <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No files uploaded yet.
               </Typography>
            </Paper>
         ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
               {attachments.map((a) => {
                  const meta = fileMeta(a.file_type)
                  return (
                     <Paper
                        key={a.id}
                        variant="outlined"
                        sx={{
                           display: 'flex',
                           alignItems: 'center',
                           gap: 2,
                           p: 1.5,
                           pl: 2,
                           borderRadius: 2,
                           borderColor: '#e2e8f0',
                           transition: 'all 150ms ease-in-out',
                           '&:hover': {
                              borderColor: '#cbd5e1',
                              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
                           },
                        }}
                     >
                        <Box
                           sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 1.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              bgcolor: meta.bg,
                              color: meta.color,
                           }}
                        >
                           {meta.icon}
                        </Box>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                           <Tooltip title={a.file_name} placement="top">
                              <Typography
                                 variant="body2"
                                 sx={{
                                    fontWeight: 600,
                                    color: '#1e293b',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                 }}
                              >
                                 {a.file_name}
                              </Typography>
                           </Tooltip>
                           <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
                              {meta.label} • {formatSize(a.file_size)}
                              {a.uploaded_by && ` • by ${a.uploaded_by.name}`}
                              {' • '}{formatDate(a.created_at)}
                           </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                           <Tooltip title="Preview" placement="top">
                              <IconButton
                                 size="small"
                                 onClick={() => setPreview(a)}
                                 sx={{
                                    color: '#64748b',
                                    '&:hover': { color: '#2563eb', bgcolor: '#eff6ff' },
                                 }}
                              >
                                 <Eye size={18} />
                              </IconButton>
                           </Tooltip>
                           <Tooltip title="Delete" placement="top">
                              <IconButton
                                 size="small"
                                 onClick={() => handleDelete(a)}
                                 sx={{
                                    color: '#64748b',
                                    '&:hover': { color: '#dc2626', bgcolor: '#fef2f2' },
                                 }}
                              >
                                 <Trash2 size={18} />
                              </IconButton>
                           </Tooltip>
                        </Box>
                     </Paper>
                  )
               })}
            </Box>
         )}

         {preview && preview.file_type.includes('pdf') && (
            <Modal
               open={!!preview}
               onClose={() => setPreview(null)}
               title={preview.file_name}
               fullScreen
               scrollable
            >
               <Box
                  component="iframe"
                  src={`/patients/attachments/${preview.id}/view`}
                  sx={{ flex: 1, width: '100%', height: '100%', border: 'none' }}
               />
            </Modal>
         )}

         {preview && !preview.file_type.includes('pdf') && (
            <Modal open={!!preview} onClose={() => setPreview(null)} title={preview.file_name} maxWidth="4xl">
               {preview.file_type.startsWith('image/') ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: '#f8fafc', borderRadius: 2 }}>
                     <Box
                        component="img"
                        src={`/patients/attachments/${preview.id}/view#view=FitH`}
                        alt={preview.file_name}
                        sx={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 2 }}
                     />
                  </Box>
               ) : (
                  <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                     <Box
                        sx={{
                           alignItems: 'center',
                           bgcolor: '#f1f5f9',
                           borderRadius: 2,
                           color: '#64748b',
                           display: 'flex',
                           height: 64,
                           justifyContent: 'center',
                           width: 64,
                        }}
                     >
                        <File size={32} />
                     </Box>
                     <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Preview not available for this file type.
                     </Typography>
                     <Button
                        variant="outlined"
                        startIcon={<Download size={16} />}
                        component="a"
                        href={`/patients/attachments/${preview.id}/view`}
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        Download file
                     </Button>
                  </Box>
               )}
            </Modal>
         )}
      </Box>
   )
}

export default AttachmentsTab
