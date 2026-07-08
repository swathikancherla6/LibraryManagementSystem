import { CircularProgress, Box } from '@mui/material';

export default function LoadingSpinner({ size = 40 }) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress size={size} />
    </Box>
  );
}
