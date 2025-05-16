import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
const backgroundImage = require('@assets/background.png');

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();
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
              Chính sách bảo mật
            </Text>
          </View>
          <View className="items-center px-8 py-12">
            <Text className="text-6xl mb-6">🔒</Text>
            <Text className="text-lg text-black text-justify leading-8">
              Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi chỉ
              thu thập và sử dụng thông tin cần thiết để cung cấp dịch vụ tốt
              nhất cho bạn.
              {'\n\n'}Thông tin của bạn sẽ được bảo mật và không được chia sẻ
              với bên thứ ba mà không có sự đồng ý của bạn.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default PrivacyPolicyScreen;
