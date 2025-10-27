import { createTheme } from "@mui/material/styles";

const deepNavy = "#1E1E2E";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: deepNavy,
    },
    secondary: {
      main: "#00ADB5",
    },
    background: {
      default: deepNavy,
      paper: "#2A2A3B",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 600, fontSize: "2rem" },
    h2: { fontWeight: 500, fontSize: "1.5rem" },
    body1: { fontSize: "1rem" },
    button: { textTransform: "none" },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

export default theme;
