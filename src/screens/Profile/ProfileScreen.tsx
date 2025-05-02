import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
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
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4">Hồ sơ của tôi</Text>
        
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2">
            <Image 
              source={require('../../assets/images/avatar-placeholder.jpg')} 
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <Text className="text-lg font-bold">Trung Phong</Text>
          <Text className="text-gray-600">tphong@example.com</Text>
        </View>
        
        <View className="bg-gray-100 rounded-lg overflow-hidden mb-4">
          <TouchableOpacity className="p-4 border-b border-gray-200">
            <Text className="text-base">Thông tin cá nhân</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 border-b border-gray-200">
            <Text className="text-base">Lịch sử tìm kiếm</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 border-b border-gray-200">
            <Text className="text-base">Cài đặt</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="p-4"
            onPress={handleLogout}
          >
            <Text className="text-base text-red-600">Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
