import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminFoodCategoryStackParamList } from '@navigation/AdminFoodCategoryStack';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import debounce from 'lodash.debounce';
import api from 'src/api/api';

export const AdminFoodCategoryManagementScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminFoodCategoryStackParamList>>();

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchCategories = async (query = '', offset = 0, limit = 10) => {
    try {
      setLoading(true);
      const response = await api.get('/admin/recipe-categories/search', {
        params: { query, offset, limit },
      });
      const { data, total } = response.data;
      console.log("Danh sach danh muc mon an", data);
      return { data, total };
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách danh mục');
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
      console.error('Error loading categories:', error);
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/admin/recipe-categories/delete/${id}`);
      setCategories((prev) => prev.filter((item) => item.id !== id));
      Alert.alert('Thành công', 'Xóa danh mục thành công');
    } catch (error) {
      console.error('Error deleting category:', error);
      Alert.alert('Lỗi', 'Không thể xóa danh mục');
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

  const renderCategoryItem = ({ item }) => (
    <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="bg-red-100 p-2 rounded-full mr-3">
            <Image
              source={{ uri: item.imageUrl }}
              className="w-12 h-12 rounded-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-base">{item.name}</Text> 
          </View>
        </View>
        <View className="flex-row">
          <TouchableOpacity
            className="mr-2 bg-blue-100 px-3 py-1.5 rounded-full flex-row items-center"
            onPress={() => navigation.navigate('EditFoodCategoryScreen', { categoryId: item.id })}
          >
            <Ionicons name="create-outline" size={14} color="#007AFF" />
            <Text className="text-blue-600 text-xs ml-1">Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-100 px-3 py-1.5 rounded-full flex-row items-center"
            onPress={() =>
              Alert.alert('Xác nhận', `Bạn có chắc muốn xóa ${item.name}?`, [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', onPress: () => deleteCategory(item.id) },
              ])
            }
          >
            <Ionicons name="trash-outline" size={14} color="#FF3B30" />
            <Text className="text-red-600 text-xs ml-1">Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <AdminHeader title="Quản lý danh mục món ăn" />

      {/* Search and Filter */}
      <View className="px-4 py-3">
        <View className="flex-row items-center bg-white rounded-lg px-3 mb-3 shadow-sm">
          <Ionicons name="search" size={20} color="#454442" />
          <TextInput
            className="flex-1 py-2 px-2"
            placeholder="Tìm kiếm danh mục món ăn..."
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
              <Ionicons name="close-circle" size={20} color="#454442" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category List */}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        onEndReached={() => loadCategories(false)}
        onEndReachedThreshold={0.5} 
        ListFooterComponent={
          loading ? (
            <View className="items-center justify-center py-4">
              <ActivityIndicator size="small" color="#941D23" />
              <Text className="text-gray-500 mt-2">Đang tải...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center justify-center py-8">
              <Ionicons name="restaurant-outline" size={48} color="#CCCCCC" />
              <Text className="text-gray-500 mt-2">Không tìm thấy danh mục nào</Text>
            </View>
          ) : null
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#941D23] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('AddFoodCategoryScreen')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};
