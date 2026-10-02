import { AppTheme } from "@/hooks/use-app-theme";
import { StyleSheet } from 'react-native';


export const createStyles = (theme: AppTheme) => {

    const { colors, typography } = theme

    return StyleSheet.create({

        container: { flex: 1, padding: 16 },

        rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        rowCenter: { flexDirection: 'row', alignItems: 'center' },

        logoBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#16281E', justifyContent: 'center', alignItems: 'center', marginRight: 10 },

        card: { backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.border, borderTopStartRadius: 12, borderTopEndRadius: 12, borderBottomEndRadius: 12, borderBottomStartRadius: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },

        TextXl: { color: colors.text, fontSize: typography.font.xxl, fontWeight: 'bold' },
        TextMain: { color: colors.text, fontSize: typography.font.xl, fontWeight: 'bold' },
        TextSecordary: { color: colors.text, fontSize: typography.font.md, fontWeight: 'bold' },
        TextXSmall: { color: colors.text, fontSize: typography.font.xs, fontWeight: 'bold' },

        TextMainSub: { color: colors.subtext, fontSize: typography.font.lg },
        TextSecordarySub: { color: colors.subtext, fontSize: typography.font.md },

        iconSizeXl: { fontSize: typography.iconSize.xl },
        iconSizeLg: { fontSize: typography.iconSize.lg },
        iconSizeMd: { fontSize: typography.iconSize.md },

        dropdownContainer: { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1, borderRadius: 8, overflow: 'hidden', },

        processBarProgress: {
            flex: 1, // 移除 width: "100%"，只留 flex: 1
            height: 7,
            backgroundColor: colors.processBarBg,
            borderRadius: 10,
            overflow: 'hidden',
        },
        processBarPrimary: {
            color: colors.primary
        },
        processBarSecondary: {
            color: colors.secondary
        },

        dividingLine: { width: '100%', height: 1, backgroundColor: colors.processBarBg, },
        dividingWhiteLine: { width: '100%', height: 1, backgroundColor: colors.subtext, },

    })
};


// 1. 定義 Styles 的型別（亦可直接使用 ReturnType<typeof createStyles>）
export type StylesType = ReturnType<typeof createStyles>;