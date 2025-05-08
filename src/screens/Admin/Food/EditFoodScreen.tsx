
import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,

  StatusBar,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { SafeAreaView } from "react-native-safe-area-context"
import { AdminHeader } from "@components/AdminHeader/AdminHeader"
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminFoodStackParamList } from "@navigation/AdminFoodStack";

type EditFoodScreenRouteProp = RouteProp<AdminFoodStackParamList, 'EditFoodScreen'>;
export const EditFoodScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AdminFoodStackParamList>>();
  const route = useRoute<EditFoodScreenRouteProp>();
  const { foodId } = route.params

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

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
  const [ingredients, setIngredients] = useState([])
  const [steps, setSteps] = useState([])

  // Mock categories for selection
  const categories = [
    { id: "1", name: "Phở" },
    { id: "2", name: "Bánh mì" },
    { id: "3", name: "Cơm" },
    { id: "4", name: "Bún" },
    { id: "5", name: "Gỏi cuốn" },
  ]

  // Fetch food data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock data for the selected food
      const foodData = {
        id: foodId,
        name: "Phở Hà Nội",
        description: "Phở bò truyền thống Hà Nội với nước dùng đậm đà, thơm ngon",
        category: "1",
        image: "https://cdn.pixabay.com/photo/2023/05/27/12/39/noodle-soup-8021418_1280.png",
        isActive: true,
        nutrition: {
          protein: "25",
          fat: "15",
          carbs: "60",
          calories: "480",
        },
        ingredients: [
          { id: "1", name: "Phở", amount: "200", unit: "g" },
          { id: "2", name: "Thịt bò", amount: "150", unit: "g" },
          { id: "3", name: "Hành", amount: "50", unit: "g" },
          { id: "4", name: "Gừng", amount: "20", unit: "g" },
        ],
        steps: [
          {
            id: "1",
            description: "Đun sôi nước dùng với xương bò trong 6-8 giờ",
            image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/cooking-736678_1280.jpg",
          },
          {
            id: "2",
            description: "Thêm các gia vị như hoa hồi, quế, đinh hương",
            image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/spices-736679_1280.jpg",
          },
          {
            id: "3",
            description: "Chuẩn bị phở, thịt bò, rau thơm và thưởng thức",
            image: "https://cdn.pixabay.com/photo/2017/01/31/09/30/raspberry-2023404_1280.jpg",
          },
        ],
      }

      // Set form data
      setFoodName(foodData.name)
      setDescription(foodData.description)
      setCategory(foodData.category)
      setFoodImage(foodData.image)
      setIsActive(foodData.isActive)

      // Set nutrition data
      setProtein(foodData.nutrition.protein)
      setFat(foodData.nutrition.fat)
      setCarbs(foodData.nutrition.carbs)
      setCalories(foodData.nutrition.calories)

      // Set ingredients and steps
      setIngredients(foodData.ingredients)
      setSteps(foodData.steps)

      setIsFetching(false)
    }, 1000)
  }, [foodId])

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
    const newId =
      ingredients.length > 0 ? (Number.parseInt(ingredients[ingredients.length - 1].id) + 1).toString() : "1"
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
    const newId = steps.length > 0 ? (Number.parseInt(steps[steps.length - 1].id) + 1).toString() : "1"
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
      Alert.alert("Thành công", "Đã cập nhật món ăn", [
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

        {/* Header */}
        {/* <AdminHeader title="Chinh sửa món ăn" /> */}
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#941D23" />
          <Text className="mt-4 text-gray-600">Đang tải thông tin món ăn...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">

      {/* Header */}
      <AdminHeader title="Chỉnh sửa món ăn" />

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
            <Text className="text-white font-bold">{isLoading ? "Đang xử lý..." : "Cập nhật món ăn"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

