import { useState, useEffect } from 'react';
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
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { AdminUserStackParamList } from '@navigation/AdminUserStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type UserDetailScreenRouteProp = RouteProp<
  AdminUserStackParamList,
  'UserDetailScreen'
>;
export const UserDetailScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminUserStackParamList>>();
  const route = useRoute<UserDetailScreenRouteProp>();
  const { userId } = route.params;

  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [userData, setUserData] = useState(null);

  // Mock data for user posts
  const userPosts = [
    {
      id: '1',
      title: 'Cách làm Phở Bò ngon đúng vị Hà Nội',
      image:
        'https://cdn.pixabay.com/photo/2023/05/27/12/39/noodle-soup-8021418_1280.png',
      date: '15/04/2023',
      likes: 245,
      comments: 32,
    },
    {
      id: '2',
      title: 'Bí quyết làm Bánh Mì giòn ngon như tiệm',
      image:
        'https://cdn.pixabay.com/photo/2018/06/10/20/30/bread-3467243_1280.jpg',
      date: '20/04/2023',
      likes: 120,
      comments: 15,
    },
    {
      id: '3',
      title: 'Cách nấu Bún Bò Huế chuẩn vị miền Trung',
      image:
        'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg',
      date: '25/04/2023',
      likes: 189,
      comments: 27,
    },
  ];

  // Mock data for user favorites
  const userFavorites = [
    {
      id: '1',
      name: 'Phở Hà Nội',
      image:
        'https://cdn.pixabay.com/photo/2023/05/27/12/39/noodle-soup-8021418_1280.png',
      author: 'Quốc Anh',
      date: '10/03/2023',
    },
    {
      id: '2',
      name: 'Bánh Mì Pate',
      image:
        'https://cdn.pixabay.com/photo/2018/06/10/20/30/bread-3467243_1280.jpg',
      author: 'Bảo Ngọc',
      date: '15/03/2023',
    },
    {
      id: '4',
      name: 'Gỏi Cuốn',
      image:
        'https://cdn.pixabay.com/photo/2016/03/27/22/16/spring-roll-1284442_1280.jpg',
      author: 'Thu Hà',
      date: '05/04/2023',
    },
  ];

  // Mock data for user activity
  const userActivity = [
    {
      id: '1',
      type: 'like',
      content: 'Đã thích món Phở Bò',
      date: 'Hôm nay, 10:30',
    },
    {
      id: '2',
      type: 'comment',
      content: 'Đã bình luận về món Bánh Mì Pate',
      date: 'Hôm qua, 15:45',
    },
    {
      id: '3',
      type: 'save',
      content: 'Đã lưu món Bún Bò Huế',
      date: '20/04/2023, 09:15',
    },
    {
      id: '4',
      type: 'post',
      content: 'Đã đăng món Gỏi Cuốn',
      date: '15/04/2023, 14:20',
    },
    {
      id: '5',
      type: 'follow',
      content: 'Đã theo dõi Quốc Anh',
      date: '10/04/2023, 08:30',
    },
  ];

  // Fetch user data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock data for the selected user
      const userData = {
        id: userId,
        fullName: 'Trung Phong',
        email: 'trungphongtrinh678@gmail.com',
        phone: '0348139449',
        bio: 'Xin chào, nếu bạn đang tìm kiếm những món ăn Việt thì xin chúc mừng, bạn đến đúng nơi rồi đây!',
        avatar:
          'https://cdn.pixabay.com/photo/2021/07/03/20/06/woman-6384768_1280.jpg',
        isAdmin: false,
        isActive: true,
        joinDate: '01/01/2023',
        followers: 245,
        following: 120,
        posts: 12,
        favorites: 35,
      };

      setUserData(userData);
      setIsFetching(false);
    }, 1000);
  }, [userId]);

  // Render post item
  const renderPostItem = ({ item }) => (
    <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
      <Image
        source={{ uri: item.image }}
        className="w-full h-40 rounded-lg mb-3"
      />
      <Text className="font-bold text-base mb-2">{item.title}</Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-500 text-xs">{item.date}</Text>
        <View className="flex-row">
          <View className="flex-row items-center mr-4">
            <Ionicons name="heart" size={14} color="#FF3B30" />
            <Text className="text-gray-500 text-xs ml-1">{item.likes}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="chatbubble" size={14} color="#007AFF" />
            <Text className="text-gray-500 text-xs ml-1">{item.comments}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Render favorite item
  const renderFavoriteItem = ({ item }) => (
    <View className="bg-white rounded-xl p-4 shadow-sm mb-4 flex-row">
      <Image
        source={{ uri: item.image }}
        className="w-20 h-20 rounded-lg mr-3"
      />
      <View className="flex-1">
        <Text className="font-bold text-base mb-1">{item.name}</Text>
        <Text className="text-gray-500 text-xs mb-2">
          Đăng bởi: {item.author}
        </Text>
        <Text className="text-gray-500 text-xs">{item.date}</Text>
      </View>
    </View>
  );

  // Render activity item
  const renderActivityItem = ({ item }) => (
    <View className="bg-white rounded-xl p-4 shadow-sm mb-4 flex-row items-center">
      <View
        className={`rounded-full p-2 mr-3 ${
          item.type === 'like'
            ? 'bg-red-100'
            : item.type === 'comment'
              ? 'bg-blue-100'
              : item.type === 'save'
                ? 'bg-green-100'
                : item.type === 'post'
                  ? 'bg-purple-100'
                  : 'bg-yellow-100'
        }`}
      >
        <Ionicons
          name={
            item.type === 'like'
              ? 'heart'
              : item.type === 'comment'
                ? 'chatbubble'
                : item.type === 'save'
                  ? 'bookmark'
                  : item.type === 'post'
                    ? 'document-text'
                    : 'person-add'
          }
          size={16}
          color={
            item.type === 'like'
              ? '#FF3B30'
              : item.type === 'comment'
                ? '#007AFF'
                : item.type === 'save'
                  ? '#34C759'
                  : item.type === 'post'
                    ? '#AF52DE'
                    : '#FF9500'
          }
        />
      </View>
      <View className="flex-1">
        <Text className="text-gray-800">{item.content}</Text>
        <Text className="text-gray-500 text-xs mt-1">{item.date}</Text>
      </View>
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <AdminHeader title="Hồ sơ người dùng" />

      <ScrollView className="flex-1">
        {/* User Profile */}
        <View className="bg-white p-4 shadow-sm">
          <View className="flex-row items-center">
            <Image
              source={{ uri: userData.avatar }}
              className="w-20 h-20 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-xl font-bold">{userData.fullName}</Text>
              <Text className="text-gray-500 text-xs mb-1">
                {userData.email}
              </Text>
              <Text className="text-gray-500 text-xs">{userData.phone}</Text>
              <View
                className={`mt-2 px-2 py-0.5 rounded-full self-start ${
                  userData.isActive ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <Text
                  className={`text-xs ${userData.isActive ? 'text-green-600' : 'text-red-600'}`}
                >
                  {userData.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Text>
              </View>
            </View>
          </View>

          <Text className="text-gray-700 mt-4">{userData.bio}</Text>

          <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-100">
            <View className="items-center">
              <Text className="text-lg font-bold">{userData.posts}</Text>
              <Text className="text-gray-500 text-xs">Bài viết</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold">{userData.followers}</Text>
              <Text className="text-gray-500 text-xs">Người theo dõi</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold">{userData.following}</Text>
              <Text className="text-gray-500 text-xs">Đang theo dõi</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold">{userData.favorites}</Text>
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
        <View className="flex-row bg-white mt-4 border-b border-gray-200">
          <TouchableOpacity
            className={`flex-1 py-3 ${activeTab === 'posts' ? 'border-b-2 border-[#941D23]' : ''}`}
            onPress={() => setActiveTab('posts')}
          >
            <Text
              className={`text-center font-medium ${activeTab === 'posts' ? 'text-[#941D23]' : 'text-gray-500'}`}
            >
              Bài viết
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 ${activeTab === 'favorites' ? 'border-b-2 border-[#941D23]' : ''}`}
            onPress={() => setActiveTab('favorites')}
          >
            <Text
              className={`text-center font-medium ${activeTab === 'favorites' ? 'text-[#941D23]' : 'text-gray-500'}`}
            >
              Yêu thích
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 ${activeTab === 'activity' ? 'border-b-2 border-[#941D23]' : ''}`}
            onPress={() => setActiveTab('activity')}
          >
            <Text
              className={`text-center font-medium ${activeTab === 'activity' ? 'text-[#941D23]' : 'text-gray-500'}`}
            >
              Hoạt động
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View className="p-4">
          {activeTab === 'posts' && (
            <>
              {userPosts.length > 0 ? (
                userPosts.map((post) => renderPostItem({ item: post }))
              ) : (
                <View className="items-center justify-center py-8">
                  <Ionicons
                    name="document-text-outline"
                    size={48}
                    color="#CCCCCC"
                  />
                  <Text className="text-gray-500 mt-2">
                    Không có bài viết nào
                  </Text>
                </View>
              )}
            </>
          )}

          {activeTab === 'favorites' && (
            <>
              {userFavorites.length > 0 ? (
                userFavorites.map((favorite) =>
                  renderFavoriteItem({ item: favorite })
                )
              ) : (
                <View className="items-center justify-center py-8">
                  <Ionicons name="heart-outline" size={48} color="#CCCCCC" />
                  <Text className="text-gray-500 mt-2">
                    Không có món ăn yêu thích nào
                  </Text>
                </View>
              )}
            </>
          )}

          {activeTab === 'activity' && (
            <>
              {userActivity.length > 0 ? (
                userActivity.map((activity) =>
                  renderActivityItem({ item: activity })
                )
              ) : (
                <View className="items-center justify-center py-8">
                  <Ionicons name="time-outline" size={48} color="#CCCCCC" />
                  <Text className="text-gray-500 mt-2">
                    Không có hoạt động nào gần đây
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
