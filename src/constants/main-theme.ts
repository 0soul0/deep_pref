import { DarkTheme as NavDarkTheme, DefaultTheme as NavLightTheme, Theme } from 'expo-router';

export const Typography = {
    // 字體大小
    font: {
        xs: 10,
        sm: 12, // TabBar Label 常用大小
        md: 14,
        lg: 16,
        xl: 20,
        xxl: 26,
    },
    // 字體粗細
    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
    // 間距與高度
    header: {
        height: 56,
    },
    tabBar: {
        height: 60,
        iconMarginTop: 2,
        iconSize: 24,
    },

    iconSize: {
        xl: 24,
        lg: 18,
        md: 16,
        sm: 14,
        xs: 12,
    }
};

export const Colors = {
    // 🌙 暗色模式 (完全精準還原圖片)
    dark: {
        // 基礎背景與卡片
        background: '#0B0E14',       // 主頁面極暗背景
        card: '#15181E',             // 卡片 / 區塊背景 (Surface)
        cardBorder: '#1F2633',       // 卡片細微邊框
        transparent: '#00000000',    // 透明
        border: '#4A5568',
        processBarBg: '#2f3037ff',

        // 文字顏色
        text: '#FFFFFF',             // 主要文字 (如標題, 數字)
        subtext: '#8F9BBA',          // 次要/副標題文字 (如 "Live monitor", "413MB")
        muted: '#4A5568',            // 暗色說明文字 (如 "CPU", "FPS")

        // 強調與功能色 (根據圖片提取)
        primary: '#32D74B',          // 螢光綠 (Dashboard 選中、進度條、圖表)
        secondary: '#3B82F6',        // 科技藍 (記憶體進度條)
        accentWarning: '#FFCC00',    // 警告黃 (如頂部 FPS 48 數值)

        notification: '#32D74B',
    },

    // ☀️ 亮色模式 (根據暗色風格相應轉化的乾淨科技風)
    light: {
        background: '#0469ceff',
        card: '#FFFFFF',
        cardBorder: '#E2E8F0',
        transparent: '#00000000',    // 透明
        border: '#E2E8F0',
        processBarBg: '#2f3037ff',

        text: '#0F172A',
        subtext: '#64748B',
        muted: '#94A3B8',

        primary: '#10B981',          // 綠色
        secondary: '#2563EB',        // 藍色
        accentWarning: '#D97706',    // 黃色


        notification: '#10B981',
    },
};

// 轉換供 React Navigation / ThemeProvider 使用
export const CustomDarkTheme: Theme = {
    ...NavDarkTheme,
    colors: {
        ...NavDarkTheme.colors,
        primary: Colors.dark.primary,
        background: Colors.dark.background,
        card: Colors.dark.card,
        text: Colors.dark.text,
        border: Colors.dark.border,
        notification: Colors.dark.notification,
    },
};

export const CustomLightTheme: Theme = {
    ...NavLightTheme,
    colors: {
        ...NavLightTheme.colors,
        primary: Colors.light.primary,
        background: Colors.light.background,
        card: Colors.light.card,
        text: Colors.light.text,
        border: Colors.light.border,
        notification: Colors.light.notification,
    },
};