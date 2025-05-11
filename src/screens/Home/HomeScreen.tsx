import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockData } from '../../MockData/Data';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backgroundImage = require('@assets/background.png');

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [categories, setCategories] = useState(mockData.categories);
  const [activeCategoryId, setActiveCategoryId] = useState('1');
  const [featuredItems, setFeaturedItems] = useState(
    mockData.featuredByCategory['1']
  );

  const handleProfilePress = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      navigation.navigate('ProfileScreen');
    } else {
      navigation.navigate('Login');
    }
  };

  useEffect(() => {
    setFeaturedItems(mockData.featuredByCategory[activeCategoryId] || []);
  }, [activeCategoryId]);

  const handleCategoryPress = (categoryId) => {
    setActiveCategoryId(categoryId);
    const updatedCategories = categories.map((category) => ({
      ...category,
      isActive: category.id === categoryId,
    }));
    setCategories(updatedCategories);
  };

  const toggleFavorite = (itemId) => {
    setFeaturedItems(
      featuredItems.map((item) =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-2 px-5 py-4">
            <TouchableOpacity
              onPress={handleProfilePress}
              className="flex-row items-center"
            >
              <Image
                source={{ uri: mockData.user.avatar }}
                className="w-20 h-20 rounded-full mr-3"
              />
              <View>
                <Text className="text-[#454442] italic">Chào buổi sáng,</Text>
                <Text className="text-[#454442] text-2xl font-bold">
                  {mockData.user.name}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons name="search-outline" size={24} color="#454442" />
            </TouchableOpacity>
          </View>

          {/* Banner */}
          <TouchableOpacity
            className="mx-4 mb-4 rounded-2xl p-4 flex-row items-center"
            style={{ backgroundColor: '#941D23' }}
            activeOpacity={0.9}
          >
            {/* Nội dung bên trái */}
            <View className="flex-1 pr-3">
              <Text className="text-white text-base font-medium leading-[22px]">
                Phở bò là một phần của{' '}
                <Text className="italic">Văn hóa Việt Nam</Text>
              </Text>

              <TouchableOpacity className="mt-3 border border-white rounded-full px-3 py-1.5 flex-row items-center self-start">
                <Text className="text-white font-medium mr-1">
                  Tìm hiểu ngay
                </Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>

            {/* Hình ảnh */}
            <Image
              source={{ uri: mockData.banner.image }}
              className="w-44 h-44 rounded-full"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Section Title */}
          <Text className="text-xl font-bold px-4 mb-4 text-gray-800">
            Hôm nay ăn gì?
          </Text>

          {/* Recipe Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4 mb-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {mockData.recipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                onPress={() =>
                  navigation.navigate('RecipeDetail', {
                    recipeId: Number(recipe.id),
                  })
                }
                className="mr-4 w-64 h-56 relative overflow-hidden rounded-xl"
              >
                {/* Background Image */}
                <Image
                  source={{ uri: recipe.image }}
                  className="absolute w-full h-full"
                  resizeMode="cover"
                />

                {/* Dark Overlay for better text visibility */}
                <View className="absolute w-full h-full bg-black/30" />

                {/* Favorite Button */}
                <TouchableOpacity className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5 z-10">
                  <Ionicons
                    name={recipe.isFavorite ? 'heart' : 'heart-outline'}
                    size={18}
                    color={recipe.isFavorite ? '#FF3B30' : '#000'}
                  />
                </TouchableOpacity>

                {/* Content Container - at the bottom */}
                <View className="absolute bottom-0 left-0 right-0 p-3">
                  {/* Recipe Title */}
                  <Text className="text-white font-bold text-base mb-2">
                    {recipe.description.length > 25
                      ? recipe.description.substring(0, 25) + '...'
                      : recipe.description}
                  </Text>

                  {/* Author and Time */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      {recipe.authorAvatar ? (
                        <Image
                          source={{ uri: recipe.authorAvatar }}
                          className="w-5 h-5 rounded-full mr-1"
                        />
                      ) : (
                        <View className="w-5 h-5 rounded-full bg-gray-300 mr-1" />
                      )}
                      <Text className="text-white text-xs">
                        {recipe.author}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={14} color="white" />
                      <Text className="text-white text-xs ml-1">
                        {recipe.time}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Popular Dishes Section */}
          <View className="flex-row justify-between px-4 mb-2">
            <Text className="text-xl font-bold text-gray-800">
              Món ăn phổ biến
            </Text>
            <TouchableOpacity>
              <Text className="text-red-600 text-base font-bold underline">
                Xem thêm
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4 py-4"
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
                className={`flex-row items-center rounded-full px-3 py-1.5 mr-2 border ${
                  category.isActive ? 'bg-red-600 border-red-600' : ''
                }`}
                style={{ minWidth: 90 }}
              >
                <Image
                  source={{ uri: category.icon }}
                  className="w-5 h-5 mr-1.5"
                  resizeMode="contain"
                />
                <Text
                  className={`${category.isActive ? 'text-white' : 'text-gray-800'} font-bold text-base`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Featured Dishes Section */}
          <View className="px-4 pt-2 pb-6">
            <Text className="text-lg font-medium text-gray-600 mb-6">
              Món nổi bật theo thể loại
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 15, paddingTop: 40 }}
            >
              {featuredItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    navigation.navigate('RecipeDetail', {
                      recipeId: Number(item.id),
                    })
                  }
                  className="bg-white rounded-2xl mb-4 mr-5 shadow-xl relative"
                  style={{ width: 160, height: 170 }}
                >
                  {/* Top circular image with absolute positioning */}
                  <View className="absolute top-[-40px] left-0 right-0 items-center">
                    <Image
                      source={{ uri: item.image }}
                      className="w-40 h-40 rounded-full border-4 border-white"
                      resizeMode="cover"
                    />
                  </View>

                  {/* Content below image */}
                  <View className="pt-32">
                    <Text className="text-center font-bold text-xl mb-2 px-1">
                      {item.name}
                    </Text>
                    {/* Bottom row with time and favorite */}
                    <View className="flex-row items-center justify-between  px-3 pb-3">
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={14} color="gray" />
                        <Text className="text-gray-500 text-xs ml-1">
                          {item.time}
                        </Text>
                      </View>

                      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                        <Ionicons
                          name={item.isFavorite ? 'heart' : 'heart-outline'}
                          size={16}
                          color={item.isFavorite ? '#FF3B30' : 'gray'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default HomeScreen;
