import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecipeResponse } from 'src/types';
import { RootStackParamList } from '@navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface SuggestedRecipeProps {
  dishes: RecipeResponse[];
  onDishPress: (id: string) => void;
}

const SuggestedRecipe: React.FC<SuggestedRecipeProps> = ({ dishes, onDishPress }) => {
  if (!dishes || dishes.length === 0) {
    return (
      <View className="items-center justify-center mt-8">
        <Text className="text-gray-500">Không có món ăn phù hợp với nguyên liệu hiện tại.</Text>
      </View>
    );
  }

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleDishPress = (id: string) => {
    navigation.navigate('RecipeDetail', {
      recipeId: id,
    });
  };

  return (
    <FlatList
      data={dishes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="bg-white rounded-xl shadow mb-4 flex-row"
          onPress={() => handleDishPress(item.id)}
          activeOpacity={0.85}
        >
          <Image
            source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }}
            className="w-24 h-24 rounded-l-xl"
            resizeMode="cover"
          />
          <View className="flex-1 p-3 justify-between">
            <Text className="font-bold text-base text-red-800" numberOfLines={2}>
              {item.name || item.displayName}
            </Text>
            <Text className="text-xs text-gray-500 mb-1" numberOfLines={2}>
              {item.description}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="person" size={14} color="#991b1b" />
              <Text className="ml-1 text-xs text-gray-700">
                {item.account?.userProfile?.fullName || item.account?.username}
              </Text>
              {item.preparationTimeMinutes && (
                <View className="flex-row items-center ml-3">
                  <Ionicons name="time" size={14} color="#991b1b" />
                  <Text className="ml-1 text-xs text-gray-700">
                    {item.preparationTimeMinutes} phút
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default SuggestedRecipe; 