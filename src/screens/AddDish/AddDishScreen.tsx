import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRecipeForm } from '@hooks/RecipeForm';
import { RecipeStatus, UnitOfMeasure } from 'src/types';
import api from 'src/api/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/AppNavigator';

// Add YouTube URL validation function
const isValidYouTubeUrl = (url) => {
  if (!url) return true; // Empty URL is considered valid (optional field)

  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|shorts\/|v\/|)([a-zA-Z0-9_-]{11})$/;
  return youtubeRegex.test(url);
};
const statusOptions = [
  { label: 'Nháp', value: RecipeStatus.DRAFT },
  { label: 'Riêng tư', value: RecipeStatus.PRIVATE },
  { label: 'Công khai', value: RecipeStatus.PUBLIC },
];
const AddDishScreen = () => {

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    form,
    isLoading,
    error,
    updateBasicInfo,
    updateCategories,
    updateIngredients,
    updateSteps,
    resetForm,
    handleSaveForUser,
  } = useRecipeForm();

  const {
    basicInfo,
    categories,
    ingredients: selectedIngredients,
    steps,
  } = form;

  // Local states to manage UI
  const [unitsOfMeasure, setUnitsOfMeasure] = useState<UnitOfMeasure[]>([]);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [errorUnits, setErrorUnits] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUnitModal, setSelectedUnitModal] = useState<{
    visible: boolean;
    ingredientIndex: number;
  }>({
    visible: false,
    ingredientIndex: -1,
  });
  // Fetch units of measure
  useEffect(() => {
    const fetchUnitsOfMeasure = async () => {
      setIsLoadingUnits(true);
      setErrorUnits(null);
      try {
        const response = await api.get('/unit-of-measure/all');
        setUnitsOfMeasure(response.data);
      } catch (e: any) {
        setErrorUnits(e.message || 'An unknown error occurred');
        Alert.alert('Lỗi', 'Không thể tải danh sách đơn vị đo lường.');
      } finally {
        setIsLoadingUnits(false);
      }
    };

    fetchUnitsOfMeasure();
  }, []);

  useEffect(() => {
    // Initialize form with default values
    updateBasicInfo({
      name: '',
      description: '',
      status: RecipeStatus.DRAFT,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      preparationTimeMinutes: 0,
    });

    // Initialize steps with one empty step
    updateSteps([
      {
        id: 1,
        recipeId: '',
        stepOrder: 1,
        instruction: '',
        imageUrl: null,
      },
    ]);
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      updateBasicInfo({ imageUrl: result.assets[0].uri });
    }
  };

  const pickStepImage = async (idx) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const newSteps = [...steps];
      newSteps[idx].imageUrl = result.assets[0].uri;
      updateSteps(newSteps);
    }
  };

  const handleAddStep = () => {
    const newId =
      steps.length > 0 ? Math.max(...steps.map((s) => s.id)) + 1 : 1;
    updateSteps([
      ...steps,
      {
        id: newId,
        recipeId: '',
        stepOrder: steps.length + 1,
        instruction: '',
        imageUrl: null,
      },
    ]);
  };

  const handleRemoveStep = (idx) => {
    if (steps.length === 1) return;
    updateSteps(steps.filter((_, i) => i !== idx));
  };

  const handleStepChange = (idx, value) => {
    const newSteps = [...steps];
    newSteps[idx].instruction = value;
    updateSteps(newSteps);
  };

  const handleAddIngredient = () => {
    navigation.navigate('IngredientSelectScreen');
  };

  const handleRemoveIngredient = (idx) => {
    if (selectedIngredients.length === 1) return;
    const newIngredients = [...selectedIngredients];
    newIngredients.splice(idx, 1);
    updateIngredients(newIngredients);
  };

  const handleIngredientChange = (idx, field, value) => {
    const newIngredients = [...selectedIngredients];

    if (field === 'amount') {
      newIngredients[idx].quantity = parseFloat(value) || 0;
    } else if (field === 'unit') {
      newIngredients[idx].unitId = value;
    }

    updateIngredients(newIngredients);
  };

  const navigateToChooseCategory = () => {
    navigation.navigate('CategorySelectScreen');
  };

  const handleSaveRecipe = async () => {
    // Cập nhật dinh dưỡng trước khi kiểm tra
    updateBasicInfo({
      calories: parseInt(nutrition.kcal) || 0,
      carbohydrates: parseFloat(nutrition.carb) || 0,
      protein: parseFloat(nutrition.protein) || 0,
      fat: parseFloat(nutrition.fat) || 0,
      videoUrl: video,
    });


    try {
      setIsSubmitting(true);
      // Sử dụng handleSaveForUser để lưu công thức (dành cho người dùng thường)
      const savedRecipe = await handleSaveForUser();

      if (savedRecipe) {
        Alert.alert('Thành công', 'Đã thêm món ăn mới!', [
          {
            text: 'OK',
            onPress: () => {
              navigation?.goBack?.();
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể lưu món ăn');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Maintain local nutrition state for UI
  const [nutrition, setNutrition] = useState({
    carb: '',
    protein: '',
    kcal: '',
    fat: '',
  });

  const [video, setVideo] = useState('');

  const backgroundImage = require('@assets/background.png');

  // Get unit name helper function
  const getUnitName = (unitId) => {
    const unit = unitsOfMeasure.find((u) => u.id === unitId);
    if (!unit) return '';
    return unit.symbol ? `${unit.unitName} (${unit.symbol})` : unit.unitName;
  };

  if (isLoading && !basicInfo.name) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#941D23" />
        <Text className="mt-2 text-gray-600 text-lg">Đang tải...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 py-5 ">
      <ImageBackground
        source={backgroundImage}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {isSubmitting && (
          <View className="absolute z-50 h-full w-full bg-black/70 items-center justify-center">
            <View className="bg-white p-5 rounded-2xl items-center justify-center">
              <ActivityIndicator size="large" color="#941D23" />
              <Text className="mt-3 text-base font-medium">
                Đang lưu món ăn...
              </Text>
            </View>
          </View>
        )}

        <View className="flex-row items-center p-4 pt-8 mb-2">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-red-800 mx-auto">
            Thêm Món ăn
          </Text>
        </View>

        <ScrollView className="flex-1">
          <View className="p-6">
            {/* Ảnh món ăn */}
            <TouchableOpacity onPress={pickImage} className="items-center mb-6">
              {basicInfo.imageUrl ? (
                <View className="relative">
                  <Image
                    source={{ uri: basicInfo.imageUrl }}
                    className="w-48 h-48 rounded-2xl"
                  />
                  <View className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md">
                    <Ionicons name="camera" size={24} color="#4B5563" />
                  </View>
                </View>
              ) : (
                <View className="w-48 h-48 bg-gray-100 rounded-2xl items-center justify-center border-2 border-dashed border-gray-300">
                  <Ionicons name="camera-outline" size={44} color="#9CA3AF" />
                  <Text className="text-gray-500 text-base mt-2">
                    Chọn ảnh món ăn
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tên món ăn */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-700 mb-2">
                Tên món ăn <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-lg"
                value={basicInfo.name}
                onChangeText={(value) => updateBasicInfo({ name: value })}
                placeholder="Nhập tên món ăn"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Tiêu đề */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-700 mb-2">
                Tiêu đề
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-lg"
                value={basicInfo.description}
                onChangeText={(value) =>
                  updateBasicInfo({ description: value })
                }
                placeholder="Nhập tiêu đề món ăn"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Danh mục */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-700 mb-2">
                Danh mục <Text className="text-red-500">*</Text>
              </Text>
              <TouchableOpacity
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
                onPress={navigateToChooseCategory}
              >
                {categories && categories.length > 0 ? (
                  <View className="flex-1">
                    <Text className="text-gray-800 text-lg mb-2">
                      Đã chọn {categories.length} danh mục
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {categories.map((category) => (
                        <View key={category.id} className="mr-2 items-center">
                          <View className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 mb-1">
                            {category.imageUrl ? (
                              <Image
                                source={{ uri: category.imageUrl }}
                                className="w-full h-full"
                                resizeMode="cover"
                              />
                            ) : (
                              <View className="w-full h-full bg-gray-200 items-center justify-center">
                                <Ionicons
                                  name="restaurant-outline"
                                  size={24}
                                  color="#9CA3AF"
                                />
                              </View>
                            )}
                          </View>
                          <Text
                            className="text-sm text-gray-600"
                            numberOfLines={1}
                          >
                            {category.name}
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                ) : (
                  <Text className="text-gray-400 text-lg">Chọn danh mục</Text>
                )}
                <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Thời gian chuẩn bị */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-700 mb-2">
                Thời gian chuẩn bị (phút)
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-lg"
                value={basicInfo.preparationTimeMinutes?.toString() || ''}
                onChangeText={(value) =>
                  updateBasicInfo({
                    preparationTimeMinutes: Number.parseInt(value) || 0,
                  })
                }
                placeholder="Nhập thời gian chuẩn bị (phút)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>

            {/* Video thực hiện */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-700 mb-2">
                Link video YouTube
              </Text>
              <TextInput
                className={`border ${!isValidYouTubeUrl(video) ? 'border-red-500' : video ? 'border-green-500' : 'border-gray-300'} bg-gray-50 border rounded-xl px-4 py-3 text-gray-800 text-lg`}
                value={video}
                onChangeText={setVideo}
                placeholder="Dán link YouTube hướng dẫn nấu món này"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {video && !isValidYouTubeUrl(video) && (
                <Text className="text-red-500 text-xs mt-1">
                  URL không hợp lệ. Vui lòng nhập URL YouTube hợp lệ.
                </Text>
              )}
              {video && isValidYouTubeUrl(video) && (
                <Text className="text-green-500 text-xs mt-1">
                  URL YouTube hợp lệ.
                </Text>
              )}
            </View>
            {/*Trạng thái */}
            <View className="space-y-2">
              <Text className="text-gray-800 text-base font-semibold">
                Trạng thái
              </Text>

              <View className="self-start rounded-full p-1 flex-row shadow-sm mt-2">
                {statusOptions.map(({ label, value }) => {
                  const isActive = basicInfo.status === value;
                  return (
                    <TouchableOpacity
                      key={value}
                      onPress={() => updateBasicInfo({ status: value })}
                      className={`px-4 py-1.5 rounded-full mx-0.5
            ${isActive ? 'bg-[#941D23]' : 'bg-white'}
          `}
                    >
                      <Text
                        className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-600'}`}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            {/* Nguyên liệu */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold text-gray-700">
                  Nguyên liệu <Text className="text-red-500">*</Text>
                </Text>
                <TouchableOpacity
                  className="bg-red-800 px-4 py-1.5 rounded-full"
                  onPress={handleAddIngredient}
                >
                  <Text className="text-white text-base font-medium">
                    + Thêm
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedIngredients.length === 0 ? (
                <View className="border border-dashed border-gray-300 rounded-xl p-6 items-center justify-center">
                  <Text className="text-gray-500 text-base mt-2">
                    Chưa có nguyên liệu
                  </Text>
                </View>
              ) : (
                selectedIngredients.map((ingredient, idx) => (
                  <View
                    key={idx}
                    className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="font-semibold text-gray-700 text-lg">
                        Nguyên liệu {idx + 1}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveIngredient(idx)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={26}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center gap-4 mb-2">
                      <View className="w-[96px] h-[96px] rounded-xl bg-gray-200 items-center justify-center">
                        {ingredient.ingredient?.imageUrl ? (
                          <Image
                            source={{ uri: ingredient.ingredient.imageUrl }}
                            className="w-full h-full rounded-xl"
                          />
                        ) : (
                          <Ionicons
                            name="camera-outline"
                            size={28}
                            color="#9CA3AF"
                          />
                        )}
                      </View>
                      <View className="flex-col w-2/3 items-center mb-2">
                        <View className="bg-white border border-gray-200 rounded-xl h-[46px] px-4 py-2 text-gray-800 mb-2 flex-row items-center w-full">
                          <Text className="flex-1 text-gray-800 text-base">
                            {ingredient.ingredient?.name || 'Chọn nguyên liệu'}
                          </Text>
                        </View>
                        <View className="flex-row gap-2">
                          <TextInput
                            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-800 text-base"
                            value={
                              ingredient.quantity
                                ? String(ingredient.quantity)
                                : ''
                            }
                            onChangeText={(v) =>
                              handleIngredientChange(idx, 'amount', v)
                            }
                            placeholder="Số lượng"
                            keyboardType="numeric"
                          />
                          <View className="w-32 h-full bg-white border border-gray-200 rounded-xl">
                            <TouchableOpacity
                              onPress={() => setSelectedUnitModal({
                                visible: true,
                                ingredientIndex: idx
                              })}
                              className="h-[46px] px-4 flex-row items-center justify-between"
                            >
                              <Text className="text-gray-800 text-base">
                                {ingredient.unitId
                                  ? getUnitName(ingredient.unitId)
                                  : 'Đơn vị'}
                              </Text>
                              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>

            <View className="mb-4 flex flex-col gap-2">
              <Text className="text-lg font-semibold text-gray-700 mb-2">
                Dinh dưỡng (trên 1 khẩu phần)
              </Text>
              <View className="flex flex-row flex-wrap justify-between gap-y-3 ">
                {/* Tinh bột */}
                <View className="w-[48%] flex flex-row items-center mb-2 bg-white rounded-lg py-2">
                  <View className="rounded-xl p-3 mr-2">
                    <MaterialCommunityIcons
                      name="grain"
                      size={28}
                      color="#222"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-700 text-base">
                      Tinh bột
                    </Text>
                    <View className="flex flex-row items-end gap-1 mt-1">
                      <TextInput
                        className="text-gray-800 text-lg p-0 m-0"
                        value={nutrition.carb}
                        onChangeText={(v) => {
                          setNutrition({ ...nutrition, carb: v });
                        }}
                        maxLength={40}
                        placeholder="0"
                        keyboardType="numeric"
                        inputMode="numeric"
                        style={{ minWidth: 40 }}
                      />
                      <Text className="text-sm text-gray-400 mb-0.5">gr</Text>
                    </View>
                  </View>
                </View>
                {/* Chất đạm */}
                <View className="w-[48%] flex flex-row items-center mb-2 bg-white rounded-lg py-2">
                  <View className="rounded-xl p-3 mr-3">
                    <MaterialCommunityIcons
                      name="food-steak"
                      size={28}
                      color="#222"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-700 text-base">
                      Chất đạm
                    </Text>
                    <View className="flex flex-row items-end gap-1 mt-1">
                      <TextInput
                        className="text-gray-800 text-lg p-0 m-0"
                        value={nutrition.protein}
                        onChangeText={(v) => {
                          setNutrition({ ...nutrition, protein: v });
                        }}
                        placeholder="0"
                        keyboardType="numeric"
                        inputMode="numeric"
                        maxLength={40}
                        style={{ minWidth: 40 }}
                      />
                      <Text className="text-sm text-gray-400 mb-0.5">gr</Text>
                    </View>
                  </View>
                </View>
                {/* Kcal */}
                <View className="w-[48%] flex flex-row items-center bg-white rounded-lg py-2 mb-2">
                  <View className="rounded-xl p-3 mr-3">
                    <MaterialCommunityIcons
                      name="fire"
                      size={28}
                      color="#222"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-700 text-base">
                      Kcal
                    </Text>
                    <View className="flex flex-row items-end gap-1 mt-1">
                      <TextInput
                        className="text-gray-800 text-lg p-0 m-0"
                        value={nutrition.kcal}
                        onChangeText={(v) => {
                          setNutrition({ ...nutrition, kcal: v });
                        }}
                        placeholder="0"
                        keyboardType="numeric"
                        inputMode="numeric"
                        maxLength={40}
                        style={{ minWidth: 40 }}
                      />
                      <Text className="text-sm text-gray-400 mb-0.5">Calo</Text>
                    </View>
                  </View>
                </View>
                {/* Chất béo */}
                <View className="w-[48%] flex flex-row items-center bg-white rounded-lg py-2 mb-2">
                  <View className="rounded-xl p-3 mr-3">
                    <MaterialCommunityIcons
                      name="water"
                      size={28}
                      color="#222"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-700 text-base">
                      Chất béo
                    </Text>
                    <View className="flex flex-row items-end gap-1 mt-1">
                      <TextInput
                        className="text-gray-800 text-lg p-0 m-0"
                        value={nutrition.fat}
                        onChangeText={(v) => {
                          setNutrition({ ...nutrition, fat: v });
                        }}
                        placeholder="0"
                        keyboardType="numeric"
                        inputMode="numeric"
                        maxLength={40}
                        style={{ minWidth: 40 }}
                      />
                      <Text className="text-sm text-gray-400 mb-0.5">gr</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Bước thực hiện */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold text-gray-700">
                  Bước thực hiện <Text className="text-red-500">*</Text>
                </Text>
                <TouchableOpacity
                  className="bg-red-800 px-4 py-1.5 rounded-full"
                  onPress={handleAddStep}
                >
                  <Text className="text-white text-base font-medium">
                    + Thêm
                  </Text>
                </TouchableOpacity>
              </View>

              {steps.map((step, idx) => (
                <View
                  key={idx}
                  className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <Text className="mb-2 font-semibold text-gray-700 text-lg">
                    Bước {idx + 1}
                  </Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-800 text-lg mb-2"
                    value={step.instruction}
                    onChangeText={(v) => handleStepChange(idx, v)}
                    placeholder={`Mô tả bước ${idx + 1}`}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={() => pickStepImage(idx)}
                    className="mb-2 items-center"
                  >
                    {step.imageUrl ? (
                      <Image
                        source={{ uri: step.imageUrl }}
                        className="w-32 h-32 rounded-xl"
                      />
                    ) : (
                      <View className="w-32 h-32 bg-white rounded-xl items-center justify-center border-2 border-dashed border-gray-300">
                        <Ionicons
                          name="camera-outline"
                          size={32}
                          color="#9CA3AF"
                        />
                        <Text className="text-gray-500 text-base mt-1">
                          Ảnh minh họa
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleRemoveStep(idx)}
                    className="items-end"
                  >
                    <Ionicons name="trash-outline" size={26} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Error message */}
            {error && (
              <Text className="text-red-500 text-center text-base mb-2">
                {error}
              </Text>
            )}

            {/* Nút lưu */}
            <TouchableOpacity
              onPress={handleSaveRecipe}
              className="bg-red-800 py-4 rounded-xl mt-2"
              disabled={isSubmitting}
            >
              <Text className="text-white text-center font-bold text-xl">
                {isSubmitting ? 'Đang xử lý...' : 'Hoàn thành'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal chọn đơn vị */}
        <Modal
          visible={selectedUnitModal.visible}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedUnitModal({ visible: false, ingredientIndex: -1 })}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl">
              <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
                <Text className="text-lg font-semibold text-gray-800">Chọn đơn vị</Text>
                <TouchableOpacity
                  onPress={() => setSelectedUnitModal({ visible: false, ingredientIndex: -1 })}
                >
                  <Ionicons name="close" size={24} color="#4B5563" />
                </TouchableOpacity>
              </View>
              <ScrollView className="max-h-[60vh]">
                {unitsOfMeasure.map((unit) => (
                  <TouchableOpacity
                    key={unit.id}
                    onPress={() => {
                      handleIngredientChange(
                        selectedUnitModal.ingredientIndex,
                        'unit',
                        unit.id
                      );
                      setSelectedUnitModal({ visible: false, ingredientIndex: -1 });
                    }}
                    className="p-4 border-b border-gray-100"
                  >
                    <Text className="text-gray-800 text-base">
                      {unit.symbol
                        ? `${unit.unitName} (${unit.symbol})`
                        : unit.unitName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AddDishScreen;
