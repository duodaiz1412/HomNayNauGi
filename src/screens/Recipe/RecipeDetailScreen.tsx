import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import RecipeDetail from '../../components/RecipeDetail/RecipeDetail';
import { ActivityIndicator, View, Text, Alert } from 'react-native';
import api from 'src/api/api';
import { Recipe, RecipeDetailTypes } from 'src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

type RecipeDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'RecipeDetail'
>;

export default function RecipeDetailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RecipeDetailScreenRouteProp>();
  const { recipeId } = route.params;

  const [recipe, setRecipe] = useState<RecipeDetailTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/recipes/detail/${recipeId}`);

        console.log('Token status:', response.data.tokenStatus);

        // Kiểm tra tokenStatus nếu API trả về
        if (response.data.tokenStatus === 'expired') {
          console.log('Token expired, attempting refresh...');
          // Token hết hạn, tiến hành refresh token
          try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
              console.log(
                'Found refresh token, requesting new access token...'
              );
              const refreshResponse = await axios.post(
                `${api.defaults.baseURL}/auth/refresh`,
                { refreshToken }
              );

              if (refreshResponse.data.accessToken) {
                console.log('Got new access token, updating storage...');
                await AsyncStorage.setItem(
                  'accessToken',
                  refreshResponse.data.accessToken
                );
                globalThis.isLoggedIn = true;

                // Thử lại request với token mới
                console.log('Re-fetching recipe with new token...');
                const newResponse = await api.get(
                  `/recipes/detail/${recipeId}`
                );
                setRecipe(newResponse.data.data);
                return;
              }
            }

            // Nếu không refresh được, đánh dấu là đã đăng xuất
            console.log('Could not refresh token, logging out...');
            globalThis.isLoggedIn = false;
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');

            // Vẫn hiển thị recipe nhưng không có trạng thái like/favorite
            setRecipe({
              ...response.data.data,
              isLiked: false,
              isFavorite: false,
            });

            // Thông báo cho người dùng biết họ đã bị đăng xuất
            Alert.alert(
              'Phiên đăng nhập hết hạn',
              'Bạn cần đăng nhập lại để thích hoặc lưu công thức.',
              [{ text: 'Đã hiểu', style: 'default' }]
            );
          } catch (refreshError) {
            console.error('Refresh token error:', refreshError);
            globalThis.isLoggedIn = false;

            // Vẫn hiển thị recipe
            setRecipe({
              ...response.data.data,
              isLiked: false,
              isFavorite: false,
            });
          }
        } else {
          // Token vẫn hợp lệ hoặc không có token
          console.log('Token is valid or not present, setting recipe data...');
          setRecipe(response.data.data);
        }

        console.log(
          'DETAIL RECIPE SCREEN ',
          JSON.stringify(response.data.data, null, 2)
        );
      } catch (err) {
        console.error('Error fetching recipe details:', err);
        setError('Không thể tải thông tin công thức');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#941D23" />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-[#4B4B4B]">
          {error || 'Không tìm thấy công thức'}
        </Text>
      </View>
    );
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLike = async (id: string) => {
    if (!globalThis.isLoggedIn) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Bạn cần đăng nhập để thích công thức này. Chuyển đến trang đăng nhập?',
        [
          { text: 'Không', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }

    try {
      await api.post(`/recipes/${id}/like`);
      setRecipe((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              totalLikes: prev.totalLikes + (prev.isLiked ? -1 : 1),
            }
          : prev
      );
    } catch (err) {
      console.error('Error liking recipe:', err);
      alert('Có lỗi xảy ra khi thích công thức!');
    }
  };
  const handleFavorite = async (id: string) => {
    if (!globalThis.isLoggedIn) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Bạn cần đăng nhập để lưu công thức này. Chuyển đến trang đăng nhập?',
        [
          { text: 'Không', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }

    try {
      await api.post(`/recipes/${id}/favorite`);
      setRecipe((prev) =>
        prev
          ? {
              ...prev,
              isFavorite: !prev.isFavorite,
              totalFavorites: prev.totalFavorites + (prev.isFavorite ? -1 : 1),
            }
          : prev
      );
    } catch (err) {
      console.error('Error favoriting recipe:', err);
      alert('Có lỗi xảy ra khi lưu công thức!');
    }
  };

  const handleStartCooking = (id: string) => {
    navigation.navigate('CookingGuide', { recipeId: recipeId });
  };

  return (
    <RecipeDetail
      recipe={recipe}
      onBack={handleBack}
      onFavorite={handleFavorite}
      onLike={handleLike}
      onStartCooking={handleStartCooking}
    />
  );
}
