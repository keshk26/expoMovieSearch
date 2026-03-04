import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getPopularTV, TVShow } from '@/services/tmdb';
import MediaCard from '@/components/MediaCard';
import { colors, spacing } from '@/constants/theme';

export default function TVScreen() {
  const router = useRouter();
  const [shows, setShows] = useState<TVShow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchShows = useCallback(async (p: number) => {
    try {
      const data = await getPopularTV(p);
      setShows(prev => p === 1 ? data.results : [...prev, ...data.results]);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchShows(1);
  }, [fetchShows]);

  const loadMore = () => {
    if (loadingMore || page >= totalPages) return;
    const next = page + 1;
    setPage(next);
    setLoadingMore(true);
    fetchShows(next);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={shows}
      keyExtractor={item => String(item.id)}
      numColumns={2}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <MediaCard
          title={item.name}
          posterPath={item.poster_path}
          rating={item.vote_average}
          year={item.first_air_date?.slice(0, 4) ?? ''}
          onPress={() => router.push(`/tv/${item.id}`)}
        />
      )}
      ListHeaderComponent={
        <Text style={styles.heading}>Popular TV Shows</Text>
      }
      ListFooterComponent={
        loadingMore ? <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} /> : null
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
