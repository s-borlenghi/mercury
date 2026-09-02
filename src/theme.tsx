import { createContext, useContext, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { createTheme, alpha } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import { usePersistentState } from "./hooks/usePersistentState";

export type ColorMode = "light" | "dark";

const PINE = { light: "#245c4d", dark: "#5fb49a" };
const SIENNA = { light: "#a6432b", dark: "#e08a63" };

export function buildTheme(mode: ColorMode): Theme {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? PINE.dark : PINE.light },
      secondary: { main: isDark ? SIENNA.dark : SIENNA.light },
      background: isDark
        ? { default: "#0f1512", paper: "#161d19" }
        : { default: "#eef0ea", paper: "#fbfbf8" },
      text: isDark
        ? { primary: "#edf1ec", secondary: "#93a096" }
        : { primary: "#1b1d1a", secondary: "#767a71" },
      divider: isDark ? "rgba(237,241,236,0.09)" : "#dcdfd5",
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: isDark
              ? `radial-gradient(circle at 15% -10%, ${alpha(PINE.dark, 0.16)}, transparent 55%), radial-gradient(circle at 100% 0%, ${alpha(SIENNA.dark, 0.07)}, transparent 45%)`
              : "none",
            backgroundAttachment: "fixed",
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: "none",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: isDark ? alpha("#1c2521", 0.72) : theme.palette.background.paper,
            backdropFilter: isDark ? "blur(14px)" : "none",
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: isDark ? alpha("#121815", 0.78) : theme.palette.background.default,
            backdropFilter: "blur(14px)",
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 9 },
        },
        variants: [
          {
            props: { variant: "contained", color: "primary" },
            style: ({ theme }) => ({
              color: isDark ? "#0f1512" : "#fbfbf8",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.35)}` },
            }),
          },
        ],
      },
      MuiOutlinedInput: {
        styleOverrides: { root: { borderRadius: 9 } },
      },
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundImage: "none",
            backgroundColor: isDark ? "#161d19" : theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDark
              ? "0 24px 60px rgba(0,0,0,.55)"
              : "0 24px 60px rgba(27,29,26,.22)",
          }),
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: 0,
            borderRadius: 7,
            textTransform: "none",
            fontWeight: 500,
            color: theme.palette.text.secondary,
            "&.Mui-selected": {
              backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.12),
              color: theme.palette.primary.main,
            },
            "&.Mui-selected:hover": {
              backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.24 : 0.16),
            },
          }),
        },
      },
    },
  });
}

interface ColorModeValue {
  mode: ColorMode;
  toggle: () => void;
}

const ColorModeContext = createContext<ColorModeValue | null>(null);

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = usePersistentState<ColorMode>("mercury.themeMode", "dark");

  const toggle = useCallback(
    () => setMode((m) => (m === "dark" ? "light" : "dark")),
    [setMode]
  );

  const value = useMemo<ColorModeValue>(() => ({ mode, toggle }), [mode, toggle]);

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode(): ColorModeValue {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error("useColorMode must be used inside <ColorModeProvider>");
  return ctx;
}
