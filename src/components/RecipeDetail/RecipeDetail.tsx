import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';

interface RecipeDetailProps {
  recipe: {
    id: string | number;
    name: string;
    image: string;
    time: string;
    description?: string;
    isFavorite: boolean;
    nutrition: {
      carbs?: string;
      protein?: string;
      calories?: string;
      fat?: string;
    };
    ingredients: Array<{
      name: string;
      amount: string;
      image: string;
    }>;
    steps: Array<{
      step: number;
      description: string;
    }>;
  };
  onBack: () => void;
  onFavorite: (id: string | number) => void;
  onStartCooking: (id: string | number) => void;
}

export default function RecipeDetail({
  recipe,
  onBack,
  onFavorite,
  onStartCooking,
}: RecipeDetailProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [quantity, setQuantity] = useState(3);
  const [activeTab, setActiveTab] = useState('ingredients');

  if (!recipe) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <Text className="text-center mt-10">Không tìm thấy món ăn</Text>
      </SafeAreaView>
    );
  }

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 relative ">
      <ScrollView className="flex-1">
        {/* Back Button */}
        <TouchableOpacity
          className="absolute left-4 top-4 z-10 bg-white rounded-full p-1.5"
          onPress={onBack}
        >
          <Ionicons name="return-up-back-outline" size={20} color="black" />
        </TouchableOpacity>
        {/* Favorite Button */}
        <TouchableOpacity 
          className="absolute top-4 right-4 bg-white/80 rounded-full p-1.5 z-10"
          onPress={() => onFavorite(recipe.id)}
        >
          <Ionicons
            name={recipe.isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={recipe.isFavorite ? '#FF3B30' : '#000'}
          />
        </TouchableOpacity>
        {/* Image */}
        <Image source={{ uri: recipe.image }} className="w-full h-60" />

        {/* Recipe Info Card */}
        <View className="bg-white rounded-t-3xl -mt-6 px-5 pt-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-4xl font-bold text-red-800">
              {recipe.name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons
                name="time-outline"
                size={20}
                color="gray"
                className="text-gray-500 mr-1"
              />
              <Text className="text-gray-500">{recipe.time}</Text>
            </View>
          </View>

          <Text className="text-gray-600 mt-3 text-base" numberOfLines={10}>
            {recipe.description ||
              'Phở Hà Nội có hương vị đặc biệt nhờ nước dùng ngọt thanh, trong vắt được ninh từ xương của bò và gia vị. Nhờ vậy, phở Hà Nội đã tạo được dấu...'}
          </Text>

          {/* Nutrition Info */}
          <View className="flex-row justify-around mt-6">
            <View className="flex-row items-center">
              <View className="bg-[#F4EFEB] p-2 rounded-xl mr-2">
                <Feather
                  name="droplet"
                  size={26}
                  color="gray"
                  className="text-gray-500 "
                />
              </View>
              <View>
                <Text className="text-lg text-[#454442] font-bold">
                  Tinh bột
                </Text>
                <Text className="text-[#808080] font-medium text-base">
                  {recipe.nutrition.carbs || '120 gr'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="bg-[#F4EFEB] p-2 rounded-xl mr-2">
                <Feather
                  name="droplet"
                  size={26}
                  color="gray"
                  className="text-gray-500 "
                />
              </View>
              <View>
                <Text className="text-lg text-[#454442] font-bold">
                  Chất đạm
                </Text>
                <Text className="text-[#808080] font-medium text-base">
                  {recipe.nutrition.protein || '200 gr'}
                </Text>
              </View>
            </View>
          </View>
          {/*  */}
          <View className="flex-row justify-around mt-6">
            <View className="flex-row items-center">
              <View className="bg-[#F4EFEB] p-2 rounded-xl mr-2">
                <Octicons
                  name="flame"
                  size={26}
                  color="gray"
                  className="text-gray-500 "
                />
              </View>
              <View>
                <Text className="text-lg text-[#454442] font-bold">Kcal</Text>
                <Text className="text-[#808080] font-medium text-base">
                  {recipe.nutrition.calories || '500 Calo'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="bg-[#F4EFEB] p-2 rounded-xl mr-2">
                <Feather
                  name="droplet"
                  size={26}
                  color="gray"
                  className="text-gray-500 "
                />
              </View>
              <View>
                <Text className="text-lg text-[#454442] font-bold">
                  Chất béo
                </Text>
                <Text className="text-[#808080] font-medium text-base">
                  {recipe.nutrition.fat || '50 gr'}
                </Text>
              </View>
            </View>
          </View>

          {/* Tab Selector */}
          <View className="flex-row mt-6 bg-red-50 rounded-lg p-3">
            <TouchableOpacity
              onPress={() => setActiveTab('ingredients')}
              className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'ingredients' ? 'bg-red-900' : ''}`}
            >
              <Text
                className={`font-bold ${activeTab === 'ingredients' ? 'text-white' : 'text-[#88131B]'}`}
              >
                Nguyên liệu
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('instructions')}
              className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'instructions' ? 'bg-red-900' : ''}`}
            >
              <Text
                className={`font-bold ${activeTab === 'instructions' ? 'text-white' : 'text-[#88131B]'}`}
              >
                Hướng dẫn
              </Text>
            </TouchableOpacity>
          </View>

          {/* Ingredients Tab Content */}
          {activeTab === 'ingredients' && (
            <View className="mt-4">
              <Text className="text-xl font-bold text-[#454442]">
                Các nguyên liệu (
                {recipe.ingredients?.length || 'Lỗi số nguyên liệu'})
              </Text>
              {/* <View className="flex-row items-center mt-2">
                <Text className="text-gray-500">Khẩu phần</Text>
                <View className="ml-auto flex-row items-center">
                  <TouchableOpacity
                    onPress={decreaseQuantity}
                    className="bg-white border border-gray-300 rounded-full w-6 h-6 items-center justify-center"
                  >
                    <Text className="text-gray-500">−</Text>
                  </TouchableOpacity>
                  <Text className="mx-3">{quantity}</Text>
                  <TouchableOpacity
                    onPress={increaseQuantity}
                    className="bg-white border border-gray-300 rounded-full w-6 h-6 items-center justify-center"
                  >
                    <Text className="text-gray-500">+</Text>
                  </TouchableOpacity>
                </View>
              </View> */}

              {recipe.ingredients.map((ingredient, index) => (
                <View
                  key={index}
                  className="mt-2 bg-white p-3 rounded-lg flex-row items-center shadow-xl"
                >
                  <View className="w-16 h-16 bg-[#F4EFEB] rounded-md mr-3 flex items-center justify-center">
                    <Image
                      source={{ uri: ingredient.image }}
                      className="w-14 h-14 rounded-md"
                    />
                  </View>
                  <View className="flex-1 flex-row justify-between items-center">
                    <Text className="font-bold text-[#454442] text-xl ">
                      {ingredient.name}
                    </Text>
                    <Text className="text-[#454442] text-xl">
                      {ingredient.amount}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Instructions Tab Content */}
          {activeTab === 'instructions' && (
            <View className="mt-4">
              <Text className="text-lg font-bold">Các bước thực hiện</Text>
              {recipe.steps.map((step, index) => (
                <View
                  key={index}
                  className="mt-2 bg-gray-100 p-3 rounded-lg flex-row"
                >
                  <View className="bg-red-900 w-8 h-8 rounded-full items-center justify-center mr-3">
                    <Text className="text-white font-bold">{step.step}</Text>
                  </View>
                  <View className="flex-1">
                    <Text>{step.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View className="h-20" />
        </View>
      </ScrollView>
      {/* Bottom Action Button - Fixed at bottom */}
      <View className="absolute bottom-5 left-0 right-0 px-7">
        <TouchableOpacity
          onPress={() => onStartCooking(recipe.id)}
          className="bg-red-900 rounded-full py-4 items-center w-3/5 self-center"
        >
          <Text className="text-white font-bold text-lg">Nấu ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
