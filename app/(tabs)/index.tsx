import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import MediaCard from '@/components/MediaCard';
import { colors, spacing } from '@/constants/theme';
import { getTrendingMovies } from '@/services/tmdb';

export default function MoviesScreen() {
  const router = useRouter();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ['trendingMovies'],
    queryFn: ({ pageParam }) => getTrendingMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.total_pages ? lastPageParam + 1 : undefined,
  });

  const movies = data?.pages.flatMap(p => p.results) ?? [];

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={movies}
      keyExtractor={item => String(item.id)}
      numColumns={2}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <MediaCard
          title={item.title}
          posterPath={item.poster_path}
          rating={item.vote_average}
          year={item.release_date?.slice(0, 4) ?? ''}
          onPress={() => router.push(`/movie/${item.id}`)}
        />
      )}
      ListHeaderComponent={<Text style={styles.heading}>Trending Today</Text>}
      ListFooterComponent={
        isFetchingNextPage
          ? <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} />
          : null
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
