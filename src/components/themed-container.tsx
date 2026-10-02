import { View, type ViewProps } from 'react-native';

import { CustomDarkTheme } from '@/constants/main-theme';
import { Theme } from 'expo-router';

export type ThemedContainerProps = ViewProps & {
  theme?: Theme;
};

export function ThemedContainer({ theme, style, ...otherProps }: ThemedContainerProps) {

  const appTheme = theme ? theme : CustomDarkTheme

  return <View style={[{ backgroundColor: appTheme.colors.background }, style]} {...otherProps} />;
}
