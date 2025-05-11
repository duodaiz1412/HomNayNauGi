'use client';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AdminFoodStackParamList } from '@navigation/AdminFoodStack';
import { useRecipeForm } from '@hooks/RecipeForm';
import { RecipeStatus } from 'src/types';
import { useFoodManagement } from 'src/context/FoodManagementContext';

export const AddFoodScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminFoodStackParamList>>();
  const {
    form,
    isLoading,
    error,
    updateBasicInfo,
    updateCategories,
    updateIngredients,
    updateSteps,
    handleSave,
    handlePublic,
  } = useRecipeForm();

  // Destructure form data
  const {
    basicInfo,
    categories,
    ingredients: selectedIngredients,
    steps,
  } = form;

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
        recipeId: '',
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

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (
      !basicInfo.name ||
      !basicInfo.description ||
      !categories ||
      categories.length === 0 ||
      !basicInfo.imageUrl ||
      !basicInfo.preparationTimeMinutes ||
      !basicInfo.videoUrl
    ) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin món ăn');
      return;
    }

    if (
      !basicInfo.protein ||
      !basicInfo.fat ||
      !basicInfo.carbohydrates ||
      !basicInfo.calories
    ) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin dinh dưỡng');
      return;
    }

    if (selectedIngredients.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng thêm ít nhất một nguyên liệu');
      return;
    }

    const hasEmptyIngredient = selectedIngredients.some((ing) => !ing.quantity);
    if (hasEmptyIngredient) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ số lượng cho các nguyên liệu');
      return;
    }

    const hasEmptyStep = steps.some((step) => !step.instruction);
    if (hasEmptyStep) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin các bước nấu ăn');
      return;
    }

    // Submit form
    try {
      const savedRecipe = await handleSave();
      if (savedRecipe) {
        Alert.alert('Thành công', 'Đã thêm món ăn mới', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể lưu món ăn. Vui lòng thử lại sau.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminHeader title="Thêm món ăn" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4 py-4">
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
            {/* Thêm trường Thời gian chuẩn bị (phút) */}
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

            {/* Thêm trường URL video hướng dẫn */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-1">URL video hướng dẫn</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nhập URL video hướng dẫn"
                value={basicInfo.videoUrl || ''}
                onChangeText={(value) => updateBasicInfo({ videoUrl: value })}
              />
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Hiển thị món ăn</Text>
              <Switch
                value={basicInfo.status === 'public'}
                onValueChange={(value) =>
                  updateBasicInfo({
                    status: value
                      ? RecipeStatus.PUBLIC
                      : RecipeStatus.PRIVATE,
                  })
                }
                trackColor={{ false: '#D1D1D6', true: '#E57373' }}
                thumbColor={
                  basicInfo.status === 'public' ? '#941D23' : '#F4F3F4'
                }
              />
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

                  <View className="flex-row">
                    <View className="flex-1 mr-2">
                      <Text className="text-gray-700 mb-1">Số lượng *</Text>
                      <TextInput
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Nhập số lượng"
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
                    <View className="flex-1">
                      <Text className="text-gray-700 mb-1">Đơn vị *</Text>
                      <TextInput
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Nhập đơn vị"
                        onChangeText={(value) =>
                          updateIngredient(
                            ingredient.ingredientId,
                            'unit',
                            value
                          )
                        }
                      />
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
          <View className="flex-row space-x-2 mb-6">
            <TouchableOpacity
              className={`flex-1 bg-gray-500 py-3 rounded-lg items-center ${isLoading ? 'opacity-70' : ''}`}
              onPress={async () => {
                updateBasicInfo({ status: RecipeStatus.DRAFT });
                console.log('===== Lưu nháp =====');
                console.log('Basic Info:', basicInfo);
                console.log('Categories:', categories);
                console.log('Ingredients:', selectedIngredients);
                console.log('Steps:', steps);
                await handleSave();
              }}
              disabled={isLoading}
            >
              <Text className="text-white font-bold">Lưu nháp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 bg-[#941D23] py-3 rounded-lg items-center ${isLoading ? 'opacity-70' : ''}`}
              onPress={async () => {
                console.log('===== Gửi lên server =====');
                console.log('Basic Info:', basicInfo);
                console.log('Categories:', categories);
                console.log('Ingredients:', selectedIngredients);
                console.log('Steps:', steps);
                await handleSave();
              }}
              disabled={isLoading}
            >
              <Text className="text-white font-bold">
                {isLoading ? 'Đang xử lý...' : 'Thêm món ăn'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
