import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export function GradientContainer({ children, style, ...props }) {
  return (
    <LinearGradient
      colors={['#4ade80', '#22c55e', '#16a34a']} // Green gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ flex: 1 }, style]}
      {...props}
    >
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </LinearGradient>
  );
}