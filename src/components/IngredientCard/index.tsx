import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IngredientCardProps {
  name: string;
  imageUrl?: string;
  backgroundColor?: string;
  cardWidth?: number;
  onDelete?: () => void;
  onPress?: () => void;
}

export default function IngredientCard({
  name,
  imageUrl = 'https://via.placeholder.com/100',
  backgroundColor,
  cardWidth,
  onDelete,
  onPress,
}: IngredientCardProps) {
  return (
    <TouchableOpacity
      style={{ width: cardWidth || '100%' }}
      className="bg-white rounded-lg shadow"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View>
        <Image
          source={{ uri: imageUrl }}
          className={`w-full h-20 rounded-t-lg ${backgroundColor ? backgroundColor : ''}`}
          resizeMode="cover"
        />
        <TouchableOpacity
          className="absolute top-1 right-1 bg-white rounded-full p-1"
          onPress={onDelete}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="close" size={16} color="black" />
        </TouchableOpacity>
        <Text className="text-center py-2 text-xs">{name}</Text>
      </View>
    </TouchableOpacity>
  );
}
