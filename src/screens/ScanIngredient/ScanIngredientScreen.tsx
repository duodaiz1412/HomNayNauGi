import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  ImageBackground,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ScanIngredientRouteProp = RouteProp<RootStackParamList, 'ScanIngredient'>;

interface DetectedIngredient {
  id: string;
  name: string;
  image?: string;
  quantity?: string;
  unit?: string;
}

const UNITS = ['Gram', 'Kg', 'ml', 'Lit', 'Cái'];

const ScanIngredientScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ScanIngredientRouteProp>();
  const { imageUri } = route.params || {};
  const backgroundImage = require('@assets/background.png');
  
  const [isLoading, setIsLoading] = useState(false);
  const [ingredients, setIngredients] = useState<DetectedIngredient[]>([
    {
      id: '1',
      name: 'Phở',
      image:
        'https://cdn.tgdd.vn/Files/2022/01/25/1412805/cach-nau-pho-bo-nam-dinh-chuan-vi-thom-ngon-nhu-hang-quan-202201250230038502.jpg',
      quantity: '200',
      unit: 'Gram',
    },
    {
      id: '2',
      name: 'Thịt bò',
      image:
        'https://cdn.tgdd.vn/Files/2021/08/09/1373325/phan-biet-cac-loai-thit-bo-my-uc-va-thit-bo-viet-nam-202203151512039104.jpg',
      quantity: '3',
      unit: 'Kg',
    },
    {
      id: '3',
      name: 'Nấm',
      image:
        'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2021/12/11/cach-chon-nam-huong-1-1639192987692459809655.jpg',
      quantity: '',
      unit: '',
    },
    {
      id: '4',
      name: 'Rau thơm',
      image:
        'https://cdn.tgdd.vn/Files/2021/08/09/1373350/rau-thom-la-gi-cac-loai-rau-thom-thuong-gap-va-cach-bao-quan-tuoi-lau-202108091555088759.jpg',
      quantity: '',
      unit: '',
    },
  ]);
  
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);
  
  const handleQuantityChange = (id: string, value: string) => {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, quantity: value } : ingredient
      )
    );
  };
  
  const handleUnitChange = (id: string, unit: string) => {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, unit: unit } : ingredient
      )
    );
    setShowUnitPicker(false);
  };
  
  const openUnitPicker = (id: string) => {
    setSelectedIngredientId(id);
    setShowUnitPicker(true);
  };
  
  const handleAddNewIngredient = () => {
    // Chức năng thêm nguyên liệu mới
    Alert.alert(
      'Thông báo',
      'Chức năng thêm nguyên liệu sẽ được phát triển sau'
    );
  };
  
  const handleFindRecipe = () => {
    // Chức năng tìm món ăn từ các nguyên liệu đã chọn
    const ingredientsWithQuantity = ingredients.filter((i) => i.quantity);
    if (ingredientsWithQuantity.length > 0) {
      navigation.navigate('SearchByIngredientScreen', {
        ingredients: ingredientsWithQuantity.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image || '',
        })),
      });
    } else {
      Alert.alert(
        'Thông báo',
        'Vui lòng nhập số lượng cho ít nhất một nguyên liệu'
      );
    }
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
              {ingredient.image ? (
                <Image
                  source={{ uri: ingredient.image }}
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
              <View className="flex-row items-center">
                <TextInput
                  className="bg-white border border-[#ddd] rounded-l px-2 py-1 w-[60px] text-center text-sm"
                  value={ingredient.quantity}
                  onChangeText={(value) =>
                    handleQuantityChange(ingredient.id, value)
                  }
                  placeholder="Nhập"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                <TouchableOpacity 
                  onPress={() => openUnitPicker(ingredient.id)}
                  className="bg-white border border-[#ddd] border-l-0 rounded-r px-2 py-1 min-w-[70px] flex-row items-center justify-between"
                >
                  <Text className="text-sm text-[#333] flex-1 text-center">
                    {ingredient.unit || 'Đơn vị'}
                  </Text>
                  <Ionicons name="chevron-down-outline" size={14} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        
        <View className="absolute bottom-[90px] self-center">
          <TouchableOpacity 
            className="bg-white w-[50px] h-[50px] rounded-full items-center justify-center shadow-md"
            onPress={handleAddNewIngredient}
          >
            <Ionicons name="add" size={30} color="#444" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          className="absolute bottom-5 left-4 right-4 bg-[#941D23] h-[50px] rounded-full items-center justify-center shadow-md"
          onPress={handleFindRecipe}
        >
          <Text className="text-white text-base font-bold">
            Tìm món ngay 🍜
          </Text>
        </TouchableOpacity>

        {/* Unit Picker Modal */}
        <Modal
          visible={showUnitPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowUnitPicker(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowUnitPicker(false)}
            className="flex-1 justify-center items-center bg-black/30"
          >
            <View className="bg-white w-[250px] rounded-lg overflow-hidden">
              <View className="border-b border-gray-200 py-2 px-4">
                <Text className="text-center font-medium text-base">Đơn vị</Text>
              </View>
              <FlatList
                data={UNITS}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="py-3 px-4 border-b border-gray-100"
                    onPress={() => selectedIngredientId && handleUnitChange(selectedIngredientId, item)}
                  >
                    <Text className="text-center">{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

      </SafeAreaView>
    </ImageBackground>
  );
};

export default ScanIngredientScreen;
