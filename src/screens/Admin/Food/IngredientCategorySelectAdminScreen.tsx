import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import debounce from 'lodash.debounce';
import api from 'src/api/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminFoodStackParamList } from '@navigation/AdminFoodStack';
import { useFoodManagement } from 'src/context/FoodManagementContext';
import { IngredientCategory } from 'src/types';
// type IngredientCategorySelectScreenRouteProp= RouteProp<AdminFoodStackParamList, 'IngredientCategorySelectScreen'>
export const IngredientCategorySelectAdminScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminFoodStackParamList>>();
  //   const route = useRoute<IngredientCategorySelectScreenRouteProp>()
  const { ingredientCategoryFilters, updateIngredientCategoryFilters } =
    useFoodManagement();

  const [selectedCategories, setSelectedCategories] = useState<
    IngredientCategory[]
  >(ingredientCategoryFilters);

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<IngredientCategory[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchCategories = async (query = '', offset = 0, limit = 10) => {
    try {
      setLoading(true);
      const response = await api.get('/admin/ingredient-categories/search', {
        params: { query, offset, limit },
      });
      const { data, total } = response.data;
      console.log('Danh sách danh mục nguyên liệu', data);
      return { data, total };
    } catch (error) {
      console.error('Error fetching ingredient categories:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách danh mục nguyên liệu');
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    try {
      const newOffset = reset ? 0 : offset;
      const { data, total } = await fetchCategories(searchQuery, newOffset, 10);
      const newCategories = reset ? data : [...categories, ...data];
      setCategories(newCategories);
      setOffset(newOffset + 10);
      setHasMore(newCategories.length < total);
    } catch (error) {
      console.error('Error loading ingredient categories:', error);
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  useEffect(() => {
    loadCategories(true);
  }, [searchQuery]);

  // Toggle category selection
  const toggleCategorySelection = (category) => {
    if (selectedCategories.some((cat) => cat.id === category.id)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat.id !== category.id)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Confirm selection and go back
  const confirmSelection = () => {
    updateIngredientCategoryFilters(selectedCategories);
    navigation.goBack();
  };

  // Filter out already selected categories from the list
  const filteredCategories = categories.filter(
    (category) =>
      !selectedCategories.some((selected) => selected.id === category.id)
  );

  // Render category item
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100"
      onPress={() => toggleCategorySelection(item)}
    >
      <Text className="text-gray-800">{item.name}</Text>
      <Ionicons name="add-circle-outline" size={24} color="#941D23" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#454442" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Chọn danh mục nguyên liệu</Text>
        <TouchableOpacity onPress={confirmSelection}>
          <Text className="text-[#941D23] font-medium">Xong</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="mt-4 px-4 py-3">
        <View className="flex-row items-center bg-white rounded-lg px-3 shadow-sm">
          <Ionicons name="search" size={24} color="#454442" />
          <TextInput
            className="flex-1 text-lg py-2 px-2"
            placeholder="Tìm kiếm danh mục nguyên liệu..."
            value={searchInput}
            onChangeText={(text) => {
              setSearchInput(text);
              debouncedSearch(text);
            }}
          />
          {searchInput ? (
            <TouchableOpacity
              onPress={() => {
                setSearchInput('');
                setSearchQuery('');
              }}
            >
              <Ionicons name="close-circle" size={24} color="#454442" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Selected Categories */}
      {selectedCategories.length > 0 && (
        <View className="px-4 py-2">
          <Text className="font-medium mb-2">
            Đã chọn ({selectedCategories.length})
          </Text>
          <View className="flex-row flex-wrap">
            {selectedCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="bg-[#941D23] rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
                onPress={() => toggleCategorySelection(category)}
              >
                <Text className="text-white mr-1">{category.name}</Text>
                <Ionicons name="close-circle" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Category List */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategoryItem}
        contentContainerStyle={{ padding: 16 }}
        onEndReached={() => loadCategories(false)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#941D23" />
              <Text className="text-gray-500 mt-2">Đang tải...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View className="py-8 items-center">
              <Text className="text-gray-500">
                Không tìm thấy danh mục nguyên liệu
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};
