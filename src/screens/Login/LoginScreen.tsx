import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

import {
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
} from 'react-native';

// Thông tin đăng nhập mặc định
const DEFAULT_USERNAME = 'ADMIN';
const DEFAULT_PASSWORD = 'ADMIN';

// Đường dẫn ảnh
const googleIcon = require('@assets/google.png');
const facebookIcon = require('@assets/facebook.png');
const appleIcon = require('@assets/apple.png');
const backgroundImage = require('@assets/background.png');

export const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Kiểm tra thông tin đăng nhập
    if (username.trim() === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } else {
      Alert.alert('Lỗi đăng nhập', 'Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      >
        <ImageBackground
          source={backgroundImage}
          style={{ flex: 1 }}
          resizeMode="cover"
      >
        <View className="flex-1">
          <StatusBar hidden={true} />
          <SafeAreaView className="flex-1">
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 32,
                paddingBottom: 40,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text className="text-4xl font-bold text-[#88131B] text-center mt-48 mb-3">
                Đăng nhập
              </Text>
              <Text className="text-base text-gray-500 text-center mb-12">
                Chào mừng bạn quay trở lại
              </Text>

              <View className="mb-6">
                <TextInput
                  className="w-full h-14 px-5 bg-white border border-gray-200 rounded-xl text-base shadow-sm mb-5"
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Tài khoản"
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />

                <TextInput
                  className="w-full h-14 px-5 bg-white border border-gray-200 rounded-xl text-base shadow-sm self-end mt-3 mb-8"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mật khẩu"
                  secureTextEntry
                  placeholderTextColor="#9CA3AF"
                />

                {/* <TouchableOpacity className="self-end mt-3 mb-8">
                  <Text className="text-sm text-[#88131B] font-medium">
                    Quên mật khẩu?
                  </Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                  className="w-full h-14 bg-[#88131B] rounded-full items-center justify-center shadow-lg mb-10"
                  onPress={handleLogin}
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
                      className="aspect-[1/1]"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity className="w-14 h-14 bg-white rounded-full items-center justify-center border border-gray-200 shadow-sm">
                    <Image
                      source={facebookIcon}
                      className="aspect-[1/1]"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity className="w-14 h-14 bg-white rounded-full items-center justify-center border border-gray-200 shadow-sm">
                    <Image
                      source={appleIcon}
                      className="aspect-[1/1]"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row justify-center items-center mt-5">
                <Text className="text-sm text-gray-600">
                  Chưa có tài khoản?
                </Text>
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
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};
