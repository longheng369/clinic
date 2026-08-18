import { Grid } from '@mui/material'
import React from 'react'
import GridItemInfo from './gridItemInfo'

type Props = {
   
}

const PatientInfo = () => {
   return (
      <Grid container spacing={1}>
         <Grid size={{ md: 4 }}>
            <GridItemInfo label={info.label} value={info.value} />
         </Grid>
      </Grid>
   )
}

export default PatientInfo