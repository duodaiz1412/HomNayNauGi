import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import 'nativewind';
import {mockData} from '../../MockData/Data';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

const EditProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [name, setName] = useState(mockData.user.name);
  const [phone, setPhone] = useState(mockData.user.phone);
  const [email, setEmail] = useState(mockData.user.email);
  const [bio, setBio] = useState(mockData.user.bio);

  const handleSave = () => {
    // Logic lưu thông tin (có thể gửi API hoặc lưu vào local storage)
    console.log('Saved:', { name, phone, email, bio });
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-2xl">⬅️</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-black ml-4">
            Chỉnh sửa hồ sơ
          </Text>
        </View>

        {/* User Avatar */}
        <View className="items-center">
          <Image
            source={{ uri: mockData.user.avatar }}
            className="w-20 h-20 rounded-full"
          />
          <Text className="text-2xl font-bold text-black ml-4">{name}</Text>
        </View>

        {/* Form Fields */}
        <View className="mx-4 mt-4">
          <Text className="text-lg font-bold mb-2">Tên</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="bg-white p-3 rounded-lg shadow mb-4"
            placeholder="Tên của bạn"
          />

          <Text className="text-lg font-bold mb-2">Số điện thoại</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            className="bg-white p-3 rounded-lg shadow mb-4"
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
          />

          <Text className="text-lg font-bold mb-2">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            className="bg-white p-3 rounded-lg shadow mb-4"
            placeholder="Email"
            keyboardType="email-address"
          />

          <Text className="text-lg font-bold mb-2">Tiểu sử</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            className="bg-white p-3 rounded-lg shadow mb-4"
            placeholder="Tiểu sử"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="mx-4 mt-4 mb-6 bg-red-600 rounded-full py-3"
        >
          <Text className="text-white text-center text-lg font-bold">Lưu</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;