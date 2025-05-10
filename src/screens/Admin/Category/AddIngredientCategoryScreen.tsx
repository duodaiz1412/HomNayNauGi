import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminIngredientCategoryStackParamList } from '@navigation/AdminIngredientCategoryStack';
import api from 'src/api/api';

export const AddIngredientCategoryScreen = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<AdminIngredientCategoryStackParamList>
    >();
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState<string | null>(null);

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setCategoryIcon(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // Validate
    if (!categoryName.trim()) {
      return Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
    }

    if (!categoryIcon) {
      return Alert.alert('Lỗi', 'Vui lòng chọn biểu tượng danh mục');
    }

    try {
      setIsLoading(true);

      // Create form data
      const formData = new FormData();
      formData.append('name', categoryName);

      // Xử lý hình ảnh
      if (categoryIcon) {
        const imageUriParts = categoryIcon.split('.');
        const fileExtension = imageUriParts[imageUriParts.length - 1];

        const imageObject = {
          uri: categoryIcon,
          name: `photo.${fileExtension}`,
          type: `image/${fileExtension}`,
        } as unknown as Blob;

        formData.append('image', imageObject, `photo.${fileExtension}`);
      }

      console.log('Sending formData:', formData);

      // Call API using configured instance
      const response = await api.post(
        '/ingredient-categories/create',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response:', response.data);
      // Show success message
      Alert.alert('Thành công', 'Đã thêm danh mục mới');

      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Error:', error);
      // Show error message
      Alert.alert('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <AdminHeader title="Thêm danh mục nguyên liệu" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-4 py-4">
          {/* Form */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Tên danh mục *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập tên danh mục"
                value={categoryName}
                onChangeText={setCategoryName}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Biểu tượng danh mục *</Text>
              <TouchableOpacity
                className="border border-dashed border-gray-300 rounded-lg p-4 items-center justify-center"
                onPress={pickImage}
              >
                {categoryIcon ? (
                  <Image
                    source={{ uri: categoryIcon }}
                    className="w-24 h-24 rounded-lg"
                    resizeMode="contain"
                  />
                ) : (
                  <View className="items-center">
                    <Ionicons name="image-outline" size={48} color="#454442" />
                    <Text className="text-gray-500 mt-2">Chọn biểu tượng</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text className="text-gray-500 text-xs mt-1">
                Biểu tượng nên có kích thước vuông và nền trong suốt
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`bg-[#941D23] py-3 rounded-lg items-center ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text className="text-white font-bold">
              {isLoading ? 'Đang xử lý...' : 'Thêm danh mục'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
