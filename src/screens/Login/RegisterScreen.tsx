import React, { useState } from 'react';
import {
  View,
  Text,
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

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import api from 'src/api/api';

// Đường dẫn ảnh
const backgroundImage = require('@assets/background.png');

export const RegisterScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    try {
      if (!username || !email || !password || !confirmPassword) {
        Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Lỗi', 'Mật khẩu nhập lại không khớp');
        return;
      }
      const response = await api.post('/auth/register', {
        username: username,
        email: email,
        name: fullName,
        password: password,
      });
      // Kiểm tra nếu đăng ký thành công
      if (
        response.data &&
        response.data.message === 'Registration successful'
      ) {
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công');
        navigation.navigate('Login');
      } else {
        Alert.alert('Lỗi', 'Đăng ký không thành công, vui lòng thử lại');
      }
    } catch (error) {
      if (error.response) {
        // Lỗi từ server
        Alert.alert(
          'Lỗi đăng nhập',
          error.response.data.message ||
            'Tên đăng nhập hoặc mật khẩu không đúng'
        );
      } else {
        // Lỗi kết nối
        Alert.alert('Lỗi kết nối', 'Không thể kết nối đến server');
      }
    }
    // Kiểm tra thông tin đăng ký
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
                flexGrow: 1,
                paddingHorizontal: 32,
                paddingBottom: 40,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header Section */}
              <Text className="text-4xl font-bold text-[#88131B] text-center mt-40 mb-3">
                Tạo tài khoản
              </Text>
              <Text className="text-base text-gray-500 text-center mb-10 px-4">
                Tạo tài khoản để có thể khám phá tất cả những công thức nấu ăn
                hấp dẫn
              </Text>

              {/* Register Form Section */}
              <View className="mb-8">
                {/* Username Input */}
                <TextInput
                  className="w-full h-14 px-5 bg-white border border-gray-200 rounded-xl text-base shadow-sm mb-5"
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Tên đăng nhập"
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />

                {/* Email Input */}
                <TextInput
                  className="w-full h-14 px-5 bg-white border border-gray-200 rounded-xl text-base shadow-sm mb-5"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  className="w-full h-14 px-5 bg-white border border-gray-200 rounded-xl text-base shadow-sm mb-5"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Họ và tên"
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                />
                {/* Password Input */}
                <TextInput
                  className="w-full h-14 px-5 bg-white border border-gray-200 rounded-xl text-base shadow-sm mb-5"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Mật khẩu"
                  secureTextEntry
                  placeholderTextColor="#9CA3AF"
                />

                {/* Confirm Password Input */}
                <TextInput
                  className="w-full h-14 px-5 bg-white border border-gray-200 rounded-xl text-base shadow-sm"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Register Button */}
              {/* mt-auto sẽ đẩy nút xuống nếu nội dung quá ngắn, nếu form dài thì nó nằm ngay dưới input cuối */}
              <TouchableOpacity
                className="w-full h-14 bg-[#88131B] rounded-full items-center justify-center shadow-lg mt-5"
                onPress={handleRegister}
                activeOpacity={0.8}
              >
                <Text className="text-white text-lg font-semibold">
                  Đăng ký
                </Text>
              </TouchableOpacity>
              <View className="flex-row justify-center items-center mt-6">
                <Text className="text-sm text-gray-600">Đã có tài khoản?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.7}
                >
                  <Text className="text-sm text-[#88131B] ml-1 font-semibold underline">
                    Đăng nhập
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
