import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHomeData } from 'src/hooks/useHomeData';
import { TabParamList } from '@navigation/TabNavigator';

const backgroundImage = require('@assets/background.png');

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const navigation2 = useNavigation<NativeStackNavigationProp<TabParamList>>();
  const {
    isLoading,
    error,
    homeData,
    activeCategoryId,
    // toggleFavorite,
    handleCategoryPress,
    isAuthenticated,
  } = useHomeData();

  const handleProfilePress = async () => {
    if (isAuthenticated) {
      navigation.navigate('ProfileScreen');
    } else {
      navigation.navigate('Login');
    }
  };

  // const handleFavoritePress = async (
  //   itemId: string,
  //   type: 'recipe' | 'featured'
  // ) => {
  //   if (!isAuthenticated) {
  //     navigation.navigate('Login');
  //     return;
  //   }
  //   await toggleFavorite(itemId, type);
  // };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#941D23" />
      </View>
    );
  }

  if (error || !homeData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-600 text-center px-4">
          {error || 'Có lỗi xảy ra'}
        </Text>
        <TouchableOpacity
          className="mt-4 bg-red-600 px-4 py-2 rounded-full"
          onPress={() => handleCategoryPress(activeCategoryId)}
        >
          <Text className="text-white">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            {isAuthenticated ? (
              // Header khi đã đăng nhập
              <TouchableOpacity
                onPress={handleProfilePress}
                className="flex-row items-center"
              >
                <Image
                  source={{ 
                    uri: homeData.user?.avatar || 'https://via.placeholder.com/200'
                  }}
                  className="w-20 h-20 rounded-full mr-3"
                />
                <View>
                  <Text className="text-[#4B4B4B] italic">Chào buổi sáng,</Text>
                  <Text className="text-[#4B4B4B] text-2xl font-bold">
                    {homeData.user?.name || 'Người dùng'}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              // Header khi chưa đăng nhập
              <TouchableOpacity
                onPress={handleProfilePress}
                className="flex-row items-center"
              >
                <View className="w-20 h-20 rounded-full mr-3 bg-gray-200 items-center justify-center">
                  <Ionicons name="person-outline" size={40} color="#4B4B4B" />
                </View>
                <View>
                  <Text className="text-[#4B4B4B] italic">Xin chào,</Text>
                  <Text className="text-[#4B4B4B] text-2xl font-bold">
                    Đăng nhập ngay
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => navigation2.navigate('Favorite')}
            >
              <Ionicons name="search-outline" size={28} color="#4B4B4B" />
            </TouchableOpacity>
          </View>

          {/* Banner */}
          <TouchableOpacity
            className="mx-4 mb-4 rounded-2xl p-4 flex-row items-center"
            style={{ backgroundColor: '#941D23' }}
            activeOpacity={0.9}
          >
            <View className="flex-1 pr-3">
              <Text
                numberOfLines={3}
                ellipsizeMode="tail" // hoặc "middle" | "head" | "clip"
                className="text-white text-base font-medium leading-[22px]"
              >
                {homeData.banner.description}
              </Text>

              <TouchableOpacity className="mt-3 border border-white rounded-full px-3 py-1.5 flex-row items-center self-start"
              onPress={()=> {navigation.navigate('RecipeDetail', {recipeId: homeData.banner.id})}}
              >
                <Text className="text-white font-medium mr-1">
                  Tìm hiểu ngay
                </Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>

            <Image
              source={{ 
                uri: homeData.banner?.image || 'https://via.placeholder.com/200'
              }}
              className="w-44 h-44 rounded-full"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Section Title */}
          <Text className="text-xl font-bold px-4 mb-4 text-[#4B4B4B]">
            Hôm nay ăn gì?
          </Text>

          {/* Recipe Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4 mb-4"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {homeData.recipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                onPress={() =>
                  navigation.navigate('RecipeDetail', {
                    recipeId: recipe.id,
                  })
                }
                className="mr-4 w-64 h-56 relative overflow-hidden rounded-xl"
              >
                <Image
                  source={{ 
                    uri: recipe.image || 'https://via.placeholder.com/200'
                  }}
                  className="absolute w-full h-full"
                  resizeMode="cover"
                />

                <View className="absolute w-full h-full bg-black/30" />

                {/* <TouchableOpacity
                  className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5 z-10"
                  onPress={() => handleFavoritePress(recipe.id, 'recipe')}
                >
                  <Ionicons
                    name={recipe.isFavorite ? 'heart' : 'heart-outline'}
                    size={18}
                    color={recipe.isFavorite ? '#FF3B30' : '#000'}
                  />
                </TouchableOpacity> */}

                <View className="absolute bottom-0 left-0 right-0 p-3">
                  <Text className="text-white font-bold text-base mb-2">
                    {recipe.description.length > 25
                      ? recipe.description.substring(0, 25) + '...'
                      : recipe.description}
                  </Text>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      {recipe.author ? (
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
            <Text className="text-xl font-bold text-[#4B4B4B]">
              Món ăn phổ biến
            </Text>
            <TouchableOpacity
            
            onPress={()=>{navigation2.navigate('Favorite')}}
            >
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
            {homeData.categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
                className={`flex-row items-center rounded-full px-3 py-1.5 mr-2 border ${
                  category.isActive ? 'bg-[#941D23] border-[#941D23]' : 'border-[#454442]'
                }`}
                style={{ minWidth: 90 }}
              >
                <Image
                  source={{ uri: category.icon }}
                  className="w-10 h-10 mr-1.5 rounded-full"
                  resizeMode="cover"
                />
                <Text
                  className={`${category.isActive ? 'text-white' : 'text-[#4B4B4B]'} font-bold text-base`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Featured Dishes Section */}
          <View className="px-4 pt-2 pb-6">
            <Text className="text-lg font-medium text-[#4B4B4B] mb-6">
              Món nổi bật theo thể loại
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 15, paddingTop: 40 }}
            >
              {homeData.featuredByCategory[activeCategoryId]?.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    navigation.navigate('RecipeDetail', {
                      recipeId: item.id,
                    })
                  }
                  className="bg-white rounded-2xl mb-4 mr-5 shadow-2xl relative"
                  style={{ width: 160, height: 150 }}
                >
                  <View className="absolute top-[-40px] left-0 right-0 items-center">
                    <Image
                      source={{ 
                        uri: item.image || 'https://via.placeholder.com/200'
                      }}
                      className="w-40 h-40 rounded-full border-4 border-white"
                      resizeMode="cover"
                    />
                  </View>

                  <View className="pt-32">
                    <Text className="text-center font-bold text-xl mb-2 px-1">
                      {item.name}
                    </Text>
                    {/* <View className="flex-row items-center justify-around px-3 pb-3">
                      <TouchableOpacity
                        onPress={() => handleFavoritePress(item.id, 'featured')}
                      >
                        <Ionicons
                          name={item.isFavorite ? 'heart' : 'heart-outline'}
                          size={16}
                          color={item.isFavorite ? '#FF3B30' : '#4B4B4B'}
                        />
                      </TouchableOpacity>
                    </View> */}
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
