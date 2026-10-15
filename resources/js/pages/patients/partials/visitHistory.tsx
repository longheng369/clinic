import { IVisit, IVisitWithMetaData } from '@/interfaces/IVisit';
import { formatCreatedDateTime } from '@/utils/date';
import { Box, Button, Chip, List, ListItemButton, Typography } from '@mui/material';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
  allVisits: IVisit[];
  selectedVisit: IVisitWithMetaData | null;
  onVisitSelect: (visitId: number) => void;
  onAdmit: (visitId: number) => void;
  onClose: (visitId: number) => void;
};

const TYPE_COLORS: Record<
  IVisit['type'],
  { main: string; tint: string }
> = {
  IPD: { main: '#f59e0b', tint: 'rgba(245, 158, 11, 0.12)' },
  OPD: { main: '#1e90ff', tint: 'rgba(30, 144, 255, 0.12)' },
};

const VisitHistory = ({
  allVisits,
  selectedVisit,
  onVisitSelect,
  onAdmit,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  if (allVisits.length === 0) {
    return (
      <Typography
        sx={{
          py: 4,
          textAlign: 'center',
          color: 'text.disabled',
          fontSize: 14,
        }}
      >
        {t('patients.show.noVisits')}
      </Typography>
    );
  }

  return (
    <List disablePadding>
      {allVisits.map((v) => {
        const isSelected = selectedVisit?.id === v.id;
        const { main, tint } = TYPE_COLORS[v.type];

        return (
          <ListItemButton
            key={v.id}
            onClick={() => onVisitSelect(v.id)}
            selected={isSelected}
            sx={{
              mt: 1.5,
              px: 2,
              py: 1.25,
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 1,
              borderRadius: 2,
              borderLeft: `${isSelected ? 5 : 3}px solid ${
                isSelected ? main : 'rgba(100, 116, 139, 0.25)'
              }`,
              bgcolor: isSelected ? tint : 'transparent',
              boxShadow: isSelected ? 2 : 1,
              transition:
                'background-color 150ms ease-in-out, border-color 150ms ease-in-out, box-shadow 150ms ease-in-out',
              '&:hover': {
                bgcolor: isSelected ? tint : 'rgba(100, 116, 139, 0.06)',
                boxShadow: isSelected ? 3 : 1.5,
              },
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {isSelected && (
                <CheckCircle2 size={16} color={main} style={{ flexShrink: 0 }} />
              )}
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? 'text.primary' : 'text.secondary',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {formatCreatedDateTime(v.created_at)}
              </Typography>
              <Chip
                label={v.type}
                size="small"
                color={v.type === 'IPD' ? 'warning' : 'info'}
                sx={{ fontWeight: 500 }}
              />
            </Box>

            {v.status === 'active' && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  gap: 1,
                }}
              >
                {v.type === 'OPD' && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(event) => {
                      event.stopPropagation();
                      onAdmit(v.id);
                    }}
                    sx={{ fontSize: 12, py: 0.375 }}
                  >
                    {t('patients.show.admit')}
                  </Button>
                )}
                <Button
                  size="small"
                  color="warning"
                  variant="outlined"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClose(v.id);
                  }}
                  sx={{ fontSize: 12, py: 0.375 }}
                >
                  {t('common.close')}
                </Button>
              </Box>
            )}
          </ListItemButton>
        );
      })}
    </List>
  );
};

export default VisitHistory;
