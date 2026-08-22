import { Box } from '@mui/material'
import { useRef } from 'react'
import { Printer, Syringe, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { IPatient } from '@/interfaces/IPatient'
import { formatDob } from '@/utils/date'
import { IVaccineCardItem } from '@/interfaces/IPatientVaccination'
import { Button } from '@/components/ui/button'

interface VaccineCardProps {
    patient: IPatient
    cardData: IVaccineCardItem[]
}

const VaccineCard = ({ patient, cardData }: VaccineCardProps) => {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const originalTitle = document.title
    document.title = `Vaccination Card - ${patient.khmer_last_name} ${patient.khmer_first_name}`
    window.print()
    document.title = originalTitle
  }

  const ageInMonths = (() => {
    const dob = new Date(patient.date_of_birth)
    const now = new Date()
    return (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth())
  })()

  const ageDisplay = ageInMonths >= 12
    ? `${Math.floor(ageInMonths / 12)} year${Math.floor(ageInMonths / 12) > 1 ? 's' : ''} ${ageInMonths % 12} month${ageInMonths % 12 !== 1 ? 's' : ''}`
    : `${ageInMonths} month${ageInMonths !== 1 ? 's' : ''}`

  return (
    <Box ref={printRef}>
      <Box sx={{}}>
        <Box sx={{}}>
          <Syringe size={16} />
                    Vaccination Card
        </Box>
        <Button onClick={handlePrint} variant="outline">
          <Printer size={16} /> Print Vaccine Card
        </Button>
      </Box>

      <Box sx={{}}>
        {/* Card header */}
        <Box sx={{}}>
          <Box sx={{}}>Vaccination Card</Box>
        </Box>

        {/* Patient info */}
        <Box sx={{}}>
          <Box sx={{}}>
            <Box>
              <Box sx={{}}>Patient:</Box>
              <Box sx={{}}>
                {patient.khmer_last_name} {patient.khmer_first_name}
              </Box>
              {patient.first_name && (
                <Box sx={{}}>
                                    ({patient.last_name ?? ''} {patient.first_name})
                </Box>
              )}
            </Box>
            <Box>
              <Box sx={{}}>DOB:</Box>
              <Box sx={{}}>{formatDob(patient.date_of_birth)}</Box>
            </Box>
            <Box>
              <Box sx={{}}>Age:</Box>
              <Box sx={{}}>{ageDisplay}</Box>
            </Box>
            <Box>
              <Box sx={{}}>Phone:</Box>
              <Box sx={{}}>{patient.phone_number}</Box>
            </Box>
          </Box>
        </Box>

        {/* Vaccine cards */}
        <Box sx={{}}>
          {cardData.length === 0 ? (
            <Box sx={{}}>No vaccines defined.</Box>
          ) : (
            <Box sx={{}}>
              {cardData.map((item) => (
                <Box
                  key={item.vaccine.id}
                  sx={{}}
                >
                  <Box sx={{}}>
                    <Box sx={{}}>{item.vaccine.name}</Box>
                    {item.total_doses > 0 && item.doses_completed >= item.total_doses ? (
                      <Box sx={{}}>
                        <CheckCircle size={12} /> Completed
                      </Box>
                    ) : item.next_dose_due_date ? (
                      <Box sx={{}}>
                        {new Date(item.next_dose_due_date) < new Date() ? (
                          <AlertTriangle size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {new Date(item.next_dose_due_date) < new Date() ? 'Overdue' : 'Pending'}
                      </Box>
                    ) : item.eligible ? (
                      <Box sx={{}}>
                        <CheckCircle size={12} /> Complete
                      </Box>
                    ) : (
                      <Box sx={{}}>
                                                Not eligible
                      </Box>
                    )}
                  </Box>

                  {/* Progress bar */}
                  {item.total_doses > 0 && (
                    <Box sx={{}}>
                      <Box sx={{}}>
                        <Box>{item.doses_completed} of {item.total_doses} doses</Box>
                        <Box>{Math.round((item.doses_completed / item.total_doses) * 100)}%</Box>
                      </Box>
                      <Box sx={{}}>
                        <Box
                          sx={{}}
                          style={{ width: `${(item.doses_completed / item.total_doses) * 100}%` }}
                        />
                      </Box>
                    </Box>
                  )}

                  {/* Next dose info */}
                  {item.next_dose_number && item.next_dose_due_date ? (
                    <Box sx={{}}>
                      <Box sx={{}}>Next:</Box> Dose {item.next_dose_number} — {item.next_dose_due_date}
                    </Box>
                  ) : item.doses_completed >= item.total_doses && item.total_doses > 0 ? (
                    <Box sx={{}}>All doses completed</Box>
                  ) : item.eligible ? (
                    <Box sx={{}}>Ready for dose 1</Box>
                  ) : (
                    <Box sx={{}}>Outside age range for this vaccine</Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Print styles */}
      <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .vaccine-card-print,
                    .vaccine-card-print * {
                        visibility: visible;
                    }
                    .vaccine-card-print {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        border: none;
                        margin: 0;
                        padding: 0;
                    }
                    .vaccine-card-print .bg-primary-500 {
                        background-color: #f3f4f6 !important;
                        color: #111827 !important;
                    }
                    @page {
                        margin: 1.5cm;
                    }
                }
            `}</style>
    </Box>
  )
}

export default VaccineCard
