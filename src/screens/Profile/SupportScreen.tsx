import React from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
const backgroundImage = require('@assets/background.png');

const SupportScreen = () => {
  const navigation = useNavigation();
  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          <View className="flex-row items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-2xl text-black">⬅️</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black ml-4">Hỗ trợ</Text>
          </View>
          <View className="items-center px-8 py-12">
            <Text className="text-6xl mb-6">🛟</Text>
            <Text className="text-lg text-black text-justify leading-8">
              Nếu bạn gặp khó khăn khi sử dụng ứng dụng hoặc có câu hỏi cần giải đáp, hãy liên hệ với chúng tôi qua:
              {"\n"}📧 Email: support@homnaynaugi.vn
              {"\n"}☎️ Hotline: 1900 1234 (8:00 - 22:00)
              {"\n\n"}Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất!
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SupportScreen; 