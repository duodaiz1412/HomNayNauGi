import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout, getUserProfile } from 'src/api/api';

const backgroundImage = require('@assets/background.png');

const SettingsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          setIsLoggedIn(true);
          await fetchUserProfile();
        } else {
          setIsLoggedIn(false);
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        Alert.alert('Lỗi', 'Không thể kiểm tra trạng thái đăng nhập');
      }
    };

    checkLoginStatus();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      console.log('Raw profile response:', response);

      if (!response || !response.data) {
        console.error('Invalid response format');
        throw new Error('Invalid response format');
      }

      const userData = response.data;
      console.log('Processed user data:', userData);

      setUserData({
        name: userData.fullName || 'Chưa cập nhật tên',
        email: userData.email || 'Chưa cập nhật email',
        phone: userData.phoneNumber || '',
        avatar: userData.avatarUrl || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        await logout();
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('refresh_token');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#88131B" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-black">⬅️</Text>
            </TouchableOpacity>
            <Text className="font-bold text-black ml-4">Cài đặt</Text>
          </View>

          {/* Thông tin tài khoản */}
          <View className="flex-row items-center bg-white rounded-lg mx-4 mb-4 p-4 shadow">
            <View className="w-12 h-12 rounded-full mr-3 overflow-hidden bg-gray-200">
              <Image
                source={
                  userData?.avatar
                    ? { uri: userData.avatar }
                    : require('../../assets/images/avatar-placeholder.jpg')
                }
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-black">{userData?.name}</Text>
              <Text className="text-black">{userData?.email}</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfileScreen')}
            >
              <Text className="text-black">✏️</Text>
            </TouchableOpacity>
          </View>

          {/* Nhóm: Cài đặt ứng dụng */}
          <View className="bg-white rounded-lg mx-4 mb-4 p-4 shadow">
            <Text className="font-bold text-black mb-2">Cài đặt ứng dụng</Text>

            {/* Ngôn ngữ */}
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-black">Ngôn ngữ</Text>
              <Text className="text-black font-semibold">Tiếng Việt</Text>
            </View>

            {/* Chế độ tối */}
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-black">Chế độ tối</Text>
              <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>
          </View>

          {/* Nhóm: Bảo mật & quyền riêng tư */}
          <View className="bg-white rounded-lg mx-4 mb-4 p-4 shadow">
            <Text className="font-bold text-black mb-2">
              Bảo mật & quyền riêng tư
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfileScreen')}
            >
              <Text className="text-black mb-2">
                Chỉnh sửa thông tin cá nhân
              </Text>
            </TouchableOpacity>
          </View>

          {/* Hỗ trợ & thông tin */}
          <TouchableOpacity
            className="bg-white rounded-lg mx-4 mb-4 p-4 shadow"
            onPress={() => navigation.navigate('SupportScreen')}
          >
            <Text className="font-bold text-black">Hỗ trợ & thông tin</Text>
          </TouchableOpacity>

          {/* Đăng xuất */}
          <TouchableOpacity
            onPress={handleLogout}
            className="mx-4 mt-6 mb-4 bg-white rounded-full py-3 border border-[#88131B]"
          >
            <Text className="text-[#88131B] text-center font-bold">
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SettingsScreen;
