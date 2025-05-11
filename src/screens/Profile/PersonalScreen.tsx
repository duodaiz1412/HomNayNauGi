import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'src/navigation/AppNavigator';
import { mockData } from 'src/MockData/Data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backgroundImage = require('@assets/background.png');

type Category = {
  id: string;
  name: string;
  icon?: string;
  isActive?: boolean;
};

const categories: Category[] = [
  { id: 'all', name: 'Tất cả'},
  ...mockData.categories
];

const userStats = {
  recipes: mockData.recipes.length,
  followers: 5400,
  following: 210,
};

const recipes = mockData.recipes.map((r) => ({
  id: r.id,
  title: r.name,
  time: r.time,
  image: r.image,
  category: r.category,
}));

const PersonalScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    };

    checkLoginStatus();
  }, [navigation]);

  const renderHeader = () => (
    <View className="items-center mt-2 mb-4 relative">
      {/* Nút cài đặt góc phải */}
      <TouchableOpacity
        className="absolute top-0 right-4"
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Text className="text-3xl text-black">☰</Text>
      </TouchableOpacity>

      {/* Tên người dùng */}
      <Text className="text-3xl font-extrabold text-[#88131B] mt-6 mb-4">
        {mockData.user.name}
      </Text>

      {/* Avatar */}
      <Image
        source={{ uri: mockData.user.avatar }}
        className="w-28 h-28 rounded-full mb-4"
      />

      {/* Số liệu thống kê */}
      <View className="flex-row justify-center mb-3">
        <View className="items-center mr-4">
          <Text className="text-xl font-bold text-black">{userStats.recipes}</Text>
          <Text className="text-sm text-gray-700 mt-1">Công thức</Text>
        </View>
        <View className="items-center mr-4">
          <Text className="text-xl font-bold text-black">{userStats.followers}</Text>
          <Text className="text-sm text-gray-700 mt-1">Lượt theo dõi</Text>
        </View>
        <View className="items-center">
          <Text className="text-xl font-bold text-black">{userStats.following}</Text>
          <Text className="text-sm text-gray-700 mt-1">Đang theo dõi</Text>
        </View>
      </View>

      {/* Bio */}
      <Text className="text-base text-black text-center px-6">
        {mockData.user.bio}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-xl w-[48%] mb-4 overflow-hidden">
      <Image source={{ uri: item.image }} className="h-28 w-full" />
      <View className="p-2">
        <Text className="text-sm font-bold text-black mb-1">{item.title}</Text>
        <Text className="text-xs text-gray-500">⏱ {item.time}</Text>
      </View>
    </View>
  );

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView className="flex-1">
        <FlatList
          data={recipes.filter((recipe) => selectedCategory === 'all' || recipe.category === selectedCategory)}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ListHeaderComponent={
            <>
              {renderHeader()}

              <Text className="text-2xl font-bold text-black text-center mb">
                Công thức của tôi
              </Text>

              {/* Tabs + Add */}
              <View className="px-4 mt-2 mb-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setSelectedCategory(cat.id)}
                      className={`flex-row items-center rounded-full px-4 py-1.5 mr-2 border ${
                        selectedCategory === cat.id
                          ? 'bg-red-700 border-red-700'
                          : 'border-gray-300'
                      }`}
                      style={{ minWidth: 90 }}
                    >
                      {cat.id !== 'all' && cat.icon && (
                        <Image
                          source={{ uri: cat.icon }}
                          className="w-5 h-5 mr-1.5"
                          resizeMode="contain"
                        />
                      )}
                      <Text
                        className={`font-bold text-base ${
                          selectedCategory === cat.id ? 'text-white' : 'text-gray-800'
                        }`}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* Nút thêm công thức */}
                  <TouchableOpacity className="ml-2 bg-red-700 w-10 h-10 rounded-full items-center justify-center">
                    <Text className="text-white text-xl">＋</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Sort & Filter */}
              <View className="flex-row items-center justify-between px-4 mb-3">
                <TouchableOpacity className="flex-row items-center">
                  <Text className="text-black text-base mr-2">↕</Text>
                  <Text className="text-black text-sm">Thời gian đăng</Text>
                </TouchableOpacity>
                <View />
              </View>
            </>
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default PersonalScreen;
