import dayjs from 'dayjs';

export const formatDob = (date: string | Date) => {
  return dayjs(date).format('DD/MM/YYYY');
};

export const formatDate = (date: string | Date) => {
  return dayjs(date).format('DD/MM/YYYY');
};

export const formatCreatedDateTime = (date: string | Date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};
