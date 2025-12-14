import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#dbc2b9",
    },
    secondary: {
      main: "#b9a096",
    },

    background: {
      default: "#fcf2f2", // app background
      paper: "rgba(240, 221, 214, 1)",
    },

    text: {
      primary: "#3c2f2f",
      secondary: "#6b5c5c",
    },

    error: {
      main: "#d9534f",
    },
    success: {
      main: "#6fbf73",
    },
    warning: {
      main: "#e6b800",
    },
    info: {
      main: "#5dade2",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--pip-on": "#4a3f3f",
          "--pip-off": "#d4c5bf",
          "--cell-border": "#b9a096",
          "--cell-bg": "#eee5e2",
          "--cell-active": "#cfc0b4",
          "--cell-highlight": "#ffe9b3",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
            boxShadow: "none",
          },
          "&.Mui-focusVisible": {
            outline: "none",
            boxShadow: "none",
          },
        },
      },
    },
  },

  typography: {
    fontFamily: `"Inter", "Roboto", sans-serif`,
    h1: { fontWeight: 700, fontSize: "2rem" },
    h2: { fontWeight: 600, fontSize: "1.5rem" },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 10,
  },
});
