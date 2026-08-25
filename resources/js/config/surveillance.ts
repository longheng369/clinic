import { IOption } from '@/interfaces/IOption';

export const O2_OPTIONS: IOption<string>[] = [
  { value: 'ROOM_AIR', label: 'Room Air' },
  { value: 'NASAL_CANNULA', label: 'Nasal Cannula' },
  { value: 'FACE_MASK', label: 'Face Mask' },
  { value: 'NON_REBREATHER_MASK', label: 'Non-Rebreather Mask' },
  { value: 'VENTILATOR', label: 'Ventilator' },
  { value: 'CPAP_BIPAP', label: 'CPAP/BiPAP' },
  { value: 'HIGH_FLOW_NASAL_CANNULA', label: 'High Flow Nasal Cannula' },
];
