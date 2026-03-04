import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { getTVDetail, TVShow, BACKDROP_BASE, IMAGE_BASE } from '@/services/tmdb';
import RatingBadge from '@/components/RatingBadge';
import { colors, radius, spacing } from '@/constants/theme';

export default function TVDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [show, setShow] = useState<TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getTVDetail(Number(id))
      .then(setShow)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: '' }} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !show) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>Failed to load TV show.</Text>
      </View>
    );
  }

  const backdropUri = show.backdrop_path ? `${BACKDROP_BASE}${show.backdrop_path}` : null;
  const posterUri = show.poster_path ? `${IMAGE_BASE}${show.poster_path}` : null;
  const year = show.first_air_date?.slice(0, 4);
  const genres = show.genres?.map(g => g.name).join(' · ');
  const seasons = show.number_of_seasons;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: show.name, headerTransparent: false }} />

      {backdropUri && (
        <Image source={{ uri: backdropUri }} style={styles.backdrop} resizeMode="cover" />
      )}

      <View style={styles.body}>
        <View style={styles.header}>
          {posterUri && (
            <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
          )}
          <View style={styles.meta}>
            <Text style={styles.title}>{show.name}</Text>
            {year && <Text style={styles.year}>{year}</Text>}
            {seasons != null && (
              <Text style={styles.detail}>
                {seasons} Season{seasons !== 1 ? 's' : ''}
              </Text>
            )}
            {show.vote_average > 0 && <RatingBadge rating={show.vote_average} />}
          </View>
        </View>

        {show.tagline ? (
          <Text style={styles.tagline}>"{show.tagline}"</Text>
        ) : null}

        {genres ? (
          <View style={styles.genreRow}>
            {show.genres?.map(g => (
              <View key={g.id} style={styles.genreBadge}>
                <Text style={styles.genreText}>{g.name}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {show.overview ? (
          <>
            <Text style={styles.sectionLabel}>Overview</Text>
            <Text style={styles.overview}>{show.overview}</Text>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  backdrop: {
    width: '100%',
    height: 220,
  },
  body: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: -60,
  },
  poster: {
    width: 110,
    height: 165,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  meta: {
    flex: 1,
    paddingTop: 70,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  year: {
    color: colors.textMuted,
    fontSize: 14,
  },
  detail: {
    color: colors.textMuted,
    fontSize: 13,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: spacing.lg,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  genreBadge: {
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  genreText: {
    color: colors.textPrimary,
    fontSize: 12,
  },
  sectionLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  overview: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
});
