import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: '#1565c0' },
    secondary: { main: '#ff6f00' },
    background: {
      default: mode === 'dark' ? '#121212' : '#f5f7fa',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { transition: 'background-color 0.3s, box-shadow 0.2s' },
      },
    },
  },
});

export default getTheme('light');
