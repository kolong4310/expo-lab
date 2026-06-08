import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DESIGN } from '../theme/design';

type PixelProgressBarProps = {
  value: number;
  blocks?: number;
};

export default function PixelProgressBar({ value, blocks = 10 }: PixelProgressBarProps) {
  const filledCount = Math.max(0, Math.min(blocks, Math.round((value / 100) * blocks)));

  return (
    <View style={styles.row}>
      {Array.from({ length: blocks }, (_, index) => (
        <View key={index} style={[styles.block, index < filledCount && styles.filled]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  block: {
    flex: 1,
    height: 18,
    backgroundColor: DESIGN.colors.bg,
    borderWidth: 2,
    borderColor: '#2A303A',
    marginRight: 5,
  },
  filled: {
    backgroundColor: DESIGN.colors.pink,
    borderColor: DESIGN.colors.yellow,
  },
});
