import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { mockData } from '../../MockData/Data';
const backgroundImage = require('@assets/background.png');

interface Recipe {
  id: string;
  name: string;
  description: string;
  time: string;
  image: string;
  author: string;
  authorAvatar: string;
  isFavorite: boolean;
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  ingredients: {
    name: string;
    amount: string;
  }[];
  steps: {
    step: number;
    description: string;
  }[];
}

const FavoritesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>(mockData.recipes);

  const filteredRecipes = favoriteRecipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (recipeId: string) => {
    setFavoriteRecipes(prev =>
      prev.filter(recipe => recipe.id !== recipeId)
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-2xl text-black">⬅️</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black ml-4">
              Yêu thích
            </Text>
          </View>

          {/* Search Bar */}
          <View className="px-4 mb-4">
            <View className="flex-row items-center bg-white rounded-lg px-4 py-2">
              <Text className="text-xl mr-2">🔍</Text>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Tìm kiếm món ăn yêu thích"
                className="flex-1"
              />
            </View>
          </View>

          {/* Recipe List */}
          <View className="px-4">
            {favoriteRecipes
              .filter(recipe =>
                recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  className="bg-white rounded-lg mb-4 shadow-sm overflow-hidden"
                  onPress={() => navigation.navigate('RecipeDetail', { recipeId: parseInt(recipe.id) })}
                >
                  <Image
                    source={{ uri: recipe.image }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                  <View className="p-4">
                    <View className="flex-row justify-between items-start">
                      <Text className="text-xl font-bold mb-2 flex-1 mr-2">{recipe.name}</Text>
                      <TouchableOpacity
                        onPress={() => setFavoriteRecipes(prev => prev.filter(r => r.id !== recipe.id))}
                        className="p-2"
                      >
                        <Text className="text-2xl">❤️</Text>
                      </TouchableOpacity>
                    </View>
                    <Text className="text-black mb-2" numberOfLines={2}>
                      {recipe.description}
                    </Text>
                    <View className="flex-row justify-between">
                      <Text className="text-black">⏱️ {recipe.time}</Text>
                      <View className="flex-row items-center">
                        <Image
                          source={{ uri: recipe.authorAvatar }}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <Text className="text-black">{recipe.author}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default FavoritesScreen; 