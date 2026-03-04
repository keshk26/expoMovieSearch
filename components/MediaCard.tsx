import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { IMAGE_BASE } from '@/services/tmdb';
import RatingBadge from './RatingBadge';

interface Props {
  title: string;
  posterPath: string | null;
  rating: number;
  year: string;
  onPress: () => void;
}

export default function MediaCard({ title, posterPath, rating, year, onPress }: Props) {
  const uri = posterPath ? `${IMAGE_BASE}${posterPath}` : null;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.posterContainer}>
        {uri ? (
          <Image source={{ uri }} style={styles.poster} resizeMode="cover" />
        ) : (
          <View style={styles.noPoster}>
            <Text style={styles.noPosterText}>No Image</Text>
          </View>
        )}
        {rating > 0 && (
          <View style={styles.badge}>
            <RatingBadge rating={rating} />
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      {year ? <Text style={styles.year}>{year}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: spacing.sm,
  },
  posterContainer: {
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.card,
    aspectRatio: 2 / 3,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  noPoster: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPosterText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  year: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
});
