import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { CategorySelectionModal } from '@components/Admin/CategorySelectionModal';
import api from 'src/api/api';

export const AddIngredientScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);

  // Form states
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientImage, setIngredientImage] = useState(null);

  // Categories
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  // Modal state
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsFetchingCategories(true);
      const response = await api.get('/ingredient-categories/all');
      if (response.data && response.data.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert(
        'Lỗi',
        'Không thể tải danh mục nguyên liệu. Vui lòng thử lại sau.'
      );
    } finally {
      setIsFetchingCategories(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Cần quyền truy cập',
        'Ứng dụng cần quyền truy cập thư viện ảnh.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setIngredientImage(result.assets[0].uri);
    }
  };

  // Handle category selection
  const handleOpenCategoryModal = () => {
    setIsCategoryModalVisible(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalVisible(false);
  };

  const handleSaveCategorySelection = (selectedIds) => {
    setSelectedCategoryIds(selectedIds);
  };

  // Remove a category from selection
  const removeCategory = (categoryId) => {
    setSelectedCategoryIds(
      selectedCategoryIds.filter((id) => id !== categoryId)
    );
  };

  const handleSubmit = async () => {
    // Validate form
    if (!ingredientName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên nguyên liệu');
      return;
    }

    if (selectedCategoryIds.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một danh mục');
      return;
    }

    if (!ingredientImage) {
      Alert.alert('Lỗi', 'Vui lòng chọn hình ảnh cho nguyên liệu');
      return;
    }

    try {
      setIsLoading(true);

      console.log('Selected category IDs:', selectedCategoryIds);

      // Create form data for API request
      const formData = new FormData();
      formData.append('name', ingredientName);

      // 👇 Thay vì stringify, gửi từng categoryId riêng
      selectedCategoryIds.forEach((id) => {
        formData.append('categoryIds', id); // đảm bảo đây là số (hoặc chuỗi của số)
      });

      // Add image
      if (ingredientImage) {
        formData.append('hasNewImageFile', 'true');

        // Handle local file paths (from image picker)
        if (
          ingredientImage.startsWith('file://') ||
          ingredientImage.startsWith('content://')
        ) {
          const imageFileName = ingredientImage.split('/').pop() || 'image.jpg';

          formData.append('image', {
            uri: ingredientImage,
            type: 'image/jpeg',
            name: imageFileName,
          } as any);
        } else {
          // For remote images, we just use the URL
          formData.append('imageUrl', ingredientImage);
        }
      }

      // Log the form data for debugging
      const formParts = [];
      // @ts-ignore
      for (const [key, value] of formData._parts) {
        formParts.push({ key, value });
      }
      console.log('Form data parts:', JSON.stringify(formParts));

      // Call API to create ingredient
      const response = await api.post('/admin/ingredients/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
        transformRequest: (data, headers) => {
          return formData; // Return the FormData object directly
        },
      });

      console.log('API response:', response.data);

      Alert.alert('Thành công', 'Đã thêm nguyên liệu mới', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error saving ingredient:', error);

      let errorMessage = 'Đã xảy ra lỗi khi lưu nguyên liệu';
      // Extract detailed error message if available
      if (error.response && error.response.data) {
        console.log('Error response:', JSON.stringify(error.response.data));
        if (error.response.data.message) {
          if (Array.isArray(error.response.data.message)) {
            errorMessage = error.response.data.message.join('\n');
          } else {
            errorMessage = error.response.data.message;
          }
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }

      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Get category name by id
  const getCategoryById = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  if (isFetchingCategories) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <AdminHeader title="Thêm nguyên liệu" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#941D23" />
          <Text className="mt-4 text-gray-600">Đang tải danh mục...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <AdminHeader title="Thêm nguyên liệu" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4 py-4">
          {/* Basic Information */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold mb-4">
              Thông tin nguyên liệu
            </Text>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Tên nguyên liệu *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập tên nguyên liệu"
                value={ingredientName}
                onChangeText={setIngredientName}
                editable={!isLoading}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Danh mục *</Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-lg p-3"
                onPress={handleOpenCategoryModal}
                disabled={isLoading}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-500">
                    {selectedCategoryIds.length > 0
                      ? `Đã chọn ${selectedCategoryIds.length} danh mục`
                      : 'Chọn danh mục'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#666" />
                </View>

                {selectedCategoryIds.length > 0 && (
                  <View className="flex-row flex-wrap">
                    {selectedCategoryIds.map((categoryId) => {
                      const category = getCategoryById(categoryId);
                      return category ? (
                        <View
                          key={categoryId}
                          className="bg-red-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
                        >
                          {category.imageUrl && (
                            <Image
                              source={{ uri: category.imageUrl }}
                              className="w-4 h-4 rounded-full mr-1"
                            />
                          )}
                          <Text className="text-sm text-red-800 mr-1">
                            {category.name}
                          </Text>
                          <TouchableOpacity
                            onPress={() => removeCategory(categoryId)}
                          >
                            <Ionicons
                              name="close-circle"
                              size={16}
                              color="#941D23"
                            />
                          </TouchableOpacity>
                        </View>
                      ) : null;
                    })}
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Hình ảnh nguyên liệu *</Text>
              <TouchableOpacity
                className="border border-dashed border-gray-300 rounded-lg p-4 items-center justify-center"
                onPress={pickImage}
                disabled={isLoading}
              >
                {ingredientImage ? (
                  <Image
                    source={{ uri: ingredientImage }}
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="items-center">
                    <Ionicons name="image-outline" size={48} color="#454442" />
                    <Text className="text-gray-500 mt-2">Chọn hình ảnh</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`bg-[#941D23] py-3 rounded-lg items-center mb-6 ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text className="text-white font-bold">
              {isLoading ? 'Đang xử lý...' : 'Thêm nguyên liệu'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Selection Modal */}
      <CategorySelectionModal
        visible={isCategoryModalVisible}
        onClose={handleCloseCategoryModal}
        onSave={handleSaveCategorySelection}
        initialSelectedIds={selectedCategoryIds}
      />
    </SafeAreaView>
  );
};
