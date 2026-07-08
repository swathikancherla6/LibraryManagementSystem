import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
      <ErrorOutlineIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h3" fontWeight="bold" gutterBottom>404</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>The page you are looking for does not exist.</Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
    </Box>
  );
}
