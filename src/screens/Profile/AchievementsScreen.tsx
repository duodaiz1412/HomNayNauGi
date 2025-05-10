import React from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
const backgroundImage = require('@assets/background.png');

const AchievementsScreen = () => {
  const navigation = useNavigation();
  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          <View className="flex-row items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-2xl text-black">⬅️</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black ml-4">Thành tựu</Text>
          </View>
          <View className="p-4">
            <Text className="text-xl font-bold text-black mb-4">Thành tựu nổi bật của bạn</Text>
            {/* Thành tựu đã đạt */}
            <View className="flex-row items-center mb-4 bg-white rounded-lg shadow p-3">
              <Text className="text-3xl mr-3">🏅</Text>
              <View className="flex-1">
                <Text className="font-bold text-black">Tân binh</Text>
                <Text className="text-black text-sm">Đăng hướng dẫn món ăn đầu tiên</Text>
                <Text className="text-xs text-gray-500">Đạt ngày: 01/06/2024</Text>
              </View>
              <Text className="text-xs text-green-600 font-bold">Đã đạt</Text>
            </View>
            <View className="flex-row items-center mb-4 bg-white rounded-lg shadow p-3">
              <Text className="text-3xl mr-3">🥈</Text>
              <View className="flex-1">
                <Text className="font-bold text-black">Người chăm chỉ</Text>
                <Text className="text-black text-sm">Đăng 10 công thức nấu ăn</Text>
                <Text className="text-xs text-gray-500">Đạt ngày: 10/06/2024</Text>
              </View>
              <Text className="text-xs text-green-600 font-bold">Đã đạt</Text>
            </View>
            <View className="flex-row items-center mb-4 bg-white rounded-lg shadow p-3">
              <Text className="text-3xl mr-3">👨‍🍳</Text>
              <View className="flex-1">
                <Text className="font-bold text-black">Chuyên gia ẩm thực</Text>
                <Text className="text-black text-sm">Công thức đạt 100 lượt thích</Text>
                <Text className="text-xs text-gray-500">Đạt ngày: 15/06/2024</Text>
              </View>
              <Text className="text-xs text-green-600 font-bold">Đã đạt</Text>
            </View>
            {/* Thành tựu bị khóa */}
            <View className="flex-row items-center mb-4 bg-white rounded-lg shadow p-3 opacity-40">
              <Text className="text-3xl mr-3">🏆</Text>
              <View className="flex-1">
                <Text className="font-bold text-black">Siêu đầu bếp</Text>
                <Text className="text-black text-sm">Đăng 50 công thức nấu ăn</Text>
                <Text className="text-xs text-gray-500">Chưa đạt</Text>
              </View>
              <Text className="text-xs text-gray-400 font-bold">Chưa đạt</Text>
            </View>
            <View className="flex-row items-center mb-4 bg-white rounded-lg shadow p-3 opacity-40">
              <Text className="text-3xl mr-3">🌟</Text>
              <View className="flex-1">
                <Text className="font-bold text-black">Người truyền cảm hứng</Text>
                <Text className="text-black text-sm">Công thức đạt 500 lượt thích</Text>
                <Text className="text-xs text-gray-500">Chưa đạt</Text>
              </View>
              <Text className="text-xs text-gray-400 font-bold">Chưa đạt</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default AchievementsScreen; 