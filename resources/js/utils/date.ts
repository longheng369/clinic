import dayjs from 'dayjs';

export const formatDob = (date: string | Date) => {
  return dayjs(date).format('DD/MM/YYYY');
};

export const calculateAge = (dateOfBirth: string | Date): number => {
  return dayjs().diff(dayjs(dateOfBirth), 'year');
};

export const formatDate = (date: string | Date) => {
  return dayjs(date).format('DD/MM/YYYY');
};

export const formatCreatedDateTime = (date: string | Date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};
