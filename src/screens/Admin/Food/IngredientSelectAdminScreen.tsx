import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFoodManagement } from 'src/context/FoodManagementContext';
import debounce from 'lodash.debounce';
import api from 'src/api/api';
import { AdminFoodStackParamList } from '@navigation/AdminFoodStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RecipeIngredient } from 'src/types';

type IngredientSelectScreenRouteProp = RouteProp<
  AdminFoodStackParamList,
  'IngredientSelectScreen'
>;

export const IngredientSelectAdminScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AdminFoodStackParamList>>();
  const route = useRoute<IngredientSelectScreenRouteProp>();
  const {
    recipeForm,
    updateIngredients,
    ingredientCategoryFilters,
    updateIngredientCategoryFilters,
  } = useFoodManagement();

  const [selectedIngredients, setSelectedIngredients] = useState<RecipeIngredient[]>(recipeForm.ingredients);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch ingredients with pagination and filtering
  const fetchIngredients = async (query = '', categoryIds = [], offset = 0, limit = 10) => {
    try {
      setLoading(true);
      const response = await api.get('/admin/ingredients/search', {
        params: { query, ...(categoryIds.length > 0 && { categoryIds: categoryIds.join(',') }), offset, limit },
      });
      const { data, total } = response.data;
      return { data, total };
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const loadIngredients = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    const newOffset = reset ? 0 : offset;
    const categoryIds = ingredientCategoryFilters.map((cat) => cat.id);
    const { data, total } = await fetchIngredients(searchQuery, categoryIds, newOffset, 10);
    const newIngredients = reset ? data : [...ingredients, ...data];
    setIngredients(newIngredients);
    setOffset(newOffset + 10);
    setHasMore(newIngredients.length < total);
  };

  const debouncedSearch = useCallback(debounce((query) => setSearchQuery(query), 500), []);

  useEffect(() => {
    loadIngredients(true);
  }, [searchQuery, ingredientCategoryFilters]);

  const toggleIngredientSelection = (ingredient) => {
    if (selectedIngredients.some((item) => item.ingredientId === ingredient.id)) {
      setSelectedIngredients(selectedIngredients.filter((item) => item.ingredientId !== ingredient.id));
    } else {
      setSelectedIngredients([...selectedIngredients, {
        recipeId: '',
        ingredientId: ingredient.id,
        quantity: null,
        unitId: null,
        ingredient: ingredient,
        unit: null
      }]);
    }
  };

  const confirmSelection = () => {
    updateIngredients(selectedIngredients);
    navigation.goBack();
  };

  const goToCategoryFilter = () => navigation.navigate('IngredientCategorySelectScreen');

  const filteredIngredient = ingredients.filter(
    (category) => !selectedIngredients.some((selected) => selected.ingredientId === category.id)
  );

  const renderIngredientItem = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100"
      onPress={() => toggleIngredientSelection(item)}
    >
      <View>
        <Text className="text-gray-800">{item.name}</Text>
        <Text className="text-gray-500 text-xs">
          Danh mục: {item.categories?.map((cat) => cat.name).join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#454442" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Chọn nguyên liệu</Text>
        <TouchableOpacity onPress={confirmSelection}>
          <Text className="text-[#941D23] font-medium">Xong</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredIngredient}
        keyExtractor={(item) => item.id}
        renderItem={renderIngredientItem}
        contentContainerStyle={{ paddingBottom: 16 }}
        onEndReached={() => loadIngredients(false)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Text>Đang tải...</Text> : null}
        ListEmptyComponent={!loading ? <Text className="text-center">Không tìm thấy danh mục</Text> : null}
        ListHeaderComponent={
          <View>
            {/* Thanh tìm kiếm và nút lọc */}
            <View className="mt-4 px-4 py-3">
              <View className="flex-row items-center">
                <View className="flex-row items-center bg-white rounded-lg px-3 shadow-sm flex-1 mr-2">
                  <Ionicons name="search" size={24} color="#454442" />
                  <TextInput
                    className="flex-1 text-lg py-2 px-2"
                    placeholder="Tìm kiếm nguyên liệu..."
                    value={searchInput}
                    onChangeText={(text) => {
                      setSearchInput(text);
                      debouncedSearch(text);
                    }}
                  />
                  {searchInput ? (
                    <TouchableOpacity onPress={() => { setSearchInput(''); setSearchQuery(''); }}>
                      <Ionicons name="close-circle" size={24} color="#454442" />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <TouchableOpacity
                  className={`p-3 rounded-lg shadow-sm ${ingredientCategoryFilters.length > 0 ? 'bg-[#941D23]' : 'bg-white'}`}
                  onPress={goToCategoryFilter}
                >
                  <Ionicons name="filter" size={24} color={ingredientCategoryFilters.length > 0 ? 'white' : '#454442'} />
                  {ingredientCategoryFilters.length > 0 && (
                    <View className="absolute -top-2 -right-2 bg-blue-500 rounded-full w-5 h-5 items-center justify-center">
                      <Text className="text-white text-xs font-bold">{ingredientCategoryFilters.length}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Bộ lọc danh mục */}
            {ingredientCategoryFilters.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-2">
                <TouchableOpacity
                  className="bg-gray-200 rounded-full px-3 py-1 flex-row items-center"
                  onPress={() => updateIngredientCategoryFilters([])}
                >
                  <Text className="text-gray-700">Xóa bộ lọc</Text>
                  <Ionicons name="close-circle" size={16} color="#454442" className="ml-1" />
                </TouchableOpacity>
                {ingredientCategoryFilters.map((category) => (
                  <View key={category.id} className="bg-gray-100 rounded-full px-3 py-1 mr-2 flex-row items-center">
                    <Text className="text-gray-700">{category.name}</Text>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Nguyên liệu đã chọn */}
            {selectedIngredients.length > 0 && (
              <View className="px-4 py-2">
                <Text className="font-medium mb-2">Đã chọn ({selectedIngredients.length})</Text>
                <View className="flex-row flex-wrap">
                  {selectedIngredients.map((ingredient) => (
                    <TouchableOpacity
                      key={ingredient.ingredientId}
                      className="bg-[#941D23] rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center"
                      onPress={() => toggleIngredientSelection(ingredient.ingredient)}
                    >
                      <Text className="text-white mr-1">{ingredient.ingredient?.name}</Text>
                      <Ionicons name="close-circle" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
};