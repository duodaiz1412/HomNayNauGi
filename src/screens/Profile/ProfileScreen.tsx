import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { mockData } from '../../MockData/Data';
const ProfileScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const profileOptions = [
    { icon: '❤️', title: 'Yêu thích', onPress: () => {} },
    { icon: '🕒', title: 'Lịch sử', onPress: () => {} },
    { icon: '🔔', title: 'Thông báo', onPress: () => {} },
    { icon: '💡', title: 'Thẩm tủy', onPress: () => {} },
    { icon: '🔗', title: 'Chia sẻ', onPress: () => {} },
    { icon: '⚙️', title: 'Cài đặt', onPress: () => {} },
    { icon: '🔒', title: 'Chính sách bảo mật', onPress: () => {} },
    { icon: '❓', title: 'Hỗ trợ', onPress: () => {} },
    { icon: 'ℹ️', title: 'Về chúng tôi', onPress: () => {} },
  ];
  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Đăng xuất',
        onPress: () => {
          // Đặt lại stack điều hướng và chuyển về màn hình đăng nhập
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-2xl">⬅️</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-red-600 ml-4">
            Tài khoản
          </Text>
        </View>

        {/* User Info */}
        <View className="flex-row items-center p-4 bg-white rounded-lg mx-4 mb-4 shadow">
          <Image
            source={{ uri: mockData.user.avatar }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="text-lg font-bold">{mockData.user.name}</Text>
            <Text className="text-gray-500">{mockData.user.bio}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfileScreen')}
          >
            <Text className="text-2xl">✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Options List */}
        <View className="bg-white rounded-lg mx-4 shadow">
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={option.onPress}
              className="flex-row items-center p-4 border-b border-gray-200"
            >
              <Text className="text-2xl mr-3">{option.icon}</Text>
              <Text className="text-lg">{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mx-4 mt-6 mb-4 bg-red-600 rounded-full py-3"
        >
          <Text className="text-white text-center text-lg font-bold">
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
