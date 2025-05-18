import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminIngredientStackParamList } from '@navigation/AdminIngredientStack';
import api from 'src/api/api';

export const IngredientManagementScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AdminIngredientStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'Tất cả' }]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/ingredient-categories/search', {
        params: { query: '', offset: 0, limit: 100 },
      });
      const categoriesData = response.data?.data || [];
      const mapped = categoriesData.map((cat) => ({ id: cat.id.toString(), name: cat.name }));
      setCategories([{ id: 'all', name: 'Tất cả' }, ...mapped]);
    } catch (error) {
      // console.error('Lỗi khi lấy danh mục:', error);
    }
  };

  const fetchIngredientsByCategory = async (categoryId: string) => {
    setIsLoading(true);
    try {
      const url = categoryId === 'all'
        ? '/ingredients'
        : `/ingredient-categories/search/${categoryId}`;
      const response = await api.get(url);
      const data = categoryId === 'all' 
        ? (Array.isArray(response.data) ? response.data : response.data?.data ?? [])
        : response.data?.data?.ingredientMappings?.map(mapping => mapping.ingredient) ?? [];
      
      setIngredients(data);
    } catch (error) {
      // console.error('Lỗi khi lấy nguyên liệu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchIngredientsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Xóa nguyên liệu',
      'Bạn có chắc chắn muốn xóa nguyên liệu này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              await api.delete(`/admin/ingredients/${id}`);
              fetchIngredientsByCategory(selectedCategory);
            } catch (error) {
              console.error('Lỗi khi xóa nguyên liệu:', error);
            }
          }
        }
      ]
    );
  };

  const renderIngredientItem = ({ item }) => (
    <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
      <View className="flex-row items-start">
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }}
          className="w-24 h-24 rounded-lg mr-3"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold text-black">{item.name}</Text>
          <Text className="text-gray-600 text-sm">Danh mục: {item.category?.name || 'N/A'}</Text>
          <Text className="text-gray-600 text-sm">Đơn vị: {item.unit || 'N/A'}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="restaurant-outline" size={14} color="#454442" />
            <Text className="text-gray-500 text-xs ml-1">
              Sử dụng trong {item.usedInDishes || 0} món ăn
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-end mt-4">
      
        <TouchableOpacity
          className="flex-row items-center px-3 py-1.5 bg-green-100 rounded-full mr-2"
          onPress={() => navigation.navigate('EditIngredientScreen', { ingredientId: item.id })}
        >
          <Ionicons name="create-outline" size={14} color="#34C759" />
          <Text className="text-green-600 text-xs ml-1">Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center px-3 py-1.5 bg-red-100 rounded-full" onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={14} color="#FF3B30" />
          <Text className="text-red-600 text-xs ml-1">Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminHeader title="Quản lý nguyên liệu" />
      <View className="px-4 py-3">
        <View className="flex-row items-center bg-white rounded-lg px-3 mb-3 shadow-sm">
          <Ionicons name="search" size={20} color="#454442" />
          <TextInput
            className="flex-1 py-2 px-2"
            placeholder="Tìm kiếm nguyên liệu..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#454442" />
            </TouchableOpacity>
          ) : null}
        </View>

        <Text className="text-gray-700 font-medium mb-2">Danh mục:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === category.id ? 'bg-[#941D23]' : 'bg-white'}`}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text className={`${selectedCategory === category.id ? 'text-white' : 'text-gray-700'}`}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#941D23" />
          <Text className="text-[#941D23] mt-2">Đang tải nguyên liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={ingredients.filter((item) =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderIngredientItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#941D23] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('AddIngredientScreen')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
