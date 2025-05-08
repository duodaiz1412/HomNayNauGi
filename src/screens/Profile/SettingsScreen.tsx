import React, { useState } from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, Alert, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { mockData } from '../../MockData/Data';
const backgroundImage = require('@assets/background.png');

const SettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fontSize, setFontSize] = useState('medium');
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] }),
        style: 'destructive',
      },
    ]);
  };

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-2xl text-black">⬅️</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black ml-4">Cài đặt</Text>
          </View>

          {/* Thông tin tài khoản */}
          <View className="flex-row items-center bg-white rounded-lg mx-4 mb-4 p-4 shadow">
            <Image source={{ uri: mockData.user.avatar }} className="w-12 h-12 rounded-full mr-3" />
            <View className="flex-1">
              <Text className="text-lg font-bold text-black">{mockData.user.name}</Text>
              <Text className="text-black">{mockData.user.email}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')}>
              <Text className="text-xl text-black">✏️</Text>
            </TouchableOpacity>
          </View>

          {/* Nhóm: Cài đặt ứng dụng */}
          <View className="bg-white rounded-lg mx-4 mb-4 p-4 shadow">
            <Text className="text-base font-bold text-black mb-2">Cài đặt ứng dụng</Text>
            {/* Ngôn ngữ */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-black">Ngôn ngữ</Text>
              <Text className="text-black font-semibold">Tiếng Việt</Text>
            </View>
            {/* Cỡ chữ */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-black">Cỡ chữ</Text>
              <View className="flex-row">
                {['small', 'medium', 'large'].map(size => (
                  <TouchableOpacity
                    key={size}
                    className={`mx-1 px-3 py-1 rounded-full ${fontSize === size ? 'bg-red-600' : 'bg-gray-200'}`}
                    onPress={() => setFontSize(size)}
                  >
                    <Text className={fontSize === size ? 'text-white' : 'text-black'}>
                      {size === 'small' ? 'Nhỏ' : size === 'medium' ? 'TB' : 'Lớn'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* Chế độ tối (placeholder) */}
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-black">Chế độ tối</Text>
              <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
          </View>

          {/* Nhóm: Bảo mật & quyền riêng tư */}
          <View className="bg-white rounded-lg mx-4 mb-4 p-4 shadow">
            <Text className="text-base font-bold text-black mb-2">Bảo mật & quyền riêng tư</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')}>
              <Text className="text-black mb-2">Chỉnh sửa thông tin cá nhân</Text>
            </TouchableOpacity>
          </View>

          {/* Nhóm: Hỗ trợ & thông tin */}
          <TouchableOpacity
            className="bg-white rounded-lg mx-4 mb-4 p-4 shadow"
            onPress={() => navigation.navigate('SupportScreen')}
          >
            <Text className="text-base font-bold text-black">Hỗ trợ & thông tin</Text>
          </TouchableOpacity>

          {/* Đăng xuất */}
          <TouchableOpacity className="mx-4 mt-6 mb-4 bg-red-600 rounded-full py-3" onPress={handleLogout}>
            <Text className="text-white text-center text-lg font-bold">Đăng xuất</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SettingsScreen; 