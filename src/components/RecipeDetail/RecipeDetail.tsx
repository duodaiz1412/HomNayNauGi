import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RecipeDetailTypes } from 'src/types';
import { formatNumber } from '../../ultils/formatNumber';
import LikeSolid from 'src/components/icons/LikeSolid';
import LikeOutLine from 'src/components/icons/LikeOutLine';
import HeartSolid from 'src/components/icons/HeartSolid';
import HeartOutLine from 'src/components/icons/HeartOutLine';

interface RecipeDetailProps {
  recipe: RecipeDetailTypes;
  onBack: () => void;
  onFavorite: (id: string | number) => void;
  onLike: (id: string | number) => void;
  onStartCooking: (id: string | number) => void;
}
export default function RecipeDetail({
  recipe,
  onBack,
  onFavorite,
  onLike,
  onStartCooking,
}: RecipeDetailProps) {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showIngredients, setShowIngredients] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  if (!recipe) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <Text className="text-center mt-10">Không tìm thấy món ăn</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 relative ">
      <ScrollView className="flex-1">
        <View className="relative">
          <Image
            source={{ uri: recipe.imageUrl }}
            className="w-full h-80 rounded-b-3xl"
            resizeMode="cover"
          />
          {/* Nút back */}
          <TouchableOpacity
            className="absolute left-4 top-4 z-10 bg-white rounded-full p-1.5"
            onPress={onBack}
          >
            <Ionicons name="return-up-back-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Recipe Info Card */}
        <View className="bg-white rounded-t-3xl -mt-8 px-5 pt-6 pb-4 shadow-lg">
          {/* Dòng 1: Tên món ăn & lượt xem */}
          <View className="flex-row justify-between items-center">
            <Text
              className="text-4xl font-bold text-red-800 flex-1"
              numberOfLines={2}
            >
              {recipe.name}
            </Text>
            <View className="flex-row items-center ml-2">
              <Ionicons name="eye" size={20} color="#4B4B4B" />
              <Text className="text-[#4B4B4B] ml-2 font-medium text-lg">
                {recipe.totalViews} lượt xem
              </Text>
            </View>
          </View>

          {/* Dòng 2: Thời gian nấu */}
          <View className="flex-row items-center mt-3">
            <Ionicons name="time-outline" size={18} color="gray" />
            <Text className="text-[#4B4B4B] ml-1 font-medium">
              {recipe.preparationTimeMinutes} phút
            </Text>
          </View>

          {/* Dòng 3: Avatar + tên người tạo (trái), nút like + tổng like + tổng yêu thích (phải) */}
          <View className="flex-row justify-between items-center mt-4">
            {/* Avatar + tên */}
            <View className="flex-row items-center">
              <Image
                source={{
                  uri: recipe.account?.userProfile?.avatarUrl ||
                    'https://ui-avatars.com/api/?name=' +
                      encodeURIComponent(
                        recipe.account?.userProfile?.displayName ||
                          recipe.account?.name ||
                          'User'
                      ),
                }}
                className="w-10 h-10 rounded-full"
              />
              <Text className="ml-3 text-base font-bold text-[#4B4B4B]">
                {recipe.account?.userProfile?.fullName ||
                  recipe.account?.name ||
                  'Ẩn danh'}
              </Text>
            </View>
            {/* Like + tổng like + tổng yêu thích */}
            <View className="flex-row items-center">
              {/* Nút like */}
              <TouchableOpacity
                onPress={() => {
                  onLike(recipe.id);
                }}
                className="rounded-full p-2 mr-2"
                // style={{ backgroundColor: recipe.isLiked ? '#FDECEA' : 'transparent' }}
                activeOpacity={0.7}
              >
                {recipe.isLiked ? (
                  <LikeSolid size={22} color="#007AFF" />
                ) : (
                  <LikeOutLine size={22} color="#4B4B4B" />
                )}
              </TouchableOpacity>
              <Text className="text-[#4B4B4B] font-medium mr-4">
                {recipe.totalLikes}
              </Text>

              {/* Nút favorite */}
              <TouchableOpacity
                onPress={() => {
                  onFavorite(recipe.id);
                }}
                className="rounded-full p-2 mr-2"
                style={{
                  backgroundColor: recipe.isFavorite
                    ? '#FDECEA'
                    : 'transparent',
                }}
                activeOpacity={0.7}
              >
                {recipe.isFavorite ? (
                  <HeartSolid size={22} color="#FF3B30" />
                ) : (
                  <HeartOutLine size={22} color="#4B4B4B" />
                )}
              </TouchableOpacity>
              <Text className="text-[#4B4B4B] font-medium">
                {recipe.totalFavorites}
              </Text>
            </View>
          </View>

          <View>
            <Text
              className="text-[#4B4B4B] mt-5 text-lg font-semibold "
              numberOfLines={showFullDescription ? undefined : 2}
            >
              {recipe.description}
            </Text>
            {recipe.description && recipe.description.length > 0 && (
              <TouchableOpacity
                onPress={() => setShowFullDescription(!showFullDescription)}
                className="mt-1"
              >
                <Text className="text-[#941D23] font-bold">
                  {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Nutrition Info */}
          <View className="flex-row justify-around mt-6">
            <View className="flex-row items-center">
              <View className="bg-[#F4EFEB] p-2 rounded-xl mr-2">
                <MaterialCommunityIcons name="grain" size={26} color="#222" />
              </View>
              <View>
                <Text className="text-lg text-[#4B4B4B] font-bold">
                  Tinh bột
                </Text>
                <Text className="text-[#4B4B4B] font-medium text-base">
                  {formatNumber(recipe.carbohydrates, ' gr') || '0 gr'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="bg-[#F4EFEB] p-2 rounded-xl mr-2">
                <MaterialCommunityIcons
                  name="food-steak"
                  size={26}
                  color="#222"
                />
              </View>
              <View>
                <Text className="text-lg text-[#4B4B4B] font-bold">
                  Chất đạm
                </Text>
                <Text className="text-[#4B4B4B] font-medium text-base">
                  {formatNumber(recipe.protein, ' gr') || '0 gr'}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-around mt-6">
            <View className="flex-row items-center">
              <View className="bg-[#F4EFEB] p-2 rounded-xl mr-2">
                <MaterialCommunityIcons name="fire" size={26} color="#222" />
              </View>
              <View>
                <Text className="text-lg text-[#4B4B4B] font-bold">Kcal</Text>
                <Text className="text-[#4B4B4B] font-medium text-base">
                  {formatNumber(recipe.calories, ' Calo') || '0 Calo'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="bg-[#F4EFEB] p-2 rounded-xl mr-2">
                <MaterialCommunityIcons name="water" size={26} color="#222" />
              </View>
              <View>
                <Text className="text-lg text-[#4B4B4B] font-bold">
                  Chất béo
                </Text>
                <Text className="text-[#4B4B4B] font-medium text-base">
                  {formatNumber(recipe.fat, ' gr') || '0 gr'}
                </Text>
              </View>
            </View>
          </View>

          {/* Tab Selector */}
          <View className="flex-row mt-6 bg-red-50 rounded-2xl p-3">
            <TouchableOpacity
              onPress={() => setActiveTab('ingredients')}
              className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'ingredients' ? 'bg-red-900' : ''}`}
            >
              <Text
                className={` text-lg font-bold ${activeTab === 'ingredients' ? 'text-white' : 'text-[#88131B]'}`}
              >
                Nguyên liệu
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('instructions')}
              className={`flex-1 py-3 items-center rounded-lg ${activeTab === 'instructions' ? 'bg-red-900' : ''}`}
            >
              <Text
                className={`text-lg font-bold ${activeTab === 'instructions' ? 'text-white' : 'text-[#88131B]'}`}
              >
                Hướng dẫn
              </Text>
            </TouchableOpacity>
          </View>

          {/* Ingredients Tab Content */}
          {activeTab === 'ingredients' && (
            <View className="mt-5">
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-[#4B4B4B] flex-1">
                  Các nguyên liệu ({recipe.recipeIngredients?.length || 0})
                </Text>
                <TouchableOpacity
                  onPress={() => setShowIngredients((prev) => !prev)}
                >
                  <Ionicons
                    name={showIngredients ? 'chevron-up' : 'chevron-down'}
                    size={22}
                    color="#941D23"
                  />
                </TouchableOpacity>
              </View>
              {showIngredients && (
                <>
                  {recipe.recipeIngredients?.map((ingredient, index) => (
                    <View
                      key={index}
                      className="flex-row items-center bg-white rounded-2xl shadow-lg px-4 py-3 mb-4 mx-2 mt-2"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      {/* Ảnh nguyên liệu */}
                      <View className="w-16 h-16 bg-[#F4EFEB] rounded-2xl items-center justify-center mr-4">
                        <Image
                          source={{ uri: ingredient.ingredient.imageUrl }}
                          className="w-14 h-14 rounded-2xl"
                          resizeMode="cover"
                        />
                      </View>
                      {/* Tên nguyên liệu */}
                      <Text className="flex-1 text-[#4B4B4B] text-lg font-semibold">
                        {ingredient.ingredient.name}
                      </Text>
                      {/* Số lượng + đơn vị */}
                      <Text className="text-[#4B4B4B] text-lg font-semibold">
                        {`${formatNumber(ingredient.quantity)} ${ingredient.unit?.unitName || ''}`}
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}

          {/* Instructions Tab Content */}
          {activeTab === 'instructions' && (
            <View className="mt-5">
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-[#4B4B4B] flex-1">
                  Các bước thực hiện
                </Text>
                <TouchableOpacity onPress={() => setShowSteps((prev) => !prev)}>
                  <Ionicons
                    name={showSteps ? 'chevron-up' : 'chevron-down'}
                    size={22}
                    color="#941D23"
                  />
                </TouchableOpacity>
              </View>
              {showSteps && (
                <>
                  {recipe.cookingSteps?.map((step, index) => (
                    <View
                      key={index}
                      className="mt-4 bg-white p-5 rounded-2xl flex-row items-center shadow-md"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <View className="bg-red-900 w-12 h-12 rounded-full items-center justify-center mr-5">
                        <Text className="text-white font-bold text-xl">
                          {step.stepOrder}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text
                          className="text-base text-[#4B4B4B] font-medium"
                          style={{ fontSize: 18, lineHeight: 26 }}
                        >
                          {step.instruction}
                        </Text>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}

          {/* Bottom Action Button - Fixed at bottom */}
          <View className="bg-white pt-3 pb-6 px-7 mt-10">
            <TouchableOpacity
              onPress={() => onStartCooking(recipe.id)}
              className="bg-red-900 rounded-full py-4 items-center w-full self-center"
            >
              <Text className="text-white font-bold text-lg">Nấu ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
