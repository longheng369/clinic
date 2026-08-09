import { Box } from '@mui/material'
import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Calendar } from 'lucide-react'

interface VisitData {
    id: number
    patient_id: number
    type: string
    status: string
    visit_date: string
    recorded_by?: string
    created_at: string
    updated_at: string
}

interface PatientData {
    id: number
    khmer_first_name: string
    khmer_last_name: string
    first_name?: string
    last_name?: string
    phone_number?: string
    gender?: string
}

interface ConsultationRow {
    id: number
    chief_complaint: string
    diagnosis?: string
    fee?: number
    recorded_by?: string
    created_at: string
}

interface MedicationRow {
    id: number
    medicine?: string
    route: string
    dosage: number
    unit: string
    interval: string
    status: string
    recorded_by?: string
    created_at: string
}

interface PrescriptionRow {
    id: number
    notes?: string
    recorded_by?: string
    created_at: string
    items: PrescriptionItemRow[]
}

interface PrescriptionItemRow {
    id: number
    medicine?: string
    route: string
    dosage: number
    unit: string
    frequency: string
    duration_days?: number
    quantity?: number
    notes?: string
}

interface SurveillanceRow {
    id: number
    systolic: number
    diastolic: number
    pulse: number
    temperature: number
    rr: number
    spo2: number
    o2_supply: string
    recorded_by?: string
    created_at: string
}

interface ParaclinicRow {
    id: number
    request_number: string
    doctor?: string
    status: string
    tests_count: number
    created_at: string
}

const STATUS_BADGE: Record<string, { label: string; backgroundColor: string; color: string }> = {
   prescribed: { label: 'Prescribed', backgroundColor: '#dbeafe', color: '#1d4ed8' },
   active: { label: 'Active', backgroundColor: '#dcfce7', color: '#15803d' },
   provided: { label: 'Provided', backgroundColor: '#dcfce7', color: '#15803d' },
   continued: { label: 'Continued', backgroundColor: '#fef3c7', color: '#b45309' },
   stopped: { label: 'Stopped', backgroundColor: '#f3f4f6', color: '#6b7280' },
}

