import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FavoriteScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4">Món ăn yêu thích</Text>
        <View className="bg-gray-100 rounded-lg p-4 mb-4">
          <Text className="text-lg font-medium mb-2">
            Chưa có món ăn yêu thích
          </Text>
          <Text className="text-gray-600">
            Các món ăn bạn đánh dấu yêu thích sẽ xuất hiện tại đây.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FavoriteScreen;
