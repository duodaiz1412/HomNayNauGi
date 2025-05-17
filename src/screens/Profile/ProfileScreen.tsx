import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout, getUserProfile } from 'src/api/api';

const backgroundImage = require('@assets/background.png');
const defaultAvatar = require('@assets/images/avatar-placeholder.jpg');

const ProfileScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      //console.log('Raw profile response:', response);

      if (!response || !response.data) {
        console.error('Invalid response format');
        throw new Error('Invalid response format');
      }

      const userData = response.data;
      //console.log('Processed user data:', userData);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  };

  const profileOptions = [
    {
      icon: '❤️',
      title: 'Yêu thích',
      onPress: () => navigation.navigate('FavoritesScreen'),
    },
    {
      icon: '🎯',
      title: 'Lịch sử',
      onPress: () => navigation.navigate('HistoryScreen'),
    },
    {
      icon: '💡',
      title: 'Thành tựu',
      onPress: () => navigation.navigate('AchievementsScreen'),
    },
  ];

  const settingsOptions = [
    {
      icon: '⚙️',
      title: 'Cài đặt',
      onPress: () => navigation.navigate('SettingsScreen'),
    },
    {
      icon: '🔒',
      title: 'Chính sách bảo mật',
      onPress: () => navigation.navigate('PrivacyPolicyScreen'),
    },
    {
      icon: '❓',
      title: 'Hỗ trợ',
      onPress: () => navigation.navigate('SupportScreen'),
    },
    {
      icon: 'ℹ️',
      title: 'Về chúng tôi',
      onPress: () => navigation.navigate('AboutUsScreen'),
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất');
    }
  };

  if (!isLoggedIn) return null;

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
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#88131B']}
            />
          }
        >
          <View className="flex-row items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-2xl">⬅️</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black ml-4">
              Tài khoản
            </Text>
          </View>

          <View className="flex-row items-center p-4 bg-white rounded-lg mx-4 mb-4 shadow">
            <View className="w-20 h-20 rounded-full mr-4 overflow-hidden bg-gray-200">
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
              <Text className="text-xl font-bold text-black mb-1">
                {userData?.name}
              </Text>
              <Text className="text-gray-600 mb-1">{userData?.email}</Text>
              {userData?.phone && (
                <Text className="text-gray-600">{userData.phone}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfileScreen')}
              className="bg-gray-100 p-2 rounded-full"
            >
              <Text className="text-2xl">✏️</Text>
            </TouchableOpacity>
          </View>

          {/* Nhóm tính năng */}
          <View className="mx-4 mb-4 border border-[#88131B] rounded-lg overflow-hidden">
            {profileOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={option.onPress}
                className={`flex-row items-center p-4 bg-white ${
                  index !== profileOptions.length - 1
                    ? 'border-b border-[#88131B]'
                    : ''
                }`}
              >
                <Text className="text-2xl mr-3">{option.icon}</Text>
                <Text className="text-lg text-black">{option.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Nhóm cài đặt */}
          <View className="mx-4 mb-4 border border-[#88131B] rounded-lg overflow-hidden">
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={option.onPress}
                className={`flex-row items-center p-4 bg-white ${
                  index !== settingsOptions.length - 1
                    ? 'border-b border-[#88131B]'
                    : ''
                }`}
              >
                <Text className="text-2xl mr-3">{option.icon}</Text>
                <Text className="text-lg text-black">{option.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="mx-4 mt-6 mb-4 bg-white rounded-full py-3 border border-[#88131B]"
          >
            <Text className="text-[#88131B] text-center text-lg font-bold">
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ProfileScreen;
