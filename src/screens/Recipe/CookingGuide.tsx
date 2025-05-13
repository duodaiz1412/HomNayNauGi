import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import api from 'src/api/api';
import { RecipeDetailTypes } from 'src/types';
import LikeSolid from 'src/components/icons/LikeSolid';
import LikeOutLine from 'src/components/icons/LikeOutLine';
import HeartSolid from 'src/components/icons/HeartSolid';
import HeartOutLine from 'src/components/icons/HeartOutLine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const backgroundImage = require('@assets/background.png');

type CookingGuideRouteProp = RouteProp<RootStackParamList, 'CookingGuide'>;

export const CookingGuide = () => {
  const route = useRoute<CookingGuideRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<RecipeDetailTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [showSteps, setShowSteps] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        console.log('Fetching recipe details...');
        const response = await api.get(
          `/recipes/detail/${recipeId}?increaseView=false`
        );
        
        console.log('Token status:', response.data.tokenStatus);
        
        // Kiểm tra tokenStatus nếu API trả về
        if (response.data.tokenStatus === 'expired') {
          console.log('Token expired, attempting refresh...');
          // Token hết hạn, tiến hành refresh token
          try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            if (refreshToken) {
              console.log('Found refresh token, requesting new access token...');
              const refreshResponse = await axios.post(
                `${api.defaults.baseURL}/auth/refresh`,
                { refreshToken }
              );
              
              if (refreshResponse.data.accessToken) {
                console.log('Got new access token, updating storage...');
                await AsyncStorage.setItem('accessToken', refreshResponse.data.accessToken);
                globalThis.isLoggedIn = true;
                
                // Thử lại request với token mới
                console.log('Re-fetching recipe with new token...');
                const newResponse = await api.get(`/recipes/detail/${recipeId}?increaseView=false`);
                setRecipe(newResponse.data.data);
                setIsFavorite(newResponse.data.data.isFavorite);
                setIsLiked(newResponse.data.data.isLiked);
                return;
              }
            }
            
            // Nếu không refresh được, đánh dấu là đã đăng xuất
            console.log('Could not refresh token, logging out...');
            globalThis.isLoggedIn = false;
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            
            // Vẫn hiển thị recipe nhưng không có trạng thái like/favorite
            setRecipe(response.data.data);
            setIsFavorite(false);
            setIsLiked(false);
            
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
            setRecipe(response.data.data);
            setIsFavorite(false);
            setIsLiked(false);
          }
        } else {
          // Token vẫn hợp lệ hoặc không có token
          console.log('Token is valid or not present, setting recipe data...');
          setRecipe(response.data.data);
          setIsFavorite(response.data.data.isFavorite);
          setIsLiked(response.data.data.isLiked);
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Không thể tải thông tin công thức');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [recipeId]);

  const handleLike = async () => {
    if (!globalThis.isLoggedIn) {
    Alert.alert(
      'Yêu cầu đăng nhập',
      'Bạn cần đăng nhập để thích công thức này. Chuyển đến trang đăng nhập?',
      [
        { text: 'Không', style: 'cancel' },
        { text: 'Đăng nhập', onPress: () => navigation.navigate('Login') }
      ]
    );
      return;
    }
    try {
      // Lưu giá trị hiện tại để hoàn tác nếu có lỗi
      const currentIsLiked = isLiked;
      const currentTotalLikes = recipe.totalLikes;
      
      // Cập nhật UI ngay lập tức (optimistic update)
      const newIsLiked = !currentIsLiked;
      setIsLiked(newIsLiked);
      
      // Cập nhật số lượng likes mà không thay đổi toàn bộ recipe object
      const newTotalLikes = newIsLiked 
        ? currentTotalLikes + 1 
        : Math.max(0, currentTotalLikes - 1);
      
      // Chỉ cập nhật thuộc tính totalLikes của recipe
      setRecipe(prevRecipe => ({
        ...prevRecipe,
        totalLikes: newTotalLikes
      }));
      
      // Gọi API
      const response = await api.post(`/recipes/${recipe.id}/like`);
      
      // Xử lý trường hợp response không khớp với dự đoán
      if (response.data.isLiked !== newIsLiked) {
        console.log('Server response differs from client prediction, syncing state');
        setIsLiked(response.data.isLiked);
        // Cập nhật lại totalLikes nếu cần
        setRecipe(prevRecipe => ({
          ...prevRecipe,
          totalLikes: response.data.isLiked 
            ? currentTotalLikes + 1 
            : Math.max(0, currentTotalLikes - 1)
        }));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('Có lỗi khi thích công thức!');
    }
  };

  const handleFavorite = async () => {
    if (!globalThis.isLoggedIn) {
    Alert.alert(
      'Yêu cầu đăng nhập',
      'Bạn cần đăng nhập để lưu công thức này. Chuyển đến trang đăng nhập?',
      [
        { text: 'Không', style: 'cancel' },
        { text: 'Đăng nhập', onPress: () => navigation.navigate('Login') }
      ]
    );
      return;
    }
    try {
      // Lưu giá trị hiện tại để hoàn tác nếu có lỗi
      const currentIsFavorite = isFavorite;
      const currentTotalFavorites = recipe.totalFavorites;
      
      // Cập nhật UI ngay lập tức
      const newIsFavorite = !currentIsFavorite;
      setIsFavorite(newIsFavorite);
      
      // Cập nhật số lượng favorites
      const newTotalFavorites = newIsFavorite 
        ? currentTotalFavorites + 1 
        : Math.max(0, currentTotalFavorites - 1);
      
      // Chỉ cập nhật thuộc tính totalFavorites
      setRecipe(prevRecipe => ({
        ...prevRecipe,
        totalFavorites: newTotalFavorites
      }));
      
      // Gọi API
      const response = await api.post(`/recipes/${recipe.id}/favorite`);
      
      // Xử lý trường hợp response không khớp với dự đoán
      if (response.data.isFavorite !== newIsFavorite) {
        console.log('Server response differs from client prediction, syncing state');
        setIsFavorite(response.data.isFavorite);
        // Cập nhật lại totalFavorites nếu cần
        setRecipe(prevRecipe => ({
          ...prevRecipe,
          totalFavorites: response.data.isFavorite 
            ? currentTotalFavorites + 1 
            : Math.max(0, currentTotalFavorites - 1)
        }));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Có lỗi khi lưu yêu thích!');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#941D23" />
      </SafeAreaView>
    );
  }

  if (error || !recipe) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <Text className="text-center mt-10">
          {error || 'Không tìm thấy món ăn'}
        </Text>
      </SafeAreaView>
    );
  }

  // Lấy videoId từ recipe.videoUrl
  let videoId = '';
  if (recipe.videoUrl) {
    if (recipe.videoUrl.includes('watch?v=')) {
      videoId = recipe.videoUrl.split('watch?v=')[1].split('&')[0];
    } else {
      const parts = recipe.videoUrl.split('/');
      videoId = parts[parts.length - 1];
    }
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
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Video Youtube */}
          {videoId ? (
            <View className="mt-5">
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
          ) : null}

          {/* Tên món ăn */}
          <Text className="text-4xl font-bold text-red-800  mt-6 mb-4 mx-4">
            {recipe.name}
          </Text>

          {/* Avatar + tên người tạo */}
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

          {/* Like + Favorite + View */}
          <View className="flex-row items-center justify-center">
            <Ionicons name="eye" size={20} color="#4B4B4B" />
            <Text className="text-[#4B4B4B] font-medium mx-2">
              {recipe.totalViews} lượt xem
            </Text>

            <TouchableOpacity
              className="rounded-full p-2 mr-2 "
              onPress={handleLike}
              // style={{ backgroundColor: isLiked ? '#FDECEA' : 'transparent' }}
              activeOpacity={0.7}
            >
              {isLiked ? (
                <LikeSolid size={22} color="#007AFF" />
              ) : (
                <LikeOutLine size={22} color="#4B4B4B" />
              )}
            </TouchableOpacity>
            <Text className="text-[#4B4B4B] font-medium mr-4">
              {recipe.totalLikes} Thích
            </Text>

            <TouchableOpacity
              className="rounded-full p-2 mr-2"
              onPress={handleFavorite}
              style={{
                backgroundColor: isFavorite ? '#FDECEA' : 'transparent',
              }}
              activeOpacity={0.7}
            >
              {isFavorite ? (
                <HeartSolid size={22} color="#FF3B30" />
              ) : (
                <HeartOutLine size={22} color="#4B4B4B" />
              )}
            </TouchableOpacity>
            <Text className="text-[#4B4B4B] font-medium mr-4">
              {recipe.totalFavorites} Lưu
            </Text>
          </View>

          {/* Các bước thực hiện */}
          <View className="mt-5 mx-4">
            <View className="flex-row items-center mb-2">
              <Text className="text-lg font-bold text-[#4B4B4B] flex-1">
                Các bước thực hiện
              </Text>
              <TouchableOpacity onPress={() => setShowSteps((prev) => !prev)}>
                <Ionicons
                  name={showSteps ? 'chevron-up' : 'chevron-down'}
                  size={22}
                  color="#941D23"
                />
              </TouchableOpacity>
            </View>
            {showSteps && (
              <>
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
                      // <View className="w-24 h-24 rounded-xl mr-4 bg-gray-200 items-center justify-center">
                      //   <Ionicons name="image-outline" size={32} color="#ccc" />
                      // </View>
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
              </>
            )}
          </View>
        </ScrollView>

        {/* Nút Hoàn thành món ăn */}
        <View className="absolute bottom-10 left-0 right-0 z-10 flex-row justify-center items-center px-8">
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs')}
            className="bg-red-800 rounded-full py-3 px-6 flex-row items-center shadow-lg w-2/3"
          >
            <Text className="text-white text-lg font-bold mx-auto">
              Hoàn thành
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};
