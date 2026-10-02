import { Colors, CustomDarkTheme, CustomLightTheme, Typography } from '@/constants/main-theme';
import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'dark' | 'light' | 'system';

export interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  scheme: 'dark' | 'light';
  theme: typeof CustomDarkTheme;
  colors: typeof Colors.dark;
  typography: typeof Typography;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  const scheme: 'dark' | 'light' =
    themeMode === 'system'
      ? systemScheme === 'light'
        ? 'light'
        : 'dark'
      : themeMode;

  const theme = scheme === 'dark' ? CustomDarkTheme : CustomLightTheme;

  const value: ThemeContextType = {
    themeMode,
    setThemeMode,
    scheme,
    theme,
    colors: Colors[scheme],
    typography: Typography,
  };

  return React.createElement(ThemeContext.Provider, { value }, children);
}

export function useAppTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    const scheme: 'dark' | 'light' = 'dark';
    return {
      themeMode: 'dark',
      setThemeMode: () => { },
      scheme,
      theme: CustomDarkTheme,
      colors: Colors.dark,
      typography: Typography,
    };
  }
  return context;
}

export type AppTheme = ThemeContextType;