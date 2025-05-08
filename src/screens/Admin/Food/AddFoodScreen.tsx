
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
import { AdminHeader } from "@components/AdminHeader/AdminHeader"
import { SafeAreaView } from "react-native-safe-area-context"

export const AddFoodScreen = () => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [foodName, setFoodName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [foodImage, setFoodImage] = useState(null)
  const [isActive, setIsActive] = useState(true)

  // Nutrition states
  const [protein, setProtein] = useState("")
  const [fat, setFat] = useState("")
  const [carbs, setCarbs] = useState("")
  const [calories, setCalories] = useState("")

  // Ingredients and steps
  const [ingredients, setIngredients] = useState([{ id: "1", name: "", amount: "", unit: "" }])
  const [steps, setSteps] = useState([{ id: "1", description: "", image: null }])

  // Mock categories for selection
  const categories = [
    { id: "1", name: "Phở" },
    { id: "2", name: "Bánh mì" },
    { id: "3", name: "Cơm" },
    { id: "4", name: "Bún" },
    { id: "5", name: "Gỏi cuốn" },
  ]

  // Pick image from gallery
  const pickImage = async (type, stepId = null) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      if (type === "food") {
        setFoodImage(result.assets[0].uri)
      } else if (type === "step" && stepId) {
        setSteps(steps.map((step) => (step.id === stepId ? { ...step, image: result.assets[0].uri } : step)))
      }
    }
  }

  // Add new ingredient
  const addIngredient = () => {
    const newId = (Number.parseInt(ingredients[ingredients.length - 1].id) + 1).toString()
    setIngredients([...ingredients, { id: newId, name: "", amount: "", unit: "" }])
  }

  // Remove ingredient
  const removeIngredient = (id) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((item) => item.id !== id))
    } else {
      Alert.alert("Thông báo", "Phải có ít nhất một nguyên liệu")
    }
  }

  // Update ingredient
  const updateIngredient = (id, field, value) => {
    setIngredients(ingredients.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // Add new step
  const addStep = () => {
    const newId = (Number.parseInt(steps[steps.length - 1].id) + 1).toString()
    setSteps([...steps, { id: newId, description: "", image: null }])
  }

  // Remove step
  const removeStep = (id) => {
    if (steps.length > 1) {
      setSteps(steps.filter((item) => item.id !== id))
    } else {
      Alert.alert("Thông báo", "Phải có ít nhất một bước")
    }
  }

  // Update step
  const updateStep = (id, field, value) => {
    setSteps(steps.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!foodName || !description || !category || !foodImage) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin món ăn")
      return
    }

    if (!protein || !fat || !carbs || !calories) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin dinh dưỡng")
      return
    }

    const hasEmptyIngredient = ingredients.some((ing) => !ing.name || !ing.amount || !ing.unit)
    if (hasEmptyIngredient) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin nguyên liệu")
      return
    }

    const hasEmptyStep = steps.some((step) => !step.description)
    if (hasEmptyStep) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin các bước nấu ăn")
      return
    }

    // Submit form
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      Alert.alert("Thành công", "Đã thêm món ăn mới", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    }, 1500)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
        <AdminHeader title="Thêm món ăn" />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1 px-4 py-4">
          {/* Basic Information */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold mb-4">Thông tin cơ bản</Text>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Tên món ăn *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập tên món ăn"
                value={foodName}
                onChangeText={setFoodName}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Mô tả *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập mô tả món ăn"
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
              <Text className="text-gray-700 mb-1">Hình ảnh món ăn *</Text>
              <TouchableOpacity
                className="border border-dashed border-gray-300 rounded-lg p-4 items-center justify-center"
                onPress={() => pickImage("food")}
              >
                {foodImage ? (
                  <Image source={{ uri: foodImage }} className="w-full h-48 rounded-lg" resizeMode="cover" />
                ) : (
                  <View className="items-center">
                    <Ionicons name="image-outline" size={48} color="#454442" />
                    <Text className="text-gray-500 mt-2">Chọn hình ảnh</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Hiển thị món ăn</Text>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: "#D1D1D6", true: "#E57373" }}
                thumbColor={isActive ? "#941D23" : "#F4F3F4"}
              />
            </View>
          </View>

          {/* Nutrition Information */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold mb-4">Thông tin dinh dưỡng</Text>

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
          </View>

          {/* Ingredients */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Nguyên liệu</Text>
              <TouchableOpacity className="bg-[#941D23] px-3 py-1 rounded-full" onPress={addIngredient}>
                <Text className="text-white">+ Thêm</Text>
              </TouchableOpacity>
            </View>

            {ingredients.map((ingredient, index) => (
              <View key={ingredient.id} className="mb-4 pb-4 border-b border-gray-100">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-medium">Nguyên liệu {index + 1}</Text>
                  {ingredients.length > 1 && (
                    <TouchableOpacity onPress={() => removeIngredient(ingredient.id)}>
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  )}
                </View>

                <View className="mb-2">
                  <Text className="text-gray-700 mb-1">Tên nguyên liệu *</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Nhập tên nguyên liệu"
                    value={ingredient.name}
                    onChangeText={(value) => updateIngredient(ingredient.id, "name", value)}
                  />
                </View>

                <View className="flex-row">
                  <View className="flex-1 mr-2">
                    <Text className="text-gray-700 mb-1">Số lượng *</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Nhập số lượng"
                      value={ingredient.amount}
                      onChangeText={(value) => updateIngredient(ingredient.id, "amount", value)}
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-700 mb-1">Đơn vị *</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Nhập đơn vị"
                      value={ingredient.unit}
                      onChangeText={(value) => updateIngredient(ingredient.id, "unit", value)}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Cooking Steps */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Các bước nấu ăn</Text>
              <TouchableOpacity className="bg-[#941D23] px-3 py-1 rounded-full" onPress={addStep}>
                <Text className="text-white">+ Thêm</Text>
              </TouchableOpacity>
            </View>

            {steps.map((step, index) => (
              <View key={step.id} className="mb-4 pb-4 border-b border-gray-100">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-medium">Bước {index + 1}</Text>
                  {steps.length > 1 && (
                    <TouchableOpacity onPress={() => removeStep(step.id)}>
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  )}
                </View>

                <View className="mb-2">
                  <Text className="text-gray-700 mb-1">Mô tả *</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Nhập mô tả bước nấu ăn"
                    value={step.description}
                    onChangeText={(value) => updateStep(step.id, "description", value)}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 mb-1">Hình ảnh minh họa</Text>
                  <TouchableOpacity
                    className="border border-dashed border-gray-300 rounded-lg p-4 items-center justify-center"
                    onPress={() => pickImage("step", step.id)}
                  >
                    {step.image ? (
                      <Image source={{ uri: step.image }} className="w-full h-40 rounded-lg" resizeMode="cover" />
                    ) : (
                      <View className="items-center">
                        <Ionicons name="image-outline" size={36} color="#454442" />
                        <Text className="text-gray-500 mt-2">Chọn hình ảnh</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`bg-[#941D23] py-3 rounded-lg items-center mb-6 ${isLoading ? "opacity-70" : ""}`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text className="text-white font-bold">{isLoading ? "Đang xử lý..." : "Thêm món ăn"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


