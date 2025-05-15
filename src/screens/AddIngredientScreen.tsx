import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
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

  // Yêu cầu quyền truy cập ảnh khi component mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Quyền truy cập bị từ chối', 'Bạn cần cấp quyền truy cập thư viện ảnh để chọn ảnh');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images, // dùng enum đúng
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở thư viện ảnh');
      console.log('ImagePicker error:', error);
    }
  };

  const handleSave = () => {
    // TODO: Thêm xử lý lưu nguyên liệu ở đây

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.innerContainer}>
          {/* Image Upload Section */}
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {image ? (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: image }} style={styles.image} />
                <View style={styles.cameraIconWrapper}>
                  <Ionicons name="camera" size={20} color="#4B5563" />
                </View>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={40} color="#9CA3AF" />
                <Text style={styles.imagePlaceholderText}>Chọn ảnh</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tên nguyên liệu</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nhập tên nguyên liệu"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Type Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Loại thực phẩm</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={type}
                  onValueChange={(itemValue) => setType(itemValue)}
                  style={styles.picker}
                >
                  {foodTypes.map((foodType) => (
                    <Picker.Item key={foodType} label={foodType} value={foodType} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    padding: 24,
    flexGrow: 1,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 192,
    height: 192,
    borderRadius: 24,
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  imagePlaceholder: {
    width: 192,
    height: 192,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#6B7280',
  },
  form: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#111827',
  },
  pickerWrapper: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  saveButton: {
    marginTop: 32,
    backgroundColor: '#991B1B',
    paddingVertical: 16,
    borderRadius: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AddIngredientScreen;
