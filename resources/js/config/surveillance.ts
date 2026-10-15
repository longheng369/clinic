import { IOption } from '@/interfaces/IOption';

export const O2_OPTIONS: IOption<string>[] = [
  { value: 'ROOM_AIR', label: 'patients.surveillance.o2.roomAir' },
  { value: 'NASAL_CANNULA', label: 'patients.surveillance.o2.nasalCannula' },
  { value: 'FACE_MASK', label: 'patients.surveillance.o2.faceMask' },
  {
    value: 'NON_REBREATHER_MASK',
    label: 'patients.surveillance.o2.nonRebreatherMask',
  },
  { value: 'VENTILATOR', label: 'patients.surveillance.o2.ventilator' },
  { value: 'CPAP_BIPAP', label: 'patients.surveillance.o2.cpapBipap' },
  {
    value: 'HIGH_FLOW_NASAL_CANNULA',
    label: 'patients.surveillance.o2.highFlowNasalCannula',
  },
];
