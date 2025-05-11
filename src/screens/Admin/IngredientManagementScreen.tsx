"use client"

import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { AdminHeader } from "@components/AdminHeader/AdminHeader"
import { SafeAreaView } from "react-native-safe-area-context"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AdminIngredientStackParamList } from "@navigation/AdminIngredientStack"
export const IngredientManagementScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AdminIngredientStackParamList>>()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Mock data for ingredient categories
  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "1", name: "Thịt" },
    { id: "2", name: "Rau củ" },
    { id: "3", name: "Gia vị" },
    { id: "4", name: "Hải sản" },
    { id: "5", name: "Ngũ cốc" },
  ]

  // Mock data for ingredients
  const ingredients = [
    {
      id: "1",
      name: "Thịt bò",
      image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/beef-1239189_1280.jpg",
      category: "Thịt",
      categoryId: "1",
      unit: "gram",
      inStock: true,
      nutrition: {
        protein: "26g",
        fat: "15g",
        carbs: "0g",
        calories: "250",
      },
      usedInDishes: 15,
    },
    {
      id: "2",
      name: "Hành tím",
      image: "https://cdn.pixabay.com/photo/2016/08/11/08/04/vegetables-1584999_1280.jpg",
      category: "Rau củ",
      categoryId: "2",
      unit: "gram",
      inStock: true,
      nutrition: {
        protein: "1.1g",
        fat: "0.1g",
        carbs: "9.3g",
        calories: "40",
      },
      usedInDishes: 28,
    },
    {
      id: "3",
      name: "Gừng",
      image: "https://cdn.pixabay.com/photo/2016/01/20/13/05/ginger-1151235_1280.jpg",
      category: "Gia vị",
      categoryId: "3",
      unit: "gram",
      inStock: true,
      nutrition: {
        protein: "1.8g",
        fat: "0.8g",
        carbs: "17.8g",
        calories: "80",
      },
      usedInDishes: 22,
    },
    {
      id: "4",
      name: "Tôm",
      image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/shrimp-1239195_1280.jpg",
      category: "Hải sản",
      categoryId: "4",
      unit: "gram",
      inStock: false,
      nutrition: {
        protein: "24g",
        fat: "1.7g",
        carbs: "0.2g",
        calories: "120",
      },
      usedInDishes: 18,
    },
    {
      id: "5",
      name: "Gạo",
      image: "https://cdn.pixabay.com/photo/2014/10/22/18/43/rice-498688_1280.jpg",
      category: "Ngũ cốc",
      categoryId: "5",
      unit: "gram",
      inStock: true,
      nutrition: {
        protein: "2.7g",
        fat: "0.3g",
        carbs: "28g",
        calories: "130",
      },
      usedInDishes: 35,
    },
  ]

  const filteredIngredients = ingredients.filter((item) => {
    // Filter by search query
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by category
    const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory

    return matchesSearch && matchesCategory
  })

  const renderIngredientItem = ({ item }) => (
    <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
      <View className="flex-row">
        <Image source={{ uri: item.image }} className="w-24 h-24 rounded-lg mr-3" />
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-base">{item.name}</Text>
            <View className={`px-2 py-1 rounded-full ${item.inStock ? "bg-green-100" : "bg-red-100"}`}>
              <Text className={`text-xs ${item.inStock ? "text-green-600" : "text-red-600"}`}>
                {item.inStock ? "Còn hàng" : "Hết hàng"}
              </Text>
            </View>
          </View>

          <Text className="text-gray-500 text-xs mt-1">Danh mục: {item.category}</Text>
          <Text className="text-gray-500 text-xs mt-1">Đơn vị: {item.unit}</Text>

          <View className="flex-row items-center mt-2">
            <Ionicons name="restaurant-outline" size={14} color="#454442" />
            <Text className="text-gray-500 text-xs ml-1">Sử dụng trong {item.usedInDishes} món ăn</Text>
          </View>
        </View>
      </View>

      {/* Nutrition Information */}
      <View className="mt-3 pt-3 border-t border-gray-100">
        <View className="flex-row items-center mb-2">
          <Ionicons name="fitness-outline" size={14} color="#454442" />
          <Text className="text-gray-700 text-xs ml-1 font-medium">Dinh dưỡng (trên 100g):</Text>
        </View>

        <View className="flex-row justify-between">
          <View className="flex-1 bg-gray-50 rounded-md p-2 mr-1">
            <Text className="text-xs text-center text-gray-500">Đạm</Text>
            <Text className="text-xs text-center font-bold">{item.nutrition.protein}</Text>
          </View>
          <View className="flex-1 bg-gray-50 rounded-md p-2 mr-1">
            <Text className="text-xs text-center text-gray-500">Béo</Text>
            <Text className="text-xs text-center font-bold">{item.nutrition.fat}</Text>
          </View>
          <View className="flex-1 bg-gray-50 rounded-md p-2 mr-1">
            <Text className="text-xs text-center text-gray-500">Tinh bột</Text>
            <Text className="text-xs text-center font-bold">{item.nutrition.carbs}</Text>
          </View>
          <View className="flex-1 bg-gray-50 rounded-md p-2">
            <Text className="text-xs text-center text-gray-500">Calo</Text>
            <Text className="text-xs text-center font-bold">{item.nutrition.calories}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-end mt-3 pt-3 border-t border-gray-100">
      {/* onPress={() => navigation.navigate("IngredientDetail", { ingredientId: item.id })} */}
        <TouchableOpacity
          className="mr-2 bg-blue-100 px-3 py-1.5 rounded-full flex-row items-center"

        >
          <Ionicons name="eye-outline" size={14} color="#007AFF" />
          <Text className="text-blue-600 text-xs ml-1">Chi tiết</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mr-2 bg-green-100 px-3 py-1.5 rounded-full flex-row items-center"
          onPress={() => navigation.navigate("EditIngredientScreen", { ingredientId: item.id })}
        >
          <Ionicons name="create-outline" size={14} color="#34C759" />
          <Text className="text-green-600 text-xs ml-1">Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-red-100 px-3 py-1.5 rounded-full flex-row items-center">
          <Ionicons name="trash-outline" size={14} color="#FF3B30" />
          <Text className="text-red-600 text-xs ml-1">Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
        <AdminHeader title="Quản lý nguyên liệu" />

      {/* Search and Filter */}
      <View className="px-4 py-3">
        <View className="flex-row items-center bg-white rounded-lg px-3 mb-3 shadow-sm">
          <Ionicons name="search" size={20} color="#454442" />
          <TextInput
            className="flex-1 py-2 px-2"
            placeholder="Tìm kiếm nguyên liệu..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#454442" />
            </TouchableOpacity>
          ) : null}
        </View>

        <Text className="text-gray-700 font-medium mb-2">Danh mục:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === category.id ? "bg-[#941D23]" : "bg-white"}`}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text className={`${selectedCategory === category.id ? "text-white" : "text-gray-700"}`}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Ingredient List */}
      <FlatList
        data={filteredIngredients}
        renderItem={renderIngredientItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#941D23] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate("AddIngredientScreen")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

