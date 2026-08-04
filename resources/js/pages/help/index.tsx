import { Head, Link } from '@inertiajs/react'
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
} from 'lucide-react'

interface HelpSection {
    icon: typeof Users
title: string
    description: string
    link?: string
    items: string[]
}

const sections: HelpSection[] = [
   {
      icon: Users,
      title: 'Patients',
      description: 'Manage patient records, view medical history, and track visits.',
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
      description: 'Record clinical consultations with detailed symptom checklists.',
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
]

const Help = () => {
   return (
      <>
         <Head title="Help" />
         <div className="h-full flex flex-col">
            <div className="shrink-0 px-8 pt-8 pb-4">
               <h1 className="text-2xl font-bold text-gray-900">Help</h1>
               <p className="mt-1 text-sm text-gray-500">
                        Learn how to use the clinic management system
               </p>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8">
               <div className="space-y-4">
                  {sections.map((section) => {
                     const Icon = section.icon
                     return (
                        <div
                           key={section.title}
                           className="rounded-xl border border-gray-200 bg-white overflow-hidden"
                        >
                           <div className="flex items-start gap-4 p-5">
                              <div className="flex items-center justify-center size-10 rounded-lg bg-primary-50 shrink-0">
                                 <Icon size={20} className="text-primary-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-base font-semibold text-gray-900">
                                       {section.title}
                                    </h2>
                                    {section.link && (
                                       <Link
                                          href={section.link}
                                          className="inline-flex items-center gap-0.5 text-xs text-primary-500 hover:text-primary-600 font-medium"
                                       >
                                                    Go to {section.title.toLowerCase()}
                                          <ChevronRight size={12} />
                                       </Link>
                                    )}
                                 </div>
                                 <p className="text-sm text-gray-500 mb-3">
                                    {section.description}
                                 </p>
                                 <ul className="space-y-1.5">
                                    {section.items.map((item) => (
                                       <li
                                          key={item}
                                          className="flex items-start gap-2 text-sm text-gray-600"
                                       >
                                          <span className="mt-1.5 size-1.5 rounded-full bg-primary-300 shrink-0" />
                                          {item}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>
      </>
   )
}

export default Help
