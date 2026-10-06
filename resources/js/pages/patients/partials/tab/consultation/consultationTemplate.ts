export interface OptionType {
  value?: string;
  label?: string;
  colSpan?: number;
  exclusive?: boolean;
  text?: string;
}

export const respiratorySymptoms: OptionType[] = [
  {
    value: 'NORMAL',
    label: 'patients.consultation.template.respiratorySymptoms.normal',
    exclusive: true,
    colSpan: 12,
  },
  {
    value: 'COUGH',
    label: 'patients.consultation.template.respiratorySymptoms.cough',
    colSpan: 3,
  },
  {
    value: 'DYSPNEA',
    label: 'patients.consultation.template.respiratorySymptoms.dyspnea',
    colSpan: 3,
  },
  {
    value: 'TACHYPNEA',
    label: 'patients.consultation.template.respiratorySymptoms.tachypnea',
    colSpan: 3,
  },
  {
    value: 'BRADYSPNEA',
    label: 'patients.consultation.template.respiratorySymptoms.bradyspnea',
    colSpan: 3,
  },
  {
    value: 'RUNNY_NOSE',
    label: 'patients.consultation.template.respiratorySymptoms.runnyNose',
    colSpan: 3,
  },
  {
    value: 'DIFFICULTY_BREATHING',
    label:
      'patients.consultation.template.respiratorySymptoms.difficultyBreathing',
    colSpan: 3,
  },
  {
    value: 'APNEA',
    label: 'patients.consultation.template.respiratorySymptoms.apnea',
    colSpan: 3,
  },
  {
    value: 'SNORING',
    label: 'patients.consultation.template.respiratorySymptoms.snoring',
    colSpan: 3,
  },
  {
    value: 'NASAL_FLARING',
    label: 'patients.consultation.template.respiratorySymptoms.nasalFlaring',
    colSpan: 3,
  },
  {
    value: 'STRIDOR',
    label: 'patients.consultation.template.respiratorySymptoms.stridor',
    colSpan: 3,
  },
  {
    value: 'CYANOSIS',
    label: 'patients.consultation.template.respiratorySymptoms.cyanosis',
    colSpan: 3,
  },
  {
    value: 'THORAX_ASYMMETRICAL',
    label:
      'patients.consultation.template.respiratorySymptoms.thoraxAsymmetrical',
    colSpan: 3,
  },
  {
    value: 'INSUFFICIENT_RESPIRATORY_EFFORT',
    label:
      'patients.consultation.template.respiratorySymptoms.insufficientRespiratoryEffort',
    colSpan: 12,
  },
  {
    text: 'patients.consultation.template.respiratorySymptoms.chestRetraction',
  },
  {
    value: 'SUPRASTERNAL',
    label: 'patients.consultation.template.respiratorySymptoms.suprasternal',
    colSpan: 3,
  },
  {
    value: 'SUPRACLAVICULAR',
    label: 'patients.consultation.template.respiratorySymptoms.supraclavicular',
    colSpan: 3,
  },
  {
    value: 'INTERCOSTAL',
    label: 'patients.consultation.template.respiratorySymptoms.intercostal',
    colSpan: 3,
  },
  {
    value: 'SUBCOSTAL',
    label: 'patients.consultation.template.respiratorySymptoms.subcostal',
    colSpan: 3,
  },
  {
    value: 'SUBSTERNAL',
    label: 'patients.consultation.template.respiratorySymptoms.substernal',
    colSpan: 3,
  },
  { text: 'patients.consultation.template.respiratorySymptoms.breathingSound' },
  {
    value: 'CRACKLE',
    label: 'patients.consultation.template.respiratorySymptoms.crackle',
    colSpan: 3,
  },
  {
    value: 'CRACKLE_RIGHT_SIDE',
    label: 'patients.consultation.template.respiratorySymptoms.rightSide',
    colSpan: 3,
  },
  {
    value: 'CRACKLE_LEFT_SIDE',
    label: 'patients.consultation.template.respiratorySymptoms.leftSide',
    colSpan: 3,
  },
  {
    value: 'WHEEZING',
    label: 'patients.consultation.template.respiratorySymptoms.wheezing',
    colSpan: 3,
  },
  { value: 'WHEEZING_RIGHT_SIDE', label: 'Right side', colSpan: 3 },
  { value: 'WHEEZING_LEFT_SIDE', label: 'Left side', colSpan: 3 },
  {
    value: 'PLEURAL_FRICTION_RUB',
    label:
      'patients.consultation.template.respiratorySymptoms.pleuralFrictionRub',
    colSpan: 3,
  },
  { value: 'PLEURAL_FRICTION_RUB_RIGHT_SIDE', label: 'Right side', colSpan: 3 },
  { value: 'PLEURAL_FRICTION_RUB_LEFT_SIDE', label: 'Left side', colSpan: 3 },
  {
    value: 'DECREASE_AIR_ENTRY',
    label:
      'patients.consultation.template.respiratorySymptoms.decreaseAirEntry',
    colSpan: 3,
  },
  { value: 'DECREASE_AIR_ENTRY_RIGHT_SIDE', label: 'Right side', colSpan: 3 },
  { value: 'DECREASE_AIR_ENTRY_LEFT_SIDE', label: 'Left side', colSpan: 3 },
  { text: 'patients.consultation.template.respiratorySymptoms.spo2' },
  {
    value: 'O2_SUPPLY',
    label: 'patients.consultation.template.respiratorySymptoms.o2Supply',
    colSpan: 3,
  },
  {
    value: 'NASAL_CANNULA',
    label: 'patients.consultation.template.respiratorySymptoms.nasalCannula',
    colSpan: 3,
  },
  { text: 'patients.consultation.template.respiratorySymptoms.chestTube' },
  { value: 'CHEST_TUBE_RIGHT_SIDE', label: 'Right side', colSpan: 3 },
  { value: 'CHEST_TUBE_LEFT_SIDE', label: 'Left side', colSpan: 3 },
];

