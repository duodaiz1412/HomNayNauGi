import React from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
const backgroundImage = require('@assets/background.png');

const AboutUsScreen = () => {
  const navigation = useNavigation();
  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          <View className="flex-row items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-2xl text-black">⬅️</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black ml-4">Về chúng tôi</Text>
          </View>
          <View className="items-center px-8 py-12">
            <Text className="text-6xl mb-6">👨‍🍳</Text>
            <Text className="text-lg text-black text-justify leading-8">
              "Hôm Nay Nấu Gì?" giúp bạn khám phá, lưu trữ và chia sẻ hàng ngàn công thức nấu ăn hấp dẫn mỗi ngày.
              {"\n\n"}Chúng tôi mong muốn mang lại trải nghiệm nấu ăn tiện lợi, sáng tạo và kết nối cộng đồng yêu bếp núc.
              {"\n\n"}Cảm ơn bạn đã đồng hành cùng chúng tôi!
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default AboutUsScreen; 