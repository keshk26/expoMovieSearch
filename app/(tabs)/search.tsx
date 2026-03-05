import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { searchMulti, SearchResult, IMAGE_BASE } from '@/services/tmdb';
import RatingBadge from '@/components/RatingBadge';
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
    <View className="flex-1 bg-background">
      <TextInput
        className="m-lg bg-search-bg rounded-md px-lg py-md text-text-primary text-[16px] border border-border"
        value={query}
        onChangeText={setQuery}
        placeholder="Search movies & TV shows..."
        placeholderTextColor="#aaaaaa"
        returnKeyType="search"
        autoCorrect={false}
      />

      {loading && (
        <ActivityIndicator color="#e50914" className="mt-xl" />
      )}

      {!loading && query.trim().length >= 2 && results.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-muted text-[15px]">No results found for "{query}"</Text>
        </View>
      )}

      {!loading && query.trim().length < 2 && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-muted text-[15px]">Type to search...</Text>
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
            <Pressable className="flex-row px-lg py-sm gap-md" onPress={() => handlePress(item)}>
              <View className="w-[60px] h-[90px] rounded-sm overflow-hidden bg-card">
                {uri ? (
                  <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <View className="flex-1 bg-card" />
                )}
              </View>
              <View className="flex-1 justify-center gap-[4px]">
                <Text className="text-text-primary text-[15px] font-semibold" numberOfLines={2}>{title}</Text>
                <Text className="text-text-muted text-[13px]">{year}</Text>
                <View className="flex-row items-center gap-sm mt-xs">
                  <View className={`px-sm py-[2px] rounded-sm ${type === 'TV' ? 'bg-[#1565c0]' : 'bg-primary'}`}>
                    <Text className="text-text-primary text-[10px] font-bold">{type}</Text>
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