export const cardiovascularSymptoms: OptionType[] = [
  {
    value: 'NORMAL',
    label: 'patients.consultation.template.cardiovascularSymptoms.normal',
    exclusive: true,
    colSpan: 12,
  },
  {
    value: 'TACHYCARDIA',
    label: 'patients.consultation.template.cardiovascularSymptoms.tachycardia',
    colSpan: 3,
  },
  {
    value: 'BRADYCARDIA',
    label: 'patients.consultation.template.cardiovascularSymptoms.bradycardia',
    colSpan: 3,
  },
  {
    value: 'MURMUR',
    label: 'patients.consultation.template.cardiovascularSymptoms.murmur',
    colSpan: 3,
  },
  {
    value: 'CHEST_PAIN',
    label: 'patients.consultation.template.cardiovascularSymptoms.chestPain',
    colSpan: 3,
  },
  {
    value: 'EDEMA',
    label: 'patients.consultation.template.cardiovascularSymptoms.edema',
    colSpan: 3,
  },
  {
    value: 'PALPITATIONS',
    label: 'patients.consultation.template.cardiovascularSymptoms.palpitations',
    colSpan: 3,
  },
  {
    value: 'PALE',
    label: 'patients.consultation.template.cardiovascularSymptoms.pale',
    colSpan: 3,
  },
  {
    value: 'PULSE_WEAKNESS',
    label:
      'patients.consultation.template.cardiovascularSymptoms.pulseWeakness',
    colSpan: 3,
  },
  {
    value: 'COOL_EXTREMITY',
    label:
      'patients.consultation.template.cardiovascularSymptoms.coolExtremity',
    colSpan: 3,
  },
  {
    value: 'CYANOSIS_EXTREMITY',
    label:
      'patients.consultation.template.cardiovascularSymptoms.cyanosisExtremity',
    colSpan: 3,
  },
  {
    value: 'CRP_GREATER_2_SEC',
    label: 'patients.consultation.template.cardiovascularSymptoms.crp2Sec',
    colSpan: 3,
  },
  {
    value: 'BOUNDING_PLUSE',
    label:
      'patients.consultation.template.cardiovascularSymptoms.boundingPluse',
    colSpan: 3,
  },
  {
    value: 'HYPERTENSION',
    label: 'patients.consultation.template.cardiovascularSymptoms.hypertension',
    colSpan: 3,
  },
  {
    value: 'HYPOTENSION',
    label: 'patients.consultation.template.cardiovascularSymptoms.hypotension',
    colSpan: 3,
  },
];

