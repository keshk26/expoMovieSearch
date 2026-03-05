import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPopularTV } from '@/services/tmdb';
import MediaCard from '@/components/MediaCard';
import { colors, spacing } from '@/constants/theme';

export default function TVScreen() {
  const router = useRouter();

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ['popular-tv'],
    queryFn: ({ pageParam }) => getPopularTV(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPageParam < lastPage.total_pages ? lastPageParam + 1 : undefined,
  });

  const shows = data?.pages.flatMap(p => p.results) ?? [];

  if (isLoading) {
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
        isFetchingNextPage ? <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} /> : null
      }
      onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
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
