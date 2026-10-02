import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AppThemeProvider, useAppTheme } from '@/hooks/use-app-theme';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

function MainContent() {
  const { theme } = useAppTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerTitle: '',
        }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <MainContent />
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}