export const neurologicalSymptoms: OptionType[] = [
  {
    value: 'NORMAL',
    label: 'patients.consultation.template.neurologicalSymptoms.normal',
    exclusive: true,
    colSpan: 12,
  },
  {
    text: 'patients.consultation.template.neurologicalSymptoms.anteriorFontanelle',
  },
  {
    value: 'BULGING',
    label: 'patients.consultation.template.neurologicalSymptoms.bulging',
    colSpan: 3,
  },
  {
    value: 'SUNKEN',
    label: 'patients.consultation.template.neurologicalSymptoms.sunken',
    colSpan: 3,
  },
  {
    text: 'patients.consultation.template.neurologicalSymptoms.consciousnessLevel',
  },
  {
    value: 'CONSCIOUSNESS',
    label: 'patients.consultation.template.neurologicalSymptoms.consciousness',
    colSpan: 3,
  },
  {
    value: 'DELIRIUM',
    label: 'patients.consultation.template.neurologicalSymptoms.delirium',
    colSpan: 3,
  },
  {
    value: 'COMA',
    label: 'patients.consultation.template.neurologicalSymptoms.coma',
    colSpan: 3,
  },
  {
    value: 'CONVULSION',
    label: 'patients.consultation.template.neurologicalSymptoms.convulsion',
    colSpan: 3,
  },
  {
    value: 'HEAD_ACHE',
    label: 'patients.consultation.template.neurologicalSymptoms.headAche',
    colSpan: 3,
  },
  {
    value: 'DIZZINESS',
    label: 'patients.consultation.template.neurologicalSymptoms.dizziness',
    colSpan: 3,
  },
  {
    value: 'NUMBNESS',
    label: 'patients.consultation.template.neurologicalSymptoms.numbness',
    colSpan: 3,
  },
  {
    value: 'LETHARGY',
    label: 'patients.consultation.template.neurologicalSymptoms.lethargy',
    colSpan: 3,
  },
  {
    value: 'LOOS_OF_BALANCE',
    label: 'patients.consultation.template.neurologicalSymptoms.loosOfBalance',
    colSpan: 3,
  },
  {
    value: 'PARALYSIS',
    label: 'patients.consultation.template.neurologicalSymptoms.paralysis',
    colSpan: 3,
  },
  {
    value: 'TREMORS',
    label: 'patients.consultation.template.neurologicalSymptoms.tremors',
    colSpan: 3,
  },
  {
    value: 'CONFUSION',
    label: 'patients.consultation.template.neurologicalSymptoms.confusion',
    colSpan: 3,
  },
  {
    value: 'DYSPHASIA',
    label: 'patients.consultation.template.neurologicalSymptoms.dysphasia',
    colSpan: 3,
  },
  {
    text: 'patients.consultation.template.neurologicalSymptoms.extremitiesMovement',
  },
  {
    value: 'WEAK',
    label: 'patients.consultation.template.neurologicalSymptoms.weak',
    colSpan: 3,
  },
  {
    value: 'ABSENCE',
    label: 'patients.consultation.template.neurologicalSymptoms.absence',
    colSpan: 3,
  },
  {
    value: 'LIMIT_RANGE_OF_MOVEMENT',
    label:
      'patients.consultation.template.neurologicalSymptoms.limitRangeOfMovement',
    colSpan: 3,
  },
];

