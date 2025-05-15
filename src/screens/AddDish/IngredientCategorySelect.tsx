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
  Image,
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
import { RootStackParamList } from '@navigation/AppNavigator';
// type IngredientCategorySelectScreenRouteProp= RouteProp<AdminFoodStackParamList, 'IngredientCategorySelectScreen'>
export const IngredientCategorySelectScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
      const response = await api.get('/ingredient-categories/search', {
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
      className="flex-row items-center justify-between p-3 border-b border-gray-100"
      onPress={() => toggleCategorySelection(item)}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 rounded-full overflow-hidden mr-3 border border-gray-200">
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full bg-gray-200 items-center justify-center">
              <Ionicons name="nutrition-outline" size={20} color="#9CA3AF" />
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-gray-800 font-medium">{item.name}</Text>
        </View>
      </View>
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
        <View className="px-4 py-3 border-b border-gray-200">
          <Text className="font-medium mb-3">
            Đã chọn ({selectedCategories.length})
          </Text>
          <FlatList
            data={selectedCategories}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="mr-3 items-center"
                onPress={() => toggleCategorySelection(item)}
              >
                <View className="relative">
                  <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#941D23]">
                    {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                      <View className="w-full h-full bg-gray-200 items-center justify-center">
                        <Ionicons name="nutrition-outline" size={24} color="#9CA3AF" />
                      </View>
                    )}
                  </View>
                  <View className="absolute -top-1 -right-1 bg-[#941D23] rounded-full w-6 h-6 items-center justify-center">
                    <Ionicons name="close" size={14} color="#FFFFFF" />
                  </View>
                </View>
                <Text className="text-xs mt-1 text-center max-w-16" numberOfLines={2}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
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
