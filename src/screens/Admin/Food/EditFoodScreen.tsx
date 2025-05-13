import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AdminFoodStackParamList } from '@navigation/AdminFoodStack';
import { useRecipeForm } from '@hooks/RecipeForm';
import { RecipeStatus, UnitOfMeasure } from 'src/types';
import { useEffect, useState } from 'react';
import api from 'src/api/api';
import { Picker } from '@react-native-picker/picker';

const statusOptions = [
  { label: 'Nháp', value: RecipeStatus.DRAFT },
  { label: 'Riêng tư', value: RecipeStatus.PRIVATE },
  { label: 'Công khai', value: RecipeStatus.PUBLIC },
];
type EditFoodScreenRouteProp = RouteProp<
  AdminFoodStackParamList,
  'EditFoodScreen'
>;
export const EditFoodScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminFoodStackParamList>>();
  const route = useRoute<EditFoodScreenRouteProp>();
  const { foodId } = route.params as { foodId: string };

  const {
    form,
    isLoading,
    error,
    updateBasicInfo,
    updateCategories,
    updateIngredients,
    updateSteps,
    resetForm,
    handleSave,
    handlePublic,
  } = useRecipeForm({ recipeId: foodId });

  const [unitsOfMeasure, setUnitsOfMeasure] = useState<UnitOfMeasure[]>([]);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [errorUnits, setErrorUnits] = useState<string | null>(null);

  // Destructure form data
  const {
    basicInfo,
    categories,
    ingredients: selectedIngredients,
    steps,
  } = form;

  // Fetch danh sách đơn vị đo lường khi component được mount
  useEffect(() => {
    const fetchUnitsOfMeasure = async () => {
      setIsLoadingUnits(true);
      setErrorUnits(null);
      try {
        const response = await api.get('/admin/unit-of-measure/all');
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

  // Pick image from gallery
  const pickImage = async (type, stepId = null) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === 'food') {
        updateBasicInfo({ imageUrl: result.assets[0].uri });
      } else if (type === 'step' && stepId) {
        const updatedSteps = steps.map((step) =>
          step.id === stepId
            ? { ...step, imageUrl: result.assets[0].uri }
            : step
        );
        updateSteps(updatedSteps);
      }
    }
  };

  // Add new step
  const addStep = () => {
    const newId =
      steps.length > 0
        ? Number.parseInt(steps[steps.length - 1].id.toString()) + 1
        : 1;

    updateSteps([
      ...steps,
      {
        id: newId,
        recipeId: foodId,
        stepOrder: steps.length + 1,
        instruction: '',
        imageUrl: null,
      },
    ]);
  };

  // Remove step
  const removeStep = (id) => {
    if (steps.length > 1) {
      updateSteps(steps.filter((item) => item.id !== id));
    } else {
      Alert.alert('Thông báo', 'Phải có ít nhất một bước');
    }
  };

  // Update step
  const updateStep = (id, field, value) => {
    updateSteps(
      steps.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Remove ingredient
  const removeIngredient = (id) => {
    updateIngredients(
      selectedIngredients.filter((item) => item.ingredientId !== id)
    );
  };

  // Update ingredient
  const updateIngredient = (id, field, value) => {
    updateIngredients(
      selectedIngredients.map((item) =>
        item.ingredientId === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const savedRecipe = await handleSave();
      if (savedRecipe) {
        Alert.alert('Thành công', 'Đã cập nhật món ăn!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('AdminFoodManagementScreen')
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật món ăn');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminHeader title="Chỉnh sửa món ăn" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >{isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#941D23" />
            <Text className="mt-2 text-gray-600">Đang tải thông tin...</Text>
          </View>
        ) :(        <ScrollView className="flex-1 px-4 py-4">
          {/* Basic Information */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold mb-4">Thông tin cơ bản</Text>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Tên món ăn *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập tên món ăn"
                value={basicInfo.name}
                onChangeText={(value) => updateBasicInfo({ name: value })}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Mô tả *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập mô tả món ăn"
                value={basicInfo.description}
                onChangeText={(value) =>
                  updateBasicInfo({ description: value })
                }
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Danh mục *</Text>
              <TouchableOpacity
                className="border border-gray-300 rounded-lg px-3 py-3 flex-row justify-between items-center"
                onPress={() => navigation.navigate('CategorySelectScreen')}
              >
                {categories && categories.length > 0 ? (
                  <Text className="text-gray-700">
                    {categories.map((cat) => cat.name).join(', ')}
                  </Text>
                ) : (
                  <Text className="text-gray-400">Chọn danh mục</Text>
                )}
                <Ionicons name="chevron-forward" size={20} color="#454442" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">Hình ảnh món ăn *</Text>
              <TouchableOpacity
                className="border border-dashed border-gray-300 rounded-lg p-4 items-center justify-center"
                onPress={() => pickImage('food')}
              >
                {basicInfo.imageUrl ? (
                  <Image
                    source={{ uri: basicInfo.imageUrl }}
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="items-center">
                    <Ionicons name="image-outline" size={48} color="#454442" />
                    <Text className="text-gray-500 mt-2">Chọn hình ảnh</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">
                Thời gian chuẩn bị (phút)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập thời gian chuẩn bị (phút)"
                value={basicInfo.preparationTimeMinutes?.toString() || ''}
                onChangeText={(value) =>
                  updateBasicInfo({
                    preparationTimeMinutes: Number.parseInt(value) || 0,
                  })
                }
                keyboardType="numeric"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-1">URL video hướng dẫn</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập URL video hướng dẫn"
                value={basicInfo.videoUrl || ''}
                onChangeText={(value) => updateBasicInfo({ videoUrl: value })}
              />
            </View>

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
            ${isActive ? 'bg-red-500' : 'bg-white'}
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
          </View>

          {/* Nutrition Information */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <Text className="text-lg font-bold mb-4">Thông tin dinh dưỡng</Text>

            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 mb-1">Tinh bột (g) *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Nhập lượng tinh bột"
                  value={basicInfo.carbohydrates?.toString()}
                  onChangeText={(value) =>
                    updateBasicInfo({
                      carbohydrates: Number.parseFloat(value) || 0,
                    })
                  }
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 mb-1">Chất đạm (g) *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Nhập lượng chất đạm"
                  value={basicInfo.protein?.toString()}
                  onChangeText={(value) =>
                    updateBasicInfo({ protein: Number.parseFloat(value) || 0 })
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-gray-700 mb-1">Calo (kcal) *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Nhập lượng calo"
                  value={basicInfo.calories?.toString()}
                  onChangeText={(value) =>
                    updateBasicInfo({ calories: Number.parseInt(value) || 0 })
                  }
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 mb-1">Chất béo *</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Nhập lượng chất béo"
                  value={basicInfo.fat?.toString()}
                  onChangeText={(value) =>
                    updateBasicInfo({ fat: Number.parseFloat(value) || 0 })
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Ingredients */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Nguyên liệu</Text>
              <TouchableOpacity
                className="bg-[#941D23] px-3 py-1 rounded-full"
                onPress={() => navigation.navigate('IngredientSelectScreen')}
              >
                <Text className="text-white">+ Thêm</Text>
              </TouchableOpacity>
            </View>

            {selectedIngredients.length === 0 ? (
              <View className="border border-dashed border-gray-300 rounded-lg p-6 items-center justify-center">
                <Text className="text-gray-500 mt-2">Chưa có nguyên liệu</Text>
              </View>
            ) : (
              selectedIngredients.map((ingredient, index) => (
                <View
                  key={ingredient.ingredientId}
                  className="mb-4 pb-4 border-b border-gray-100"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-medium">Nguyên liệu {index + 1}</Text>
                    <TouchableOpacity
                      onPress={() => removeIngredient(ingredient.ingredientId)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#FF3B30"
                      />
                    </TouchableOpacity>
                  </View>

                  <View className="mb-2">
                    <Text className="text-gray-700 mb-1">
                      Tên nguyên liệu *
                    </Text>
                    <View className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                      <Text>{ingredient.ingredient?.name}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-start">
                    {/* Số lượng */}
                    <View style={{ width: 80 }} className="mr-2">
                      <Text className="text-gray-700 mb-1">Số lượng *</Text>
                      <TextInput
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Nhập số lượng"
                        value={
                          ingredient.quantity != null
                            ? Number(ingredient.quantity) % 1 === 0
                              ? String(Number(ingredient.quantity))
                              : String(ingredient.quantity)
                            : ''
                        }
                        onChangeText={(value) =>
                          updateIngredient(
                            ingredient.ingredientId,
                            'quantity',
                            Number.parseFloat(value) || 0
                          )
                        }
                        keyboardType="numeric"
                      />
                    </View>

                    {/* Đơn vị */}
                    <View className="flex-1 ml-2">
                      <Text className="text-gray-700 mb-1">Đơn vị *</Text>
                      {isLoadingUnits ? (
                        <ActivityIndicator
                          size="small"
                          color="#941D23"
                          className="mt-2"
                        />
                      ) : errorUnits ? (
                        <Text className="text-red-500 text-xs mt-1">
                          Lỗi tải đơn vị
                        </Text>
                      ) : (
                        <View
                          className="border border-gray-300 rounded-lg px-2"
                          style={{ height: 44, justifyContent: 'center' }}
                        >
                          <Picker
                            selectedValue={ingredient.unitId}
                            onValueChange={(itemValue) => {
                              if (
                                itemValue !== null &&
                                itemValue !== undefined
                              ) {
                                updateIngredient(
                                  ingredient.ingredientId,
                                  'unitId',
                                  itemValue
                                );
                              }
                            }}
                            style={{
                              height: 50,
                              fontSize: 16,
                            }}
                            dropdownIconColor="#000"
                          >
                            <Picker.Item
                              label="-- Chọn đơn vị --"
                              value={null}
                              style={{ color: '#9CA3AF' }}
                            />
                            {unitsOfMeasure.map((unit) => (
                              <Picker.Item
                                key={unit.id}
                                label={
                                  unit.symbol
                                    ? `${unit.unitName} (${unit.symbol})`
                                    : unit.unitName
                                }
                                value={unit.id}
                              />
                            ))}
                          </Picker>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Cooking Steps */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Các bước nấu ăn</Text>
              <TouchableOpacity
                className="bg-[#941D23] px-3 py-1 rounded-full"
                onPress={addStep}
              >
                <Text className="text-white">+ Thêm</Text>
              </TouchableOpacity>
            </View>

            {steps.map((step, index) => (
              <View
                key={step.id}
                className="mb-4 pb-4 border-b border-gray-100"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-medium">Bước {index + 1}</Text>
                  {steps.length > 1 && (
                    <TouchableOpacity onPress={() => removeStep(step.id)}>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#FF3B30"
                      />
                    </TouchableOpacity>
                  )}
                </View>

                <View className="mb-2">
                  <Text className="text-gray-700 mb-1">Mô tả *</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Nhập mô tả bước nấu ăn"
                    value={step.instruction}
                    onChangeText={(value) =>
                      updateStep(step.id, 'instruction', value)
                    }
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 mb-1">Hình ảnh minh họa</Text>
                  <TouchableOpacity
                    className="border border-dashed border-gray-300 rounded-lg p-4 items-center justify-center"
                    onPress={() => pickImage('step', step.id)}
                  >
                    {step.imageUrl ? (
                      <Image
                        source={{ uri: step.imageUrl }}
                        className="w-full h-40 rounded-lg"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="items-center">
                        <Ionicons
                          name="image-outline"
                          size={36}
                          color="#454442"
                        />
                        <Text className="text-gray-500 mt-2">
                          Chọn hình ảnh
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Submit Button */}
          <View className="mb-6">
            {error && (
              <Text className="text-red-500 mb-2 text-center text-xl">
                {error}
              </Text>
            )}

            <View className="flex-row space-x-2">
              <TouchableOpacity
                className={`flex-1 bg-[#941D23] py-3 rounded-lg items-center ${isLoading ? 'opacity-70' : ''}`}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text className="text-white font-bold">
                  {isLoading ? 'Đang xử lý...' : 'Cập nhật món ăn'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>)
      }
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