const VisitShow = ({ visit, patient, consultations, medicationAdministrations, prescriptions, surveillances, paraclinicRequests }: {
    visit: VisitData
    patient: PatientData
    consultations: ConsultationRow[]
    medicationAdministrations: MedicationRow[]
    prescriptions: PrescriptionRow[]
    surveillances: SurveillanceRow[]
    paraclinicRequests: ParaclinicRow[]
}) => {
   return (
      <>
         <Head title={`Visit - ${patient.khmer_last_name} ${patient.khmer_first_name}`} />

         <Box>
            <Box>
               <Link
                  href={`/patients/${patient.id}`}
               >
                  <ArrowLeft size={20} />
               </Link>
               <Box>
                  <Box>
                     <Calendar size={20} />
                  </Box>
                  <Box>
                     <Box>
                        <Box>{patient.khmer_last_name} {patient.khmer_first_name}</Box>
                     </Box>
                     <Box>
                        <Box>
                           {visit.type}
                        </Box>
                        <Box>
                           {new Date(visit.visit_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })}
                        </Box>
                        <Box>
                                    &middot; {visit.status}
                        </Box>
                     </Box>
                  </Box>
               </Box>
            </Box>
         </Box>

         <Box>
            {/* Consultations */}
            {consultations.length > 0 && (
               <Section title="Consultations" count={consultations.length}>
                  {consultations.map((c) => (
                     <Row key={c.id}>
                        <Box>
                           <Box>{c.chief_complaint}</Box>
                           {c.diagnosis && <Box>{c.diagnosis}</Box>}
                        </Box>
                        <Box>
                           {c.fee ? <Box>${c.fee.toFixed(2)}</Box> : null}
                           <Box>{new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</Box>
                           {c.recorded_by && <Box>by {c.recorded_by}</Box>}
                        </Box>
                     </Row>
                  ))}
               </Section>
            )}

            {/* Medications */}
            {medicationAdministrations.length > 0 && (
               <Section title="Medications" count={medicationAdministrations.length}>
                  {medicationAdministrations.map((m) => {
                     const badge = STATUS_BADGE[m.status] ?? { label: m.status, backgroundColor: '#f3f4f6', color: '#4b5563' }
                     return (
                        <Row key={m.id}>
                           <Box>
                              <Box>{m.medicine ?? '—'}</Box>
                              <Box>{m.route}</Box>
                              <Box>{m.dosage} {m.unit} &middot; {m.interval}</Box>
                           </Box>
                           <Box>
                              <Box sx={{ backgroundColor: badge.backgroundColor, color: badge.color }}>
                                 {badge.label}
                              </Box>
                              <Box>
                                 {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                              </Box>
                              {m.recorded_by && <Box>by {m.recorded_by}</Box>}
                           </Box>
                        </Row>
                     )
                  })}
               </Section>
            )}

            {/* Prescriptions */}
            {prescriptions.length > 0 && (
               <Section title="Prescriptions" count={prescriptions.length}>
                  {prescriptions.map((p) => (
                     <Box key={p.id}>
                        <Box>
                           <Box>
                                        Prescription #{p.id}
                              <Box>
                                 {p.items.length} medicine{p.items.length !== 1 ? 's' : ''}
                              </Box>
                           </Box>
                           <Box>
                              <Box>{new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</Box>
                              {p.recorded_by && <Box>by {p.recorded_by}</Box>}
                           </Box>
                        </Box>
                        {p.items.map((item) => (
                           <Row key={item.id}>
                              <Box>
                                 <Box>{item.medicine ?? '—'}</Box>
                                 <Box>{item.route}</Box>
                                 <Box>{item.dosage} {item.unit} &middot; {item.frequency}</Box>
                                 {item.duration_days && <Box>{item.duration_days}d</Box>}
                                 {item.quantity && <Box>Qty: {item.quantity}</Box>}
                              </Box>
                              <Box>
                                 {item.notes && <Box>{item.notes}</Box>}
                              </Box>
                           </Row>
                        ))}
                        {p.notes && (
                           <Box>
                                        Note: {p.notes}
                           </Box>
                        )}
                     </Box>
                  ))}
               </Section>
            )}

            {/* Surveillances */}
            {surveillances.length > 0 && (
               <Section title="Vital Signs" count={surveillances.length}>
                  {surveillances.map((s) => (
                     <Row key={s.id}>
                        <Box>
                           <Box>{s.systolic}/{s.diastolic}</Box>
                           <Box>Pulse {s.pulse}</Box>
                           <Box>Temp {s.temperature.toFixed(1)}°C</Box>
                           <Box>RR {s.rr}</Box>
                           <Box>SpO₂ {s.spo2}%</Box>
                           <Box>{s.o2_supply}</Box>
                        </Box>
                        <Box>
                           <Box>{new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</Box>
                           {s.recorded_by && <Box>by {s.recorded_by}</Box>}
                        </Box>
                     </Row>
                  ))}
               </Section>
            )}

            {/* Paraclinic Requests */}
            {paraclinicRequests.length > 0 && (
               <Section title="Paraclinic Requests" count={paraclinicRequests.length}>
                  {paraclinicRequests.map((r) => (
                     <Row key={r.id}>
                        <Box>
                           <Box>{r.request_number}</Box>
                           {r.doctor && <Box>Dr. {r.doctor}</Box>}
                           <Box>{r.tests_count} test{r.tests_count !== 1 ? 's' : ''}</Box>
                        </Box>
                        <Box>
                           <Box>{r.status}</Box>
                           <Box>{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</Box>
                        </Box>
                     </Row>
                  ))}
               </Section>
            )}

            {consultations.length === 0 && medicationAdministrations.length === 0 && prescriptions.length === 0 && surveillances.length === 0 && paraclinicRequests.length === 0 && (
               <Box>
                  <Calendar size={40} />
                  <Box>No records</Box>
                  <Box>This visit has no associated records.</Box>
               </Box>
            )}
         </Box>
      </>
   )
}

const Section = ({ title, count, children }: { title: string; count: number; children: React.ReactNode }) => (
   <Box>
      <Box>
         <Box>{title} <Box>({count})</Box></Box>
      </Box>
      <Box>{children}</Box>
   </Box>
)

const Row = ({ children }: { children: React.ReactNode }) => (
   <Box>{children}</Box>
)

export default VisitShow
