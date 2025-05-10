import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const dishTypes = [
  'Món chính',
  'Món phụ',
  'Tráng miệng',
  'Ăn vặt',
  'Nước uống',
  'Khác',
];

const AddDishScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState(dishTypes[0]);
  const [image, setImage] = useState(null);
  const units = ['Gram', 'Kg', 'ml', 'Lít', 'Cái'];
  const [nutrition, setNutrition] = useState({
    carb: '',
    protein: '',
    kcal: '',
    fat: '',
  });
  const [steps, setSteps] = useState([{ description: '', image: null }]);
  const [video, setVideo] = useState('');
  const [ingredients, setIngredients] = useState([
    { id: '', name: '', amount: '', unit: '', image: '' },
  ]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickStepImage = async (idx) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const newSteps = [...steps];
      newSteps[idx].image = result.assets[0].uri;
      setSteps(newSteps);
    }
  };

  const handleAddStep = () => {
    setSteps([...steps, { description: '', image: null }]);
  };

  const handleRemoveStep = (idx) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const handleStepChange = (idx, value) => {
    const newSteps = [...steps];
    newSteps[idx].description = value;
    setSteps(newSteps);
  };

  const handleAddIngredient = () => {
    navigation.navigate('AddIngredient', {
      isMultiSelect: false,
      onSelect: (selectedIngredient) => {
        if (selectedIngredient) {
          setIngredients([
            ...ingredients,
            {
              id: selectedIngredient.id,
              name: selectedIngredient.name,
              amount: '',
              unit: '',
              image: selectedIngredient.image,
            },
          ]);
        }
      },
    });
  };

  const handleRemoveIngredient = (idx) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleIngredientChange = (idx, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[idx][field] = value;
    setIngredients(newIngredients);
  };

  const handleSave = () => {
    if (!name) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên món ăn.');
      return;
    }
    // TODO: Xử lý lưu dữ liệu
    console.log(name, title, type, image, nutrition, steps, video, ingredients);
    Alert.alert('Thành công', 'Đã thêm món ăn mới!');
    navigation?.goBack?.();
  };

  const backgroundImage = require('@assets/background.png');

  return (
    <SafeAreaView className="flex-1 py-5 bg-white">
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
            Thêm thực phẩm
          </Text>
        </View>

        <ScrollView className="flex-1">
          <View className="p-6">
            {/* Ảnh món ăn */}
            <TouchableOpacity onPress={pickImage} className="items-center mb-6">
              {image ? (
                <View className="relative">
                  <Image
                    source={{ uri: image }}
                    className="w-48 h-48 rounded-2xl"
                  />
                  <View className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md">
                    <Ionicons name="camera" size={20} color="#4B5563" />
                  </View>
                </View>
              ) : (
                <View className="w-48 h-48 bg-gray-100 rounded-2xl items-center justify-center border-2 border-dashed border-gray-300">
                  <Ionicons name="camera-outline" size={40} color="#9CA3AF" />
                  <Text className="text-gray-500">Chọn ảnh món ăn</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Tên món ăn */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">
                Tên món ăn <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                value={name}
                onChangeText={setName}
                placeholder="Nhập tên món ăn"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Tiêu đề */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Tiêu đề</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                value={title}
                onChangeText={setTitle}
                placeholder="Nhập tiêu đề món ăn"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Thể loại */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">
                Thể loại món ăn
              </Text>
              <View className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <Picker
                  selectedValue={type}
                  onValueChange={(itemValue) => setType(itemValue)}
                  style={{ height: 50 }}
                >
                  {dishTypes.map((dishType) => (
                    <Picker.Item
                      key={dishType}
                      label={dishType}
                      value={dishType}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Nguyên liệu */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">
                Nguyên liệu
              </Text>
              {ingredients.map((ingredient, idx) => (
                <View
                  key={idx}
                  className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-semibold">Nguyên liệu {idx + 1}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveIngredient(idx)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={22}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row items-center gap-4 mb-2">
                    <View className="w-[96px] h-[96px] rounded-xl bg-gray-200 items-center justify-center">
                      {ingredient.image ? (
                        <Image
                          source={{ uri: ingredient.image }}
                          className="w-full h-full rounded-xl"
                        />
                      ) : (
                        <Ionicons
                          name="camera-outline"
                          size={24}
                          color="#9CA3AF"
                        />
                      )}
                    </View>
                    <View className="flex-col w-2/3 items-center mb-2">
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('AddIngredient', {
                            isMultiSelect: false,
                            onSelect: (selectedIngredient) => {
                              if (selectedIngredient) {
                                const newIngredients = [...ingredients];
                                newIngredients[idx] = {
                                  ...newIngredients[idx],
                                  id: selectedIngredient.id,
                                  name: selectedIngredient.name,
                                  image: selectedIngredient.image,
                                };
                                setIngredients(newIngredients);
                              }
                            },
                          })
                        }
                        className="bg-white border border-gray-200 rounded-xl h-[42px] px-4 py-2 text-gray-800 mb-2 flex-row items-center"
                      >
                        <Text className="flex-1 text-gray-800">
                          {ingredient.name || 'Chọn nguyên liệu'}
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>
                      <View className="flex-row gap-2">
                        <TextInput
                          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-800"
                          value={ingredient.amount}
                          onChangeText={(v) =>
                            handleIngredientChange(idx, 'amount', v)
                          }
                          placeholder="Số lượng"
                          keyboardType="numeric"
                        />
                        <View className="w-32 h-full bg-white  border border-gray-200 rounded-xl">
                          <Picker
                            selectedValue={ingredient.unit}
                            onValueChange={(v) =>
                              handleIngredientChange(idx, 'unit', v)
                            }
                            style={{ height: 50, color: '#4B5563' }}
                            dropdownIconColor="#4B5563"
                            mode="dropdown"
                          >
                            <Picker.Item
                              label="Đơn vị"
                              value=""
                              color="#9CA3AF"
                              style={{ fontSize: 14 }}
                            />
                            {units.map((unit) => (
                              <Picker.Item
                                key={unit}
                                label={unit}
                                value={unit}
                                color="#4B5563"
                                style={{ fontSize: 14 }}
                              />
                            ))}
                          </Picker>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
              <TouchableOpacity
                onPress={handleAddIngredient}
                className="bg-white py-2 rounded-xl items-center"
              >
                <Ionicons name="add-circle-outline" size={22} color="#B91C1C" />
                <Text className="text-red-800 font-semibold">
                  Thêm nguyên liệu
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-4 flex flex-col gap-2">
              <Text className="text-gray-700 font-medium mb-2">
                Dinh dưỡng (trên 1 khẩu phần)
              </Text>
              <View className="flex flex-row flex-wrap justify-between gap-y-3 ">
                {/* Tinh bột */}
                <View className="w-[48%] flex flex-row items-center mb-2 bg-white rounded-lg py-2">
                  <View className="rounded-xl p-3 mr-2">
                    <MaterialCommunityIcons
                      name="grain"
                      size={24}
                      color="#222"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-700">
                      Tinh bột
                    </Text>
                    <View className="flex flex-row items-end gap-1 mt-1">
                      <TextInput
                        className="text-gray-800 text-base p-0 m-0"
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
                      <Text className="text-xs text-gray-400 mb-0.5">gr</Text>
                    </View>
                  </View>
                </View>
                {/* Chất đạm */}
                <View className="w-[48%] flex flex-row items-center mb-2 bg-white rounded-lg py-2">
                  <View className="rounded-xl p-3 mr-3">
                    <MaterialCommunityIcons
                      name="food-steak"
                      size={24}
                      color="#222"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-700">
                      Chất đạm
                    </Text>
                    <View className="flex flex-row items-end gap-1 mt-1">
                      <TextInput
                        className="text-gray-800 text-base p-0 m-0"
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
                      <Text className="text-xs text-gray-400 mb-0.5">gr</Text>
                    </View>
                  </View>
                </View>
                {/* Kcal */}
                <View className="w-[48%] flex flex-row items-center bg-white rounded-lg py-2 mb-2">
                  <View className="rounded-xl p-3 mr-3">
                    <MaterialCommunityIcons
                      name="fire"
                      size={24}
                      color="#222"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-700">Kcal</Text>
                    <View className="flex flex-row items-end gap-1 mt-1">
                      <TextInput
                        className="text-gray-800 text-base p-0 m-0"
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
                      <Text className="text-xs text-gray-400 mb-0.5">Calo</Text>
                    </View>
                  </View>
                </View>
                {/* Chất béo */}
                <View className="w-[48%] flex flex-row items-center bg-white rounded-lg py-2 mb-2">
                  <View className="rounded-xl p-3 mr-3">
                    <MaterialCommunityIcons
                      name="water"
                      size={24}
                      color="#222"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-700">
                      Chất béo
                    </Text>
                    <View className="flex flex-row items-end gap-1 mt-1">
                      <TextInput
                        className="text-gray-800 text-base p-0 m-0"
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
                      <Text className="text-xs text-gray-400 mb-0.5">gr</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Bước thực hiện */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">
                Bước thực hiện
              </Text>
              {steps.map((step, idx) => (
                <View
                  key={idx}
                  className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <Text className="mb-2 font-semibold">Bước {idx + 1}</Text>
                  <TextInput
                    className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-800 mb-2"
                    value={step.description}
                    onChangeText={(v) => handleStepChange(idx, v)}
                    placeholder={`Mô tả bước ${idx + 1}`}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={() => pickStepImage(idx)}
                    className="mb-2 items-center"
                  >
                    {step.image ? (
                      <Image
                        source={{ uri: step.image }}
                        className="w-32 h-32 rounded-xl"
                      />
                    ) : (
                      <View className="w-32 h-32 bg-white rounded-xl items-center justify-center border-2 border-dashed border-gray-300">
                        <Ionicons
                          name="camera-outline"
                          size={28}
                          color="#9CA3AF"
                        />
                        <Text className="text-gray-500 mt-1">Ảnh minh họa</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleRemoveStep(idx)}
                    className="items-end"
                  >
                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={handleAddStep}
                className="bg-white py-2 rounded-xl items-center"
              >
                <Ionicons name="add-circle-outline" size={22} color="#B91C1C" />
                <Text className="text-red-800 font-semibold">Thêm bước</Text>
              </TouchableOpacity>
            </View>

            {/* Video thực hiện */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">
                Link video YouTube (không bắt buộc)
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                value={video}
                onChangeText={setVideo}
                placeholder="Dán link YouTube hướng dẫn nấu món này"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Nút lưu */}
            <TouchableOpacity
              onPress={handleSave}
              className="bg-red-800 py-4 rounded-xl mt-2"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Hoàn thành
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default AddDishScreen;