export const musculoskeletalSymptoms: OptionType[] = [
  {
    value: 'NORMAL',
    label: 'patients.consultation.template.musculoskeletalSymptoms.normal',
    exclusive: true,
    colSpan: 12,
  },
  {
    value: 'EDEMA_SWOLLEN',
    label:
      'patients.consultation.template.musculoskeletalSymptoms.edemaSwollen',
    colSpan: 3,
  },
  {
    value: 'PAIN_CRAMP',
    label: 'patients.consultation.template.musculoskeletalSymptoms.painCramp',
    colSpan: 3,
  },
  {
    value: 'CONTRACTURE',
    label: 'patients.consultation.template.musculoskeletalSymptoms.contracture',
    colSpan: 3,
  },
  {
    value: 'BONE_PAIN',
    label: 'patients.consultation.template.musculoskeletalSymptoms.bonePain',
    colSpan: 3,
  },
  {
    value: 'JOINT_PAINT',
    label: 'patients.consultation.template.musculoskeletalSymptoms.jointPain',
    colSpan: 3,
  },
  {
    value: 'JOINT_STIFFNESS',
    label:
      'patients.consultation.template.musculoskeletalSymptoms.jointStiffness',
    colSpan: 3,
  },
  {
    value: 'LIMITED_MOVEMENT',
    label:
      'patients.consultation.template.musculoskeletalSymptoms.limitedMovement',
    colSpan: 3,
  },
  {
    value: 'DECREASE_BALANCE',
    label:
      'patients.consultation.template.musculoskeletalSymptoms.decreaseBalance',
    colSpan: 3,
  },
  {
    value: 'GAIT',
    label: 'patients.consultation.template.musculoskeletalSymptoms.gait',
    colSpan: 3,
  },
  {
    text: 'patients.consultation.template.musculoskeletalSymptoms.typeOfBoneFracture',
  },
  {
    value: 'CLOSE_FRACTURE',
    label:
      'patients.consultation.template.musculoskeletalSymptoms.closeFracture',
    colSpan: 3,
  },
  {
    value: 'OPEN_FRACTURE',
    label:
      'patients.consultation.template.musculoskeletalSymptoms.openFracture',
    colSpan: 3,
  },
  {
    value: 'AMPUTATION',
    label: 'patients.consultation.template.musculoskeletalSymptoms.amputation',
    colSpan: 3,
  },
  {
    value: 'PROSTHESIS',
    label: 'patients.consultation.template.musculoskeletalSymptoms.prosthesis',
    colSpan: 3,
  },
  {
    value: 'ASSISTIVE_DEVICE',
    label:
      'patients.consultation.template.musculoskeletalSymptoms.assistiveDevice',
    colSpan: 3,
  },
];

export const digestiveSymptoms: OptionType[] = [
  {
    value: 'NORMAL',
    label: 'patients.consultation.template.digestiveSymptoms.normal',
    exclusive: true,
    colSpan: 12,
  },
  {
    value: 'NAUSEA',
    label: 'patients.consultation.template.digestiveSymptoms.nausea',
    colSpan: 3,
  },
  {
    value: 'ABDOMINAL_PAIN',
    label: 'patients.consultation.template.digestiveSymptoms.abdominalPain',
    colSpan: 3,
  },
  {
    value: 'ABDOMINAL_DISTENSION',
    label:
      'patients.consultation.template.digestiveSymptoms.abdominalDistension',
    colSpan: 3,
  },
  {
    value: 'SWALLOWING_DIFFICULTY',
    label:
      'patients.consultation.template.digestiveSymptoms.swallowingDifficulty',
    colSpan: 3,
  },
  {
    value: 'VOMITING',
    label: 'patients.consultation.template.digestiveSymptoms.vomiting',
    colSpan: 3,
  },
  {
    value: 'HEMATEMESIS',
    label: 'patients.consultation.template.digestiveSymptoms.hematemesis',
    colSpan: 3,
  },
  {
    value: 'POOR_APPETITE',
    label: 'patients.consultation.template.digestiveSymptoms.poorAppetite',
    colSpan: 3,
  },
  {
    value: 'HEPATOMEGALY',
    label: 'patients.consultation.template.digestiveSymptoms.hepatomegaly',
    colSpan: 3,
  },
  {
    value: 'SPLENOMEGALY',
    label: 'patients.consultation.template.digestiveSymptoms.splenomegaly',
    colSpan: 3,
  },
  { text: 'patients.consultation.template.digestiveSymptoms.changeBowelSound' },
  {
    value: 'BOWEL_SOUND_DECREASE',
    label: 'patients.consultation.template.digestiveSymptoms.decrease',
    colSpan: 3,
  },
  {
    value: 'BOWEL_SOUND_INCREASE',
    label: 'patients.consultation.template.digestiveSymptoms.increase',
    colSpan: 3,
  },
  {
    value: 'BOWEL_SOUND_ABSENCE',
    label: 'patients.consultation.template.digestiveSymptoms.absence',
    colSpan: 3,
  },
  { text: 'patients.consultation.template.digestiveSymptoms.abnormalStool' },
  {
    value: 'DIARRHEA',
    label: 'patients.consultation.template.digestiveSymptoms.diarrhea',
    colSpan: 3,
  },
  {
    value: 'CONSTIPATION',
    label: 'patients.consultation.template.digestiveSymptoms.constipation',
    colSpan: 3,
  },
  {
    value: 'BLACK_STOOL',
    label: 'patients.consultation.template.digestiveSymptoms.blackStool',
    colSpan: 3,
  },
  {
    value: 'BLOODY_STOOL',
    label: 'patients.consultation.template.digestiveSymptoms.bloodyStool',
    colSpan: 3,
  },
];

