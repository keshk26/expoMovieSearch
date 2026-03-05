import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  rating: number;
}

export default function RatingBadge({ rating }: Props) {
  const score = rating.toFixed(1);
  return (
    <View className="flex-row items-center bg-black/70 px-sm py-xs rounded-sm gap-[3px]">
      <Text className="text-accent text-[11px]">★</Text>
      <Text className="text-accent text-[12px] font-bold">{score}</Text>
    </View>
  );
}
