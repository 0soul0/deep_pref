
import { Typography } from '@/constants/main-theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.subtext,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    // 💡 解決壓到系統導覽鍵的問題：基礎高度 60px + 系統底部安全邊距
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: Typography.font.sm,
                    fontWeight: Typography.fontWeight.semibold,
                    marginTop: Typography.tabBar.iconMarginTop,
                },

            }}>
            {/* 1. 首頁 (Dashboard) */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid-sharp" size={size} color={color} />
                    ),
                }}
            />

            {/* 2. 只保留你要顯示的第 2 個 Tab */}
            <Tabs.Screen
                name="analysis"
                options={{
                    title: 'Analysis',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="analytics-sharp" size={size} color={color} />
                    ),
                }}
            />

            {/* 3. 設定 (Settings) */}
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-sharp" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}