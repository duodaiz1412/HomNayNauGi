
import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,

  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { SafeAreaView } from "react-native-safe-area-context"
import { AdminHeader } from "@components/AdminHeader/AdminHeader"

export const AddIngredientScreen = () => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [ingredientName, setIngredientName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [ingredientImage, setIngredientImage] = useState(null)
  const [unit, setUnit] = useState("")
  const [inStock, setInStock] = useState(true)

  // Nutrition states
  const [protein, setProtein] = useState("")
  const [fat, setFat] = useState("")
  const [carbs, setCarbs] = useState("")
  const [calories, setCalories] = useState("")
  const [fiber, setFiber] = useState("")
  const [sugar, setSugar] = useState("")

  // Mock categories for selection
  const categories = [
    { id: "1", name: "Thịt" },
    { id: "2", name: "Rau củ" },
    { id: "3", name: "Gia vị" },
    { id: "4", name: "Hải sản" },
    { id: "5", name: "Ngũ cốc" },
  ]

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setIngredientImage(result.assets[0].uri)
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!ingredientName || !description || !category || !ingredientImage || !unit) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin nguyên liệu")
      return
    }

    if (!protein || !fat || !carbs || !calories) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin dinh dưỡng cơ bản")
      return
    }

    // Submit form
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      Alert.alert("Thành công", "Đã thêm nguyên liệu mới", [
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
    <AdminHeader title="Thêm nguyên liệu" />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1 px-4 py-4">
          {/* Basic Information */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold mb-4">Thông tin cơ bản</Text>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Tên nguyên liệu *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập tên nguyên liệu"
                value={ingredientName}
                onChangeText={setIngredientName}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Mô tả *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập mô tả nguyên liệu"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Danh mục *</Text>
              <View className="border border-gray-300 rounded-lg px-3 py-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      className={`px-3 py-1 rounded-full mr-2 ${category === cat.id ? "bg-[#941D23]" : "bg-gray-100"}`}
                      onPress={() => setCategory(cat.id)}
                    >
                      <Text className={`${category === cat.id ? "text-white" : "text-gray-700"}`}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Đơn vị *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập đơn vị (g, ml, cái...)"
                value={unit}
                onChangeText={setUnit}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Hình ảnh nguyên liệu *</Text>
              <TouchableOpacity
                className="border border-dashed border-gray-300 rounded-lg p-4 items-center justify-center"
                onPress={pickImage}
              >
                {ingredientImage ? (
                  <Image source={{ uri: ingredientImage }} className="w-full h-48 rounded-lg" resizeMode="cover" />
                ) : (
                  <View className="items-center">
                    <Ionicons name="image-outline" size={48} color="#454442" />
                    <Text className="text-gray-500 mt-2">Chọn hình ảnh</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Còn hàng</Text>
              <Switch
                value={inStock}
                onValueChange={setInStock}
                trackColor={{ false: "#D1D1D6", true: "#E57373" }}
                thumbColor={inStock ? "#941D23" : "#F4F3F4"}
              />
            </View>
          </View>

          {/* Nutrition Information */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold mb-4">Thông tin dinh dưỡng (trên 100g)</Text>

            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 mb-1">Đạm (g) *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Nhập lượng đạm"
                  value={protein}
                  onChangeText={setProtein}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 mb-1">Chất béo (g) *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Nhập lượng chất béo"
                  value={fat}
                  onChangeText={setFat}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 mb-1">Tinh bột (g) *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Nhập lượng tinh bột"
                  value={carbs}
                  onChangeText={setCarbs}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 mb-1">Calo *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Nhập lượng calo"
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 mb-1">Chất xơ (g)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Nhập lượng chất xơ"
                  value={fiber}
                  onChangeText={setFiber}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 mb-1">Đường (g)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Nhập lượng đường"
                  value={sugar}
                  onChangeText={setSugar}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`bg-[#941D23] py-3 rounded-lg items-center mb-6 ${isLoading ? "opacity-70" : ""}`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text className="text-white font-bold">{isLoading ? "Đang xử lý..." : "Thêm nguyên liệu"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

