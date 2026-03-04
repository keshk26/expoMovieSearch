import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

interface Props {
  rating: number;
}

export default function RatingBadge({ rating }: Props) {
  const score = rating.toFixed(1);
  return (
    <View style={styles.badge}>
      <Text style={styles.star}>★</Text>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    gap: 3,
  },
  star: {
    color: colors.accent,
    fontSize: 11,
  },
  score: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});
