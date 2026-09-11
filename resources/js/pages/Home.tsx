import { Link } from '@inertiajs/react';
import { Box, Button, Stack, Typography } from '@mui/material';

const Home = () => (
  <Box sx={{ p: 4 }}>
    <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Typography variant="h4" component="h1">
        Home
      </Typography>
      <Button
        component={Link as React.ElementType}
        href="/dashboard"
        variant="contained"
      >
        Go to Dashboard
      </Button>
    </Stack>
  </Box>
);

export default Home;
