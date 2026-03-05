import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPopularTV } from '@/services/tmdb';
import MediaCard from '@/components/MediaCard';

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
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-background"
      data={shows}
      keyExtractor={item => String(item.id)}
      numColumns={2}
      contentContainerClassName="px-sm pb-xl"
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
        <Text className="text-text-primary text-[22px] font-bold px-sm pt-lg pb-sm">
          Popular TV Shows
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
