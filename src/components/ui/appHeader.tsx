import { createStyles } from "@/constants/global-styles";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Text, View } from "react-native";

interface Props {
    title: string;
    subtitle: string;
    fps: number;
    cpu: number;
}

export default function AppHeader(
    { title, subtitle, fps, cpu }: Props
) {

    const theme = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.rowBetween}>

            <View style={styles.rowCenter}>
                <View style={styles.logoBadge}>
                    <Ionicons name="speedometer-outline" style={styles.iconSizeXl} color={theme.colors.primary} />
                </View>
                <View>
                    <Text style={styles.TextMain}>{title}</Text>
                    <Text style={styles.TextSecordarySub}>{subtitle}</Text>
                </View>
            </View>

            <View style={[styles.card, styles.rowCenter]}>
                <Ionicons name="grid-outline" style={styles.iconSizeMd} color={theme.colors.subtext} />
                <View style={{ marginLeft: 6 }}>
                    <View style={styles.rowCenter}>
                        <Ionicons name="flash-outline" style={styles.iconSizeMd} color={theme.colors.accentWarning} />
                        <Text style={styles.TextSecordarySub}> FPS </Text>
                        <Text style={styles.TextSecordary}> {fps}</Text>
                    </View>
                    <View style={styles.rowCenter}>
                        <Ionicons name="speedometer-outline" style={styles.iconSizeMd} color={theme.colors.primary} />
                        <Text style={styles.TextSecordarySub}> CPU </Text>
                        <Text style={styles.TextSecordary}> {cpu}%</Text>
                    </View>
                </View>
            </View>

        </View>
    );
}