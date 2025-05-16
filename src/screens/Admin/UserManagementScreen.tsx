import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminUserStackParamList } from '@navigation/AdminUserStack';
import api from '../../api/api';

export const UserManagementScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminUserStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAllUserProfiles = async () => {
    const response = await api.get('/admin/user-profiles');
    return response.data;
  };

  const deleteUserProfile = async (userId: number | string) => {
    await api.delete(`/admin/user-profiles/${userId}`);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUserProfiles();
      console.log('===> User data:', data[0]);
      setUsers(data);
    } catch (err) {
      setError('Lấy danh sách người dùng thất bại');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user.fullName ?? '';
      const email = user.email ?? '';
      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase());

      const userStatus = user.account?.status ?? '';
      const userRole = user.account?.username === 'admin' ? 'admin' : 'user';

      const matchesFilter =
        selectedFilter === 'all' ||
        (selectedFilter === 'active' && userStatus === 'active') ||
        (selectedFilter === 'inactive' && userStatus === 'inactive') ||
        (selectedFilter === 'admin' && userRole === 'admin');

      return matchesSearch && matchesFilter;
    });
  }, [users, searchQuery, selectedFilter]);

  const handleDeleteUser = (userId: number | string, userName: string) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa người dùng "${userName}" không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserProfile(userId);
              setUsers((prev) => prev.filter((user) => user.id !== userId));
              Alert.alert('Thành công', `Đã xóa người dùng "${userName}"`);
            } catch (err) {
              Alert.alert('Lỗi', 'Xóa người dùng thất bại');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderUserItem = ({ item }: { item: any }) => {
    const name = item.fullName ?? 'Không tên';
    const email = item.email ?? 'Không có email';
    const role = item.account?.username === 'admin' ? 'admin' : 'user';
    const status = item.account?.status ?? 'inactive';

    return (
      <View className="bg-white rounded-xl p-4 shadow-sm mb-4 flex-row">
        <Image
          source={{ uri: item.avatar }}
          className="w-16 h-16 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-bold text-base">{name}</Text>
              <Text className="text-gray-500 text-xs">{email}</Text>
            </View>
            <View
              className={`px-2 py-1 rounded-full ${
                role === 'admin'
                  ? 'bg-purple-100'
                  : status === 'active'
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}
            >
              <Text
                className={`text-xs ${
                  role === 'admin'
                    ? 'text-purple-600'
                    : status === 'active'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {role === 'admin'
                  ? 'Admin'
                  : status === 'active'
                  ? 'Hoạt động'
                  : 'Không hoạt động'}
              </Text>
            </View>
          </View>

          <View className="flex-row mt-2">
            <View className="flex-row items-center mr-4">
              <Ionicons name="document-text-outline" size={14} color="#454442" />
              <Text className="text-gray-500 text-xs ml-1">
                {item.posts || 0} bài viết
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="people-outline" size={14} color="#454442" />
              <Text className="text-gray-500 text-xs ml-1">
                {item.followers || 0} người theo dõi
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
              onPress={() => handleDeleteUser(item.id, name)}
            >
              <Ionicons name="trash-outline" size={14} color="#FF3B30" />
              <Text className="text-red-600 text-xs ml-1">Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminHeader title="Quản lí người dùng" />
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
          {['all', 'active', 'inactive', 'admin'].map((filter) => (
            <TouchableOpacity
              key={filter}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedFilter === filter ? 'bg-[#941D23]' : 'bg-white'
              }`}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text className={`${selectedFilter === filter ? 'text-white' : 'text-gray-700'}`}>
                {filter === 'all'
                  ? 'Tất cả'
                  : filter === 'active'
                  ? 'Hoạt động'
                  : filter === 'inactive'
                  ? 'Không hoạt động'
                  : 'Admin'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#941D23" style={{ marginTop: 50 }} />
      ) : error ? (
        <View className="items-center justify-center py-8">
          <Text className="text-red-500">{error}</Text>
          <TouchableOpacity onPress={fetchUsers} className="mt-3 bg-[#941D23] px-4 py-2 rounded">
            <Text className="text-white">Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-8">
              <Ionicons name="people-outline" size={48} color="#CCCCCC" />
              <Text className="text-gray-500 mt-2">Không tìm thấy người dùng nào</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#941D23] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('AddUserScreen')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
