import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { Dish } from 'src/types';

interface SuggestDishProps {
  dishes: Dish[];
  onDishPress: (id: string) => void;
}

export default function SuggestDish({ dishes, onDishPress }: SuggestDishProps) {
  if (dishes.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-500 mb-2">
          Chưa có gợi ý món ăn nào
        </Text>
        <Text className="text-sm text-gray-400 text-center">
          Thêm nhiều nguyên liệu hơn để nhận gợi ý món ăn phù hợp
        </Text>
      </View>
    );
  }

  const renderDishItem = ({ item }: { item: Dish }) => (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-md mb-4"
      onPress={() => onDishPress(item.id)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrl }}
        className="w-full h-40 rounded-t-xl"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="font-bold text-lg mb-1">{item.name}</Text>
        <Text className="text-gray-500 text-xs mb-2">
          {item.ingredients.join(', ')}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-xs text-gray-500">Thời gian: {item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={dishes}
        renderItem={renderDishItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}
