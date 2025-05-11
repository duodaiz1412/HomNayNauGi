import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { mockData } from '../../MockData/Data';
const backgroundImage = require('@assets/background.png');

interface Notification {
  id: string;
  type: 'new_recipe' | 'new_follower' | 'recipe_liked' | 'recipe_updated';
  user: {
    name: string;
    avatar: string;
  };
  recipe?: typeof mockData.recipes[0];
  timestamp: string;
  isRead: boolean;
}

interface NotificationGroup {
  date: string;
  notifications: Notification[];
}

const NotificationsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data cho thông báo
  const [notifications, setNotifications] = useState<NotificationGroup[]>([
    {
      date: 'Hôm nay',
      notifications: [
        {
          id: '1',
          type: 'new_recipe',
          user: {
            name: 'Nguyễn Văn A',
            avatar: 'https://i.pravatar.cc/150?img=1'
          },
          recipe: mockData.recipes[0],
          timestamp: '10:30',
          isRead: false
        },
        {
          id: '2',
          type: 'new_follower',
          user: {
            name: 'Trần Thị B',
            avatar: 'https://i.pravatar.cc/150?img=2'
          },
          timestamp: '09:15',
          isRead: false
        },
        {
          id: '3',
          type: 'recipe_liked',
          user: {
            name: 'Lê Văn C',
            avatar: 'https://i.pravatar.cc/150?img=3'
          },
          recipe: mockData.recipes[1],
          timestamp: '08:45',
          isRead: true
        }
      ]
    },
    {
      date: 'Hôm qua',
      notifications: [
        {
          id: '4',
          type: 'recipe_updated',
          user: {
            name: 'Phạm Thị D',
            avatar: 'https://i.pravatar.cc/150?img=4'
          },
          recipe: mockData.recipes[2],
          timestamp: '15:30',
          isRead: true
        },
        {
          id: '5',
          type: 'new_follower',
          user: {
            name: 'Hoàng Văn E',
            avatar: 'https://i.pravatar.cc/150?img=5'
          },
          timestamp: '14:20',
          isRead: true
        }
      ]
    }
  ]);

  const filteredNotifications = notifications.map(group => ({
    ...group,
    notifications: group.notifications.filter(notification =>
      notification.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (notification.recipe?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    ),
  })).filter(group => group.notifications.length > 0);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_recipe':
        return '🍳';
      case 'new_follower':
        return '👥';
      case 'recipe_liked':
        return '❤️';
      case 'recipe_updated':
        return '📝';
      default:
        return '📢';
    }
  };

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 'new_recipe':
        return `${notification.user.name} đã đăng tải món ăn mới: ${notification.recipe?.name}`;
      case 'new_follower':
        return `${notification.user.name} đã theo dõi bạn`;
      case 'recipe_liked':
        return `${notification.user.name} đã thêm món ${notification.recipe?.name} vào yêu thích`;
      case 'recipe_updated':
        return `${notification.user.name} đã cập nhật công thức món ${notification.recipe?.name}`;
      default:
        return 'Thông báo mới';
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(group => ({
        ...group,
        notifications: group.notifications.map(notification => ({
          ...notification,
          isRead: true
        }))
      }))
    );
  };

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text className="text-2xl text-black">⬅️</Text>
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-black ml-4">
                Thông báo
              </Text>
            </View>
            <TouchableOpacity onPress={markAllAsRead}>
              <Text className="text-black">Đánh dấu đã đọc</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="px-4 mb-4">
            <View className="flex-row items-center bg-white rounded-lg px-4 py-2">
              <Text className="text-xl mr-2">🔍</Text>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Tìm kiếm thông báo"
                className="flex-1"
              />
            </View>
          </View>

          {/* Notifications List */}
          <View className="px-4">
            {filteredNotifications.map((group) => (
              <View key={group.date} className="mb-6">
                <Text className="text-lg font-bold mb-2">{group.date}</Text>
                {group.notifications.map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    className={`bg-white rounded-lg mb-4 shadow-sm overflow-hidden ${!notification.isRead ? 'border-l-4 border-red-500' : ''}`}
                    onPress={() => {
                      if (notification.recipe) {
                        navigation.navigate('RecipeDetail', { recipeId: parseInt(notification.recipe.id) });
                      }
                    }}
                  >
                    <View className="flex-row p-4">
                      <View className="mr-3">
                        <Image
                          source={{ uri: notification.user.avatar }}
                          className="w-12 h-12 rounded-full"
                        />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row justify-between items-start">
                          <Text className="text-lg font-bold flex-1 mr-2">{notification.user.name}</Text>
                          <Text className="text-black text-sm">{notification.timestamp}</Text>
                        </View>
                        <View className="flex-row items-center mb-1">
                          <Text className="text-sm mr-2">{getNotificationIcon(notification.type)}</Text>
                          <Text className="text-black text-sm flex-1">
                            {getNotificationText(notification)}
                          </Text>
                        </View>
                        {notification.recipe && (
                          <View className="flex-row items-center mt-2">
                            <Image
                              source={{ uri: notification.recipe.image }}
                              className="w-16 h-16 rounded-lg mr-2"
                            />
                            <View className="flex-1">
                              <Text className="font-medium">{notification.recipe.name}</Text>
                              <Text className="text-black text-sm" numberOfLines={1}>
                                {notification.recipe.description}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default NotificationsScreen; 