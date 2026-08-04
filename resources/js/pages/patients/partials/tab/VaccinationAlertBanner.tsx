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
      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
         <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
               <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-500" />
               <div>
                  <h3 className="text-sm font-semibold text-red-800">
                            Vaccination Alerts
                  </h3>
                  {overdue.length > 0 && (
                     <div className="mt-2">
                        <p className="text-xs font-medium text-red-700 uppercase tracking-wider mb-1">
                                    Overdue
                        </p>
                        <ul className="space-y-1">
                           {overdue.map((a) => (
                              <li key={`${a.vaccine.id}-${a.next_dose_number}`} className="text-sm text-red-700 flex items-center gap-2">
                                 <AlertTriangle size={12} className="shrink-0" />
                                 <span>
                                    <strong>{a.vaccine.name}</strong> — Dose {a.next_dose_number} was due {a.next_dose_due_date}
                                 </span>
                              </li>
                           ))}
                        </ul>
                     </div>
                  )}
                  {upcoming.length > 0 && (
                     <div className="mt-3">
                        <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">
                                    Due Soon
                        </p>
                        <ul className="space-y-1">
                           {upcoming.map((a) => (
                              <li key={`${a.vaccine.id}-${a.next_dose_number}`} className="text-sm text-amber-700 flex items-center gap-2">
                                 <Clock size={12} className="shrink-0" />
                                 <span>
                                    <strong>{a.vaccine.name}</strong> — Dose {a.next_dose_number} due {a.next_dose_due_date}
                                 </span>
                              </li>
                           ))}
                        </ul>
                     </div>
                  )}
               </div>
            </div>
            <button
               type="button"
               onClick={() => setDismissed(true)}
               className="shrink-0 rounded p-1 text-red-400 hover:bg-red-100 hover:text-red-600"
            >
               <X size={16} />
            </button>
         </div>
      </div>
   )
}

export default VaccinationAlertBanner
