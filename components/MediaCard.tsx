import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { IMAGE_BASE } from '@/services/tmdb';
import RatingBadge from './RatingBadge';

interface Props {
  title: string;
  posterPath: string | null;
  rating: number;
  year: string;
  onPress: () => void;
}

export default function MediaCard({ title, posterPath, rating, year, onPress }: Props) {
  const uri = posterPath ? `${IMAGE_BASE}${posterPath}` : null;

  return (
    <Pressable className="flex-1 m-sm" onPress={onPress}>
      <View className="rounded-md overflow-hidden bg-card aspect-[2/3]">
        {uri ? (
          <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-text-muted text-[12px]">No Image</Text>
          </View>
        )}
        {rating > 0 && (
          <View className="absolute top-sm right-sm">
            <RatingBadge rating={rating} />
          </View>
        )}
      </View>
      <Text className="text-text-primary text-[13px] font-semibold mt-sm leading-[18px]" numberOfLines={2}>
        {title}
      </Text>
      {year ? <Text className="text-text-muted text-[12px] mt-[2px]">{year}</Text> : null}
    </Pressable>
  );
}
