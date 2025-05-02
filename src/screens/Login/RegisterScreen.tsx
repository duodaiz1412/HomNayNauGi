import React, { useState } from "react";
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
} from "react-native";

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

export const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    // Kiểm tra thông tin đăng ký
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu nhập lại không khớp');
      return;
    }
    
    // Thông báo đăng ký thành công và chuyển về màn hình đăng nhập
    Alert.alert('Thành công', 'Đăng ký tài khoản thành công!', [
      { text: 'OK', onPress: () => navigation.navigate('Login') }
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* Màu nền giống Login */}
      <View className="flex-1 bg-[#F8F5F2]">
        <StatusBar hidden={true} />
        <SafeAreaView className="flex-1">
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 32, // px-8
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
              Tạo tài khoản để có thể khám phá tất cả những công thức nấu ăn hấp dẫn
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

              {/* Phone Number Input */}
              <TextInput
                className="w-full h-14 px-5 bg-white border border-gray-200 rounded-xl text-base shadow-sm mb-5"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Số điện thoại"
                keyboardType="phone-pad"
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
              <Text className="text-white text-lg font-semibold">Đăng ký</Text>
            </TouchableOpacity>
            <View className="flex-row justify-center items-center mt-6">
                <Text className="text-sm text-gray-600">
                  Đã có tài khoản?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
                  <Text className="text-sm text-[#88131B] ml-1 font-semibold underline">
                    Đăng nhập
                  </Text>
                </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};