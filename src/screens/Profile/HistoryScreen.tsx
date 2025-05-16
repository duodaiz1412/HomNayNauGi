import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import api, { getUserProfile } from 'src/api/api';

const backgroundImage = require('@assets/background.png');
type FilterMode = 'all' | 'created' | 'viewed';

interface Recipe {
  id: string;
  name: string;
  imageUrl: string;
  createdAt?: string;
}

interface ViewHistoryItem {
  id: string;
  viewed_at: string;
  recipe: Recipe;
}

const HistoryScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [history, setHistory] = useState<ViewHistoryItem[]>([]);
  const [createdRecipes, setCreatedRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserProfile(); // Lấy thông tin người dùng hiện tại
        const accountId = userProfile?.data?.accountId;

        const [historyRes, createdRes] = await Promise.all([
          api.get('/view-history'), // không cần accountId
          api.get('/view-history/created-by', {
            params: { accountId }, // chỉ thêm accountId ở đây
          }),
        ]);

        if (historyRes.data && Array.isArray(historyRes.data)) {
          // Lọc trùng bằng Map lấy lần xem mới nhất cho mỗi recipe
          const mapLatestView = new Map<string, ViewHistoryItem>();

          historyRes.data.forEach((item: any) => {
            const recipeId = item.recipe.id;
            const viewedAt = item.viewed_at || item.viewedAt; // an toàn lấy trường đúng

            const existing = mapLatestView.get(recipeId);
            if (
              !existing ||
              new Date(viewedAt) > new Date(existing.viewed_at)
            ) {
              mapLatestView.set(recipeId, {
                id: item.id,
                viewed_at: viewedAt,
                recipe: {
                  id: recipeId,
                  name: item.recipe.name,
                  imageUrl: item.recipe.imageUrl,
                },
              });
            }
          });

          const uniqueHistory = Array.from(mapLatestView.values()).sort(
            (a, b) =>
              new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime()
          );

          setHistory(uniqueHistory);
        }

        if (createdRes.data) {
          setCreatedRecipes(createdRes.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Lọc dữ liệu theo searchQuery
  const filteredHistory = history.filter((item) =>
    item.recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCreated = createdRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lọc dữ liệu hiển thị theo filterMode
  const displayedItems = (() => {
    switch (filterMode) {
      case 'created':
        return filteredCreated;
      case 'viewed':
        return filteredHistory;
      case 'all':
      default:
        type DisplayItem = {
          id: string;
          name: string;
          imageUrl: string;
          createdAt?: string;
          viewed_at?: string;
          type: 'created' | 'viewed' | 'both';
        };

        // Tạo map để gộp dữ liệu
        const map = new Map<string, DisplayItem>();

        // Thêm createdRecipes
        filteredCreated.forEach((r) => {
          map.set(r.id, {
            id: r.id,
            name: r.name,
            imageUrl: r.imageUrl,
            createdAt: r.createdAt,
            type: 'created',
          });
        });

        // Thêm hoặc gộp với history
        filteredHistory.forEach((h) => {
          const existing = map.get(h.recipe.id);
          if (existing) {
            // Đã có trong map, gộp thêm viewed_at và đổi type thành 'both'
            map.set(h.recipe.id, {
              ...existing,
              viewed_at: h.viewed_at,
              type: 'both',
            });
          } else {
            // Chưa có, thêm mới
            map.set(h.recipe.id, {
              id: h.recipe.id,
              name: h.recipe.name,
              imageUrl: h.recipe.imageUrl,
              viewed_at: h.viewed_at,
              type: 'viewed',
            });
          }
        });

        // Trả về mảng các phần tử đã gộp, sắp xếp theo thời gian xem hoặc tạo (mình ưu tiên xem mới nhất)
        return Array.from(map.values()).sort((a, b) => {
          const timeA = a.viewed_at
            ? new Date(a.viewed_at).getTime()
            : a.createdAt
              ? new Date(a.createdAt).getTime()
              : 0;
          const timeB = b.viewed_at
            ? new Date(b.viewed_at).getTime()
            : b.createdAt
              ? new Date(b.createdAt).getTime()
              : 0;
          return timeB - timeA;
        });
    }
  })();

  const updateViewHistory = (
    newViewedRecipe: Recipe,
    newViewedAt: string = new Date().toISOString()
  ) => {
    setHistory((prevHistory) => {
      // Lọc bỏ hết các bản ghi có cùng recipe.id (để tránh trùng)
      const filteredHistory = prevHistory.filter(
        (item) => item.recipe.id !== newViewedRecipe.id
      );

      // Tạo bản ghi mới với thời gian xem mới nhất
      const newRecord = {
        id: generateUniqueId(),
        viewed_at: newViewedAt,
        recipe: newViewedRecipe,
      };

      // Thêm món này lên đầu danh sách
      return [newRecord, ...filteredHistory];
    });
  };

  // Hàm tạo ID ngẫu nhiên tạm thời nếu cần
  const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
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
          </View>

          {/* Search */}
          <View className="px-4 mb-4">
            <View className="flex-row items-center bg-white rounded-lg px-4 py-2">
              <Text className="text-xl mr-2">🔍</Text>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Tìm món đã xem hoặc tạo"
                className="flex-1"
              />
            </View>
          </View>

          {/* Filter Buttons */}
          <View className="flex-row justify-center space-x-4 mb-4">
            {(['all', 'created', 'viewed'] as FilterMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                className={`px-4 py-2 rounded-full border ${
                  filterMode === mode
                    ? 'bg-red-700 bg-red-700'
                    : 'bg-white border-gray-300'
                }`}
                onPress={() => setFilterMode(mode)}
              >
                <Text
                  className={`${filterMode === mode ? 'text-white' : 'text-gray-700'} font-semibold`}
                >
                  {mode === 'all'
                    ? 'Tất cả'
                    : mode === 'created'
                      ? 'Công thức bạn tạo'
                      : 'Công thức đã xem'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* List Items */}
          <View className="px-4 pb-8">
            {filterMode === 'created' && (
              <>
                <Text className="text-lg font-semibold mb-2 text-black">
                  🧑‍🍳 Công thức bạn đã tạo
                </Text>
                {displayedItems.length === 0 && (
                  <Text className="text-center text-gray-500 mt-4">
                    Không có công thức nào phù hợp.
                  </Text>
                )}
                {(displayedItems as Recipe[]).map((recipe) => (
                  <TouchableOpacity
                    key={recipe.id}
                    className="bg-white rounded-xl shadow-md mb-4 overflow-hidden"
                    onPress={() =>
                      navigation.navigate('RecipeDetail', {
                        recipeId: recipe.id,
                      })
                    }
                  >
                    <Image
                      source={{ uri: recipe.imageUrl }}
                      className="w-full h-40"
                      resizeMode="cover"
                    />
                    <View className="p-4">
                      <Text className="text-lg font-bold mb-1">
                        {recipe.name}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        Đã tạo vào{' '}
                        {new Date(recipe.createdAt ?? '').toLocaleString(
                          'vi-VN',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }
                        )}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {filterMode === 'viewed' && (
              <>
                <Text className="text-lg font-semibold mb-2 text-black">
                  👁️ Công thức đã xem
                </Text>
                {displayedItems.length === 0 && (
                  <Text className="text-center text-gray-500 mt-4">
                    Không có công thức đã xem nào phù hợp.
                  </Text>
                )}
                {(displayedItems as ViewHistoryItem[]).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="bg-white rounded-xl shadow-md mb-4 overflow-hidden"
                    onPress={() => {
                      updateViewHistory(item.recipe);
                      navigation.navigate('RecipeDetail', {
                        recipeId: item.recipe.id,
                      });
                    }}
                  >
                    <Image
                      source={{ uri: item.recipe.imageUrl }}
                      className="w-full h-40"
                      resizeMode="cover"
                    />
                    <View className="p-4">
                      <Text className="text-lg font-bold mb-1">
                        {item.recipe.name}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        Bạn đã xem vào lúc{' '}
                        {new Date(item.viewed_at).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {filterMode === 'all' && (
              <>
                {displayedItems.length === 0 && (
                  <Text className="text-center text-gray-500 mt-4">
                    Không có công thức nào phù hợp.
                  </Text>
                )}
                {displayedItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="bg-white rounded-xl shadow-md mb-4 overflow-hidden"
                    onPress={() => {
                      if (item.type === 'created' || item.type === 'both') {
                        navigation.navigate('RecipeDetail', {
                          recipeId: item.id,
                        });
                      } else {
                        updateViewHistory({
                          id: item.id,
                          name: item.name,
                          imageUrl: item.imageUrl,
                          createdAt: undefined,
                        });
                        navigation.navigate('RecipeDetail', {
                          recipeId: item.id,
                        });
                      }
                    }}
                  >
                    <Image
                      source={{ uri: item.imageUrl }}
                      className="w-full h-40"
                      resizeMode="cover"
                    />
                    <View className="p-4">
                      <Text className="text-lg font-bold mb-1">
                        {item.name}
                      </Text>
                      {/* Hiển thị cả createdAt và viewed_at nếu có */}
                      {item.createdAt && (
                        <Text className="text-xs text-gray-500 mb-1">
                          Đã tạo vào{' '}
                          {new Date(item.createdAt).toLocaleString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </Text>
                      )}
                      {item.viewed_at && (
                        <Text className="text-xs text-gray-500">
                          Bạn đã xem vào lúc{' '}
                          {new Date(item.viewed_at).toLocaleString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default HistoryScreen;
