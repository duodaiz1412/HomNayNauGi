import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'src/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from 'src/api/api';
import api from 'src/api/api';

const backgroundImage = require('@assets/background.png');

type Category = {
  id: number;
  name: string;
  icon?: string;
  isActive?: boolean;
};

type Recipe = {
  id: string;
  name: string;
  status: string;
  imageUrl: string | null;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  createdAt: Date;
  preparationTimeMinutes: number | null;
  description: string | null;
};

const PersonalScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedCategory, setSelectedCategory] = useState('0');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalFavorites, setTotalFavorites] = useState(0);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/recipes/me', {
        params: {
          limit: 20,
          offset: 0,
          status: 'public',
          query: '',
        },
      });
      
      if (response.data && response.data.data) {
        const recipes = response.data.data.map((recipe: any) => ({
          ...recipe,
          viewCount: Number(recipe.viewCount || 0),
          likeCount: Number(recipe.likeCount || 0),
          favoriteCount: Number(recipe.favoriteCount || 0)
        }));
        
        setRecipes(recipes);
        setTotalRecipes(response.data.total);
        
        const totalLikes = recipes.reduce(
          (sum: number, recipe: Recipe) => sum + recipe.likeCount,
          0
        );
        const totalFavorites = recipes.reduce(
          (sum: number, recipe: Recipe) => sum + recipe.favoriteCount,
          0
        );
        setTotalLikes(totalLikes);
        setTotalFavorites(totalFavorites);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      if (response.data && response.data.data) {
        const { fullName, email, phoneNumber, avatarUrl, bio } = response.data.data;
        setUserData({
          name: fullName || 'Chưa cập nhật tên',
          email: email || 'Chưa cập nhật email',
          phone: phoneNumber || '',
          avatar: avatarUrl || '',
          bio: bio || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/recipe-categories/search');
      if (response.data && response.data.data) {
        const categoriesData = [
          { id: 0, name: 'Tất cả' },
          ...response.data.data,
        ];
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleRecipePress = async (recipeId: string) => {
    try {
      const response = await api.get(`/recipes/${recipeId}`);
      if (response.data && response.data.data) {
        navigation.navigate('RecipeDetail', { recipeId: Number(recipeId) });
      }
    } catch (error) {
      console.error('Error fetching recipe detail:', error);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          setIsLoggedIn(true);
          await Promise.all([fetchUserData(), fetchCategories(), fetchRecipes()]);
        } else {
          setIsLoggedIn(false);
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();

    const unsubscribe = navigation.addListener('focus', () => {
      if (isLoggedIn) {
        fetchUserData();
        fetchRecipes();
      }
    });

    return unsubscribe;
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecipes();
    }
  }, [selectedCategory]);

  const renderHeader = () => (
    <View className="items-center mt-2 mb-4">
      <View className="flex-row items-center justify-end w-full px-4 mb-4">
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          <Text className="text-2xl">☰</Text>
        </TouchableOpacity>
      </View>

      <View className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 mb-4">
        <Image
          source={userData?.avatar ? { uri: userData.avatar } : require('../../assets/images/avatar-placeholder.jpg')}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <Text className="text-4xl font-bold text-[#88131B] mb-2">
        {userData?.name}
      </Text>

      {userData?.bio ? (
        <TouchableOpacity 
          onPress={() => navigation.navigate('EditProfileScreen', { focusBio: true })}
          className="mb-4"
        >
          <Text className="text-base text-gray-600 text-center px-6">
            {userData.bio}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text className="text-base text-gray-600 text-center px-6 mb-4">
          Xin chào, nếu bạn đang tìm kiếm những món ăn Việt thì xin chúc mừng, bạn tìm đến đúng nơi rồi đấy !!!
        </Text>
      )}

      <View className="flex-row justify-center mb-6">
        <View className="items-center px-8">
          <Text className="text-xl font-bold text-black">{totalRecipes}</Text>
          <Text className="text-sm text-gray-600">Công thức</Text>
        </View>
        <View className="items-center px-8 border-l border-r border-gray-200">
          <Text className="text-xl font-bold text-black">{totalLikes}</Text>
          <Text className="text-sm text-gray-600">Lượt thích</Text>
        </View>
        <View className="items-center px-8">
          <Text className="text-xl font-bold text-black">{totalFavorites}</Text>
          <Text className="text-sm text-gray-600">Đã lưu</Text>
        </View>
      </View>

      <Text className="text-2xl font-bold text-black mb-4 w-full px-4">
        Công thức của tôi
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategory(cat.id.toString())}
            className={`flex-row items-center rounded-full px-4 py-2 mr-2 border ${selectedCategory === cat.id.toString() ? 'bg-[#88131B] border-[#88131B]' : 'border-[#88131B]'}`}
            style={{ minWidth: 100 }}
          >
            <Text className={`font-bold text-base ${selectedCategory === cat.id.toString() ? 'text-white' : 'text-[#88131B]'}`}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity 
          className="ml-2 bg-[#88131B] w-10 h-10 rounded-full items-center justify-center"
          onPress={() => navigation.navigate('AddDishScreen')}
        >
          <Text className="text-white text-xl">＋</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView className="flex-1">
        <FlatList
          data={recipes}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white rounded-xl w-[48%] mb-4 overflow-hidden"
              onPress={() => handleRecipePress(item.id)}
            >
              <Image
                source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                className="h-28 w-full"
              />
              <View className="p-2">
                <Text className="text-sm font-bold text-black mb-1">{item.name}</Text>
                <Text className="text-xs text-gray-500">
                  ⏱ {item.preparationTimeMinutes ? `${item.preparationTimeMinutes} phút` : 'Chưa cập nhật'}
                </Text>
                <View className="flex-row justify-between mt-1">
                  <Text className="text-xs text-gray-500">👁 {item.viewCount}</Text>
                  <Text className="text-xs text-gray-500">❤️ {item.likeCount}</Text>
                  <Text className="text-xs text-gray-500">🔖 {item.favoriteCount}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-8">
              <Text className="text-gray-500 text-lg">Chưa có công thức nào</Text>
            </View>
          }
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default PersonalScreen;
