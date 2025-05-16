import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { findRecipesByIngredients, scanIngredient } from '../../api/api';
import SuggestDish from '../../components/SuggestDish/index';

type ScanIngredientRouteProp = RouteProp<RootStackParamList, 'ScanIngredient'>;

interface DetectedIngredient {
  id: string;
  name: string;
  imageUrl?: string;
}

const ScanIngredientScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ScanIngredientRouteProp>();
  const { imageUri, selectedIngredients } = route.params || {};
  const backgroundImage = require('@assets/background.png');

  const [isLoading, setIsLoading] = useState(false);
  const [ingredients, setIngredients] = useState<DetectedIngredient[]>(
    selectedIngredients || []
  );
  const [showSuggestDish, setShowSuggestDish] = useState(false);
  const [suggestedDishes, setSuggestedDishes] = useState([]);
  const [isLoadingDishes, setIsLoadingDishes] = useState(false);

  useEffect(() => {
    const extractIngredients = async () => {
      if (imageUri) {
        try {
          setIsLoading(true);
          console.log('Bắt đầu quá trình scan với ảnh:', imageUri);

          const response = await scanIngredient(imageUri);
          console.log('Kết quả nhận được:', response);

          if (response.success && response.ingredients) {
            setIngredients(
              response.ingredients.map((item: any) => ({
                id: item.id,
                name: item.name,
                imageUrl: item.imageUrl,
              }))
            );
          }
        } catch (error) {
          console.error('Lỗi khi xử lý nguyên liệu:', error);
          Alert.alert('Lỗi', 'Không thể xử lý nguyên liệu. Vui lòng thử lại.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    extractIngredients();
  }, [imageUri]);

  const handleAddNewIngredient = () => {
    Alert.alert(
      'Thông báo',
      'Chức năng thêm nguyên liệu sẽ được phát triển sau'
    );
  };

  const handleFindRecipe = async () => {
    if (ingredients.length > 0) {
      setIsLoadingDishes(true);
      try {
        const searchIngredients = ingredients.map((ing) => ({
          id: ing.id,
        }));
        const response = await findRecipesByIngredients(searchIngredients);
        setSuggestedDishes(response.data);
        setShowSuggestDish(true);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tìm kiếm món ăn. Vui lòng thử lại.');
      } finally {
        setIsLoadingDishes(false);
      }
    } else {
      Alert.alert(
        'Thông báo',
        'Vui lòng có ít nhất một nguyên liệu để tìm kiếm'
      );
    }
  };

  const handleDishPress = (id: string) => {
    setShowSuggestDish(false);
    navigation.navigate('RecipeDetail', { recipeId: id });
  };

  const handleEdit = () => {
    Alert.alert('Thông báo', 'Chức năng chỉnh sửa sẽ được phát triển sau');
  };

  return (
    <ImageBackground source={backgroundImage} className="flex-1 w-full">
      <SafeAreaView className="flex-1 px-4">
        <View className="flex-row items-center py-2.5">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#941D23" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-[#941D23]">Nguyên liệu</Text>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#941D23" />
            <Text className="text-lg text-[#941D23] mt-4">
              Đang nhận dạng nguyên liệu...
            </Text>
          </View>
        ) : (
          <>
            <View className="flex flex-row justify-between items-center gap-2 mb-4">
              <View className="flex flex-col">
                <Text className="text-2xl font-semibold text-[#333]">
                  Các nguyên liệu
                </Text>
                <Text className="text-base text-[#666]">
                  {ingredients.length} nguyên liệu
                </Text>
              </View>

              <View className="flex-row items-center">
                <TouchableOpacity onPress={handleEdit} className="p-2 ml-2">
                  <Ionicons name="create-outline" size={22} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddNewIngredient}
                  className="p-2 ml-2"
                >
                  <Ionicons name="add-outline" size={24} color="#333" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="flex-1 mb-20">
              {ingredients.map((ingredient) => (
                <View
                  key={ingredient.id}
                  className="flex-row items-center bg-white rounded-lg px-3 py-3 mb-2 shadow-sm"
                >
                  {ingredient.imageUrl ? (
                    <Image
                      source={{ uri: ingredient.imageUrl }}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <View className="w-10 h-10 rounded-full bg-[#f0f0f0] items-center justify-center mr-3">
                      <Ionicons name="leaf-outline" size={20} color="#ccc" />
                    </View>
                  )}
                  <Text className="flex-1 text-base font-medium text-[#333]">
                    {ingredient.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        <TouchableOpacity
          className="absolute bottom-5 left-4 right-4 bg-[#941D23] h-[50px] rounded-full items-center justify-center shadow-md"
          onPress={handleFindRecipe}
        >
          <Text className="text-white text-base font-bold">
            Tìm món ngay 🍜
          </Text>
        </TouchableOpacity>

        {/* Modal hiển thị SuggestDish */}
        <Modal
          visible={showSuggestDish}
          animationType="slide"
          onRequestClose={() => setShowSuggestDish(false)}
        >
          <SafeAreaView className="flex-1 bg-white mt-10 p-2">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-[#941D23]">
                Gợi ý món ăn
              </Text>
              <TouchableOpacity onPress={() => setShowSuggestDish(false)}>
                <Ionicons name="close" size={24} color="#941D23" />
              </TouchableOpacity>
            </View>

            {isLoadingDishes ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#941D23" />
                <Text className="text-lg text-[#941D23] mt-4">
                  Đang tìm kiếm món ăn phù hợp...
                </Text>
              </View>
            ) : (
              <SuggestDish
                dishes={suggestedDishes}
                onDishPress={handleDishPress}
              />
            )}
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ScanIngredientScreen;
