import React, { useEffect, useState } from "react"
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AdminFoodStackParamList } from "@navigation/AdminFoodStack"
import { SafeAreaView } from "react-native-safe-area-context"
import { AdminHeader } from "@components/AdminHeader/AdminHeader"
import api from "src/api/api"
import { Recipe } from "src/types" 
import LikeSolid from '@components/icons/LikeSolid';

export const FoodDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AdminFoodStackParamList>>()
  const route = useRoute()
  const { foodId } = route.params as { foodId: string }

  const [isFetching, setIsFetching] = useState(true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsFetching(true);
        const response = await api.get(`/admin/recipes/detail/${foodId}`)
        const recipeData = response.data.data;
        if (!recipeData) {
          throw new Error('Không tìm thấy công thức');
        }
        
        console.log("\nRecipe data:", JSON.stringify(recipeData,null,2));
        setRecipe(recipeData);
      } catch (e) {
        console.error('Error fetching recipe:', e);
        Alert.alert('Lỗi', 'Không thể tải thông tin công thức');
      } finally {
        setIsFetching(false);
      }
    };
    fetchRecipe();
  }, [foodId]);

  if (isFetching) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#941D23" />
          <Text className="mt-4 text-gray-600">
            Đang tải thông tin công thức...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Không tìm thấy công thức</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminHeader title="Chi tiết món ăn"/>
      <ScrollView className="flex-1 bg-gray-50">
        {/* Hero Image */}
        <View className="relative">
          <Image 
            source={{ uri: recipe.imageUrl }} 
            className="w-full h-64"
            resizeMode="cover"
          />
          <View className="absolute inset-0  bg-opacity-30" />
          <View className="absolute bottom-4 left-4">
            <Text className="text-white text-2xl font-bold">{recipe.name}</Text>
            <View className="flex-row items-center mt-1">
              <View className={`px-2 py-1 rounded-full ${recipe.status === "public" ? "bg-green-500" : "bg-yellow-500"}`}>
                <Text className="text-white text-xs">
                  {recipe.status === "public" ? "Đang hiển thị" : "Chờ duyệt"}
                </Text>
              </View>
              <Text className="text-white text-sm ml-2">
                Danh mục: {recipe.categoryMappings?.map(cat => cat.recipeCategory.name).join(", ")}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around bg-white py-4 shadow-sm">
          <View className="items-center">
            <View className="flex-row items-center">
              <LikeSolid size={18} color="#FFA500" />
              <Text className="text-gray-700 font-bold ml-1">{recipe.totalLikes}</Text>
            </View>
            <Text className="text-gray-500 text-xs mt-1">Lượt thích</Text>
          </View>
          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="eye" size={18} color="#007AFF" />
              <Text className="text-gray-700 font-bold ml-1">{recipe.totalViews}</Text>
            </View>
            <Text className="text-gray-500 text-xs mt-1">Lượt xem</Text>
          </View>
          <View className="items-center">
            <View className="flex-row items-center">
              <Ionicons name="heart" size={18} color="#FF3B30" />
              <Text className="text-gray-700 font-bold ml-1">{recipe.totalFavorites}</Text>
            </View>
            <Text className="text-gray-500 text-xs mt-1">Lưu</Text>
          </View>
        </View>

        {/* Description */}
        <View className="bg-white p-4 mt-2">
          <Text className="text-lg font-bold mb-2">Mô tả</Text>
          <Text className="text-gray-700">{recipe.description}</Text>
        </View>

        {/* Nutrition */}
        <View className="bg-white p-4 mt-2">
          <Text className="text-lg font-bold mb-2">Thông tin dinh dưỡng</Text>
          <View className="flex-row justify-between bg-gray-50 p-3 rounded-lg">
            <View className="items-center">
              <Text className="text-gray-500 text-xs">Đạm</Text>
              <Text className="text-gray-700 font-bold">{recipe.protein}g</Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-xs">Béo</Text>
              <Text className="text-gray-700 font-bold">{recipe.fat}g</Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-xs">Tinh bột</Text>
              <Text className="text-gray-700 font-bold">{recipe.carbohydrates}g</Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-xs">Calo</Text>
              <Text className="text-gray-700 font-bold">{recipe.calories}</Text>
            </View>
          </View>
        </View>

        {/* Ingredients */}
        <View className="bg-white p-4 mt-2">
          <Text className="text-lg font-bold mb-2">Nguyên liệu</Text>
          {recipe.recipeIngredients?.map((ingredient, index) => (
            <View key={index} className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-gray-700">{ingredient.ingredient.name}</Text>
              <Text className="text-gray-500">
                {ingredient.quantity} {ingredient.unit.symbol}
              </Text>
            </View>
          ))}
        </View>

        {/* Steps */}
        <View className="bg-white p-4 mt-2 mb-4">
          <Text className="text-lg font-bold mb-2">Các bước thực hiện</Text>
          {recipe.cookingSteps?.map((step, index) => (
            <View key={step.id} className="mb-4">
              <View className="flex-row items-center mb-2">
                <View className="w-8 h-8 rounded-full bg-[#941D23] items-center justify-center">
                  <Text className="text-white font-bold">{step.stepOrder}</Text>
                </View>
                <Text className="text-gray-700 font-bold ml-2">Bước {step.stepOrder}</Text>
              </View>
              <Text className="text-gray-600 mb-2">{step.instruction}</Text>
              {step.imageUrl && <Image source={{ uri: step.imageUrl }} className="w-full h-48 rounded-lg" />}
            </View>
          ))}
        </View>

        {/* Metadata */}
        <View className="bg-white p-4 mt-2 mb-4">
          <Text className="text-lg font-bold mb-2">Thông tin khác</Text>
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-500">Trạng thái</Text>
            <Text className="text-gray-700">{recipe.status}</Text>
          </View>
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-500">Id Người tạo</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-700">{recipe.accountId}</Text>
            </View>
          </View>
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-500">Người tạo</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-700">{recipe.account?.userProfile.fullName}</Text>
            </View>
          </View>
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-500">Ngày tạo</Text>
            <Text className="text-gray-700">{new Date(recipe.createdAt).toLocaleDateString("vi-VN")}</Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-gray-500">Cập nhật lần cuối</Text>
            <Text className="text-gray-700">{new Date(recipe.updatedAt).toLocaleDateString("vi-VN")}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-center p-4 bg-white shadow-lg">
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center mr-4"
            onPress={() => navigation.navigate("EditFoodScreen", { foodId: recipe.id })}
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
