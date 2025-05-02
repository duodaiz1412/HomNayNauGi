import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/AppNavigator';


import {
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView, // Import ScrollView
  KeyboardAvoidingView, // Import KeyboardAvoidingView
  Platform, // Import Platform
} from 'react-native';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

const googleIcon = require('../../assets/icon.png');
const facebookIcon = require('../../assets/icon.png'); // Thay bằng icon thật
const appleIcon = require('../../assets/icon.png'); // Thay bằng icon thật
// --------------------

export const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    // Sử dụng KeyboardAvoidingView bao ngoài cùng
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }} // Cần style flex: 1
    >
      {/* View nền chính */}
      <View className="flex-1 bg-[#F8F5F2]">
        {' '}
        {/* Màu nền trắng ngà */}
        <StatusBar hidden={true} />
        <SafeAreaView className="flex-1">
          {/* ScrollView cho phép cuộn nội dung */}
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 32, // Padding ngang (tương đương px-8)
              paddingBottom: 40, // Padding dưới cùng
            }}
            keyboardShouldPersistTaps="handled" // Giúp bấm nút khi keyboard mở
            showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
          >
            {/* Header Section */}
            <Text className="text-4xl font-bold text-[#88131B] text-center mt-48 mb-3">
              {/* Tăng margin top */}
              Đăng nhập
            </Text>
            <Text className="text-base text-gray-500 text-center mb-12">
              Chào mừng bạn quay trở lại
            </Text>

            {/* Login Form Section */}
            <View className="mb-6">
              {/* Username Input - Không có label ngoài */}
              <TextInput
                className="w-full h-14 px-5 bg-white border border-gray-200 rounded-xl text-base shadow-sm mb-5" // Tăng margin bottom
                value={username}
                onChangeText={setUsername}
                placeholder="Tài khoản" // Placeholder là label
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />

              {/* Password Input - Không có label ngoài */}
              <TextInput
                className="w-full h-14 px-5 bg-white border border-gray-200 rounded-xl text-base shadow-sm"
                value={password}
                onChangeText={setPassword}
                placeholder="Mật khẩu" // Placeholder là label
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />

              {/* Forgot Password */}
              <TouchableOpacity className="self-end mt-3 mb-8">
                {' '}
                {/* Tăng margin */}
                <Text className="text-sm text-[#88131B] font-medium">
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                className="w-full h-14 bg-[#88131B] rounded-full items-center justify-center shadow-lg mb-10" // Bo tròn hoàn toàn, tăng margin bottom
                onPress={() =>
                  console.log('Login pressed:', { username, password })
                }
                activeOpacity={0.8}
              >
                <Text className="text-white text-lg font-semibold">
                  Đăng nhập
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-10">
              <Text className="text-sm text-gray-500 text-center mb-6">
                Hoặc đăng nhập bằng
              </Text>
              <View className="flex-row justify-center gap-3">
                <TouchableOpacity className="w-14 h-14 bg-white rounded-full items-center justify-center border border-gray-200 shadow-sm">
                  <Image
                    source={googleIcon}
                    className="w-7 h-7"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity className="w-14 h-14 bg-white rounded-full items-center justify-center border border-gray-200 shadow-sm">
                  <Image
                    source={facebookIcon}
                    className="w-7 h-7"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity className="w-14 h-14 bg-white rounded-full items-center justify-center border border-gray-200 shadow-sm">
                  <Image
                    source={appleIcon}
                    className="w-7 h-7"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-center items-center mt-5">
              <Text className="text-sm text-gray-600">Chưa có tài khoản?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.7}
              >
                <Text className="text-sm text-[#88131B] ml-1 font-semibold underline">
                  Tạo tài khoản
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};
