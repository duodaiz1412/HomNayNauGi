import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import api from 'src/api/api';

const backgroundImage = require('@assets/background.png');

const AchievementsScreen = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [totalRecipes, setTotalRecipes] = useState(0);

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
        const recipes = response.data.data.map((recipe) => ({
          ...recipe,
          viewCount: Number(recipe.viewCount || 0),
          likeCount: Number(recipe.likeCount || 0),
          favoriteCount: Number(recipe.favoriteCount || 0),
        }));

        setRecipes(recipes);
        setTotalRecipes(response.data.total || recipes.length);

        const totalLikes = recipes.reduce((sum, r) => sum + r.likeCount, 0);
        const totalFavorites = recipes.reduce(
          (sum, r) => sum + r.favoriteCount,
          0
        );

        setTotalLikes(totalLikes);
        setTotalFavorites(totalFavorites);
      }
    } catch (error) {
      console.error('Lỗi khi lấy công thức:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request:', error.request);
      } else {
        console.error('Message:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const userStats = {
    recipesCount: totalRecipes,
    maxLikes: Math.max(0, ...recipes.map((r) => r.likeCount)),
    totalLikes,
    totalFavorites,
  };

  const allAchievements = [
    {
      id: 1,
      icon: '🏅',
      title: 'Tân binh',
      description: 'Đăng hướng dẫn món ăn đầu tiên',
      condition: (data) => data.recipesCount >= 1,
    },
    {
      id: 2,
      icon: '🥈',
      title: 'Người chăm chỉ',
      description: 'Đăng 10 công thức nấu ăn',
      condition: (data) => data.recipesCount >= 10,
    },
    {
      id: 3,
      icon: '👨‍🍳',
      title: 'Chuyên gia ẩm thực',
      description: 'Công thức đạt 100 lượt thích',
      condition: (data) => data.maxLikes >= 100,
    },
    {
      id: 4,
      icon: '🏆',
      title: 'Siêu đầu bếp',
      description: 'Đăng 50 công thức nấu ăn',
      condition: (data) => data.recipesCount >= 50,
    },
    {
      id: 5,
      icon: '🌟',
      title: 'Người truyền cảm hứng',
      description: 'Tổng lượt thích đạt 500',
      condition: (data) => data.totalLikes >= 500,
    },
    {
      id: 6,
      icon: '❤️',
      title: 'Người được yêu thích',
      description: 'Tổng số lượt yêu thích đạt 100',
      condition: (data) => data.totalFavorites >= 100,
    },
  ];

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          <View className="flex-row items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-2xl text-black">⬅️</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black ml-4">
              Thành tựu
            </Text>
          </View>

          <View className="p-4">
            <Text className="text-xl font-bold text-black mb-4">
              Thành tựu nổi bật của bạn
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              allAchievements.map((item) => {
                const isAchieved = item.condition(userStats);
                return (
                  <View
                    key={item.id}
                    className={`flex-row items-center mb-4 bg-white rounded-lg shadow p-3 ${
                      !isAchieved ? 'opacity-40' : ''
                    }`}
                  >
                    <Text className="text-3xl mr-3">{item.icon}</Text>
                    <View className="flex-1">
                      <Text className="font-bold text-black">{item.title}</Text>
                      <Text className="text-black text-sm">
                        {item.description}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {isAchieved ? 'Đã đạt' : 'Chưa đạt'}
                      </Text>
                    </View>
                    <Text
                      className={`text-xs font-bold ${
                        isAchieved ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {isAchieved ? '✔️' : '✖️'}
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default AchievementsScreen;
