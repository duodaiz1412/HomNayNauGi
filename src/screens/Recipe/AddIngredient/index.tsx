import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getIngredientCategories } from 'src/api/api';

const INGREDIENT_CATEGORIES = [
  'Tất cả',
  'Gia vị',
  'Thịt',
  'Thuỷ hải sản',
  'Rau củ quả',
  'Nấm',
  'Trứng sữa',
  'Khác'
];

interface Ingredient {
  id: string;
  name: string;
  imageUrl: string;
}

interface IngredientMapping {
  ingredientId: string;
  ingredientCategoryId: number;
  ingredient: Ingredient;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  imageUrl: string;
  ingredientMappings: IngredientMapping[];
}

interface ApiResponse {
  message: string;
  data: Category[];
  total: number;
}

const AddIngredientScreen = ({ navigation, route }) => {
  const [selectedCategory, setSelectedCategory] = useState(INGREDIENT_CATEGORIES[0]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Ingredient[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10; // Số lượng loại nguyên liệu mỗi lần load
  const isMultiSelect = route.params?.isMultiSelect ?? false;

  // Fetch ingredients khi chọn category hoặc search thay đổi
  useEffect(() => {
    const fetchIngredients = async () => {
      if (!hasMore && offset > 0) return;
      
      setIsLoading(true);
      try {
        const queryParam = search || (selectedCategory !== 'Tất cả' ? selectedCategory : '');
        const response = await getIngredientCategories(offset, limit, queryParam);
        
        // Lấy tất cả ingredients từ tất cả categories
        const allIngredients = response.data.flatMap(category => 
          category.ingredientMappings.map(mapping => mapping.ingredient)
        );
        
        // Cập nhật trạng thái hasMore dựa vào total
        setHasMore(offset + limit < response.total);
        
        // Nếu là trang đầu tiên, thay thế hoàn toàn
        if (offset === 0) {
          setIngredients(allIngredients);
        } else {
          // Nếu là trang tiếp theo, thêm vào danh sách hiện tại
          setIngredients(prev => [...prev, ...allIngredients]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Lỗi khi tải nguyên liệu:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    // Reset data khi đổi category hoặc search
    if (search || selectedCategory !== INGREDIENT_CATEGORIES[0]) {
      setOffset(0);
      setHasMore(true);
      setIngredients([]);
      fetchIngredients();
    }

    const debounceTimer = setTimeout(fetchIngredients, 300);
    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, search, offset]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setOffset(prev => prev + limit);
    }
  };

  const toggleSelect = (item: Ingredient) => {
    if (isMultiSelect) {
      if (selected.some(i => i.id === item.id)) {
        setSelected(selected.filter(i => i.id !== item.id));
      } else {
        setSelected([...selected, item]);
      }
    } else {
      if (selected.some(i => i.id === item.id)) {
        setSelected([]);
      } else {
        setSelected([item]);
      }
    }
  };

  const handleAddIngredient = () => {
    if (selected.length > 0) {
      route.params?.onSelect?.(selected[0]);
    }
    navigation.goBack();
  };

  if (isLoading && ingredients.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#B91C1C" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-red-800 mx-auto">
          Thêm thực phẩm
        </Text>
      </View>
      <View className="p-4 ">
        {/* Thanh tìm kiếm */}
        <View className="flex-row items-center bg-gray-100 h-14 rounded-xl px-3 mb-4">
          <Ionicons name="search" size={24} color="#888" />
          <TextInput
            className="flex-1 py-2 px-2 bg-transparent text-lg"
            placeholder="Tìm kiếm nguyên liệu"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        {/* Slider loại nguyên liệu */}
        <FlatList
          data={INGREDIENT_CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item)}
              className={`px-4 py-2 min-h-[36p] rounded-full mr-2 ${selectedCategory === item ? 'bg-red-700' : 'bg-gray-200'}`}
            >
              <Text
                className={selectedCategory === item ? 'text-white' : 'text-gray-700 items-center justify-center align-middle'}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{
            paddingRight: 16,
            maxHeight: 40,
            marginBottom: 15,
          }}
        />

        {isLoading && ingredients.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#B91C1C" />
          </View>
        ) : (
          <FlatList
            data={ingredients}
            numColumns={3}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleSelect(item)}
                className="flex-1 m-2"
                style={{ maxWidth: '30%'}}
              >
                <View
                  className={`rounded-xl overflow-hidden border ${selected.some(i => i.id === item.id) ? 'border-red-800' : 'border-gray-300'}`}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="w-full h-24"
                    resizeMode="cover"
                  />
                  <View className="absolute top-1 right-1 w-[18px] h-[18px] rounded-full bg-white items-center justify-center">
                    {selected.some(i => i.id === item.id) && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#B91C1C"
                      />
                    )}
                  </View>
                  <Text className="text-center py-2 text-xs font-medium text-gray-700">
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 16 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isLoading && ingredients.length > 0 ? (
              <ActivityIndicator size="small" color="#B91C1C" />
            ) : null}
            ListEmptyComponent={
              !isLoading ? (
                <Text className="text-center text-gray-500 mt-4">
                  Không tìm thấy nguyên liệu nào
                </Text>
              ) : null
            }
          />
        )}
      </View>
      <View className="absolute bottom-5 left-0 right-0 px-7">
        <TouchableOpacity
          onPress={handleAddIngredient}
          className="bg-red-900 rounded-full py-4 items-center w-3/5 self-center"
        >
          <Text className="text-white font-bold text-lg">Thêm nguyên liệu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddIngredientScreen;
