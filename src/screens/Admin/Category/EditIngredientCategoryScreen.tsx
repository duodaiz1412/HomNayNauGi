
import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute,RouteProp } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { SafeAreaView } from "react-native-safe-area-context"
import { AdminHeader } from "@components/AdminHeader/AdminHeader"
import { AdminIngredientCategoryStackParamList } from "@navigation/AdminIngredientCategoryStack"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import api from "src/api/api"

type EditIngredientCategoryScreenRouteProp = RouteProp<AdminIngredientCategoryStackParamList,'EditIngredientCategoryScreen'>


export const EditIngredientCategoryScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AdminIngredientCategoryStackParamList>>()
  const route = useRoute<EditIngredientCategoryScreenRouteProp>()
  const { ingredientCategoryId } = route.params

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const [categoryName, setCategoryName] = useState("")
  const [categoryImg, setCategoryImg] = useState(null)

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () =>{
      try {
        setIsFetching(true);
        const reponse = await api.get(`/admin/ingredient-categories/search/${ingredientCategoryId}`)
        const categoryData = reponse.data.data;
        console.log (categoryData)
        if (!categoryData) {
          throw new Error('Không tìm thấy danh mục');
        }
        setCategoryName(categoryData.name);
        setCategoryImg(categoryData.imageUrl);
      }catch (e){
        console.error('Error fetching category:', e);
        Alert.alert('Lỗi', 'Không thể tải thông tin danh mục');
      }
      finally {
        setIsFetching(false);
      }
    }
    fetchCategory();
  }, [ingredientCategoryId])

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setCategoryImg(result.assets[0].uri)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    // Validate
    if (!categoryName.trim()) {
      return Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
    }

    if (!categoryImg) {
      return Alert.alert('Lỗi', 'Vui lòng chọn biểu tượng danh mục');
    }

    try {
      setIsLoading(true);

      // Create form data
      const formData = new FormData();
      formData.append('name', categoryName);

      // Xử lý hình ảnh
      if (categoryImg) {
        const imageUriParts = categoryImg.split('.');
        const fileExtension = imageUriParts[imageUriParts.length - 1];

        const imageObject = {
          uri: categoryImg,
          name: `photo.${fileExtension}`,
          type: `image/${fileExtension}`,
        } as unknown as Blob;

        formData.append('image', imageObject, `photo.${fileExtension}`);
      }

      console.log('Sending formData:', formData);

      // Call API using configured instance
      const response = await api.put(
        `/admin/ingredient-categories/edit/${ingredientCategoryId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response:', response.data);
      // Show success message
      Alert.alert('Thành công', 'Sửa danh mục thành công');

      // Navigate back
      navigation.replace("AdminIngredientCategoryManagementScreen");
    } catch (error) {
      console.error('Error:', error);
      // Show error message
      Alert.alert('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#941D23" />
          <Text className="mt-4 text-gray-600">Đang tải thông tin danh mục...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">

      {/* Header */}
    <AdminHeader title="Chỉnh sửa danh mục nguyên liệu" />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 px-4 py-4">
          {/* Form */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Tên danh mục nguyên liệu *</Text>
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
                {categoryImg ? (
                  <Image source={{ uri: categoryImg }} className="w-24 h-24 rounded-lg" resizeMode="contain" />
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
            className={`bg-[#941D23] py-3 rounded-lg items-center ${isLoading ? "opacity-70" : ""}`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text className="text-white font-bold">{isLoading ? "Đang xử lý..." : "Cập nhật danh mục"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