export const renalReproductiveSymptoms: OptionType[] = [
  {
    value: 'NORMAL',
    label: 'patients.consultation.template.renalReproductiveSymptoms.normal',
    exclusive: true,
    colSpan: 12,
  },
  {
    text: 'patients.consultation.template.renalReproductiveSymptoms.abnormalUrinaryColor',
  },
  {
    value: 'CLOUDY',
    label: 'patients.consultation.template.renalReproductiveSymptoms.cloudy',
    colSpan: 3,
  },
  {
    value: 'DARK_YELLOW',
    label:
      'patients.consultation.template.renalReproductiveSymptoms.darkYellow',
    colSpan: 3,
  },
  {
    value: 'DARK_BROWN',
    label: 'patients.consultation.template.renalReproductiveSymptoms.darkBrown',
    colSpan: 3,
  },
  {
    value: 'RED',
    label: 'patients.consultation.template.renalReproductiveSymptoms.red',
    colSpan: 3,
  },
  {
    value: 'DYSURIA',
    label: 'patients.consultation.template.renalReproductiveSymptoms.dysuria',
    colSpan: 3,
  },
  {
    value: 'POLLAKIURIA',
    label:
      'patients.consultation.template.renalReproductiveSymptoms.pollakiuria',
    colSpan: 3,
  },
  {
    value: 'HEMATURIA',
    label: 'patients.consultation.template.renalReproductiveSymptoms.hematuria',
    colSpan: 3,
  },
  {
    value: 'POLYURIA',
    label: 'patients.consultation.template.renalReproductiveSymptoms.polyuria',
    colSpan: 3,
  },
  {
    value: 'URINARY_OBSTRUCTION',
    label:
      'patients.consultation.template.renalReproductiveSymptoms.urinaryObstruction',
    colSpan: 3,
  },
  {
    value: 'ANURIA_NO_URINE_LESS_THAN_24_HS',
    label:
      'patients.consultation.template.renalReproductiveSymptoms.anuriaNoUrine24Hs',
    colSpan: 3,
  },
  {
    value: 'OILGURIA_LESS_THAN_24H',
    label:
      'patients.consultation.template.renalReproductiveSymptoms.oilguria400ml24h',
    colSpan: 3,
  },
  {
    value: 'URINARY_INCONTINENCE',
    label:
      'patients.consultation.template.renalReproductiveSymptoms.urinaryIncontinence',
    colSpan: 3,
  },
  {
    value: 'ABNORMAL_URINARY_COLOR_ODOR',
    label: 'patients.consultation.template.renalReproductiveSymptoms.odor',
    colSpan: 3,
  },
  {
    value: 'ABNORMAL_URINARY_COLOR_PYURIA',
    label: 'patients.consultation.template.renalReproductiveSymptoms.pyuria',
    colSpan: 3,
  },
  {
    value: 'PROSTATE_PROBLEM',
    label:
      'patients.consultation.template.renalReproductiveSymptoms.prostateProblem',
    colSpan: 3,
  },
  {
    text: 'patients.consultation.template.renalReproductiveSymptoms.reproductive',
  },
  {
    value: 'GENITAL_DISCHARGE',
    label:
      'patients.consultation.template.renalReproductiveSymptoms.genitalDischarge',
    colSpan: 3,
  },
  {
    value: 'PAIN_AROUND_GENITAL',
    label:
      'patients.consultation.template.renalReproductiveSymptoms.painAroundGenital',
    colSpan: 3,
  },
  {
    value: 'ITCHING',
    label: 'patients.consultation.template.renalReproductiveSymptoms.itching',
    colSpan: 3,
  },
  {
    value: 'GENITAL_INFECTION',
    label:
      'patients.consultation.template.renalReproductiveSymptoms.genitalInfection',
    colSpan: 3,
  },
  {
    value: 'BLISTER',
    label: 'patients.consultation.template.renalReproductiveSymptoms.blister',
    colSpan: 3,
  },
  {
    value: 'SORE',
    label: 'patients.consultation.template.renalReproductiveSymptoms.sore',
    colSpan: 3,
  },
  { value: 'REPRODUCTIVE_ODOR', label: 'Odor', colSpan: 3 },
];

