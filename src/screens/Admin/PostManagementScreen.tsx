'use client';

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
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';

export const AdminPostManagementScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for posts
  const posts = [
    {
      id: '1',
      title: 'Cách làm Phở Bò ngon đúng vị Hà Nội',
      image:
        'https://cdn.pixabay.com/photo/2023/05/27/12/39/noodle-soup-8021418_1280.png',
      author: 'Trung Phong',
      authorAvatar:
        'https://cdn.pixabay.com/photo/2021/07/03/20/06/woman-6384768_1280.jpg',
      date: '15/04/2023',
      status: 'approved',
      likes: 245,
      comments: 32,
    },
    {
      id: '2',
      title: 'Bí quyết làm Bánh Mì giòn ngon như tiệm',
      image:
        'https://cdn.pixabay.com/photo/2018/06/10/20/30/bread-3467243_1280.jpg',
      author: 'Bảo Ngọc',
      authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      date: '20/04/2023',
      status: 'pending',
      likes: 120,
      comments: 15,
    },
    {
      id: '3',
      title: 'Cách nấu Bún Bò Huế chuẩn vị miền Trung',
      image:
        'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg',
      author: 'Minh Tuấn',
      authorAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      date: '25/04/2023',
      status: 'approved',
      likes: 189,
      comments: 27,
    },
    {
      id: '4',
      title: 'Bí quyết làm Gỏi Cuốn tôm thịt ngon đúng điệu',
      image:
        'https://cdn.pixabay.com/photo/2016/03/27/22/16/spring-roll-1284442_1280.jpg',
      author: 'Thu Hà',
      authorAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      date: '28/04/2023',
      status: 'rejected',
      likes: 78,
      comments: 8,
    },
    {
      id: '5',
      title: 'Cách làm Cơm Tấm Sườn Nướng ngon như ngoài hàng',
      image:
        'https://cdn.pixabay.com/photo/2016/03/27/22/16/rice-1284444_1280.jpg',
      author: 'Hoàng Long',
      authorAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      date: '30/04/2023',
      status: 'pending',
      likes: 156,
      comments: 19,
    },
  ];

  const filteredPosts = posts.filter((post) => {
    // Filter by search query
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'approved' && post.status === 'approved') ||
      (selectedFilter === 'pending' && post.status === 'pending') ||
      (selectedFilter === 'rejected' && post.status === 'rejected');

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return {
          bg: 'bg-green-100',
          text: 'text-green-600',
          label: 'Đã duyệt',
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-600',
          label: 'Chờ duyệt',
        };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-600', label: 'Từ chối' };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          label: 'Không xác định',
        };
    }
  };

  const renderPostItem = ({ item }) => {
    const statusStyle = getStatusColor(item.status);

    return (
      <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: item.authorAvatar }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View className="flex-1">
            <Text className="font-bold">{item.author}</Text>
            <Text className="text-gray-500 text-xs">{item.date}</Text>
          </View>
          <View className={`px-2 py-1 rounded-full ${statusStyle.bg}`}>
            <Text className={`text-xs ${statusStyle.text}`}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        <Text className="font-bold text-base mb-3">{item.title}</Text>

        <Image
          source={{ uri: item.image }}
          className="w-full h-40 rounded-lg mb-3"
        />

        <View className="flex-row justify-between items-center">
          <View className="flex-row">
            <View className="flex-row items-center mr-4">
              <Ionicons name="heart" size={16} color="#FF3B30" />
              <Text className="text-gray-500 text-xs ml-1">{item.likes}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="chatbubble" size={16} color="#007AFF" />
              <Text className="text-gray-500 text-xs ml-1">
                {item.comments}
              </Text>
            </View>
          </View>

          <View className="flex-row">
            {item.status === 'pending' && (
              <>
                <TouchableOpacity className="mr-2 bg-green-100 p-2 rounded-full">
                  <Ionicons name="checkmark" size={18} color="#34C759" />
                </TouchableOpacity>
                <TouchableOpacity className="mr-2 bg-red-100 p-2 rounded-full">
                  <Ionicons name="close" size={18} color="#FF3B30" />
                </TouchableOpacity>
              </>
            )}
            {/* onPress={() => navigation.navigate("PostDetail", { postId: item.id })} */}
            <TouchableOpacity className="mr-2">
              <Ionicons name="eye-outline" size={18} color="#454442" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <AdminHeader title="Quản lý bài đăng" />

      {/* Search and Filter */}
      <View className="px-4 py-3">
        <View className="flex-row items-center bg-white rounded-lg px-3 mb-3 shadow-sm">
          <Ionicons name="search" size={20} color="#454442" />
          <TextInput
            className="flex-1 py-2 px-2"
            placeholder="Tìm kiếm bài đăng..."
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
            className={`px-4 py-2 rounded-full mr-2 ${selectedFilter === 'approved' ? 'bg-[#941D23]' : 'bg-white'}`}
            onPress={() => setSelectedFilter('approved')}
          >
            <Text
              className={`${selectedFilter === 'approved' ? 'text-white' : 'text-gray-700'}`}
            >
              Đã duyệt
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
          <TouchableOpacity
            className={`px-4 py-2 rounded-full mr-2 ${selectedFilter === 'rejected' ? 'bg-[#941D23]' : 'bg-white'}`}
            onPress={() => setSelectedFilter('rejected')}
          >
            <Text
              className={`${selectedFilter === 'rejected' ? 'text-white' : 'text-gray-700'}`}
            >
              Từ chối
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Post List */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
};
