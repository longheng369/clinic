import { IVisit, IVisitWithMetaData } from '@/interfaces/IVisit';
import { formatCreatedDateTime } from '@/utils/date'
import { Button, Chip, List, ListItemButton, Typography } from '@mui/material'

type Props = {
   allVisits: IVisit[]
   selectedVisit: IVisitWithMetaData | null
   onVisitSelect: (visitId: number) => void
   onAdmit: (visitId: number) => void
   onClose: (visitId: number) => void
};

const TYPE_COLORS: Record<IVisit['type'], { main: string; soft: string }> = {
  IPD: { main: '#f59e0b', soft: 'rgba(245, 158, 11, 0.14)' },
  OPD: { main: '#1e90ff', soft: 'rgba(30, 144, 255, 0.14)' },
}

const VisitHistory = ({
  allVisits,
  selectedVisit,
  onVisitSelect,
  onAdmit,
  onClose,
}: Props) => {
  if (allVisits.length === 0) {
    return (
      <Typography sx={{ py: 4, textAlign: 'center', color: 'text.disabled', fontSize: 14 }}>
            No visits recorded
      </Typography>
    )
  }

  return (
    <List disablePadding>
      {allVisits.map((v) => {
        const isSelected = selectedVisit?.id === v.id
        const { main, soft } = TYPE_COLORS[v.type]

        return (
          <ListItemButton
            key={v.id}
            onClick={() => onVisitSelect(v.id)}
            selected={isSelected}
            sx={{
              mt: 1.5,
              px: 1.5,
              py: 1,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 1,
              borderLeft: `${isSelected ? 4 : 3}px solid ${main}`,
              bgcolor: isSelected ? soft : 'transparent',
              boxShadow: 1,
              transition: 'background-color 150ms ease-in-out, border-color 150ms ease-in-out, box-shadow 150ms ease-in-out',
              '&:hover': {
                bgcolor: isSelected ? soft : 'rgba(100, 116, 139, 0.08)',
              },
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: isSelected ? 600 : 400 }}>
              {formatCreatedDateTime(v.created_at)}
            </Typography>
            <Chip label={v.type} size='small' color={v.type === 'IPD' ? 'warning' : 'info'} />
            {v.status === 'active' && (
              <>
                {v.type === 'OPD' && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(event) => {
                      event.stopPropagation()
                      onAdmit(v.id)
                    }}
                  >
                              Admit
                  </Button>
                )}
                <Button
                  size="small"
                  color="warning"
                  variant="outlined"
                  onClick={(event) => {
                    event.stopPropagation()
                    onClose(v.id)
                  }}
                >
                           Close
                </Button>
              </>
            )}
          </ListItemButton>
        )
      })}
    </List>
  )
}

export default VisitHistory
