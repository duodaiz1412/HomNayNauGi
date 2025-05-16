import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MyIngredient from '@components/MyIngredient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import {
  getUserPantry,
  removeIngredientFromPantry,
  removeAllIngredientsFromPantry,
  findRecipesByIngredients,
} from '../../api/api';
import { IngredientSearch, RecipeResponse } from 'src/types';
import SuggestedRecipe from '@components/SuggestedRecipe';

interface Ingredient {
  id: string;
  name: string;
  image_url: string;
}

interface IngredientGroup {
  name: string;
  ingredients: Ingredient[];
}

export default function RecipeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'dishes'>(
    'ingredients'
  );
  const [ingredientGroups, setIngredientGroups] = useState<IngredientGroup[]>(
    []
  );
  const [suggestedDishes, setSuggestedDishes] = useState<RecipeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDishes, setLoadingDishes] = useState(false);

  useEffect(() => {
    fetchPantryData();
  }, []);

  useEffect(() => {
  }, [suggestedDishes]);

  const fetchPantryData = async () => {
    try {
      setLoading(true);
      const data = await getUserPantry();
      setIngredientGroups(data);
      handleGetSuggestedDish();
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu pantry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSuggestedDish = async () => {
    try {
      setLoadingDishes(true);
      // Lấy tất cả ID nguyên liệu từ ingredientGroups
      const ingredientIds: IngredientSearch[] = ingredientGroups.reduce(
        (acc, group) =>
          acc.concat(
            group.ingredients.map((ingredient) => ({ id: ingredient.id }))
          ),
        [] as IngredientSearch[]
      );

      if (ingredientIds.length === 0) {
        setSuggestedDishes([]);
        return;
      }

      const response = await findRecipesByIngredients(ingredientIds);
      setSuggestedDishes(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy món ăn gợi ý:', error);
      Alert.alert('Lỗi', 'Không thể lấy danh sách món ăn gợi ý');
    } finally {
      setLoadingDishes(false);
    }
  };

  const backgroundImage = require('@assets/background.png');

  const handleDeleteIngredient = async (id: string) => {
    try {
      await removeIngredientFromPantry(id);
      fetchPantryData();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa nguyên liệu này');
    }
  };

  const handleIngredientPress = (id: string) => {
    console.log('Chọn nguyên liệu:', id);
  };

  const handleDeleteAll = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa tất cả nguyên liệu?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeAllIngredientsFromPantry();
            // Refresh data after deletion
            fetchPantryData();
          } catch (error) {
            Alert.alert('Lỗi', 'Không thể xóa tất cả nguyên liệu');
          }
        },
      },
    ]);
  };

  const handleAddIngredient = () => {
    navigation.navigate('AddIngredient', {
      isMultiSelect: true,
      onAddSuccess: () => {
        fetchPantryData();
      },
    });
  };

  const handleDishPress = (id: string) => {
    navigation.navigate('RecipeDetail', {
      recipeId: id.replace('d', ''),
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#991b1b" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={backgroundImage}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View className="flex-row items-center p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-red-800 mx-auto">
            Thực phẩm
          </Text>
        </View>

        <View className="flex-row px-6 mb-4">
          <TouchableOpacity
            className={`flex-1 pb-2 ${activeTab === 'ingredients' ? 'border-b-2 border-red-800' : ''}`}
            onPress={() => setActiveTab('ingredients')}
          >
            <View className="flex-row items-center justify-center">
              <Text
                className={`font-medium ${activeTab === 'ingredients' ? 'text-red-800' : 'text-gray-500'}`}
              >
                Nguyên liệu của tôi
              </Text>
              <View className="bg-black rounded-full ml-1 w-5 h-5 flex items-center justify-center">
                <Text className="text-white text-xs">
                  {ingredientGroups.reduce(
                    (acc, group) => acc + group.ingredients.length,
                    0
                  )}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 pb-2 ${activeTab === 'dishes' ? 'border-b-2 border-red-800' : ''}`}
            onPress={() => setActiveTab('dishes')}
          >
            <View className="flex-row items-center justify-center">
              <Text
                className={`font-medium ${activeTab === 'dishes' ? 'text-red-800' : 'text-gray-500'}`}
              >
                Gợi ý món ăn
              </Text>
              <View className="bg-black rounded-full ml-1 w-5 h-5 flex items-center justify-center">
                <Text className="text-white text-xs">
                  {suggestedDishes.length}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {activeTab === 'ingredients' ? (
          <ScrollView className="flex flex-col gap-3 px-4">
            <MyIngredient
              ingredients={ingredientGroups}
              onDeleteIngredient={handleDeleteIngredient}
              onIngredientPress={handleIngredientPress}
              onDeleteAll={handleDeleteAll}
            />
          </ScrollView>
        ) : (
          <View className="flex-1 px-4">
            {loadingDishes ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#B91C1C" />
              </View>
            ) : (
              <SuggestedRecipe
                dishes={suggestedDishes}
                onDishPress={handleDishPress}
              />
            )}
          </View>
        )}

        {/* Floating Action Button */}
        {activeTab === 'ingredients' && (
          <TouchableOpacity
            onPress={handleAddIngredient}
            className="absolute bottom-12 right-6 bg-red-800 w-14 h-14 rounded-full items-center justify-center shadow-lg"
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}
