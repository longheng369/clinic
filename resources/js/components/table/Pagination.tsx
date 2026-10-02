import { Box, Button, Stack, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '@/interfaces/IPagination';
import type { ElementType } from 'react';

const InertiaLinkComponent = Link as unknown as ElementType;

type Props = {
  meta: PaginationMeta;
  baseUrl: string;
  only?: string[];
};

const Pagination = ({ meta, baseUrl, only }: Props) => {
  const { t } = useTranslation();
  const separator = baseUrl.includes('?') ? '&' : '?';
  const link = (page: number) => `${baseUrl}${separator}page=${page}`;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{
        mt: 1.5,
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {t('common.pageOf', {
          current: meta.current_page,
          total: meta.last_page,
        })}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
        }}
      >
        <Button
          component={InertiaLinkComponent}
          href={link(meta.current_page - 1)}
          preserveScroll
          only={only}
          disabled={meta.current_page === 1}
          size="small"
          startIcon={<ChevronLeft size={16} />}
        >
          {t('common.previous')}
        </Button>
        {Array.from({ length: meta.last_page }, (_, index) => index + 1).map(
          (page) => (
            <Button
              key={page}
              component={InertiaLinkComponent}
              href={link(page)}
              preserveScroll
              only={only}
              size="small"
              variant={page === meta.current_page ? 'contained' : 'text'}
              color={page === meta.current_page ? 'primary' : 'inherit'}
              sx={{ minWidth: 36 }}
            >
              {page}
            </Button>
          ),
        )}
        <Button
          component={InertiaLinkComponent}
          href={link(meta.current_page + 1)}
          preserveScroll
          only={only}
          disabled={meta.current_page === meta.last_page}
          size="small"
          endIcon={<ChevronRight size={16} />}
        >
          {t('common.next')}
        </Button>
      </Box>
    </Stack>
  );
};

export default Pagination;
