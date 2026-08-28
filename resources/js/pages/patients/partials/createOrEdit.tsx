import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Input from '@/components/form/input';
import Select from '@/components/form/select';
import DateInput from '@/components/form/date';
import Autocomplete from '@/components/form/autocomplete';
import { IPatient, IPatientFormData } from '@/interfaces/IPatient';
import { router } from '@inertiajs/react';
import { useToast } from '@/components/toast';
import { DialogActions, DialogContent, Grid, Box, Button } from '@mui/material';
import { useModal } from '@/components/modal';
import { IGazetteer } from '@/interfaces/IGazetteer';
import { getGazetteerInfo } from '@/utils/gazetteer';

const BLOOD_GROUPS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

type Props = {
  patient?: IPatient;
};

const getDefaultPatientValues = (patient?: IPatient): IPatientFormData => {
  if (!patient) {
    return {
      khmer_first_name: '',
      khmer_last_name: '',
      first_name: '',
      last_name: '',
      date_of_birth: '',
      address: null,
      province_code: null,
      district_code: null,
      commune_code: null,
      village_code: null,
      blood_group: null,
      phone_number: '',
      gender: 'male',
      allergy: '',
      national_id: '',
    };
  }

  const patientAddressCodes = patient.address
    ? getGazetteerInfo(patient.address)
    : null;

  return {
    khmer_first_name: patient.khmer_first_name,
    khmer_last_name: patient.khmer_last_name,
    first_name: patient.first_name,
    last_name: patient.last_name,
    date_of_birth: patient.date_of_birth,
    address: patient.address,
    province_code: patientAddressCodes?.province
      ? Number(patientAddressCodes.province)
      : null,
    district_code: patientAddressCodes?.district
      ? Number(patientAddressCodes.district)
      : null,
    commune_code: patientAddressCodes?.commune
      ? Number(patientAddressCodes.commune)
      : null,
    village_code: patientAddressCodes?.village
      ? Number(patientAddressCodes.village)
      : null,
    blood_group: patient.blood_group,
    phone_number: patient.phone_number,
    gender: patient.gender,
    allergy: patient.allergy,
    national_id: patient.national_id,
  };
};

