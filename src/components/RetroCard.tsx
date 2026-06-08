import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { DESIGN } from '../theme/design';

type RetroCardProps = ViewProps & {
  accent?: 'cyan' | 'pink' | 'green' | 'yellow' | 'purple';
};

const accentColor = {
  cyan: DESIGN.colors.border,
  pink: DESIGN.colors.primary,
  green: DESIGN.colors.mint,
  yellow: DESIGN.colors.yellow,
  purple: DESIGN.colors.purple,
};

export default function RetroCard({ accent = 'cyan', style, children, ...props }: RetroCardProps) {
  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          borderColor: accentColor[accent],
          borderRightColor: DESIGN.colors.primary,
          borderBottomColor: DESIGN.colors.yellow,
        },
        style,
      ]}
    >
      <View style={[styles.corner, { backgroundColor: accentColor[accent] }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: DESIGN.colors.surface,
    borderWidth: DESIGN.borders.heavy,
    borderRadius: DESIGN.spacing.radius,
    borderRightWidth: DESIGN.borders.heavy,
    borderBottomWidth: DESIGN.borders.heavy,
  },
  corner: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 7,
    height: 7,
  },
});
