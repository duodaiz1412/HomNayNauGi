import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold mb-4">Hôm nay nấu gì?</Text>

          {/* Banner */}
          <View className="bg-red-700 rounded-lg p-4 mb-6">
            <View className="flex-row justify-between">
              <View className="flex-1 pr-2">
                <Text className="text-white text-base mb-1">
                  Phở bò là một phần của "Văn hóa Việt Nam"
                </Text>
                <TouchableOpacity>
                  <View className="flex-row items-center w-auto bg-white bg-opacity-20 self-start px-3 py-1 rounded-full">
                    <Text className="text-red-700 text-sm">Tìm hiểu ngay</Text>
                    <Text className="text-red-700 text-lg mb-1 ml-1">→</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  source={require('../../assets/images/pho.jpg')}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          {/* Món ăn đề xuất */}
          <Text className="text-lg font-bold mb-4">Món ăn phổ biến</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            {/* Món ăn item */}
            <TouchableOpacity className="mr-4">
              <View className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden mb-2">
                <Image
                  source={require('../../assets/images/pho.jpg')}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="font-medium">Phở</Text>
            </TouchableOpacity>

            <TouchableOpacity className="mr-4">
              <View className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden mb-2">
                <Image
                  source={require('../../assets/images/banh-mi.jpg')}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="font-medium">Bánh mì</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <View className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden mb-2">
                <Image
                  source={require('../../assets/images/com-rang.jpg')}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="font-medium">Cơm rang</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
