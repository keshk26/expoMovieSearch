import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getTVDetail, BACKDROP_BASE, IMAGE_BASE } from '@/services/tmdb';
import RatingBadge from '@/components/RatingBadge';

export default function TVDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: show, isLoading, isError } = useQuery({
    queryKey: ['tv', id],
    queryFn: () => getTVDetail(Number(id)),
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Stack.Screen options={{ title: '' }} />
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  if (isError || !show) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Stack.Screen options={{ title: 'Error' }} />
        <Text className="text-text-muted text-[16px]">Failed to load TV show.</Text>
      </View>
    );
  }

  const backdropUri = show.backdrop_path ? `${BACKDROP_BASE}${show.backdrop_path}` : null;
  const posterUri = show.poster_path ? `${IMAGE_BASE}${show.poster_path}` : null;
  const year = show.first_air_date?.slice(0, 4);
  const genres = show.genres?.map(g => g.name).join(' · ');
  const seasons = show.number_of_seasons;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-xxl">
      <Stack.Screen options={{ title: show.name, headerTransparent: false, headerBackTitle: 'Back' }} />

      {backdropUri && (
        <Image source={{ uri: backdropUri }} className="w-full h-[220px]" resizeMode="cover" />
      )}

      <View className="p-lg">
        <View className="flex-row gap-lg -mt-[60px]">
          {posterUri && (
            <Image
              source={{ uri: posterUri }}
              className="w-[110px] h-[165px] rounded-md border-2 border-border"
              resizeMode="cover"
            />
          )}
          <View className="flex-1 pt-[70px] gap-sm">
            <Text className="text-text-primary text-[20px] font-bold leading-[26px]">{show.name}</Text>
            {year && <Text className="text-text-muted text-[14px]">{year}</Text>}
            {seasons != null && (
              <Text className="text-text-muted text-[13px]">
                {seasons} Season{seasons !== 1 ? 's' : ''}
              </Text>
            )}
            {show.vote_average > 0 && <RatingBadge rating={show.vote_average} />}
          </View>
        </View>

        {show.tagline ? (
          <Text className="text-text-muted text-[14px] italic mt-lg">"{show.tagline}"</Text>
        ) : null}

        {genres ? (
          <View className="flex-row flex-wrap gap-sm mt-md">
            {show.genres?.map(g => (
              <View key={g.id} className="bg-card rounded-sm px-md py-xs border border-border">
                <Text className="text-text-primary text-[12px]">{g.name}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {show.overview ? (
          <>
            <Text className="text-text-primary text-[16px] font-bold mt-xl mb-sm">Overview</Text>
            <Text className="text-text-muted text-[14px] leading-[22px]">{show.overview}</Text>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}
