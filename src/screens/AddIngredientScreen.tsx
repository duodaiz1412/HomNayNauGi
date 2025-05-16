import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const foodTypes = [
  'Thịt & hải sản',
  'Trứng & sữa',
  'Rau củ quả',
  'Trái cây',
  'Gia vị',
  'Ngũ cốc',
  'Khác',
];

const AddIngredientScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState(foodTypes[0]);
  const [image, setImage] = useState(null);

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

  const handleSave = () => {
    // TODO: Implement save functionality
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Image Upload Section */}
          <TouchableOpacity onPress={pickImage} className="items-center mb-8">
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
                <Text className="text-gray-500 mt-2">Chọn ảnh</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Form Fields */}
          <View className="space-y-6 flex flex-col gap-3">
            {/* Name Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Tên nguyên liệu
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800"
                value={name}
                onChangeText={setName}
                placeholder="Nhập tên nguyên liệu"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Type Picker */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Loại thực phẩm
              </Text>
              <View className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <Picker
                  selectedValue={type}
                  onValueChange={(itemValue) => setType(itemValue)}
                  style={{ height: 50 }}
                >
                  {foodTypes.map((foodType) => (
                    <Picker.Item
                      key={foodType}
                      label={foodType}
                      value={foodType}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className="bg-red-800 py-4 rounded-xl mt-8"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Lưu
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddIngredientScreen;
