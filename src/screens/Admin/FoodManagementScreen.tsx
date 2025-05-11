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
  // Chọn một trạng thái mặc định, ví dụ: PUBLISHED
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(RecipeStatus.PUBLIC);

  const [recipes, setRecipes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchRecipes = async (query = "", status: RecipeStatus, currentOffset = 0)=> {
    try {
      setLoading(true);
      const params: any = {
        query: query || undefined,
        status: status, // Luôn gửi một trạng thái cụ thể
        offset: currentOffset,
        limit,
      };
      // console.log("Fetching recipes with params:", params);
      const response = await api.get('/recipes', { params });
      const { data, total } = response.data;
      console.log("recipes",data)
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

    const currentOffset = reset ? 0 : offset;
    const { data: newRecipes, total } = await fetchRecipes(searchQuery, selectedStatusFilter, currentOffset);

    if (reset) {
      setRecipes(newRecipes);
    } else {
      setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes]);
    }
    setOffset(currentOffset + newRecipes.length);
    setHasMore((reset ? newRecipes.length : recipes.length + newRecipes.length) < total);
  };

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setSearchQuery(text);
      setRecipes([]);
      setOffset(0);
      setHasMore(true);
    }, 500),
    []
  );

  useEffect(() => {
    setRecipes([]);
    setOffset(0);
    setHasMore(true);
    loadRecipes(true);
  }, [searchQuery, selectedStatusFilter]);


const renderFoodItem = ({ item }) => {
  const statusInfo = STATUS_FILTERS.find(sf => sf.value === item.status);
  const statusColor = {
    public: { bg: 'bg-green-100', text: 'text-green-700' },
    private: { bg: 'bg-blue-100', text: 'text-blue-700' },
    draft: { bg: 'bg-gray-100', text: 'text-gray-700' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700' },
    pending_approval: { bg: 'bg-orange-100', text: 'text-orange-700' },
  }[item.status] || { bg: 'bg-gray-100', text: 'text-gray-700' };

  const handleDelete = async () => {
    try {
      await api.delete(`/recipes/${item.id}`);
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== item.id));
      Alert.alert('Thành công', 'Đã xóa món ăn.');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      Alert.alert('Lỗi', 'Không thể xóa món ăn.');
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 shadow-md mb-4"
      onPress={() =>
        navigation.navigate('FoodDetailScreen', { foodId: item.id })
      }
    >
      <View className="flex-row">
        <Image
          source={{ uri: item.imageUrl || 'https://placehold.co/100x100?text=No+Image' }}
          className="w-24 h-24 rounded-xl mr-4 bg-gray-100"
          resizeMode="cover"
        />
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-2">
              <Text className="font-semibold text-base" numberOfLines={2}>
                {item.name || '(Không có tên)'}
              </Text>
            </View>
            <View className={`px-2 py-1 rounded-full ${statusColor.bg}`}>
              <Text className={`text-xs font-medium ${statusColor.text}`}>
                {statusInfo?.label || item.status}
              </Text>
            </View>
          </View>

          {/* Hiển thị Like, View, Favorite */}
          <View className="flex-row justify-between mb-2">
            <View className="flex-row items-center">
              <Ionicons name="heart-outline" size={16} color="#FF3B30" />
              <Text className="text-gray-600 text-xs ml-1">{item.likeCount}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="eye-outline" size={16} color="#007AFF" />
              <Text className="text-gray-600 text-xs ml-1">{item.viewCount}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="star-outline" size={16} color="#FFA500" />
              <Text className="text-gray-600 text-xs ml-1">{item.favoriteCount}</Text>
            </View>
          </View>

          <View className="flex-row justify-end pt-2 border-t border-gray-100">
            <TouchableOpacity
              className="mr-2 bg-blue-100 p-2 rounded-full"
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('EditFoodScreen', { foodId: item.id });
              }}
            >
              <Ionicons name="create-outline" size={18} color="#007AFF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-100 p-2 rounded-full"
              onPress={(e) => {
                e.stopPropagation();
                Alert.alert(
                  'Xác nhận xóa',
                  `Bạn có chắc muốn xóa món "${item.name}"?`,
                  [
                    { text: 'Hủy', style: 'cancel' },
                    {
                      text: 'Xóa',
                      onPress: handleDelete,
                      style: 'destructive',
                    },
                  ]
                );
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminHeader title="Quản lý món ăn" />

      <View className="px-4 pt-3 pb-2 bg-gray-50">
        <View className="flex-row items-center bg-white rounded-lg px-3 mb-3 shadow-sm border border-gray-200">
          <Ionicons name="search" size={20} color="#454442" />
          <TextInput
            className="flex-1 py-2 px-2 text-base"
            placeholder="Tìm kiếm theo tên món ăn..."
            value={searchInput}
            onChangeText={(text) => {
              setSearchInput(text);
              debouncedSearch(text);
            }}
          />
          {searchInput ? (
            <TouchableOpacity onPress={() => { setSearchInput(''); debouncedSearch(''); }}>
              <Ionicons name="close-circle" size={20} color="#454442" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View>
            <Text className="text-gray-600 text-sm font-medium mb-1.5">Trạng thái:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
            {/* Sử dụng STATUS_FILTERS đã định nghĩa ở trên */}
            {STATUS_FILTERS.map((filter) => (
                <TouchableOpacity
                key={filter.value} // value giờ là RecipeStatus, không có 'all'
                className={`px-3.5 py-1.5 rounded-full mr-2 border ${
                    selectedStatusFilter === filter.value
                    ? 'bg-[#941D23] border-[#941D23]'
                    : 'bg-white border-gray-300'
                }`}
                onPress={() => {
                    setSelectedStatusFilter(filter.value);
                }}
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
      </View>

      <FlatList
        data={recipes}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        onEndReached={() => loadRecipes(false)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && recipes.length > 0 ? (
            <View className="items-center justify-center py-4">
              <ActivityIndicator size="small" color="#941D23" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading && recipes.length === 0 ? (
            <View className="flex-1 items-center justify-center mt-10">
              <Ionicons name="leaf-outline" size={48} color="gray" />
              <Text className="text-gray-500 mt-2">Không có món ăn nào.</Text>
              { (searchQuery || selectedStatusFilter !== RecipeStatus.PUBLIC) && // So sánh với trạng thái mặc định
                <TouchableOpacity onPress={() => {
                    setSearchInput('');
                    setSearchQuery('');
                    setSelectedStatusFilter(RecipeStatus.PUBLIC); // Reset về trạng thái mặc định
                }}>
                    <Text className="text-blue-500 mt-1">Xóa bộ lọc/tìm kiếm</Text>
                </TouchableOpacity>
              }
            </View>
          ) : null
        }
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('AddFoodScreen')}
        className="absolute bottom-6 right-6 bg-[#941D23] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 5 }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
