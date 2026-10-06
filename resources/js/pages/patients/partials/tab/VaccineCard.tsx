import { Box } from '@mui/material';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Printer,
  Syringe,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { IPatient } from '@/interfaces/IPatient';
import { formatDob } from '@/utils/date';
import { IVaccineCardItem } from '@/interfaces/IPatientVaccination';
import { Button } from '@/components/ui/button';

interface VaccineCardProps {
  patient: IPatient;
  cardData: IVaccineCardItem[];
}

const VaccineCard = ({ patient, cardData }: VaccineCardProps) => {
  const { t } = useTranslation();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = t('patients.vaccination.cardDocumentTitle', {
      khmer_last_name: patient.khmer_last_name,
      khmer_first_name: patient.khmer_first_name,
    });
    window.print();
    document.title = originalTitle;
  };

  const ageInMonths = (() => {
    const dob = new Date(patient.date_of_birth);
    const now = new Date();
    return (
      (now.getFullYear() - dob.getFullYear()) * 12 +
      (now.getMonth() - dob.getMonth())
    );
  })();

  const ageDisplay =
    ageInMonths >= 12
      ? t('patients.vaccination.ageYearsMonths', {
        years: Math.floor(ageInMonths / 12),
        months: ageInMonths % 12,
      })
      : t('patients.vaccination.ageMonths', { months: ageInMonths });

  return (
    <Box ref={printRef}>
      <Box sx={{}}>
        <Box sx={{}}>
          <Syringe size={16} />
          {t('patients.vaccination.cardTitle')}
        </Box>
        <Button onClick={handlePrint} variant="outline">
          <Printer size={16} /> {t('patients.vaccination.printCard')}
        </Button>
      </Box>

      <Box sx={{}}>
        {/* Card header */}
        <Box sx={{}}>
          <Box sx={{}}>{t('patients.vaccination.cardTitle')}</Box>
        </Box>

        {/* Patient info */}
        <Box sx={{}}>
          <Box sx={{}}>
            <Box>
              <Box sx={{}}>{t('patients.vaccination.patientLabel')}</Box>
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
              <Box sx={{}}>{t('patients.vaccination.dobLabel')}</Box>
              <Box sx={{}}>{formatDob(patient.date_of_birth)}</Box>
            </Box>
            <Box>
              <Box sx={{}}>{t('patients.vaccination.ageLabel')}</Box>
              <Box sx={{}}>{ageDisplay}</Box>
            </Box>
            <Box>
              <Box sx={{}}>{t('patients.vaccination.phoneLabel')}</Box>
              <Box sx={{}}>{patient.phone_number}</Box>
            </Box>
          </Box>
        </Box>

        {/* Vaccine cards */}
        <Box sx={{}}>
          {cardData.length === 0 ? (
            <Box sx={{}}>{t('patients.vaccination.noVaccines')}</Box>
          ) : (
            <Box sx={{}}>
              {cardData.map((item) => (
                <Box key={item.vaccine.id} sx={{}}>
                  <Box sx={{}}>
                    <Box sx={{}}>{item.vaccine.name}</Box>
                    {item.total_doses > 0 &&
                    item.doses_completed >= item.total_doses ? (
                        <Box sx={{}}>
                          <CheckCircle size={12} />{' '}
                          {t('patients.shared.status.completed')}
                        </Box>
                      ) : item.next_dose_due_date ? (
                        <Box sx={{}}>
                          {new Date(item.next_dose_due_date) < new Date() ? (
                            <AlertTriangle size={12} />
                          ) : (
                            <Clock size={12} />
                          )}
                          {new Date(item.next_dose_due_date) < new Date()
                            ? t('patients.shared.status.overdue')
                            : t('patients.shared.status.pending')}
                        </Box>
                      ) : item.eligible ? (
                        <Box sx={{}}>
                          <CheckCircle size={12} />{' '}
                          {t('patients.vaccination.complete')}
                        </Box>
                      ) : (
                        <Box sx={{}}>
                          {t('patients.vaccination.notEligible')}
                        </Box>
                      )}
                  </Box>

                  {/* Progress bar */}
                  {item.total_doses > 0 && (
                    <Box sx={{}}>
                      <Box sx={{}}>
                        <Box>
                          {t('patients.vaccination.doseProgress', {
                            doses_completed: item.doses_completed,
                            total_doses: item.total_doses,
                          })}
                        </Box>
                        <Box>
                          {Math.round(
                            (item.doses_completed / item.total_doses) * 100,
                          )}
                          %
                        </Box>
                      </Box>
                      <Box sx={{}}>
                        <Box
                          sx={{}}
                          style={{
                            width: `${(item.doses_completed / item.total_doses) * 100}%`,
                          }}
                        />
                      </Box>
                    </Box>
                  )}

                  {/* Next dose info */}
                  {item.next_dose_number && item.next_dose_due_date ? (
                    <Box sx={{}}>
                      <Box sx={{}}>{t('patients.vaccination.nextLabel')}</Box>{' '}
                      {t('patients.vaccination.nextDose', {
                        next_dose_number: item.next_dose_number,
                        next_dose_due_date: item.next_dose_due_date,
                      })}
                    </Box>
                  ) : item.doses_completed >= item.total_doses &&
                    item.total_doses > 0 ? (
                      <Box sx={{}}>
                        {t('patients.vaccination.allDosesCompleted')}
                      </Box>
                    ) : item.eligible ? (
                      <Box sx={{}}>
                        {t('patients.vaccination.readyForDose1')}
                      </Box>
                    ) : (
                      <Box sx={{}}>
                        {t('patients.vaccination.outsideAgeRange')}
                      </Box>
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
  );
};

export default VaccineCard;
