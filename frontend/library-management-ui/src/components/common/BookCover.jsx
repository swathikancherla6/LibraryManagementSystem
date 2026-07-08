import { Box } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function BookCover({ src, title, width = 120, height = 180 }) {
  return (
    <Box
      sx={{
        width,
        height,
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'action.hover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: 2,
      }}
    >
      {src ? (
        <Box
          component="img"
          src={src}
          alt={title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <MenuBookIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
      )}
    </Box>
  );
}
