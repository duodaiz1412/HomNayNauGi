import { useState,useCallback,useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminFoodStackParamList } from '@navigation/AdminFoodStack';
import { RecipeStatus } from 'src/types';
import debounce from 'lodash.debounce';
import api from 'src/api/api';
import LikeSolid from '@components/icons/LikeSolid';
// Định nghĩa các trạng thái có thể lọc
const STATUS_FILTERS: { label: string; value: RecipeStatus }[] = [
  { label: 'Công khai', value: RecipeStatus.PUBLIC },
  { label: 'Riêng tư', value: RecipeStatus.PRIVATE },
  { label: 'Từ chối', value: RecipeStatus.REJECTED },
  { label: 'Bản nháp', value: RecipeStatus.DRAFT },
];
export const AdminFoodManagementScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminFoodStackParamList>>();

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(RecipeStatus.PUBLIC);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [recipes, setRecipes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchRecipes = async (query = "", status: RecipeStatus, currentOffset = 0) => {
    try {
      setLoading(true);
      const params: any = {
        status: status,
        offset: currentOffset,
        limit,
      };
      
      if (query && query.trim() !== '') {
        params.query = query.trim();
      }

      console.log("Fetching recipes with params:", params);
      const response = await api.get('/admin/recipes/search', { params });
      const { data, total } = response.data;
      console.log("recipes", JSON.stringify(data, null, 2));
      return { data: data || [], total: total || 0 };
    } catch (error) {
      console.error('Error fetching recipes:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách món ăn.');
      return { data: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    try {
      const newOffset = reset ? 0 : offset;
      const { data, total } = await fetchRecipes(searchQuery, selectedStatusFilter, newOffset);
      const newRecipes = reset ? data : [...recipes, ...data];
      setRecipes(newRecipes);
      setOffset(newOffset + data.length);
      setHasMore(newRecipes.length < total);
    } catch (error) {
      console.error('Error loading recipes:', error);
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  // Load dữ liệu khi searchQuery hoặc selectedStatusFilter thay đổi
  useEffect(() => {
    loadRecipes(true);
  }, [searchQuery, selectedStatusFilter]);

  // Xử lý nút xóa bộ lọc/tìm kiếm
  const handleClearFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setSelectedStatusFilter(RecipeStatus.PUBLIC);
  };
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/recipes/delete/${id}`);
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
      Alert.alert('Thành công', 'Đã xóa món ăn.');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      Alert.alert('Lỗi', 'Không thể xóa món ăn.');
    }
  };

  const renderFoodItem = ({ item }) => {
    const statusInfo = STATUS_FILTERS.find(sf => sf.value === item.status);
    const statusColor = {
      public: { bg: 'bg-green-100', text: 'text-green-700' },
      private: { bg: 'bg-blue-100', text: 'text-blue-700' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-700' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700' },
      pending_approval: { bg: 'bg-orange-100', text: 'text-orange-700' },
    }[item.status] || { bg: 'bg-gray-100', text: 'text-gray-700' };

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('FoodDetailScreen', { foodId: item.id })}
        activeOpacity={0.7}
      >
        <View className="bg-white mb-3 mx-4 rounded-2xl overflow-hidden shadow-sm">
          <View className="p-4">
            <View className="flex-row items-center">
              <View className="relative">
                <Image
                  source={{ uri: item.imageUrl || 'https://placehold.co/100x100?text=No+Image' }}
                  className="w-20 h-20 rounded-xl"
                  resizeMode="cover"
                />
                <View className={`absolute -bottom-1 -right-1 ${statusColor.bg} px-2 py-0.5 rounded-lg`}>
                  <Text className={`text-xs font-medium ${statusColor.text}`}>
                    {statusInfo?.label || item.status}
                  </Text>
                </View>
              </View>
              <View className="flex-1 ml-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-800 flex-1 mr-2" numberOfLines={2}>
                    {item.name || '(Không có tên)'}
                  </Text>
                  <View className="flex-row">
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        navigation.navigate('EditFoodScreen', { foodId: item.id });
                      }}
                      className="w-8 h-8 items-center justify-center rounded-full bg-[#88131b]/5 mr-2"
                    >
                      <Ionicons name="create-outline" size={18} color="#88131b" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        Alert.alert('Xác nhận xóa', `Bạn có chắc muốn xóa món "${item.name}"?`, [
                          { text: 'Hủy', style: 'cancel' },
                          { text: 'Xóa', onPress: () => handleDelete(item.id), style: 'destructive' },
                        ]);
                      }}
                      className="w-8 h-8 items-center justify-center rounded-full bg-red-50"
                    >
                      <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Interaction Stats */}
                <View className="flex-row items-center mt-3">
                  <View className="flex-row items-center bg-[#FF3B30]/5 px-2.5 py-1 rounded-full">
                    <Ionicons name="heart" size={14} color="#FF3B30" />
                    <Text className="text-xs text-[#FF3B30] ml-1.5 font-medium">{item.favoriteCount || 0}</Text>
                  </View>
                  <View className="flex-row items-center bg-[#007AFF]/5 px-2.5 py-1 rounded-full ml-3">
                    <Ionicons name="eye" size={14} color="#007AFF" />
                    <Text className="text-xs text-[#007AFF] ml-1.5 font-medium">{item.viewCount || 0}</Text>
                  </View>
                  <View className="flex-row items-center bg-[#FFA500]/5 px-2.5 py-1 rounded-full ml-3">
                    <LikeSolid size={14} color="#FFA500" />
                    <Text className="text-xs text-[#FFA500] ml-1.5 font-medium">{item.likeCount || 0}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminHeader title="Quản lý món ăn" />

      <View className="px-4 pt-4">
        <View className="relative">
          <TextInput
            className="bg-white h-12 rounded-2xl pl-12 pr-4 text-base shadow-sm"
            placeholder="Tìm kiếm món ăn..."
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
            >
              <Ionicons name="close-circle" size={20} color="#454442" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View className="px-4 pt-4">
        <Text className="text-gray-600 text-sm font-medium mb-2">Trạng thái:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
          {STATUS_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              className={`px-3.5 py-1.5 rounded-full mr-2 border ${
                selectedStatusFilter === filter.value
                  ? 'bg-[#88131b] border-[#88131b]'
                  : 'bg-white border-gray-300'
              }`}
              onPress={() => setSelectedStatusFilter(filter.value)}
            >
              <Text
                className={`${
                  selectedStatusFilter === filter.value ? 'text-white' : 'text-gray-700'
                } text-sm`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={recipes}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        onEndReached={() => loadRecipes(false)}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View className="px-4 mb-6">
            <Text className="text-2xl font-bold text-gray-800">Danh sách món ăn</Text>
            <Text className="text-base text-gray-500 mt-1">
              Quản lý và tổ chức các món ăn trong hệ thống
            </Text>
          </View>
        }
        ListFooterComponent={
          loading ? (
            <View className="items-center justify-center py-8">
              <View className="w-10 h-10 border-3 border-[#88131b] border-t-transparent rounded-full animate-spin" />
              <Text className="text-gray-500 mt-4 font-medium">Đang tải món ăn...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center justify-center py-16 px-4">
              <View className="w-24 h-24 bg-[#88131b]/5 rounded-full items-center justify-center mb-6">
                <Ionicons name="restaurant-outline" size={40} color="#88131b" />
              </View>
              <Text className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy món ăn</Text>
              <Text className="text-base text-gray-500 text-center">
                {searchQuery || selectedStatusFilter !== RecipeStatus.PUBLIC
                  ? 'Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc'
                  : 'Hãy thêm món ăn mới vào hệ thống'}
              </Text>
              {(searchQuery || selectedStatusFilter !== RecipeStatus.PUBLIC) && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchInput('');
                    setSearchQuery('');
                    setSelectedStatusFilter(RecipeStatus.PUBLIC);
                  }}
                  className="mt-4 bg-[#88131b]/5 px-4 py-2 rounded-full"
                >
                  <Text className="text-[#88131b] font-medium">Xóa bộ lọc</Text>
                </TouchableOpacity>
              )}
              {!searchQuery && selectedStatusFilter === RecipeStatus.PUBLIC && (
                <TouchableOpacity
                  className="mt-6 bg-[#88131b] px-6 py-3 rounded-full flex-row items-center"
                  onPress={() => navigation.navigate('AddFoodScreen')}
                >
                  <Ionicons name="add" size={20} color="white" />
                  <Text className="text-white font-medium ml-2">Thêm món ăn mới</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null
        }
      />

      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#88131b] w-14 h-14 rounded-full items-center justify-center"
        onPress={() => navigation.navigate('AddFoodScreen')}
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
