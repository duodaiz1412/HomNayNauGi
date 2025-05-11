import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockData } from '../../MockData/Data';
import { logout } from 'src/api/api';


const backgroundImage = require('@assets/background.png');

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        navigation.replace('Login');
      }
    };
    checkLoginStatus();
  }, []);

  if (!isLoggedIn) return null;

  const profileOptions = [
    { icon: '❤️', title: 'Yêu thích', onPress: () => navigation.navigate('FavoritesScreen') },
    { icon: '🔔', title: 'Thông báo', onPress: () => navigation.navigate('NotificationsScreen') },
    { icon: '💡', title: 'Thành tựu', onPress: () => navigation.navigate('AchievementsScreen') },
    { icon: '⚙️', title: 'Cài đặt', onPress: () => navigation.navigate('SettingsScreen') },
    { icon: '🔒', title: 'Chính sách bảo mật', onPress: () => navigation.navigate('PrivacyPolicyScreen') },
    { icon: '❓', title: 'Hỗ trợ', onPress: () => navigation.navigate('SupportScreen') },
    { icon: 'ℹ️', title: 'Về chúng tôi', onPress: () => navigation.navigate('AboutUsScreen') },
  ];
const handleLogout = () => {
  Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
    {
      text: 'Hủy',
      style: 'cancel',
    },
    {
      text: 'Đăng xuất',
      onPress: async () => {
        try {
          await logout();
          console.log("Đăng xuất thành công");
          // Chuyển về màn hình login
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        } catch (error) {
          console.error('Lỗi đăng xuất:', error);
          Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
        }
      },
      style: 'destructive',
    },
  ]);
};



  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          <View className="flex-row items-center p-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-2xl">⬅️</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-black ml-4">Tài khoản</Text>
          </View>

          <View className="flex-row items-center p-4 bg-white rounded-lg mx-4 mb-4 shadow">
            <Image
              source={{ uri: mockData.user.avatar }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="text-lg font-bold text-black">{mockData.user.name}</Text>
              <Text className="text-black">{mockData.user.bio}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')}>
              <Text className="text-2xl">✏️</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-lg mx-4 shadow">
            {profileOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={option.onPress}
                className="flex-row items-center p-4 border-b border-gray-200"
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
            <Text className="text-[#88131B] text-center text-lg font-bold">Đăng xuất</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ProfileScreen;
