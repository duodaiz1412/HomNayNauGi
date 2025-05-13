import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Alert,
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
    <View className="bg-white mb-3 mx-4 rounded-2xl overflow-hidden shadow-sm">
      <View className="p-4">
        <View className="flex-row items-center">
          <View className="relative">
            <Image
              source={{ uri: item.imageUrl }}
              className="w-20 h-20 rounded-xl"
              resizeMode="cover"
            />
            {/* <View className="absolute -bottom-1 -right-1 bg-[#88131b] px-2 py-0.5 rounded-lg">
              <Text className="text-white text-xs font-medium">Danh mục</Text>
            </View> */}
          </View>
          <View className="flex-1 ml-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-800 flex-1 mr-2">{item.name}</Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditFoodCategoryScreen', { categoryId: item.id })}
                  className="w-8 h-8 items-center justify-center rounded-full bg-[#88131b]/5 mr-2"
                >
                  <Ionicons name="create-outline" size={18} color="#88131b" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert('Xác nhận', `Bạn có chắc muốn xóa ${item.name}?`, [
                      { text: 'Hủy', style: 'cancel' },
                      { text: 'Xóa', onPress: () => deleteCategory(item.id) },
                    ])
                  }
                  className="w-8 h-8 items-center justify-center rounded-full bg-red-50"
                >
                  <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View> 
            <View className="flex-row items-center mt-2">
              <View className="flex-row items-center bg-[#88131b]/5 px-3 py-1 rounded-full">
                <Ionicons name="restaurant-outline" size={14} color="#88131b" />
                <Text className="text-xs text-[#88131b] ml-1 font-medium">Danh mục món ăn</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <AdminHeader title="Quản lý danh mục món ăn" />

      {/* Search Section */}
      <View className="px-4 pt-4">
        <View className="relative">
          <TextInput
            className="bg-white h-12 rounded-2xl pl-12 pr-4 text-base shadow-sm"
            placeholder="Tìm kiếm danh mục món ăn..."
            value={searchInput}
            onChangeText={(text) => {
              setSearchInput(text);
              debouncedSearch(text);
            }}
            placeholderTextColor="#9CA3AF"
          />
          <View className="absolute left-4 top-3">
            <Ionicons name="search" size={20} color="#88131b" />
          </View>
          {searchInput ? (
            <TouchableOpacity
              onPress={() => {
                setSearchInput('');
                setSearchQuery('');
              }}
              className="absolute right-4 top-3"
            >
              <Ionicons name="close-circle" size={20} color="#88131b" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category List */}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        onEndReached={() => loadCategories(false)}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View className="px-4 mb-6">
            <Text className="text-2xl font-bold text-gray-800">Danh mục món ăn</Text>
            <Text className="text-base text-gray-500 mt-1">
              Quản lý và tổ chức các danh mục món ăn trong hệ thống
            </Text>
          </View>
        }
        ListFooterComponent={
          loading ? (
            <View className="items-center justify-center py-8">
              <View className="w-10 h-10 border-3 border-[#88131b] border-t-transparent rounded-full animate-spin" />
              <Text className="text-gray-500 mt-4 font-medium">Đang tải danh mục...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center justify-center py-16 px-4">
              <View className="w-24 h-24 bg-[#88131b]/5 rounded-full items-center justify-center mb-6">
                <Ionicons name="restaurant-outline" size={40} color="#88131b" />
              </View>
              <Text className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy danh mục</Text>
              <Text className="text-base text-gray-500 text-center">
                Hãy thử tìm kiếm với từ khóa khác hoặc thêm danh mục mới vào hệ thống
              </Text>
              <TouchableOpacity
                className="mt-6 bg-[#88131b] px-6 py-3 rounded-full flex-row items-center"
                onPress={() => navigation.navigate('AddFoodCategoryScreen')}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text className="text-white font-medium ml-2">Thêm danh mục mới</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#88131b] w-14 h-14 rounded-full items-center justify-center"
        onPress={() => navigation.navigate('AddFoodCategoryScreen')}
        style={{
          shadowColor: '#88131b',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
