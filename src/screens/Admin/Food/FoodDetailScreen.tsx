import React from "react"
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AdminFoodStackParamList } from "@navigation/AdminFoodStack"
import { SafeAreaView } from "react-native-safe-area-context"
import { AdminHeader } from "@components/AdminHeader/AdminHeader"

// Giả lập dữ liệu món ăn
const foodItems = [
  {
    id: "1",
    name: "Phở Hà Nội",
    image: "https://cdn.pixabay.com/photo/2023/05/27/12/39/noodle-soup-8021418_1280.png",
    category: "Phở",
    categoryId: "1",
    status: "active",
    likes: 1245,
    views: 5678,
    saves: 320,
    nutrition: {
      protein: "25g",
      fat: "15g",
      carbs: "60g",
      calories: "480",
    },
    ingredients: [
      { id: "1", name: "Phở", amount: "200g" },
      { id: "2", name: "Thịt bò", amount: "150g" },
      { id: "3", name: "Hành", amount: "50g" },
      { id: "4", name: "Gừng", amount: "20g" },
    ],
    steps: [
      {
        id: "1",
        title: "Chuẩn bị nguyên liệu",
        description: "Rửa sạch các nguyên liệu và cắt thành từng phần nhỏ.",
        image: "https://cdn.pixabay.com/photo/2016/09/13/18/38/silverware-1667988_1280.jpg",
      },
      {
        id: "2",
        title: "Nấu nước dùng",
        description: "Cho xương bò vào nồi nước, thêm gừng, hành và các gia vị, đun sôi trong 3 giờ.",
        image: "https://cdn.pixabay.com/photo/2014/10/22/16/38/ingredients-498199_1280.jpg",
      },
      {
        id: "3",
        title: "Chuẩn bị thịt",
        description: "Thái thịt bò thành lát mỏng.",
        image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/beef-1238262_1280.jpg",
      },
      {
        id: "4",
        title: "Trụng bánh phở",
        description: "Trụng bánh phở trong nước sôi khoảng 10-15 giây.",
        image: "https://cdn.pixabay.com/photo/2018/07/18/19/12/spaghetti-3547078_1280.jpg",
      },
      {
        id: "5",
        title: "Hoàn thành",
        description: "Cho bánh phở vào tô, xếp thịt bò lên trên, chan nước dùng và thêm các loại rau thơm.",
        image: "https://cdn.pixabay.com/photo/2023/05/27/12/39/noodle-soup-8021418_1280.png",
      },
    ],
    description:
      "Phở Hà Nội là một món ăn truyền thống của Việt Nam, đặc biệt là ở miền Bắc. Món ăn này bao gồm bánh phở, thịt bò hoặc gà, và nước dùng trong vắt được nấu từ xương bò với các loại gia vị đặc trưng như hồi, quế, đinh hương, và hạt ngò. Phở thường được ăn kèm với các loại rau thơm như húng quế, ngò gai, và giá đỗ.",
    type: "Món chính",
    typeId: "1",
    createdAt: "2023-05-15T08:30:00Z",
    updatedAt: "2023-06-20T10:15:00Z",
    author: {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
    },
  },
  {
    id: "2",
    name: "Bánh Mì Pate",
    image: "https://cdn.pixabay.com/photo/2018/06/10/20/30/bread-3467243_1280.jpg",
    category: "Bánh mì",
    categoryId: "2",
    status: "active",
    likes: 987,
    views: 3456,
    saves: 210,
    nutrition: {
      protein: "18g",
      fat: "12g",
      carbs: "45g",
      calories: "380",
    },
    ingredients: [
      { id: "1", name: "Bánh mì", amount: "1 ổ" },
      { id: "2", name: "Pate", amount: "50g" },
      { id: "3", name: "Thịt", amount: "100g" },
      { id: "4", name: "Rau", amount: "50g" },
    ],
    steps: [
      {
        id: "1",
        title: "Chuẩn bị bánh mì",
        description: "Cắt bánh mì làm đôi theo chiều dọc.",
        image: "https://cdn.pixabay.com/photo/2018/06/10/20/30/bread-3467243_1280.jpg",
      },
      {
        id: "2",
        title: "Thêm pate",
        description: "Phết pate lên bánh mì.",
        image: "https://cdn.pixabay.com/photo/2016/03/05/22/31/food-1239423_1280.jpg",
      },
      {
        id: "3",
        title: "Hoàn thành",
        description: "Thêm thịt, rau và các gia vị khác.",
        image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg",
      },
    ],
    description:
      "Bánh mì Pate là một món ăn phổ biến ở Việt Nam, kết hợp giữa bánh mì Pháp và các nguyên liệu đặc trưng của Việt Nam. Bánh mì giòn bên ngoài, mềm bên trong, kết hợp với pate béo ngậy, thịt thơm ngon, rau sống tươi mát và các loại gia vị đặc trưng tạo nên hương vị độc đáo.",
    type: "Món ăn nhanh",
    typeId: "2",
    createdAt: "2023-04-10T09:45:00Z",
    updatedAt: "2023-05-25T14:20:00Z",
    author: {
      id: "2",
      name: "Trần Thị B",
      avatar: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
    },
  },
]

