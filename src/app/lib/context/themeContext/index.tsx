"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ReactNode } from "react";

const theme = createTheme({
  palette: {
    primary: { main: "#37a711" },
    secondary: { main: "#ffffff" },
  },
});

export default function MUIThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
