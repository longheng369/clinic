import { Box } from '@mui/material'
import { useState } from 'react'
import { AlertTriangle, Clock, X } from 'lucide-react'
import { IVaccinationAlert } from '@/interfaces/IPatientVaccination'

interface VaccinationAlertBannerProps {
    alerts: IVaccinationAlert[]
}

const VaccinationAlertBanner = ({ alerts }: VaccinationAlertBannerProps) => {
   const [dismissed, setDismissed] = useState(false)

   if (dismissed || alerts.length === 0) return null

   const overdue = alerts.filter((a) => new Date(a.next_dose_due_date) < new Date())
   const upcoming = alerts.filter((a) => new Date(a.next_dose_due_date) >= new Date())

   return (
      <Box >
         <Box >
            <Box >
               <AlertTriangle size={20} />
               <Box>
                  <Box >
                            Vaccination Alerts
                  </Box>
                  {overdue.length > 0 && (
                     <Box >
                        <Box >
                                    Overdue
                        </Box>
                        <Box >
                           {overdue.map((a) => (
                              <Box key={`${a.vaccine.id}-${a.next_dose_number}`} >
                                 <AlertTriangle size={12} />
                                 <Box>
                                    <strong>{a.vaccine.name}</strong> — Dose {a.next_dose_number} was due {a.next_dose_due_date}
                                 </Box>
                              </Box>
                           ))}
                        </Box>
                     </Box>
                  )}
                  {upcoming.length > 0 && (
                     <Box >
                        <Box >
                                    Due Soon
                        </Box>
                        <Box >
                           {upcoming.map((a) => (
                              <Box key={`${a.vaccine.id}-${a.next_dose_number}`} >
                                 <Clock size={12} />
                                 <Box>
                                    <strong>{a.vaccine.name}</strong> — Dose {a.next_dose_number} due {a.next_dose_due_date}
                                 </Box>
                              </Box>
                           ))}
                        </Box>
                     </Box>
                  )}
               </Box>
            </Box>
            <button
               type="button"
               onClick={() => setDismissed(true)}
               style={{ border: 0, background: 'none' }}
            >
               <X size={16} />
            </button>
         </Box>
      </Box>
   )
}

export default VaccinationAlertBanner
