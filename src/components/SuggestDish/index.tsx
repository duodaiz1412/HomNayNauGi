import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { RecipeResponse } from 'src/types';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SuggestDishProps {
  dishes?: RecipeResponse[];
  search?: boolean;
  onDishPress: (id: string) => void;
}

export default function SuggestDish({
  search = false,
  dishes,
  onDishPress,
}: SuggestDishProps) {
  if (dishes && dishes.length === 0) {
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

  const renderDishItem = ({ item }: { item: RecipeResponse }) => {
    const matchedIngredients = item.ingredients.filter(ing => ing.isMatched);
    const matchPercentage = Math.round((matchedIngredients.length / item.ingredients.length) * 100);

    return (
      <TouchableOpacity
        className="bg-white rounded-xl shadow-md mb-4 mx-4"
        onPress={() => onDishPress(item.id)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-40 rounded-t-xl"
          resizeMode="cover"
        />
        <View className="p-4">
          <Text className="font-bold text-lg text-[#333]">{item.name}</Text>
          <Text className="text-gray-500 text-sm mt-1 mb-3" numberOfLines={2}>
            {item.description}
          </Text>

          {/* Thông tin nguyên liệu khớp */}
          <View className="flex-row items-center mb-3">
            <View className="flex-row items-center bg-green-50 px-3 py-1 rounded-full">
              <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
              <Text className="text-green-600 text-xs ml-1 font-medium">
                {matchedIngredients.length}/{item.ingredients.length} nguyên liệu ({matchPercentage}%)
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Image
                source={{ 
                  uri: 'https://via.placeholder.com/150'
                }}
                className="w-6 h-6 rounded-full mr-2"
              />
              <Text className="text-sm text-gray-600">
                {item.account?.username || 'Ẩn danh'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text className="text-sm text-gray-600 ml-1">
                {item.preparationTimeMinutes} phút
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1">
      <FlatList
        data={dishes}
        renderItem={renderDishItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
}
