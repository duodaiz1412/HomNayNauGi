import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminUserStackParamList } from '@navigation/AdminUserStack';

export const UserManagementScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminUserStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for users
  const users = [
    {
      id: '1',
      name: 'Trung Phong',
      avatar:
        'https://cdn.pixabay.com/photo/2021/07/03/20/06/woman-6384768_1280.jpg',
      email: 'trungphongtrinh678@gmail.com',
      role: 'user',
      status: 'active',
      posts: 12,
      followers: 245,
    },
    {
      id: '2',
      name: 'Quốc Anh',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      email: 'quocanh@gmail.com',
      role: 'admin',
      status: 'active',
      posts: 45,
      followers: 1245,
    },
    {
      id: '3',
      name: 'Bảo Ngọc',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      email: 'baongoc@gmail.com',
      role: 'user',
      status: 'inactive',
      posts: 8,
      followers: 120,
    },
    {
      id: '4',
      name: 'Minh Tuấn',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      email: 'minhtuan@gmail.com',
      role: 'user',
      status: 'active',
      posts: 23,
      followers: 567,
    },
    {
      id: '5',
      name: 'Thu Hà',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      email: 'thuha@gmail.com',
      role: 'user',
      status: 'active',
      posts: 15,
      followers: 345,
    },
  ];

  const filteredUsers = users.filter((user) => {
    // Filter by search query
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'active' && user.status === 'active') ||
      (selectedFilter === 'inactive' && user.status === 'inactive') ||
      (selectedFilter === 'admin' && user.role === 'admin');

    return matchesSearch && matchesFilter;
  });

  // Handle delete user
  const handleDeleteUser = (userId, userName) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa người dùng "${userName}" không?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            // Handle delete user logic here
            Alert.alert('Thành công', `Đã xóa người dùng "${userName}"`);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderUserItem = ({ item }) => (
    <View className="bg-white rounded-xl p-4 shadow-sm mb-4 flex-row">
      <Image
        source={{ uri: item.avatar }}
        className="w-16 h-16 rounded-full mr-3"
      />
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-bold text-base">{item.name}</Text>
            <Text className="text-gray-500 text-xs">{item.email}</Text>
          </View>
          <View
            className={`px-2 py-1 rounded-full ${
              item.role === 'admin'
                ? 'bg-purple-100'
                : item.status === 'active'
                  ? 'bg-green-100'
                  : 'bg-red-100'
            }`}
          >
            <Text
              className={`text-xs ${
                item.role === 'admin'
                  ? 'text-purple-600'
                  : item.status === 'active'
                    ? 'text-green-600'
                    : 'text-red-600'
              }`}
            >
              {item.role === 'admin'
                ? 'Admin'
                : item.status === 'active'
                  ? 'Hoạt động'
                  : 'Không hoạt động'}
            </Text>
          </View>
        </View>

        <View className="flex-row mt-2">
          <View className="flex-row items-center mr-4">
            <Ionicons name="document-text-outline" size={14} color="#454442" />
            <Text className="text-gray-500 text-xs ml-1">
              {item.posts} bài viết
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="people-outline" size={14} color="#454442" />
            <Text className="text-gray-500 text-xs ml-1">
              {item.followers} người theo dõi
            </Text>
          </View>
        </View>

        <View className="flex-row mt-2 justify-end">
          <TouchableOpacity
            className="mr-2 bg-blue-100 px-3 py-1.5 rounded-full flex-row items-center"
            onPress={() =>
              navigation.navigate('UserDetailScreen', { userId: item.id })
            }
          >
            <Ionicons name="eye-outline" size={14} color="#007AFF" />
            <Text className="text-blue-600 text-xs ml-1">Chi tiết</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="mr-2 bg-green-100 px-3 py-1.5 rounded-full flex-row items-center"
            onPress={() =>
              navigation.navigate('EditUserScreen', { userId: item.id })
            }
          >
            <Ionicons name="create-outline" size={14} color="#34C759" />
            <Text className="text-green-600 text-xs ml-1">Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-100 px-3 py-1.5 rounded-full flex-row items-center"
            onPress={() => handleDeleteUser(item.id, item.name)}
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
      <AdminHeader title="Quản lí người dùng" />

      {/* Search and Filter */}
      <View className="px-4 py-3">
        <View className="flex-row items-center bg-white rounded-lg px-3 mb-3 shadow-sm">
          <Ionicons name="search" size={20} color="#454442" />
          <TextInput
            className="flex-1 py-2 px-2"
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#454442" />
            </TouchableOpacity>
          ) : null}
        </View>

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
              Hoạt động
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-full mr-2 ${selectedFilter === 'inactive' ? 'bg-[#941D23]' : 'bg-white'}`}
            onPress={() => setSelectedFilter('inactive')}
          >
            <Text
              className={`${selectedFilter === 'inactive' ? 'text-white' : 'text-gray-700'}`}
            >
              Không hoạt động
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-full mr-2 ${selectedFilter === 'admin' ? 'bg-[#941D23]' : 'bg-white'}`}
            onPress={() => setSelectedFilter('admin')}
          >
            <Text
              className={`${selectedFilter === 'admin' ? 'text-white' : 'text-gray-700'}`}
            >
              Admin
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-8">
            <Ionicons name="people-outline" size={48} color="#CCCCCC" />
            <Text className="text-gray-500 mt-2">
              Không tìm thấy người dùng nào
            </Text>
          </View>
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#941D23] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('AddUserScreen')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
