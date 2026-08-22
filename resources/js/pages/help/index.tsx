import { Head, Link } from '@inertiajs/react';
import {
  Users,
  Calendar,
  Pill,
  Syringe,
  ClipboardList,
  Stethoscope,
  Activity,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { Box, Card, Stack, Typography } from '@mui/material';
interface HelpSection {
  icon: typeof Users;
  title: string;
  description: string;
  link?: string;
  items: string[];
}
const sections: HelpSection[] = [
  {
    icon: Users,
    title: 'Patients',
    description:
      'Manage patient records, view medical history, and track visits.',
    link: '/patients',
    items: [
      'Register new patients with Khmer and English name fields',
      'Upload and view patient attachments (photos, documents)',
      'View complete medical history in a tabbed interface',
      'Search patients by name, phone, or ID',
    ],
  },
  {
    icon: Calendar,
    title: 'Appointments',
    description: 'Schedule and manage patient appointments.',
    link: '/appointments',
    items: [
      'Create appointments with date, time, and doctor assignment',
      'View appointments filtered by date, status, or patient search',
      'Vaccine alerts shown during appointment creation',
      'Edit or cancel existing appointments',
    ],
  },
  {
    icon: ClipboardList,
    title: 'Consultations',
    description:
      'Record clinical consultations with detailed symptom checklists.',
    link: '/patients',
    items: [
      'Create consultations linked to a patient and visit',
      'Document physical exam findings via organized body system checklists',
      'Review past consultations from the patient profile',
      'Edit or update existing consultation records',
    ],
  },
  {
    icon: Activity,
    title: 'Surveillance',
    description: 'Record and track patient vital signs.',
    link: '/patients',
    items: [
      'Record vital signs: blood pressure, pulse, temperature, respiratory rate, SpO2',
      'Each surveillance record is linked to an active visit',
      'View historical vital signs in the patient profile',
    ],
  },
  {
    icon: Pill,
    title: 'Medications',
    description: 'Manage medicine catalog and track medication administration.',
    link: '/medicines',
    items: [
      'Maintain a medicine catalog with brand/generic names, category, and unit',
      'Prescribe medications to patients during a visit',
      'Track administration status: Pending → Provided → Continued → Stopped',
      'Provide individual doses per administration',
    ],
  },
  {
    icon: Syringe,
    title: 'Vaccinations',
    description: 'Track vaccination schedules and administer doses.',
    link: '/vaccines',
    items: [
      'Configure vaccine types with custom dose schedules and age rules',
      'View vaccination due alerts on the dashboard',
      'Record doses administered to patients',
      'Track completed vs. remaining doses per patient',
    ],
  },
  {
    icon: FileText,
    title: 'Paraclinic Requests',
    description: 'Manage lab tests, imaging, and other diagnostic requests.',
    link: '/paraclinic-requests',
    items: [
      'Create diagnostic requests with multiple tests',
      'Upload and view attachments (lab reports, images)',
      'Update request status: Pending → Completed',
      'Record test results for each requested test',
    ],
  },
  {
    icon: Stethoscope,
    title: 'Visits',
    description: 'Track patient visits (OPD and IPD).',
    link: '/patients',
    items: [
      'Visits are created automatically when starting a consultation or surveillance',
      'OPD (outpatient) and IPD (inpatient) visit types',
      'Admit patients for IPD and close visits when discharged',
      'Medication and surveillance tabs only show for IPD visits',
    ],
  },
];
const Help = () => (
  <>
    <Head title="Help" />
    <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        Help
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Learn how to use the clinic management system
      </Typography>
      <Stack spacing={2}>
        {sections.map(({ icon: Icon, ...section }) => (
          <Card key={section.title} variant="outlined" sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={2}>
              <Box
                sx={{
                  p: 1,
                  height: 'fit-content',
                  bgcolor: 'primary.50',
                  borderRadius: 1,
                }}
              >
                <Icon size={20} color="var(--mui-palette-primary-main)" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {section.title}
                  </Typography>
                  {section.link && (
                    <Link
                      href={section.link}
                      style={{ textDecoration: 'none' }}
                    >
                      <Stack direction="row" sx={{ alignItems: 'center' }}>
                        <Typography variant="caption" color="primary">
                          Go to {section.title.toLowerCase()}
                        </Typography>
                        <ChevronRight size={12} />
                      </Stack>
                    </Link>
                  )}
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {section.description}
                </Typography>
                <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2.5 }}>
                  {section.items.map((item) => (
                    <Typography
                      component="li"
                      key={item}
                      variant="body2"
                      color="text.secondary"
                    >
                      {item}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  </>
);
export default Help;
