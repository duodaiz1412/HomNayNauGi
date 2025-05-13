import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminFoodStackParamList } from '@navigation/AdminFoodStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import api from 'src/api/api';
import { Recipe, RecipeStatus } from 'src/types';
import LikeSolid from '@components/icons/LikeSolid';
import { formatNumber } from 'src/ultils/formatNumber';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';

export const FoodDetailScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminFoodStackParamList>>();
  const route = useRoute();
  const { foodId } = route.params as { foodId: string };

  const [isFetching, setIsFetching] = useState(true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showIngredients, setShowIngredients] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YoutubeIframeRef>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsFetching(true);
        const response = await api.get(`/admin/recipes/detail/${foodId}`);
        const recipeData = response.data.data;
        if (!recipeData) {
          throw new Error('Không tìm thấy công thức');
        }

        console.log('\nRecipe data:', JSON.stringify(recipeData, null, 2));
        setRecipe(recipeData);
      } catch (e) {
        console.error('Error fetching recipe:', e);
        Alert.alert('Lỗi', 'Không thể tải thông tin công thức');
      } finally {
        setIsFetching(false);
      }
    };
    fetchRecipe();
  }, [foodId]);
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/recipes/delete/${id}`);
      Alert.alert('Thành công', 'Đã xóa món ăn.');
      navigation.navigate("AdminFoodManagementScreen")

    } catch (error) {
      console.error('Error deleting recipe:', error);
      Alert.alert('Lỗi', 'Không thể xóa món ăn.');
    }
  };
  // Lấy videoId từ recipe.videoUrl (nếu có)
  const getVideoId = (url?: string): string => {
    if (!url) return '';

    try {
      if (url.includes('watch?v=')) {
        return url.split('watch?v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0];
      } else {
        const parts = url.split('/');
        return parts[parts.length - 1];
      }
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return '';
    }
  };

  if (isFetching) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#941D23" />
          <Text className="mt-4 text-gray-600">
            Đang tải thông tin công thức...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Không tìm thấy công thức</Text>
        </View>
      </SafeAreaView>
    );
  }

  const videoId = getVideoId(recipe.videoUrl);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminHeader title="Chi tiết món ăn" />
      <ScrollView className="flex-1 bg-gray-50">
        {/* Hero Image */}
        <View className="relative">
          <Image
            source={{ uri: recipe.imageUrl }}
            className="w-full h-64"
            resizeMode="cover"
          />
        </View>

        {/* Recipe Title and Status - đã di chuyển từ overlay */}
        <View className="bg-white px-4 py-3">
          <Text className="text-3xl font-bold text-red-800">{recipe.name}</Text>
          <View className="flex-row items-center mt-2">
            <View
              className={`px-2 py-1 rounded-full ${
                recipe.status === RecipeStatus.PUBLIC
                  ? 'bg-green-500'
                  : recipe.status === RecipeStatus.PENDING_APPROVAL
                  ? 'bg-yellow-500'
                  : recipe.status === RecipeStatus.DRAFT
                  ? 'bg-gray-500'
                  : 'bg-blue-500'
              }`}
            >
              <Text className="text-white text-xs">
                {recipe.status === RecipeStatus.PUBLIC
                  ? 'Đang hiển thị'
                  : recipe.status === RecipeStatus.PENDING_APPROVAL
                  ? 'Chờ duyệt'
                  : recipe.status === RecipeStatus.DRAFT
                  ? 'Nháp'
                  : 'Riêng tư'}
              </Text>
            </View>
          </View>
        </View>

        {videoId ? (
          <View className="mt-2 bg-white p-4">
            <Text className="text-lg font-bold mb-2">Video hướng dẫn</Text>
            <View className="overflow-hidden rounded-lg">
              <YoutubePlayer
                ref={playerRef}
                height={220}
                play={isPlaying}
                videoId={videoId}
                onChangeState={(state) => {
                  if (state === 'playing') setIsPlaying(true);
                  else if (state === 'paused' || state === 'ended')
                    setIsPlaying(false);
                }}
                initialPlayerParams={{
                  controls: true,
                  fs: 1,
                  playsInline: true,
                  modestbranding: true,
                }}
              />
            </View>
          </View>
        ) : null}
        {/* Stats */}
        <View className="flex-row justify-around bg-white py-4 shadow-sm">
          <View className="items-center">
            <View className="flex-row items-center">
              <LikeSolid size={18} color="#FFA500" />
              <Text className="text-gray-700 font-bold ml-1">
                {recipe.totalLikes || 0}
              </Text>
            </View>
            <Text className="text-gray-500 text-xs mt-1">Lượt thích</Text>
          </View>
          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="eye" size={18} color="#007AFF" />
              <Text className="text-gray-700 font-bold ml-1">
                {recipe.totalViews || 0}
              </Text>
            </View>
            <Text className="text-gray-500 text-xs mt-1">Lượt xem</Text>
          </View>
          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="heart" size={18} color="#FF3B30" />
              <Text className="text-gray-700 font-bold ml-1">
                {recipe.totalFavorites || 0}
              </Text>
            </View>
            <Text className="text-gray-500 text-xs mt-1">Lưu</Text>
          </View>
        </View>
        <View className="flex-row items-center mb-2 mx-4">
          <Image
            source={{
              uri:
                recipe.account?.userProfile?.avatarUrl ||
                'https://ui-avatars.com/api/?name=' +
                  encodeURIComponent(
                    recipe.account?.userProfile?.displayName ||
                      recipe.account?.name ||
                      'User'
                  ),
            }}
            className="w-10 h-10 rounded-full"
          />
          <Text className="ml-3 text-base font-bold text-[#4B4B4B]">
            {recipe.account?.userProfile?.fullName ||
              recipe.account?.name ||
              'Ẩn danh'}
          </Text>
        </View>

        {/* Description */}
        <View className="bg-white p-4 mt-2">
          <Text className="text-lg font-bold mb-2">Mô tả</Text>
          <Text className="text-gray-700">{recipe.description}</Text>
        </View>

        {/* Categories */}
        <View className="bg-white p-4 mt-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold">Danh mục</Text>
            <TouchableOpacity
              onPress={() => setShowCategories((prev) => !prev)}
            >
              <Ionicons
                name={showCategories ? 'chevron-up' : 'chevron-down'}
                size={22}
                color="#941D23"
              />
            </TouchableOpacity>
          </View>

          {showCategories && (
            <View className="mt-3">
              {recipe.categoryMappings && recipe.categoryMappings.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="py-2"
                >
                  {recipe.categoryMappings.map((category, index) => (
                    <View key={index} className="mr-4 items-center">
                      <View className="bg-gray-100 w-20 h-20 rounded-full overflow-hidden">
                        <Image
                          source={{
                            uri:
                              category.recipeCategory.imageUrl ||
                              'https://via.placeholder.com/150',
                          }}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                      <Text className="text-center mt-2 text-gray-700 font-medium">
                        {category.recipeCategory.name}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text className="text-gray-500 italic mt-2">
                  Không có danh mục
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Nutrition */}
        <View className="bg-white p-4 mt-2">
          <Text className="text-lg font-bold mb-2">Thông tin dinh dưỡng</Text>
          <View className="flex-row justify-between bg-gray-50 p-3 rounded-lg">
            <View className="items-center">
              <Text className="text-gray-500 text-xs">Đạm</Text>
              <Text className="text-gray-700 font-bold">
                {formatNumber(recipe.protein, ' g')}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-xs">Béo</Text>
              <Text className="text-gray-700 font-bold">
                {formatNumber(recipe.fat, ' g')}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-xs">Tinh bột</Text>
              <Text className="text-gray-700 font-bold">
                {formatNumber(recipe.carbohydrates, ' g')}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-xs">Calo</Text>
              <Text className="text-gray-700 font-bold">
                {formatNumber(recipe.calories, ' Calo')}
              </Text>
            </View>
          </View>
        </View>

        {/* Ingredients */}
        <View className="bg-white p-4 mt-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold">
              Nguyên liệu ({recipe.recipeIngredients?.length || 0})
            </Text>
            <TouchableOpacity
              onPress={() => setShowIngredients((prev) => !prev)}
            >
              <Ionicons
                name={showIngredients ? 'chevron-up' : 'chevron-down'}
                size={22}
                color="#941D23"
              />
            </TouchableOpacity>
          </View>

          {showIngredients && (
            <View className="mt-3">
              {recipe.recipeIngredients?.map((ingredient, index) => (
                <View
                  key={index}
                  className="flex-row items-center bg-gray-50 rounded-xl px-3 py-3 mb-3"
                >
                  {/* Ảnh nguyên liệu */}
                  <View className="w-14 h-14 bg-white rounded-xl items-center justify-center mr-3 overflow-hidden">
                    <Image
                      source={{ uri: ingredient.ingredient.imageUrl }}
                      className="w-12 h-12"
                      resizeMode="cover"
                    />
                  </View>
                  {/* Tên nguyên liệu */}
                  <Text className="flex-1 text-gray-700 font-medium">
                    {ingredient.ingredient.name}
                  </Text>
                  {/* Số lượng + đơn vị */}
                  <Text className="text-gray-700 font-bold">
                    {`${formatNumber(ingredient.quantity)} ${ingredient.unit?.unitName || ''}`}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Steps */}
        <View className="bg-white p-4 mt-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold">Các bước thực hiện</Text>
            <TouchableOpacity onPress={() => setShowSteps((prev) => !prev)}>
              <Ionicons
                name={showSteps ? 'chevron-up' : 'chevron-down'}
                size={22}
                color="#941D23"
              />
            </TouchableOpacity>
          </View>

          {showSteps && (
            <View className="mt-3">
              {recipe.cookingSteps?.map((step, index) => (
                <View
                  key={index}
                  className="mt-4 bg-white rounded-2xl flex-row items-center shadow-md px-4 py-4"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  {/* Ảnh minh họa bên trái */}
                  {step.imageUrl ? (
                    <Image
                      source={{ uri: step.imageUrl }}
                      className="w-24 h-24 rounded-xl mr-4"
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={{
                        uri: 'https://res.cloudinary.com/dq3fcbnk6/image/upload/v1747151197/enzngyecuwmvfoppe0pa.jpg',
                      }}
                      className="w-24 h-24 rounded-xl mr-4"
                      resizeMode="cover"
                    />
                  )}

                  {/* Nội dung bên phải */}
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-[#4B4B4B] mb-1">
                      Bước {step.stepOrder}:
                    </Text>
                    <Text className="text-base text-[#4B4B4B]">
                      {step.instruction}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Metadata */}
        <View className="bg-white p-4 mt-2">
          <Text className="text-lg font-bold mb-2">Thông tin khác</Text>
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-500">Trạng thái</Text>
            <Text
              className={`font-medium ${
                recipe.status === RecipeStatus.PUBLIC
                  ? 'text-green-600'
                  : recipe.status === RecipeStatus.PENDING_APPROVAL
                  ? 'text-yellow-600'
                  : recipe.status === RecipeStatus.DRAFT
                  ? 'text-gray-600'
                  : 'text-blue-600'
              }`}
            >
              {recipe.status === RecipeStatus.PUBLIC
                ? 'Đang hiển thị'
                : recipe.status === RecipeStatus.PENDING_APPROVAL
                ? 'Chờ duyệt'
                : recipe.status === RecipeStatus.DRAFT
                ? 'Nháp'
                : 'Riêng tư'}
            </Text>
          </View>
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-500">Người tạo</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-700">
                {recipe.account?.userProfile?.fullName || 'Chưa có thông tin'}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-500">Ngày tạo</Text>
            <Text className="text-gray-700">
              {new Date(recipe.createdAt).toLocaleDateString('vi-VN')}
            </Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-gray-500">Cập nhật lần cuối</Text>
            <Text className="text-gray-700">
              {new Date(recipe.updatedAt).toLocaleDateString('vi-VN')}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-center p-4 bg-white mt-2 shadow-lg mb-6">
          <TouchableOpacity
            className="bg-blue-500 px-5 py-3 rounded-lg flex-row items-center mr-4"
            onPress={() =>
              navigation.navigate('EditFoodScreen', { foodId: recipe.id })
            }
          >
            <Ionicons name="create-outline" size={20} color="white" />
            <Text className="text-white font-bold ml-2">Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 px-5 py-3 rounded-lg flex-row items-center"
            onPress={() => {
              Alert.alert(
                'Xác nhận xóa',
                'Bạn có chắc chắn muốn xóa công thức này không?',
                [
                  { text: 'Hủy', style: 'cancel' },
                  {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => {
                      handleDelete(recipe.id)
                    },
                  },
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text className="text-white font-bold ml-2">Xóa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
