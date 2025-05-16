import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  FlatList,
  RefreshControl,
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const navigation2 = useNavigation<NativeStackNavigationProp<TabParamList>>();
  const {
    isLoading,
    error,
    homeData,
    activeCategoryId,
    handleCategoryPress,
    isAuthenticated,
    fetchRecipeFeed,
    refreshData
  } = useHomeData();

  // Kiểm tra role admin
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const role = await AsyncStorage.getItem('accountRole');
        console.log(role)
        if(role ==='admin'){
                  navigation.reset({
          index: 0,
          routes: [{ name: 'AdminDrawerNavigator' }],
        });
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
      }
    };
    
    checkAdminRole();
  }, []);

  // Hàm refresh feed
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  // Hàm tải thêm
  const handleLoadMore = async () => {
    if (isLoadingMore || !homeData?.recipeFeedHasMore) return;
    
    setIsLoadingMore(true);
    const currentLength = homeData.recipeFeed?.length || 0;
    await fetchRecipeFeed('recommended', currentLength);
    setIsLoadingMore(false);
  };

  const handleProfilePress = async () => {
    if (isAuthenticated) {
      navigation2.navigate('Profile');
    } else {
      navigation.navigate('Login');
    }
  };


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
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-2 px-5 py-4">
            {isAuthenticated ? (
              // Header khi đã đăng nhập
              <TouchableOpacity
                onPress={handleProfilePress}
                className="flex-row items-center"
              >
                <Image
                  source={{ uri: homeData.user?.avatar }}
                  className="w-20 h-20 rounded-full mr-3"
                />
                <View>
                  <Text className="text-[#4B4B4B] italic">Chào buổi sáng,</Text>
                  <Text className="text-[#4B4B4B] text-2xl font-bold">
                    {homeData.user?.name}
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

            <TouchableOpacity onPress={() => navigation.navigate('AddDishScreen')}>
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

              <TouchableOpacity
                className="mt-3 border border-white rounded-full px-3 py-1.5 flex-row items-center self-start"
                onPress={() => {
                  navigation.navigate('RecipeDetail', {
                    recipeId: homeData.banner.id,
                  });
                }}
              >
                <Text className="text-white font-medium mr-1">
                  Tìm hiểu ngay
                </Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>

            <Image
              source={{ uri: homeData.banner.image }}
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
            {homeData.recipesFeatured && homeData.recipesFeatured.length > 0 ? (
              homeData.recipesFeatured.map((recipe) => (
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
                    source={{ uri: recipe.image }}
                    className="absolute w-full h-full"
                    resizeMode="cover"
                  />

                  <View className="absolute w-full h-full bg-black/30" />

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
              ))
            ) : (
              <View className="flex-1 justify-center items-center my-4">
                <Text className="text-gray-500">Không có công thức nào</Text>
              </View>
            )}
          </ScrollView>

          {/* Popular Dishes Section */}
          <View className="flex-row justify-between px-4 mb-2 mt-1">
            <Text className="text-xl font-bold text-[#4B4B4B]">
              Món ăn phổ biến theo thể loại
            </Text>
          </View>

          {/* Category Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4 py-4"
          >
            {homeData.categories && homeData.categories.length > 0 ? (
              homeData.categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleCategoryPress(category.id)}
                  className={`flex-row items-center rounded-full px-3 py-1.5 mr-2 border ${
                    category.isActive
                      ? 'bg-[#941D23] border-[#941D23]'
                      : 'border-[#454442]'
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
              ))
            ) : (
              <View className="justify-center items-center py-2">
                <Text className="text-gray-500">Không có danh mục nào</Text>
              </View>
            )}
          </ScrollView>

          {/* Featured Dishes Section */}
          <View className="px-4 pt-2 pb-6">

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 15, paddingTop: 40 }}
            >
              {homeData.featuredByCategory && 
              homeData.featuredByCategory[activeCategoryId] && 
              homeData.featuredByCategory[activeCategoryId].length > 0 ? (
                homeData.featuredByCategory[activeCategoryId].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      navigation.navigate('RecipeDetail', {
                        recipeId: item.id,
                      })
                    }
                    className="bg-white rounded-2xl mb-4 mr-5 shadow-2xl"
                    style={{ width: 160, minHeight: 150 }}
                  >
                    <View className="items-center" style={{ marginTop: -40 }}>
                      <Image
                        source={{ uri: item.image }}
                        className="w-40 h-40 rounded-full border-2 border-white"
                        resizeMode="cover"
                      />
                    </View>

                    <View className="px-2 py-2">
                      <Text className="text-center font-bold text-lg">
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="flex-1 justify-center items-center mb-4 mt-4 w-full">
                  <Text className="text-gray-500 text-3xl">Không có món ăn nổi bật nào</Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Recipe Feed Section */}
          <View className="px-4 pt-2 pb-20">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-[#4B4B4B]">
                Khám phá món ăn
              </Text>
            </View>
            
            {homeData.recipeFeed && homeData.recipeFeed.length > 0 ? (
              <FlatList
                data={homeData.recipeFeed}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
                    className="bg-white rounded-3xl mb-6 shadow-xl overflow-hidden"
                  >
                    <View className="flex-row p-4">
                      {/* Ảnh món ăn bên trái */}
                      <Image 
                        source={{ uri: item.imageUrl }} 
                        className="w-36 h-36 rounded-3xl"
                        resizeMode="cover"
                      />
                      
                      {/* Thông tin món ăn bên phải */}
                      <View className="flex-1 pl-4 pr-2 py-2 justify-between">
                        {/* Tiêu đề món ăn */}
                        <Text className="font-bold text-gray-800 text-xl" numberOfLines={2}>
                          Công thức {item.name}
                        </Text>
                        
                        {/* Thông tin tác giả và mũi tên */}
                        <View className="flex-row items-center justify-between mt-3">
                          <View className="flex-row items-center">
                            <Image 
                              source={{ uri: item.author.avatar }}
                              className="w-12 h-12 rounded-full" 
                            />
                            <Text className="text-gray-600 ml-2 text-base">
                              {item.author.name}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                ListFooterComponent={
                  isLoadingMore ? (
                    <View className="py-4 items-center">
                      <ActivityIndicator size="small" color="#941D23" />
                      <Text className="text-gray-500 text-xs mt-2">Đang tải thêm...</Text>
                    </View>
                  ) : homeData.recipeFeedHasMore ? (
                    <TouchableOpacity 
                      className="py-4 items-center"
                      onPress={handleLoadMore}
                    >
                      <Text className="text-red-600 font-medium">Xem thêm</Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="py-4 items-center">
                      <Text className="text-gray-500 text-xs">Bạn đã xem hết danh sách</Text>
                    </View>
                  )
                }
              />
            ) : (
              <View className="items-center justify-center py-10">
                <Text className="text-gray-500 text-base">
                  Không có bài đăng nào
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default HomeScreen;
