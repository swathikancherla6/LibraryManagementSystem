import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

export default function EmptyState({ message = 'No data found', icon }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" py={6} color="text.secondary">
      {icon || <InboxIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />}
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
}
