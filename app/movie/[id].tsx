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
import { getMovieDetail, Movie, BACKDROP_BASE, IMAGE_BASE } from '@/services/tmdb';
import RatingBadge from '@/components/RatingBadge';
import { colors, radius, spacing } from '@/constants/theme';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getMovieDetail(Number(id))
      .then(setMovie)
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

  if (error || !movie) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>Failed to load movie.</Text>
      </View>
    );
  }

  const backdropUri = movie.backdrop_path ? `${BACKDROP_BASE}${movie.backdrop_path}` : null;
  const posterUri = movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null;
  const year = movie.release_date?.slice(0, 4);
  const genres = movie.genres?.map(g => g.name).join(' · ');
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: movie.title, headerTransparent: false, headerBackTitle: 'Back' }} />

      {backdropUri && (
        <Image source={{ uri: backdropUri }} style={styles.backdrop} resizeMode="cover" />
      )}

      <View style={styles.body}>
        <View style={styles.header}>
          {posterUri && (
            <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
          )}
          <View style={styles.meta}>
            <Text style={styles.title}>{movie.title}</Text>
            {year && <Text style={styles.year}>{year}</Text>}
            {runtime && <Text style={styles.detail}>{runtime}</Text>}
            {movie.vote_average > 0 && <RatingBadge rating={movie.vote_average} />}
          </View>
        </View>

        {movie.tagline ? (
          <Text style={styles.tagline}>"{movie.tagline}"</Text>
        ) : null}

        {genres ? (
          <View style={styles.genreRow}>
            {movie.genres?.map(g => (
              <View key={g.id} style={styles.genreBadge}>
                <Text style={styles.genreText}>{g.name}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {movie.overview ? (
          <>
            <Text style={styles.sectionLabel}>Overview</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
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
