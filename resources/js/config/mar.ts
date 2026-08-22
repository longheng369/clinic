import { IOption } from "@/interfaces/IOption";

export const MEDICINE_ROUTE: IOption<string>[] = [
  { value: 'PO', label: 'PO (Oral)' },
  { value: 'IV', label: 'IV (Intravenous)' },
  { value: 'IM', label: 'IM (Intramuscular)' },
  { value: 'SC', label: 'SC (Subcutaneous)' },
  { value: 'SL', label: 'SL (Sublingual)' },
  { value: 'PR', label: 'PR (Rectal)' },
  { value: 'Topical', label: 'Topical' },
  { value: 'Inhalation', label: 'Inhalation' },
  { value: 'Otic', label: 'Otic (Ear)' },
  { value: 'Ophthalmic', label: 'Ophthalmic (Eye)' },
];