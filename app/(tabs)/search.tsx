import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { searchMulti, SearchResult, IMAGE_BASE } from '@/services/tmdb';
import RatingBadge from '@/components/RatingBadge';
import { colors, radius, spacing } from '@/constants/theme';
import { useDebounce } from '@/utils/useDebounce';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 350);
  const trimmed = debouncedQuery.trim();

  const { data, isFetching: loading } = useQuery({
    queryKey: ['search', trimmed],
    queryFn: () => searchMulti(trimmed),
    enabled: trimmed.length >= 2,
    select: data => data.results.filter(r => r.media_type !== 'person'),
  });

  const results: SearchResult[] = data ?? [];

  const handlePress = (item: SearchResult) => {
    if (item.media_type === 'movie') {
      router.push(`/movie/${item.id}`);
    } else if (item.media_type === 'tv') {
      router.push(`/tv/${item.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Search movies & TV shows..."
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        autoCorrect={false}
      />

      {loading && (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      )}

      {!loading && query.trim().length >= 2 && results.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No results found for "{query}"</Text>
        </View>
      )}

      {!loading && query.trim().length < 2 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Type to search...</Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={item => `${item.media_type}-${item.id}`}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const title = item.title ?? item.name ?? 'Untitled';
          const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4);
          const uri = item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : null;
          const type = item.media_type === 'movie' ? 'MOVIE' : 'TV';

          return (
            <Pressable style={styles.row} onPress={() => handlePress(item)}>
              <View style={styles.poster}>
                {uri ? (
                  <Image source={{ uri }} style={styles.posterImg} resizeMode="cover" />
                ) : (
                  <View style={styles.noPoster} />
                )}
              </View>
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                <Text style={styles.year}>{year}</Text>
                <View style={styles.meta}>
                  <View style={[styles.typeBadge, type === 'TV' ? styles.tvBadge : styles.movieBadge]}>
                    <Text style={styles.typeText}>{type}</Text>
                  </View>
                  {item.vote_average > 0 && <RatingBadge rating={item.vote_average} />}
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  input: {
    margin: spacing.lg,
    backgroundColor: colors.searchBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  posterImg: {
    width: '100%',
    height: '100%',
  },
  noPoster: {
    flex: 1,
    backgroundColor: colors.card,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  year: {
    color: colors.textMuted,
    fontSize: 13,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  movieBadge: {
    backgroundColor: colors.primary,
  },
  tvBadge: {
    backgroundColor: '#1565c0',
  },
  typeText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
});
