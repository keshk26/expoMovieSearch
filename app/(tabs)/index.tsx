import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import MediaCard from '@/components/MediaCard';
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
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-background"
      data={movies}
      keyExtractor={item => String(item.id)}
      numColumns={2}
      contentContainerClassName="px-sm pb-xl"
      renderItem={({ item }) => (
        <MediaCard
          title={item.title}
          posterPath={item.poster_path}
          rating={item.vote_average}
          year={item.release_date?.slice(0, 4) ?? ''}
          onPress={() => router.push(`/movie/${item.id}`)}
        />
      )}
      ListHeaderComponent={
        <Text className="text-text-primary text-[22px] font-bold px-sm pt-lg pb-sm">
          Trending Today
        </Text>
      }
      ListFooterComponent={
        isFetchingNextPage
          ? <ActivityIndicator color="#e50914" className="my-lg" />
          : null
      }
      onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
      onEndReachedThreshold={0.5}
    />
  );
}
