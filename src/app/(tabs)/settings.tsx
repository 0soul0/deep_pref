import AppHeader from '@/components/ui/appHeader';
import { createStyles } from '@/constants/global-styles';
import { ThemeMode, useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function SettingsScreen() {
  const appTheme = useAppTheme();
  const { colors, themeMode, setThemeMode } = appTheme;
  const styles = useMemo(() => createStyles(appTheme), [appTheme]);

  const [fps] = useState(52);
  const [cpu] = useState(7);

  const themeOptions: { label: string; mode: ThemeMode; icon: keyof typeof Ionicons.glyphMap; description: string }[] = [
    {
      label: 'Dark Mode (暗色模式)',
      mode: 'dark',
      icon: 'moon-outline',
      description: '適用於低光環境，降低眼部疲勞',
    },
    {
      label: 'Light Mode (亮色模式)',
      mode: 'light',
      icon: 'sunny-outline',
      description: '乾淨俐落的亮色視圖風格',
    },
    {
      label: 'System (跟隨系統)',
      mode: 'system',
      icon: 'phone-portrait-outline',
      description: '自動依據裝置系統設定切換主題',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <AppHeader
        title="Settings"
        subtitle="Preferences & Theme"
        fps={fps}
        cpu={cpu}
      />

      <View style={[styles.card, { marginTop: 16, padding: 16 }]}>
        <Text style={[styles.TextSecordary, { marginBottom: 4 }]}>THEME PREFERENCE</Text>
        <Text style={[styles.TextSecordarySub, { marginBottom: 16 }]}>選擇偏好的應用程式主題色彩</Text>

        {themeOptions.map((opt, index) => {
          const isSelected = themeMode === opt.mode;
          return (
            <View key={opt.mode}>
              <Pressable
                onPress={() => setThemeMode(opt.mode)}
                style={({ pressed }) => [
                  styles.rowBetween,
                  {
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor: isSelected ? colors.border : 'transparent',
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View style={[styles.rowCenter, { flex: 1 }]}>
                  <Ionicons
                    name={opt.icon}
                    size={20}
                    color={isSelected ? colors.primary : colors.subtext}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.TextSecordary, { color: isSelected ? colors.primary : colors.text }]}>
                      {opt.label}
                    </Text>
                    <Text style={[styles.TextSecordarySub, { fontSize: 12, marginTop: 2 }]}>
                      {opt.description}
                    </Text>
                  </View>
                </View>

                {isSelected && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                )}
              </Pressable>

              {index !== themeOptions.length - 1 && (
                <View style={[styles.dividingLine, { marginVertical: 6 }]} />
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
