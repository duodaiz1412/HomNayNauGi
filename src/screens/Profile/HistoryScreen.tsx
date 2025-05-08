import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { mockData } from '../../MockData/Data';
const backgroundImage = require('@assets/background.png');

interface HistoryItem {
  id: string;
  type: 'view' | 'favorite_add' | 'favorite_remove';
  recipe: typeof mockData.recipes[0];
  timestamp: string;
}

interface HistoryGroup {
  date: string;
  items: HistoryItem[];
}

const HistoryScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data với các loại hành động khác nhau
  const [historyData, setHistoryData] = useState<HistoryGroup[]>([
    {
      date: 'Hôm nay',
      items: [
        {
          id: '1',
          type: 'view',
          recipe: mockData.recipes[0],
          timestamp: '10:30'
        },
        {
          id: '2',
          type: 'favorite_add',
          recipe: mockData.recipes[0],
          timestamp: '10:31'
        },
        {
          id: '3',
          type: 'view',
          recipe: mockData.recipes[1],
          timestamp: '09:15'
        }
      ]
    },
    {
      date: 'Hôm qua',
      items: [
        {
          id: '4',
          type: 'view',
          recipe: mockData.recipes[2],
          timestamp: '15:45'
        },
        {
          id: '5',
          type: 'favorite_add',
          recipe: mockData.recipes[2],
          timestamp: '15:46'
        },
        {
          id: '6',
          type: 'favorite_remove',
          recipe: mockData.recipes[2],
          timestamp: '15:50'
        }
      ]
    }
  ]);

  const filteredHistory = historyData.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(group => group.items.length > 0);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'view':
        return '👁️';
      case 'favorite_add':
        return '❤️';
      case 'favorite_remove':
        return '💔';
      default:
        return '📝';
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
      case 'view':
        return 'Đã xem';
      case 'favorite_add':
        return 'Đã thêm vào yêu thích';
      case 'favorite_remove':
        return 'Đã xóa khỏi yêu thích';
      default:
        return 'Hành động khác';
    }
  };

  const clearHistory = () => {
    setHistoryData([]);
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
                Lịch sử
              </Text>
            </View>
            <TouchableOpacity onPress={clearHistory}>
              <Text className="text-black">Xóa lịch sử</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="px-4 mb-4">
            <View className="flex-row items-center bg-white rounded-lg px-4 py-2">
              <Text className="text-xl mr-2">🔍</Text>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Tìm kiếm trong lịch sử"
                className="flex-1"
              />
            </View>
          </View>

          {/* History Timeline */}
          <View className="px-4">
            {filteredHistory.map((group) => (
              <View key={group.date} className="mb-6">
                <Text className="text-lg font-bold mb-2">{group.date}</Text>
                {group.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="bg-white rounded-lg mb-4 shadow-sm overflow-hidden"
                    onPress={() => navigation.navigate('RecipeDetail', { recipeId: parseInt(item.recipe.id) })}
                  >
                    <View className="flex-row">
                      <Image
                        source={{ uri: item.recipe.image }}
                        className="w-24 h-24"
                        resizeMode="cover"
                      />
                      <View className="flex-1 p-3">
                        <View className="flex-row justify-between items-start">
                          <Text className="text-lg font-bold flex-1 mr-2">{item.recipe.name}</Text>
                          <Text className="text-black text-sm">{item.timestamp}</Text>
                        </View>
                        <View className="flex-row items-center mb-1">
                          <Text className="text-sm mr-2">{getActionIcon(item.type)}</Text>
                          <Text className="text-black text-sm">{getActionText(item.type)}</Text>
                        </View>
                        <Text className="text-black text-sm" numberOfLines={1}>
                          {item.recipe.description}
                        </Text>
                        <View className="flex-row items-center mt-2">
                          <Image
                            source={{ uri: item.recipe.authorAvatar }}
                            className="w-5 h-5 rounded-full mr-2"
                          />
                          <Text className="text-black text-sm">{item.recipe.author}</Text>
                        </View>
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

export default HistoryScreen; 