import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import api from 'src/api/api';
import { AdminHeader } from '@components/AdminHeader/AdminHeader'; 
import { AdminUserStackParamList } from '@navigation/AdminUserStack';

// Định nghĩa kiểu route param
type UserDetailScreenRouteProp = RouteProp<
  AdminUserStackParamList,
  'UserDetailScreen'
>;

export const UserDetailScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminUserStackParamList>>();
  const route = useRoute<UserDetailScreenRouteProp>();
  const { userId } = route.params;

  // State quản lý dữ liệu
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<'recipes' | 'favorites' | 'activity'>(
    'recipes'
  );
  const [userData, setUserData] = useState<{
    id: string;
    fullName: string;
    email: string;
    phone: string;
    bio: string;
    avatar: string;
    isAdmin: boolean;
    isActive: boolean;
    joinDate: string;
    likes: number;          
    postsCount: number;     
    favoritesCount: number;
  } | null>(null);

  const [userRecipes, setUserRecipes] = useState<any[]>([]);  
  const [userFavorites, setUserFavorites] = useState<any[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  

  useEffect(() => {
    if (!userId) return;
    setIsFetching(true);
    api.get(`/admin/user-profiles/${userId}/details`)
      .then((response) => {
        const data = response.data.data;
        setUserData({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          bio: data.bio,
          avatar: data.avatar,
          isAdmin: data.isAdmin,
          isActive: data.isActive,
          joinDate: data.joinDate,
          likes: data.likes ?? 0,  // giả sử API có trả về số lượt thích
          postsCount: data.posts ? data.posts.length : 0,  // vẫn dùng posts làm công thức
          favoritesCount: data.favorites ? data.favorites.length : 0,
        });
        setUserRecipes(data.posts ?? []);
        setUserFavorites(data.favorites ?? []);
        setUserActivity(data.activity ?? []);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy thông tin user:', error);
      })
      .then(() => setIsFetching(false));
  }, [userId]);

  // Hàm render từng công thức
  const renderRecipeItem = ({ item }: { item: any }) => (
    <View
      key={item.id}
      className="mb-4 rounded-md bg-white p-4 shadow-sm"
      style={{ borderWidth: 1, borderColor: '#ddd' }}
    >
      <Text className="font-semibold text-lg mb-2">{item.title}</Text>
      <Text className="text-gray-600">{item.content}</Text>
      <Text className="mt-2 text-xs text-gray-400">
        Đăng lúc: {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  // Hàm render món yêu thích giữ nguyên
  const renderFavoriteItem = ({ item }: { item: any }) => (
    <View
      key={item.id}
      className="mb-4 rounded-md bg-white p-4 shadow-sm flex-row items-center"
      style={{ borderWidth: 1, borderColor: '#ddd' }}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: 60, height: 60, borderRadius: 6, marginRight: 12 }}
      />
      <View className="flex-1">
        <Text className="font-semibold text-lg">{item.name}</Text>
        <Text className="text-gray-600">{item.description}</Text>
      </View>
    </View>
  );

  // Hàm render hoạt động giữ nguyên
  const renderActivityItem = ({ item }: { item: any }) => (
    <View
      key={item.id}
      className="mb-4 rounded-md bg-white p-4 shadow-sm"
      style={{ borderWidth: 1, borderColor: '#ddd' }}
    >
      <Text>{item.description}</Text>
      <Text className="mt-2 text-xs text-gray-400">
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  if (isFetching) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#941D23" />
          <Text className="mt-4 text-gray-600">
            Đang tải thông tin người dùng...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500">Không tìm thấy thông tin người dùng</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdminHeader title="Hồ sơ người dùng" />
      <ScrollView className="flex-1">
        <View className="bg-white p-4 shadow-sm">
          <View className="flex-row items-center">
            <Image
              source={{ uri: userData.avatar }}
              className="w-20 h-20 rounded-full mr-4"
              style={{ width: 80, height: 80, borderRadius: 40, marginRight: 16 }}
            />
            <View className="flex-1">
              <Text className="text-xl font-bold">{userData.fullName}</Text>
              <Text className="text-gray-500 text-xs mb-1">{userData.email}</Text>
              <Text className="text-gray-500 text-xs">{userData.phone}</Text>
              <View
                className="mt-2 px-2 py-0.5 rounded-full self-start"
                style={{
                  backgroundColor: userData.isActive ? '#d1fae5' : '#fee2e2',
                }}
              >
                <Text
                  className="text-xs"
                  style={{ color: userData.isActive ? '#059669' : '#b91c1c' }}
                >
                  {userData.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Text>
              </View>
            </View>
          </View>

          <Text className="text-gray-700 mt-4">{userData.bio}</Text>

          <View
            className="flex-row justify-between mt-4 pt-4 border-t border-gray-100"
            style={{ borderColor: '#e5e7eb' }}
          >
            <View className="items-center">
              <Text className="text-lg font-bold">{userData.postsCount}</Text>
              <Text className="text-gray-500 text-xs">Công thức</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold">{userData.likes}</Text>
              <Text className="text-gray-500 text-xs">Lượt thích</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold">{userData.favoritesCount}</Text>
              <Text className="text-gray-500 text-xs">Yêu thích</Text>
            </View>
          </View>

          <View className="flex-row mt-4">
            <TouchableOpacity
              className="flex-1 mr-2 bg-[#941D23] py-2 rounded-lg items-center"
              onPress={() =>
                navigation.navigate('EditUserScreen', { userId: userData.id })
              }
            >
              <Text className="text-white font-medium">Chỉnh sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-gray-200 py-2 rounded-lg items-center">
              <Text className="text-gray-700 font-medium">Nhắn tin</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View
          className="flex-row bg-white mt-4 border-b border-gray-200"
          style={{ borderColor: '#e5e7eb' }}
        >
          <TouchableOpacity
            className={`flex-1 py-3 ${
              activeTab === 'recipes' ? 'border-b-2 border-[#941D23]' : ''
            }`}
            onPress={() => setActiveTab('recipes')}
            style={{
              borderBottomWidth: activeTab === 'recipes' ? 2 : 0,
              borderBottomColor: activeTab === 'recipes' ? '#941D23' : undefined,
            }}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === 'recipes' ? 'text-[#941D23]' : 'text-gray-500'
              }`}
              style={{ color: activeTab === 'recipes' ? '#941D23' : '#6B7280' }}
            >
              Công thức
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 ${
              activeTab === 'favorites' ? 'border-b-2 border-[#941D23]' : ''
            }`}
            onPress={() => setActiveTab('favorites')}
            style={{
              borderBottomWidth: activeTab === 'favorites' ? 2 : 0,
              borderBottomColor: activeTab === 'favorites' ? '#941D23' : undefined,
            }}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === 'favorites' ? 'text-[#941D23]' : 'text-gray-500'
              }`}
              style={{ color: activeTab === 'favorites' ? '#941D23' : '#6B7280' }}
            >
              Yêu thích
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 ${
              activeTab === 'activity' ? 'border-b-2 border-[#941D23]' : ''
            }`}
            onPress={() => setActiveTab('activity')}
            style={{
              borderBottomWidth: activeTab === 'activity' ? 2 : 0,
              borderBottomColor: activeTab === 'activity' ? '#941D23' : undefined,
            }}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === 'activity' ? 'text-[#941D23]' : 'text-gray-500'
              }`}
              style={{ color: activeTab === 'activity' ? '#941D23' : '#6B7280' }}
            >
              Hoạt động
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nội dung tab */}
        <View className="p-4">
          {activeTab === 'recipes' && (
            <View>
              {userRecipes.length === 0 ? (
                <Text className="text-center text-gray-400 mt-8">
                  Người dùng chưa tạo công thức nào.
                </Text>
              ) : (
                userRecipes.map((item) => renderRecipeItem({ item }))
              )}
            </View>
          )}

          {activeTab === 'favorites' && (
            <View>
              {userFavorites.length === 0 ? (
                <Text className="text-center text-gray-400 mt-8">
                  Người dùng chưa thêm món yêu thích nào.
                </Text>
              ) : (
                userFavorites.map((item) => renderFavoriteItem({ item }))
              )}
            </View>
          )}

          {activeTab === 'activity' && (
            <View>
              {userActivity.length === 0 ? (
                <Text className="text-center text-gray-400 mt-8">
                  Người dùng chưa có hoạt động nào.
                </Text>
              ) : (
                userActivity.map((item) => renderActivityItem({ item }))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
