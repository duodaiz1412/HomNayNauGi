import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminFoodStackParamList } from '@navigation/AdminFoodStack';

export const AdminFoodManagementScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminFoodStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Mock data for categories
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: '1', name: 'Phở' },
    { id: '2', name: 'Bánh mì' },
    { id: '3', name: 'Cơm' },
    { id: '4', name: 'Bún' },
    { id: '5', name: 'Gỏi cuốn' },
  ];

  // Mock data for food items
  const foodItems = [
    {
      id: '1',
      name: 'Phở Hà Nội',
      image:
        'https://cdn.pixabay.com/photo/2023/05/27/12/39/noodle-soup-8021418_1280.png',
      category: 'Phở',
      categoryId: '1',
      status: 'active',
      likes: 1245,
      views: 5678,
      saves: 320,
      nutrition: {
        protein: '25g',
        fat: '15g',
        carbs: '60g',
        calories: '480',
      },
      ingredients: ['Phở', 'Thịt bò', 'Hành', 'Gừng'],
      steps: 5,
    },
    {
      id: '2',
      name: 'Bánh Mì Pate',
      image:
        'https://cdn.pixabay.com/photo/2018/06/10/20/30/bread-3467243_1280.jpg',
      category: 'Bánh mì',
      categoryId: '2',
      status: 'active',
      likes: 987,
      views: 3456,
      saves: 210,
      nutrition: {
        protein: '18g',
        fat: '12g',
        carbs: '45g',
        calories: '380',
      },
      ingredients: ['Bánh mì', 'Pate', 'Thịt', 'Rau'],
      steps: 3,
    },
    {
      id: '3',
      name: 'Bún Bò Huế',
      image:
        'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg',
      category: 'Bún',
      categoryId: '4',
      status: 'active',
      likes: 876,
      views: 2987,
      saves: 180,
      nutrition: {
        protein: '22g',
        fat: '18g',
        carbs: '55g',
        calories: '520',
      },
      ingredients: ['Bún', 'Thịt bò', 'Sả', 'Ớt'],
      steps: 6,
    },
    {
      id: '4',
      name: 'Gỏi Cuốn',
      image:
        'https://cdn.pixabay.com/photo/2016/03/27/22/16/spring-roll-1284442_1280.jpg',
      category: 'Gỏi cuốn',
      categoryId: '5',
      status: 'pending',
      likes: 543,
      views: 1876,
      saves: 150,
      nutrition: {
        protein: '15g',
        fat: '8g',
        carbs: '30g',
        calories: '280',
      },
      ingredients: ['Bánh tráng', 'Tôm', 'Thịt', 'Rau'],
      steps: 4,
    },
    {
      id: '5',
      name: 'Cơm Tấm Sườn Nướng',
      image:
        'https://cdn.pixabay.com/photo/2016/03/27/22/16/rice-1284444_1280.jpg',
      category: 'Cơm',
      categoryId: '3',
      status: 'active',
      likes: 765,
      views: 2345,
      saves: 190,
      nutrition: {
        protein: '28g',
        fat: '20g',
        carbs: '70g',
        calories: '580',
      },
      ingredients: ['Cơm', 'Sườn', 'Trứng', 'Đồ chua'],
      steps: 5,
    },
  ];

  const filteredFoods = foodItems.filter((item) => {
    // Filter by search query
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'active' && item.status === 'active') ||
      (selectedFilter === 'pending' && item.status === 'pending');

    // Filter by category
    const matchesCategory =
      selectedCategory === 'all' || item.categoryId === selectedCategory;

    return matchesSearch && matchesFilter && matchesCategory;
  });

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity 
      className="bg-white rounded-xl p-4 shadow-sm mb-4"
      onPress={() => navigation.navigate('FoodDetailScreen', { foodId: item.id })}
    >
      <View className="flex-row">
        <Image
          source={{ uri: item.image }}
          className="w-36 h-40 rounded-lg mr-4"
        />
        <View className="flex-1">

          <View className="flex-row justify-between items-start">

            <Text className="font-bold text-2xl flex-1 mr-2">{item.name}</Text>

            <View
              className={`px-2.5 py-1.5 rounded-full ${
                item.status === 'active' ? 'bg-green-100' : 'bg-yellow-100'
              }`}
            >
              <Text
                className={`text-base ${
                  item.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                }`}
              >
                {item.status === 'active' ? 'Đang hiển thị' : 'Chờ duyệt'}
              </Text>
            </View>
          </View>
  
          <Text className="text-gray-500 text-lg mt-2">
            Danh mục: {item.category}
          </Text>
  
          <View className="flex-row mt-3">
            <View className="flex-row items-center mr-5">
              {/* Tăng kích thước icon lớn hơn */}
              <Ionicons name="heart" size={18} color="#FF3B30" />
              <Text className="text-gray-500 text-base ml-1.5">
                {item.likes}
              </Text>
            </View>
            <View className="flex-row items-center mr-5">
              <Ionicons name="eye" size={18} color="#007AFF" />
              <Text className="text-gray-500 text-base ml-1.5">
                {item.views}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="bookmark" size={18} color="#34C759" />
              <Text className="text-gray-500 text-base ml-1.5">
                {item.saves}
              </Text>
            </View>
          </View>
          
          {/* Action Buttons - đặt ngay dưới các nút view/save/like, vẫn trong phần bên phải */}
          <View className="flex-row justify-end mt-3">
            <TouchableOpacity
              className="mr-2 bg-green-100 p-2 rounded-full"
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('EditFoodScreen', { foodId: item.id });
              }}
            >
              <Ionicons name="create-outline" size={18} color="#34C759" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-red-100 p-2 rounded-full"
              onPress={(e) => {
                e.stopPropagation(); 
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <AdminHeader title="Quản lý món ăn" />

      <View className="px-4 py-3">
        <View className="flex-row items-center bg-white rounded-lg px-3 mb-3 shadow-sm">
          <Ionicons name="search" size={20} color="#454442" />
          <TextInput
            className="flex-1 py-2 px-2"
            placeholder="Tìm kiếm món ăn..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#454442" />
            </TouchableOpacity>
          ) : null}
        </View>

        <Text className="text-gray-700 font-medium mb-2">Trạng thái:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
        >
          <TouchableOpacity
            className={`px-4 py-2 rounded-full mr-2 ${selectedFilter === 'all' ? 'bg-[#941D23]' : 'bg-white'}`}
            onPress={() => setSelectedFilter('all')}
          >
            <Text
              className={`${selectedFilter === 'all' ? 'text-white' : 'text-gray-700'}`}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-full mr-2 ${selectedFilter === 'active' ? 'bg-[#941D23]' : 'bg-white'}`}
            onPress={() => setSelectedFilter('active')}
          >
            <Text
              className={`${selectedFilter === 'active' ? 'text-white' : 'text-gray-700'}`}
            >
              Đang hiển thị
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-full mr-2 ${selectedFilter === 'pending' ? 'bg-[#941D23]' : 'bg-white'}`}
            onPress={() => setSelectedFilter('pending')}
          >
            <Text
              className={`${selectedFilter === 'pending' ? 'text-white' : 'text-gray-700'}`}
            >
              Chờ duyệt
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Text className="text-gray-700 font-medium mb-2">Danh mục:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className={`px-4 py-2 rounded-full mr-2 ${selectedCategory === category.id ? 'bg-[#941D23]' : 'bg-white'}`}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                className={`${selectedCategory === category.id ? 'text-white' : 'text-gray-700'}`}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Food List */}
      <FlatList
        data={filteredFoods}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Add Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddFoodScreen')}
        className="absolute bottom-6 right-6 bg-[#941D23] w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
