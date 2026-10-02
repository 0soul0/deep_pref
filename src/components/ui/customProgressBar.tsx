import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface ProgressBarProps {
    progress: number; // 0 到 1 之間的浮點數 (例如: 0.5 代表 50%)
    height?: number; // 進度條高度
    trackColor?: string; // 底色 (軌道顏色)
    progressColor?: string; // 進度填充顏色
    borderRadius?: number; // 圓角大小
    style?: StyleProp<ViewStyle>; // 最外層容器樣式
    animated?: boolean; // 是否啟用過渡動畫
}

export const CustomProgressBar: React.FC<ProgressBarProps> = ({
    progress = 0,
    height = 8,
    trackColor = '#1E262D',
    progressColor = '#3B82F6',
    borderRadius = 4,
    style,
    animated = true,
}) => {
    // 限制 progress 範圍在 0 ~ 1 之間
    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    const animatedValue = useRef(new Animated.Value(clampedProgress)).current;

    useEffect(() => {
        if (animated) {
            Animated.timing(animatedValue, {
                toValue: clampedProgress,
                duration: 300, // 動畫時間 (毫秒)
                useNativeDriver: false, // 涉及 width 屬性變更，需關閉 native driver
            }).start();
        } else {
            animatedValue.setValue(clampedProgress);
        }
    }, [clampedProgress, animated]);

    // 將 0~1 的數值轉換為 0%~100% 寬度字串
    const widthInterpolation = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View
            style={[
                styles.track,
                {
                    height,
                    backgroundColor: trackColor,
                    borderRadius,
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    styles.progress,
                    {
                        width: widthInterpolation,
                        backgroundColor: progressColor,
                        borderRadius,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        width: '100%',
        overflow: 'hidden', // 確保填充條不會超出軌道圓角
    },
    progress: {
        height: '100%',
    },
});