import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import 'nativewind';
import { mockData } from '../../MockData/Data';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type CookingGuideRouteProp = RouteProp<RootStackParamList, 'CookingGuide'>;
const backgroundImage = require('@assets/background.png');

const CookingGuide = () => {
  const route = useRoute<CookingGuideRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { recipeId } = route.params;
  const recipe = mockData.recipes.find((r) => Number(r.id) === recipeId);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Giữ state để theo dõi trạng thái
  const playerRef = useRef<YoutubeIframeRef>(null);

  if (!recipe) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <Text className="text-center mt-10">Không tìm thấy món ăn</Text>
      </SafeAreaView>
    );
  }

  // Lấy videoId từ URL YouTube
  const videoUrl = 'https://www.youtube.com/watch?v=9kTyUFi3G1A'; // Video mẫu
  const videoId = videoUrl.includes('watch?v=')
    ? videoUrl.split('watch?v=')[1].split('&')[0]
    : videoUrl.split('/').pop();

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }} // Tăng paddingBottom để chứa 2 nút absolute
        >
          {/* <TouchableOpacity
            className="bg-white rounded-full p-2 z-10 absolute top-2 left-4"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="return-up-back-outline" size={20} color="black" />
          </TouchableOpacity> */}

          {/* Video nhúng với YoutubePlayer */}
          <View className="mt-5">
            <YoutubePlayer
              ref={playerRef}
              height={250}
              play={isPlaying}
              videoId={videoId}
              onChangeState={(state) => {
                if (state === 'playing') setIsPlaying(true);
                else if (state === 'paused' || state === 'ended')
                  setIsPlaying(false);
              }}
              initialPlayerParams={{
                controls: true, // Hiển thị thanh điều khiển YouTube
                fs: 1, // Cho phép chế độ toàn màn hình
                playsInline: true, // Phát video trong ứng dụng
                modestbranding: true, // Ẩn logo YouTube nếu có thể
              }}
            />
          </View>

          <View className="flex-row justify-between items-center px-4 py-2 my-3">
            <Text className="text-2xl font-bold mx-4 text-red-800 ">
              {recipe.name}
            </Text>
            <TouchableOpacity
              className="bg-white/80 rounded-full p-2 z-10"
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#FF3B30' : '#000'}
              />
            </TouchableOpacity>
          </View>

          {/* Các bước thực hiện */}
          <View className="mt-3 mx-4">
            <Text className="text-lg font-bold">Các bước thực hiện</Text>
            {recipe.steps.map((step, index) => (
              <View
                key={index}
                className="mt-2 bg-gray-100 p-3 rounded-lg flex-row"
              >
                <View className="bg-red-900 w-8 h-8 rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold">{step.step}</Text>
                </View>
                <View className="flex-1">
                  <Text>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Nút Hoàn thành món ăn và Share (absolute ở dưới) */}
        <View className="absolute bottom-10 left-0 right-0 z-10 flex-row justify-center items-center px-8">
          <TouchableOpacity className="bg-red-800 rounded-full py-3 px-6 flex-row items-center shadow-lg w-2/3">
            <Text className="text-white text-lg font-bold mx-auto">
              Hoàn thành
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default CookingGuide;
