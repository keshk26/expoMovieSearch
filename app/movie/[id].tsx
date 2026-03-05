import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { getMovieDetail, Movie, BACKDROP_BASE, IMAGE_BASE } from '@/services/tmdb';
import RatingBadge from '@/components/RatingBadge';

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
      <View className="flex-1 bg-background items-center justify-center">
        <Stack.Screen options={{ title: '' }} />
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Stack.Screen options={{ title: 'Error' }} />
        <Text className="text-text-muted text-[16px]">Failed to load movie.</Text>
      </View>
    );
  }

  const backdropUri = movie.backdrop_path ? `${BACKDROP_BASE}${movie.backdrop_path}` : null;
  const posterUri = movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null;
  const year = movie.release_date?.slice(0, 4);
  const genres = movie.genres?.map(g => g.name).join(' · ');
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-xxl">
      <Stack.Screen options={{ title: movie.title, headerTransparent: false, headerBackTitle: 'Back' }} />

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
            <Text className="text-text-primary text-[20px] font-bold leading-[26px]">{movie.title}</Text>
            {year && <Text className="text-text-muted text-[14px]">{year}</Text>}
            {runtime && <Text className="text-text-muted text-[13px]">{runtime}</Text>}
            {movie.vote_average > 0 && <RatingBadge rating={movie.vote_average} />}
          </View>
        </View>

        {movie.tagline ? (
          <Text className="text-text-muted text-[14px] italic mt-lg">"{movie.tagline}"</Text>
        ) : null}

        {genres ? (
          <View className="flex-row flex-wrap gap-sm mt-md">
            {movie.genres?.map(g => (
              <View key={g.id} className="bg-card rounded-sm px-md py-xs border border-border">
                <Text className="text-text-primary text-[12px]">{g.name}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {movie.overview ? (
          <>
            <Text className="text-text-primary text-[16px] font-bold mt-xl mb-sm">Overview</Text>
            <Text className="text-text-muted text-[14px] leading-[22px]">{movie.overview}</Text>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}