export const FoodDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AdminFoodStackParamList>>()
  const route = useRoute()
  const { foodId } = route.params as { foodId: string }

  // Tìm món ăn dựa trên ID
  const food = foodItems.find((item) => item.id === foodId)

  if (!food) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Không tìm thấy thông tin món ăn</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
        <AdminHeader title="Chi tiết món ăn"/>
    <ScrollView className="flex-1 bg-gray-50">
      {/* Hero Image */}
      <View className="relative">
        <Image source={{ uri: food.image }} className="w-full h-64" />
        <View className="absolute inset-0 bg-black bg-opacity-30" />
        <View className="absolute bottom-4 left-4">
          <Text className="text-white text-2xl font-bold">{food.name}</Text>
          <View className="flex-row items-center mt-1">
            <View className={`px-2 py-1 rounded-full ${food.status === "active" ? "bg-green-500" : "bg-yellow-500"}`}>
              <Text className="text-white text-xs">
                {food.status === "active" ? "Đang hiển thị" : "Chờ duyệt"}
              </Text>
            </View>
            <Text className="text-white text-sm ml-2">Danh mục: {food.category}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row justify-around bg-white py-4 shadow-sm">
        <View className="items-center">
          <View className="flex-row items-center">
            <Ionicons name="heart" size={18} color="#FF3B30" />
            <Text className="text-gray-700 font-bold ml-1">{food.likes}</Text>
          </View>
          <Text className="text-gray-500 text-xs mt-1">Lượt thích</Text>
        </View>
        <View className="items-center">
          <View className="flex-row items-center">
            <Ionicons name="eye" size={18} color="#007AFF" />
            <Text className="text-gray-700 font-bold ml-1">{food.views}</Text>
          </View>
          <Text className="text-gray-500 text-xs mt-1">Lượt xem</Text>
        </View>
        <View className="items-center">
          <View className="flex-row items-center">
            <Ionicons name="bookmark" size={18} color="#34C759" />
            <Text className="text-gray-700 font-bold ml-1">{food.saves}</Text>
          </View>
          <Text className="text-gray-500 text-xs mt-1">Lưu</Text>
        </View>
      </View>

      {/* Description */}
      <View className="bg-white p-4 mt-2">
        <Text className="text-lg font-bold mb-2">Mô tả</Text>
        <Text className="text-gray-700">{food.description}</Text>
      </View>

      {/* Nutrition */}
      <View className="bg-white p-4 mt-2">
        <Text className="text-lg font-bold mb-2">Thông tin dinh dưỡng</Text>
        <View className="flex-row justify-between bg-gray-50 p-3 rounded-lg">
          <View className="items-center">
            <Text className="text-gray-500 text-xs">Đạm</Text>
            <Text className="text-gray-700 font-bold">{food.nutrition.protein}</Text>
          </View>
          <View className="items-center">
            <Text className="text-gray-500 text-xs">Béo</Text>
            <Text className="text-gray-700 font-bold">{food.nutrition.fat}</Text>
          </View>
          <View className="items-center">
            <Text className="text-gray-500 text-xs">Tinh bột</Text>
            <Text className="text-gray-700 font-bold">{food.nutrition.carbs}</Text>
          </View>
          <View className="items-center">
            <Text className="text-gray-500 text-xs">Calo</Text>
            <Text className="text-gray-700 font-bold">{food.nutrition.calories}</Text>
          </View>
        </View>
      </View>

      {/* Ingredients */}
      <View className="bg-white p-4 mt-2">
        <Text className="text-lg font-bold mb-2">Nguyên liệu</Text>
        {food.ingredients.map((ingredient, index) => (
          <View key={ingredient.id} className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-700">{ingredient.name}</Text>
            <Text className="text-gray-500">{ingredient.amount}</Text>
          </View>
        ))}
      </View>

      {/* Steps */}
      <View className="bg-white p-4 mt-2 mb-4">
        <Text className="text-lg font-bold mb-2">Các bước thực hiện</Text>
        {food.steps.map((step, index) => (
          <View key={step.id} className="mb-4">
            <View className="flex-row items-center mb-2">
              <View className="w-8 h-8 rounded-full bg-[#941D23] items-center justify-center">
                <Text className="text-white font-bold">{index + 1}</Text>
              </View>
              <Text className="text-gray-700 font-bold ml-2">{step.title}</Text>
            </View>
            <Text className="text-gray-600 mb-2">{step.description}</Text>
            {step.image && <Image source={{ uri: step.image }} className="w-full h-48 rounded-lg" />}
          </View>
        ))}
      </View>

      {/* Metadata */}
      <View className="bg-white p-4 mt-2 mb-4">
        <Text className="text-lg font-bold mb-2">Thông tin khác</Text>
        <View className="flex-row justify-between py-2 border-b border-gray-100">
          <Text className="text-gray-500">Loại món ăn</Text>
          <Text className="text-gray-700">{food.type}</Text>
        </View>
        <View className="flex-row justify-between py-2 border-b border-gray-100">
          <Text className="text-gray-500">Người tạo</Text>
          <View className="flex-row items-center">
            <Image source={{ uri: food.author.avatar }} className="w-5 h-5 rounded-full mr-1" />
            <Text className="text-gray-700">{food.author.name}</Text>
          </View>
        </View>
        <View className="flex-row justify-between py-2 border-b border-gray-100">
          <Text className="text-gray-500">Ngày tạo</Text>
          <Text className="text-gray-700">{new Date(food.createdAt).toLocaleDateString("vi-VN")}</Text>
        </View>
        <View className="flex-row justify-between py-2">
          <Text className="text-gray-500">Cập nhật lần cuối</Text>
          <Text className="text-gray-700">{new Date(food.updatedAt).toLocaleDateString("vi-VN")}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-center p-4 bg-white shadow-lg">
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center mr-4"
          onPress={() => navigation.navigate("EditFoodScreen", { foodId: food.id })}
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Chỉnh sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-red-500 px-4 py-2 rounded-lg flex-row items-center">
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Xóa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>

  )
}