const fetchGazetteers = async (endpoint: string): Promise<IGazetteer[]> => {
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Failed to load ${endpoint}`);
  }

  const payload = (await response.json()) as { data?: IGazetteer[] };

  return payload.data ?? [];
};

const PatientForm = ({ patient }: Props) => {
  const { closeModal } = useModal();
  const [isProcessing, setIsProcessing] = useState(false);
  const [provinces, setProvinces] = useState<IGazetteer[]>([]);
  const [districts, setDistricts] = useState<IGazetteer[]>([]);
  const [communes, setCommunes] = useState<IGazetteer[]>([]);
  const [villages, setVillages] = useState<IGazetteer[]>([]);
  const { toast } = useToast();
  const { control, handleSubmit, watch, setValue } = useForm<IPatientFormData>({
    defaultValues: getDefaultPatientValues(patient),
  });
  const provinceCode = watch('province_code');
  const districtCode = watch('district_code');
  const communeCode = watch('commune_code');

  useEffect(() => {
    let cancelled = false;

    void fetchGazetteers('/gazetteers/provinces')
      .then((data) => {
        if (!cancelled) {
          setProvinces(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProvinces([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!provinceCode) {
      setDistricts([]);
      return;
    }

    let cancelled = false;

    void fetchGazetteers(`/gazetteers/districts/${provinceCode}`)
      .then((data) => {
        if (!cancelled) {
          setDistricts(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDistricts([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [provinceCode]);

  useEffect(() => {
    if (!districtCode) {
      setCommunes([]);
      return;
    }

    let cancelled = false;

    void fetchGazetteers(`/gazetteers/communes/${districtCode}`)
      .then((data) => {
        if (!cancelled) {
          setCommunes(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCommunes([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [districtCode]);

  useEffect(() => {
    if (!communeCode) {
      setVillages([]);
      return;
    }

    let cancelled = false;

    void fetchGazetteers(`/gazetteers/villages/${communeCode}`)
      .then((data) => {
        if (!cancelled) {
          setVillages(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setVillages([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [communeCode]);

  const onSubmit = handleSubmit((data) => {
    setIsProcessing(true);
    if (patient) {
      router.put(
        `/patients/${patient.id}`,
        { ...data, address: data.village_code ?? data.address },
        {
          onSuccess: () => {
            closeModal();
            toast('Patient updated successfully!', {
              variant: 'success',
              description: 'The patient has been updated.',
            });
          },
          onFinish: () => {
            setIsProcessing(false);
          },
        },
      );

      return;
    }

    router.post(
      '/patients',
      { ...data, address: data.village_code ?? data.address },
      {
        onSuccess: () => {
          closeModal();
          toast('Patient created successfully!', {
            variant: 'success',
            description: 'The patient has been created.',
          });
        },
        onFinish: () => {
          setIsProcessing(false);
        },
      },
    );
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <DialogContent sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Grid container spacing={3}>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="khmer_first_name"
              label="Khmer First Name"
              sx={{
                '& .MuiInputBase-input': { fontFamily: 'var(--font-khmer)' },
              }}
              slotProps={{ htmlInput: { spellCheck: false } }}
              rules={{
                required: 'This field is required',
                pattern: {
                  value: /^[\u1780-\u17FF\s]+$/,
                  message: 'Only Khmer characters are allowed',
                },
              }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="khmer_last_name"
              label="Khmer Last Name"
              sx={{
                '& .MuiInputBase-input': { fontFamily: 'var(--font-khmer)' },
              }}
              slotProps={{ htmlInput: { spellCheck: false } }}
              rules={{
                required: 'This field is required',
                pattern: {
                  value: /^[\u1780-\u17FF\s]+$/,
                  message: 'Only Khmer characters are allowed',
                },
              }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="first_name"
              label="First Name (English)"
              slotProps={{ htmlInput: { spellCheck: false } }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="last_name"
              label="Last Name (English)"
              slotProps={{ htmlInput: { spellCheck: false } }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <DateInput
              control={control}
              name="date_of_birth"
              label="Date of Birth"
              rules={{ required: 'This field is required' }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input
              control={control}
              name="phone_number"
              label="Phone Number"
              rules={{ required: 'This field is required' }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Select
              control={control}
              name="gender"
              label="Gender"
              rules={{ required: 'This field is required' }}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Select
              control={control}
              name="blood_group"
              label="Blood Group"
              options={BLOOD_GROUPS}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Input control={control} name="national_id" label="National ID" />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Autocomplete
              control={control}
              name="province_code"
              label="Province"
              options={provinces.map((province) => ({
                value: province.code,
                label: province.name_in_khmer,
              }))}
              rules={{ required: 'This field is required' }}
              onChange={() => {
                setValue('district_code', null);
                setValue('commune_code', null);
                setValue('village_code', null);
                setValue('address', null);
              }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Autocomplete
              control={control}
              name="district_code"
              label="District"
              options={districts.map((district) => ({
                value: district.code,
                label: district.name_in_khmer,
              }))}
              rules={{ required: 'This field is required' }}
              disabled={!provinceCode}
              onChange={() => {
                setValue('commune_code', null);
                setValue('village_code', null);
                setValue('address', null);
              }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Autocomplete
              control={control}
              name="commune_code"
              label="Commune"
              options={communes.map((commune) => ({
                value: commune.code,
                label: commune.name_in_khmer,
              }))}
              rules={{ required: 'This field is required' }}
              disabled={!districtCode}
              onChange={() => {
                setValue('village_code', null);
                setValue('address', null);
              }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Autocomplete
              control={control}
              name="village_code"
              label="Village"
              options={villages.map((village) => ({
                value: village.code,
                label: village.name_in_khmer,
              }))}
              rules={{ required: 'This field is required' }}
              disabled={!communeCode}
              onChange={(option) => {
                setValue('address', option?.value ?? null);
              }}
            />
          </Grid>
          <Grid size={{ md: 12 }}>
            <Input control={control} name="allergy" label="Allergy" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={() => closeModal()} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" disabled={isProcessing} variant="contained">
          {patient ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default PatientForm;
