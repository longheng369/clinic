import { Grid } from '@mui/material';
import React from 'react';

type Props = {
  label: string;
  value: React.ReactNode;
};

const GridItemInfo = ({ label, value }: Props) => {
  return (
    <Grid container>
      <Grid size={{ md: 4 }}>{label}</Grid>
      <Grid size={{ md: 8 }}>: {value}</Grid>
    </Grid>
  );
};

export default GridItemInfo;
