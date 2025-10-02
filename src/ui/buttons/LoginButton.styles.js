// styles/LoginButton.styles.js
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

export const LoginButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText, // texto blanco si el botón es primary
  fontWeight: 400,
  "&.MuiButton-outlined": {
    color: theme.palette.primary.main, // color de texto para outlined
    borderColor: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.dark,
      borderColor: theme.palette.primary.dark,
    },
  },
  "&.MuiButton-contained": {
    color: "white", // texto blanco para botones llenos
  },
}));