export const skinSymptoms: OptionType[] = [
  {
    value: 'NORMAL',
    label: 'patients.consultation.template.skinSymptoms.normal',
    exclusive: true,
    colSpan: 12,
  },
  {
    value: 'SKIN_LESIONS',
    label: 'patients.consultation.template.skinSymptoms.skinLesions',
    colSpan: 3,
  },
  {
    value: 'REDNESS',
    label: 'patients.consultation.template.skinSymptoms.redness',
    colSpan: 3,
  },
  {
    value: 'SKIN_BLISTER',
    label: 'patients.consultation.template.skinSymptoms.blister',
    colSpan: 3,
  },
  {
    value: 'JAUNDICE',
    label: 'patients.consultation.template.skinSymptoms.jaundice',
    colSpan: 3,
  },
  {
    value: 'BURN',
    label: 'patients.consultation.template.skinSymptoms.burn',
    colSpan: 3,
  },
  {
    value: 'DRY_SKIN',
    label: 'patients.consultation.template.skinSymptoms.drySkin',
    colSpan: 3,
  },
  {
    value: 'DECREASE_TURGOR',
    label: 'patients.consultation.template.skinSymptoms.decreaseTurgor',
    colSpan: 3,
  },
  {
    value: 'SKIN_MOTTLING',
    label: 'patients.consultation.template.skinSymptoms.skinMottling',
    colSpan: 3,
  },
  {
    value: 'RASH',
    label: 'patients.consultation.template.skinSymptoms.rash',
    colSpan: 3,
  },
  {
    value: 'ACROCYANOSIS',
    label: 'patients.consultation.template.skinSymptoms.acrocyanosis',
    colSpan: 3,
  },
  {
    value: 'HYPERTHERMIA',
    label: 'patients.consultation.template.skinSymptoms.hyperthermia',
    colSpan: 3,
  },
  {
    value: 'HYPOTHERMIA',
    label: 'patients.consultation.template.skinSymptoms.hypothermia',
    colSpan: 3,
  },
  {
    value: 'PETECHIAL',
    label: 'patients.consultation.template.skinSymptoms.petechial',
    colSpan: 3,
  },
  {
    value: 'SWELLING',
    label: 'patients.consultation.template.skinSymptoms.swelling',
    colSpan: 3,
  },
];

