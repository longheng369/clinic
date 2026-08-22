import { IOption } from "@/interfaces/IOption";

export const MEDICINE_INSTRUCTION: IOption<string>[] = [
  {
    label: "មុនបាយ",
    value: "BEFORE_MEAL",
  },
  {
    label: "អំឡុងពេលអាហារ",
    value: "DURING_MEAL",
  },
  {
    label: "ក្រោយបាយ",
    value: "AFTER_MEAL",
  },
  {
    label: "មុនចូលគេង",
    value: "BEFORE_BED",
  },
  {
    label: "ពេលព្រឹក",
    value: "IN_THE_MORNING",
  },
  {
    label: "ពេលថ្ងៃ",
    value: "IN_THE_AFTERNOON",
  },
  {
    label: "ពេលល្ងាច",
    value: "IN_THE_EVENING",
  },
  {
    label: "ពេលយប់",
    value: "AT_NIGHT",
  },
  {
    label: "ពេលឃ្លាន",
    value: "ON_EMPTY_STOMACH",
  },
  {
    label: "ជាមួយទឹកច្រើន",
    value: "WITH_PLENTY_OF_WATER",
  },
  {
    label: "ផឹកជាមួយទឹក",
    value: "WITH_WATER",
  },
  {
    label: "មិនត្រូវលេប",
    value: "DO_NOT_SWALLOW",
  },
  {
    label: "សម្រាប់លាបខាងក្រៅ",
    value: "FOR_EXTERNAL_USE",
  },
  {
    label: "សម្រាប់លាង",
    value: "FOR_IRRIGATION",
  },
  {
    label: "ប្រើតាមតម្រូវការ",
    value: "AS_NEEDED",
  },
  {
    label: "ប្រើតាមវេជ្ជបញ្ជា",
    value: "AS_PRESCRIBED",
  },
];
