
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

type EditIngredientCategoryScreenRouteProp = RouteProp<AdminIngredientCategoryStackParamList,'EditIngredientCategoryScreen'>


export const EditIngredientCategoryScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AdminIngredientCategoryStackParamList>>()
  const route = useRoute<EditIngredientCategoryScreenRouteProp>()
  const { ingredientCategoryId } = route.params

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  // Form states
  const [categoryName, setCategoryName] = useState("")
  const [description, setDescription] = useState("")
  const [categoryIcon, setCategoryIcon] = useState(null)

  // Fetch category data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock data for the selected category
      const categoryData = {
        id: ingredientCategoryId,
        name: "Thịt",
        description: "Các loại thịt tươi sống và đã qua chế biến",
        icon: "https://cdn-icons-png.flaticon.com/128/3082/3082051.png",
      }

      // Set form data
      setCategoryName(categoryData.name)
      setDescription(categoryData.description)
      setCategoryIcon(categoryData.icon)

      setIsFetching(false)
    }, 1000)
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
      setCategoryIcon(result.assets[0].uri)
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!categoryName) {
      Alert.alert("Lỗi", "Vui lòng nhập tên danh mục")
      return
    }

    if (!categoryIcon) {
      Alert.alert("Lỗi", "Vui lòng chọn biểu tượng cho danh mục")
      return
    }

    // Submit form
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      Alert.alert("Thành công", "Đã cập nhật danh mục nguyên liệu", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    }, 1500)
  }

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
              <Text className="text-gray-700 mb-1">Tên danh mục *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập tên danh mục"
                value={categoryName}
                onChangeText={setCategoryName}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Mô tả</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập mô tả danh mục (không bắt buộc)"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Biểu tượng danh mục *</Text>
              <TouchableOpacity
                className="border border-dashed border-gray-300 rounded-lg p-4 items-center justify-center"
                onPress={pickImage}
              >
                {categoryIcon ? (
                  <Image source={{ uri: categoryIcon }} className="w-24 h-24 rounded-lg" resizeMode="contain" />
                ) : (
                  <View className="items-center">
                    <Ionicons name="image-outline" size={48} color="#454442" />
                    <Text className="text-gray-500 mt-2">Chọn biểu tượng</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text className="text-gray-500 text-xs mt-1">
                Biểu tượng nên có kích thước vuông và nền trong suốt (PNG)
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