export const eyeSymptoms: OptionType[] = [
  {
    value: 'NORMAL',
    label: 'patients.consultation.template.eyeSymptoms.normal',
    exclusive: true,
    colSpan: 12,
  },
  {
    value: 'EPIPHORA',
    label: 'patients.consultation.template.eyeSymptoms.epiphora',
    colSpan: 3,
  },
  {
    value: 'OCULAR_PAIN',
    label: 'patients.consultation.template.eyeSymptoms.ocularPain',
    colSpan: 3,
  },
  {
    value: 'RED_EYE',
    label: 'patients.consultation.template.eyeSymptoms.redEye',
    colSpan: 3,
  },
  {
    value: 'YELLOW_EYE',
    label: 'patients.consultation.template.eyeSymptoms.yellowEye',
    colSpan: 3,
  },
  {
    value: 'SUB_CONJUNCTIVAL_HEMORRHAGE',
    label:
      'patients.consultation.template.eyeSymptoms.subConjunctivalHemorrhage',
    colSpan: 3,
  },
  {
    value: 'BLURRY_VISION',
    label: 'patients.consultation.template.eyeSymptoms.blurryVision',
    colSpan: 3,
  },
  {
    value: 'OCULAR_PRURITUS',
    label: 'patients.consultation.template.eyeSymptoms.ocularPruritus',
    colSpan: 3,
  },
  {
    value: 'ITCHING',
    label: 'patients.consultation.template.eyeSymptoms.itching',
    colSpan: 3,
  },
  {
    value: 'EYELID_EDEMA',
    label: 'patients.consultation.template.eyeSymptoms.eyelidEdema',
    colSpan: 3,
  },
  {
    value: 'CORNEAL_OPACITY',
    label: 'patients.consultation.template.eyeSymptoms.cornealOpacity',
    colSpan: 3,
  },
  {
    value: 'EYELID_MASS',
    label: 'patients.consultation.template.eyeSymptoms.eyelidMass',
    colSpan: 3,
  },
  {
    value: 'BLURRED_VISION',
    label: 'patients.consultation.template.eyeSymptoms.blurredVision',
    colSpan: 3,
  },
  {
    value: 'DACRYOCYSTITIS',
    label: 'patients.consultation.template.eyeSymptoms.dacryocystitis',
    colSpan: 3,
  },
  {
    value: 'PTOSIS',
    label: 'patients.consultation.template.eyeSymptoms.ptosis',
    colSpan: 3,
  },
  {
    value: 'EXOPHTHALMIA',
    label: 'patients.consultation.template.eyeSymptoms.exophthalmia',
    colSpan: 3,
  },
  {
    value: 'LAGOPHTHALMOS',
    label: 'patients.consultation.template.eyeSymptoms.lagophthalmos',
    colSpan: 3,
  },
];

export const earSymptoms: OptionType[] = [
  {
    value: 'NORMAL',
    label: 'patients.consultation.template.earSymptoms.normal',
    exclusive: true,
    colSpan: 12,
  },
  {
    value: 'HEARING_IMPAIRMENT',
    label: 'patients.consultation.template.earSymptoms.hearingImpairment',
    colSpan: 3,
  },
  {
    value: 'DIZZINESS',
    label: 'patients.consultation.template.earSymptoms.deafness',
    colSpan: 3,
  },
  {
    value: 'OTALGIA',
    label: 'patients.consultation.template.earSymptoms.otalgia',
    colSpan: 3,
  },
  {
    value: 'EAR_DISCHARGE',
    label: 'patients.consultation.template.earSymptoms.earDischarge',
    colSpan: 3,
  },
  {
    value: 'OTORRHEA',
    label: 'patients.consultation.template.earSymptoms.otorrhea',
    colSpan: 3,
  },
  {
    value: 'HEARING_LOSS',
    label: 'patients.consultation.template.earSymptoms.hearingLoss',
    colSpan: 3,
  },
  {
    value: 'EAR_FULLNESS',
    label: 'patients.consultation.template.earSymptoms.earFullness',
    colSpan: 3,
  },
  {
    value: 'EAR_ITCHING',
    label: 'patients.consultation.template.earSymptoms.earItching',
    colSpan: 3,
  },
  {
    value: 'FURONCULOSIS',
    label: 'patients.consultation.template.earSymptoms.furonculosis',
    colSpan: 3,
  },
  {
    value: 'CORNEAL_OPACITY',
    label: 'patients.consultation.template.earSymptoms.cornealOpacity',
    colSpan: 3,
  },
];

