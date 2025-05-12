import { useState, useEffect, useCallback } from 'react';
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
import { AdminIngredientCategoryStackParamList } from '@navigation/AdminIngredientCategoryStack';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import debounce from 'lodash.debounce';
import api from 'src/api/api';

export const AdminIngredientCategoryManagementScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminIngredientCategoryStackParamList>>();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
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

      console.log("Danh sach danh muc nguyen lieu", data);

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
      await api.delete(`/admin/ingredient-categories/delete/${id}`);
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
    <View className="bg-white rounded-xl p-4 shadow-sm mb-4 flex-row items-center">
      <View className="bg-red-800 p-3 rounded-full mr-5">
        <Image
          source={{ uri: item.imageUrl }}
          className="w-14 h-14 rounded-full"
          resizeMode="cover"
        />
      </View>
      <View className="flex-1">
        <Text className="text-xl font-bold">{item.name}</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditIngredientCategoryScreen', {
              ingredientCategoryId: item.id,
            })
          }
          className="mr-3"
        >
          <Ionicons name="create-outline" size={24} color="#454442" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Xác nhận', `Bạn có chắc muốn xóa ${item.name}?`, [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Xóa', onPress: () => deleteCategory(item.id) },
            ])
          }
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminHeader title="Quản lý danh mục nguyên liệu" />
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
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        onEndReached={() => loadCategories(false)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Text>Đang tải...</Text> : null}
        ListEmptyComponent={
          !loading ? <Text className="text-center">Không tìm thấy danh mục</Text> : null
        }
      />
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#941D23] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('AddIngredientCategoryScreen')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};