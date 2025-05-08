import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminIngredientCategoryStackParamList } from '@navigation/AdminIngredientCategoryStack';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

export const AdminIngredientCategoryManagementScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminIngredientCategoryStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');

  // Data for ingredient categories
  const ingredientCategories = [
    {
      id: '1',
      name: 'Thịt',
      icon: 'https://cdn-icons-png.flaticon.com/128/3082/3082051.png',
      itemCount: 12,
    },
    {
      id: '2',
      name: 'Rau củ',
      icon: 'https://cdn-icons-png.flaticon.com/128/2153/2153786.png',
      itemCount: 25,
    },
    {
      id: '3',
      name: 'Gia vị',
      icon: 'https://cdn-icons-png.flaticon.com/128/3348/3348313.png',
      itemCount: 18,
    },
    {
      id: '4',
      name: 'Hải sản',
      icon: 'https://cdn-icons-png.flaticon.com/128/2970/2970014.png',
      itemCount: 9,
    },
  ];

  const filteredCategories = ingredientCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategoryItem = ({ item }) => (
    <View className="bg-white rounded-xl p-4 shadow-sm mb-4 flex-row items-center">
      <View className="bg-red-100 p-3 rounded-full mr-3">
        <Image
          source={{ uri: item.icon }}
          className="w-8 h-8"
          resizeMode="contain"
        />
      </View>
      <View className="flex-1">
        <Text className="font-bold">{item.name}</Text>
        <Text className="text-gray-500 text-xs">{item.itemCount} món</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity onPress={() => navigation.navigate('EditIngredientCategoryScreen', { ingredientCategoryId: item.id })} className="mr-3">
          <Ionicons name="create-outline" size={20} color="#454442" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <AdminHeader title="Quản lý danh mục nguyên liệu" />

      {/* Search */}
      <View className="px-4 py-3">
        <View className="flex-row items-center bg-white rounded-lg px-3 shadow-sm">
          <Ionicons name="search" size={20} color="#454442" />
          <TextInput
            className="flex-1 py-2 px-2"
            placeholder="Tìm kiếm danh mục nguyên liệu..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#454442" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category List */}
      <FlatList
        data={filteredCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#941D23] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('AddIngredientCategoryScreen')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};