export const noseSymptoms: OptionType[] = [
  {
    value: 'NORMAL',
    label: 'patients.consultation.template.noseSymptoms.normal',
    exclusive: true,
    colSpan: 12,
  },
  {
    value: 'RUNNY_NOSE',
    label: 'patients.consultation.template.noseSymptoms.runnyNose',
    colSpan: 3,
  },
  {
    value: 'NOSE_BLEEDING',
    label: 'patients.consultation.template.noseSymptoms.noseBleeding',
    colSpan: 3,
  },
  {
    value: 'STUFFY_NOSE',
    label: 'patients.consultation.template.noseSymptoms.stuffyNose',
    colSpan: 3,
  },
  {
    value: 'SINUS_PAIN',
    label: 'patients.consultation.template.noseSymptoms.sinusPain',
    colSpan: 3,
  },
  {
    value: 'FETOR_NASAL',
    label: 'patients.consultation.template.noseSymptoms.nasalFetor',
    colSpan: 3,
  },
  {
    value: 'NASAL_OBSTRUCTION',
    label: 'patients.consultation.template.noseSymptoms.nasalObstruction',
    colSpan: 3,
  },
  {
    value: 'NOSE_IRRITATION',
    label: 'patients.consultation.template.noseSymptoms.noseIrritation',
    colSpan: 3,
  },
  {
    value: 'SNEEZING',
    label: 'patients.consultation.template.noseSymptoms.sneezing',
    colSpan: 3,
  },
  {
    value: 'ANOSMIA',
    label: 'patients.consultation.template.noseSymptoms.anosmia',
    colSpan: 3,
  },
  {
    value: 'CACOSMIA',
    label: 'patients.consultation.template.noseSymptoms.cacosmia',
    colSpan: 3,
  },
  {
    value: 'FACIAL_PAIN',
    label: 'patients.consultation.template.noseSymptoms.facialPain',
    colSpan: 3,
  },
];

export const throatSymptoms: OptionType[] = [
  {
    value: 'NORMAL',
    label: 'patients.consultation.template.throatSymptoms.normal',
    exclusive: true,
    colSpan: 12,
  },
  {
    value: 'GUM_BLEEDING',
    label: 'patients.consultation.template.throatSymptoms.gumBleeding',
    colSpan: 3,
  },
  {
    value: 'THROAT_PAIN',
    label: 'patients.consultation.template.throatSymptoms.pain',
    colSpan: 3,
  },
  {
    value: 'SORE_THROAT',
    label: 'patients.consultation.template.throatSymptoms.soreThroat',
    colSpan: 3,
  },
  {
    value: 'SPEECH_DISORDER',
    label: 'patients.consultation.template.throatSymptoms.speechDifficulty',
    colSpan: 3,
  },
  {
    value: 'DYSPHAGIA',
    label: 'patients.consultation.template.throatSymptoms.dysphagia',
    colSpan: 3,
  },
  {
    value: 'ORAL_MUCOSA_STIFFNESS',
    label: 'patients.consultation.template.throatSymptoms.stiffJaw',
    colSpan: 3,
  },
  {
    value: 'ODYNOPHALGIA',
    label: 'patients.consultation.template.throatSymptoms.odynophagia',
    colSpan: 3,
  },
  {
    value: 'HYPERSECRETAION',
    label: 'patients.consultation.template.throatSymptoms.hypersecretaion',
    colSpan: 3,
  },
  {
    value: 'THROAT_COUGH',
    label: 'patients.consultation.template.throatSymptoms.cough',
    colSpan: 3,
  },
  {
    value: 'DYSPHONIA',
    label: 'patients.consultation.template.throatSymptoms.hoarseness',
    colSpan: 3,
  },
  {
    value: 'TOOTH_PAIN',
    label: 'patients.consultation.template.throatSymptoms.toothPain',
    colSpan: 3,
  },
  {
    value: 'DENTAL_CARIES',
    label: 'patients.consultation.template.throatSymptoms.dentalCaries',
    colSpan: 3,
  },
];

export const psychologySymptoms: OptionType[] = [
  {
    value: 'LETHARGY',
    label: 'patients.consultation.template.psychologySymptoms.calm',
    colSpan: 3,
  },
  {
    value: 'AGITATION',
    label: 'patients.consultation.template.psychologySymptoms.agitation',
    colSpan: 3,
  },
  {
    value: 'ISOLATION',
    label: 'patients.consultation.template.psychologySymptoms.isolation',
    colSpan: 3,
  },
  {
    value: 'ANXIETY',
    label: 'patients.consultation.template.psychologySymptoms.anxiety',
    colSpan: 3,
  },
  {
    value: 'HALLUCINATION',
    label: 'patients.consultation.template.psychologySymptoms.hallucination',
    colSpan: 3,
  },
];
