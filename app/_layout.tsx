import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ApplianceProvider } from '@/context/ApplianceContext';
import { GamificationProvider } from '@/context/GamificationContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ApplianceProvider>
      <GamificationProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </GamificationProvider>
    </ApplianceProvider>
  );
}