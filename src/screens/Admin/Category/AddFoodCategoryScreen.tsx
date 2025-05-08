
import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { AdminHeader } from "@components/AdminHeader/AdminHeader"
import { SafeAreaView } from "react-native-safe-area-context"

export const AddFoodCategoryScreen = () => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [categoryName, setCategoryName] = useState("")
  const [description, setDescription] = useState("")
  const [categoryIcon, setCategoryIcon] = useState(null)

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
      Alert.alert("Thành công", "Đã thêm danh mục món ăn mới", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    }, 1500)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
    <AdminHeader title="Thêm danh mục món ăn"/>

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
            <Text className="text-white font-bold">{isLoading ? "Đang xử lý..." : "Thêm danh mục"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


