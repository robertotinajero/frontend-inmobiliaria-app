// src/theme/theme.js
import { createTheme } from '@mui/material/styles';
import { blue, blueGrey, indigo, red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      light: blue[300],
      main: indigo[600],
      //main: '#e91e63',
      dark: blue[700],
      darker: blue[900],
      contrastText: '#000', // texto blanco para botones primary
    },
    secondary: {
      main: '#f50057', // ejemplo secundario
      contrastText: '#fff',
    },
    action: {
      hover: 'rgba(0, 0, 0, 0.04)',
      disabled: 'rgba(0, 0, 0, 0.26)',
    },
  },
  components: {
    // Aquí definimos estilos globales para los botones
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px',
        },
        containedPrimary: {
          color: '#d41010ff',
          backgroundColor: blue[500],
          '&:hover': {
            backgroundColor: blue[700],
          },
          '&:disabled': {
            backgroundColor: 'rgba(0, 0, 0, 0.26)',
            color: 'rgba(0, 0, 0, 0.26)',
          },
        },
        outlinedPrimary: {
          color: blue[50],
          borderColor: blue[900],
          '&:hover': {
            color: blue[100],
            borderColor: blueGrey[700],
            //backgroundColor: 'rgba(0, 0, 0, 0.04)',
            backgroundColor: blue[900],
          },
          '&:disabled': {
            color: 'rgba(0, 0, 0, 0.26)',
            borderColor: 'rgba(0, 0, 0, 0.26)',
          },
        },
      },
    },
  },
});

export default theme;
