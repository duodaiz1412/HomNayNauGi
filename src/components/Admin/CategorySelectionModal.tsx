import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from 'src/api/api';

type CategorySelectionModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (selectedIds: number[]) => void;
  initialSelectedIds: number[];
};

export const CategorySelectionModal = ({
  visible,
  onClose,
  onSave,
  initialSelectedIds = [],
}: CategorySelectionModalProps) => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(initialSelectedIds);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchCategories();
      setSelectedCategoryIds(initialSelectedIds);
    }
  }, [visible, initialSelectedIds]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/ingredient-categories/all');
      if (response.data && response.data.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      // console.error('Error fetching categories:', error);
      Alert.alert(
        'Lỗi',
        'Không thể tải danh mục nguyên liệu. Vui lòng thử lại sau.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle category selection
  const toggleCategory = (categoryId: number) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    }
  };

  const handleSave = () => {
    onSave(selectedCategoryIds);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-xl h-3/4">
          <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <Text className="text-lg font-bold">Chọn danh mục</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#454442" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#941D23" />
              <Text className="mt-4 text-gray-600">Đang tải danh mục...</Text>
            </View>
          ) : (
            <FlatList
              data={categories}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`flex-row items-center p-3 mb-2 rounded-lg ${
                    selectedCategoryIds.includes(item.id) ? 'bg-red-100 border border-red-800' : 'bg-white border border-gray-200'
                  }`}
                  onPress={() => toggleCategory(item.id)}
                >
                  {item.imageUrl && (
                    <Image 
                      source={{ uri: item.imageUrl }} 
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  )}
                  <View className="flex-1">
                    <Text className="text-base font-medium">{item.name}</Text>
                  </View>
                  {selectedCategoryIds.includes(item.id) && (
                    <Ionicons name="checkmark-circle" size={24} color="#941D23" />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center py-10">
                  <Text className="text-gray-500">Không có danh mục nào</Text>
                </View>
              }
            />
          )}
          
          <View className="p-4 bg-white border-t border-gray-200">
            <TouchableOpacity
              className="bg-[#941D23] py-3 rounded-lg items-center"
              onPress={handleSave}
            >
              <Text className="text-white font-bold">
                Lưu ({selectedCategoryIds.length} đã chọn)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}; 