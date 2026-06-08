import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DESIGN } from '../../theme/design';

type PixelTabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
  accent?: string;
};

export default function PixelTabIcon({ name, color, focused, accent = DESIGN.colors.green }: PixelTabIconProps) {
  return (
    <View
      style={[
        styles.frame,
        focused ? { borderColor: accent, borderRightColor: DESIGN.colors.pink, borderBottomColor: DESIGN.colors.yellow } : styles.inactive,
      ]}
    >
      <Ionicons name={name} size={19} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    minWidth: 34,
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN.colors.bg,
    borderWidth: DESIGN.borders.pixel,
    borderRadius: 4,
  },
  inactive: {
    borderColor: '#252B36',
    borderRightColor: '#252B36',
    borderBottomColor: '#252B36',
  },
});
