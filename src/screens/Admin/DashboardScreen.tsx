import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { LineChart } from 'react-native-chart-kit';
import { AdminDrawerParamList } from '@navigation/AdminDrawerNavigator';
import { useNavigation } from '@react-navigation/native';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
import { useStatisticData } from '@hooks/useStatisticData';
import { useState, useCallback } from 'react';
import { CommonActions } from '@react-navigation/native';
import LikeSolid from '@components/icons/LikeSolid';
import HeartSolid from '@components/icons/HeartSolid';

// Component hiển thị thông báo không có dữ liệu
const NoDataMessage = ({ message = 'Không có dữ liệu' }) => (
  <View className="bg-white rounded-xl p-6 flex items-center justify-center">
    <Ionicons name="information-circle-outline" size={48} color="#941D23" />
    <Text className="text-center mt-2 text-gray-500">{message}</Text>
  </View>
);

export const AdminDashboardScreen = () => {
  const { width } = useWindowDimensions();
  const chartWidth = width - 32;
  const navigation =
    useNavigation<DrawerNavigationProp<AdminDrawerParamList>>();
  const [refreshing, setRefreshing] = useState(false);
  const [activeSortBy, setActiveSortBy] = useState<
    'views' | 'likes' | 'favorites'
  >('views');
  const [selectedRange, setSelectedRange] = useState('week');

  const handleChangeRange = (range) => {
    setSelectedRange(range);
    fetchDataWithTimeRange(range);
  };

  const {
    isLoading,
    error,
    dashboardData,
    refreshData,
    fetchDataWithTimeRange,
    fetchDataWithSortBy,
  } = useStatisticData();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#941D23" />
        <Text className="mt-2 text-gray-500">Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Ionicons name="alert-circle-outline" size={48} color="#941D23" />
        <Text className="mt-2 text-gray-700">{error}</Text>
        <TouchableOpacity
          className="mt-4 bg-[#941D23] px-4 py-2 rounded-lg"
          onPress={refreshData}
        >
          <Text className="text-white font-medium">Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      {/* Header */}
      <AdminHeader title="Tổng quan" />

      {/* Content */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Overview */}
        {dashboardData?.overviewStats ? (
          <View className="flex-row flex-wrap justify-between mt-4">
            <View
              className="bg-white rounded-xl p-4 shadow-sm mb-4"
              style={{ width: '48%' }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500">Tổng Món Ăn</Text>
                <View className="bg-red-100 rounded-full p-2">
                  <Ionicons name="restaurant" size={20} color="#941D23" />
                </View>
              </View>
              <Text className="text-2xl font-bold mt-2">
                {dashboardData.overviewStats.totalRecipes.toLocaleString()}
              </Text>
            </View>

            <View
              className="bg-white rounded-xl p-4 shadow-sm mb-4"
              style={{ width: '48%' }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500">Người Dùng</Text>
                <View className="bg-red-100 rounded-full p-2">
                  <Ionicons name="people" size={20} color="#941D23" />
                </View>
              </View>
              <Text className="text-2xl font-bold mt-2">
                {dashboardData.overviewStats.totalUsers.toLocaleString()}
              </Text>
            </View>

            <View
              className="bg-white rounded-xl p-4 shadow-sm mb-4"
              style={{ width: '48%' }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500">Lượt Xem</Text>
                <View className="bg-red-100 rounded-full p-2">
                  <Ionicons name="eye" size={20} color="#941D23" />
                </View>
              </View>
              <Text className="text-2xl font-bold mt-2">
                {dashboardData.overviewStats.totalViews.toLocaleString()}
              </Text>
            </View>

            <View
              className="bg-white rounded-xl p-4 shadow-sm mb-4"
              style={{ width: '48%' }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500">Lượt Thích</Text>
                <View className="bg-red-100 rounded-full p-2">
                  <LikeSolid size={20} color="#941D23" />
                </View>
              </View>
              <Text className="text-2xl font-bold mt-2">
                {dashboardData.overviewStats.totalLikes.toLocaleString()}
              </Text>
            </View>
          </View>
        ) : (
          <View className="mt-4 mb-4">
            <NoDataMessage message="Không có dữ liệu thống kê tổng quan" />
          </View>
        )}

        {/* Chart */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold">Lượt xem theo</Text>

            <View className="flex-row">
              {['week', 'month', 'year'].map((range) => (
                <TouchableOpacity
                  key={range}
                  onPress={() => handleChangeRange(range)}
                  className={`px-3 py-1 rounded-lg mr-2 ${
                    selectedRange === range ? 'bg-[#941D23]' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedRange === range ? 'text-white' : 'text-[#941D23]'
                    }`}
                  >
                    {range === 'week'
                      ? 'Tuần'
                      : range === 'month'
                        ? 'Tháng'
                        : 'Năm'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {dashboardData?.viewsData ? (
            <LineChart
              data={dashboardData.viewsData}
              width={chartWidth} // dùng useWindowDimensions nếu chưa có
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(148, 29, 35, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#941D23',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                marginLeft: -15, // dịch sang trái
              }}
            />
          ) : (
            <View className="h-[220px] justify-center">
              <NoDataMessage message="Không có dữ liệu lượt xem theo thời gian" />
            </View>
          )}
        </View>

        {/* Top Dishes */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">Món ăn nhiều</Text>

            <View className="flex-row">
              <TouchableOpacity
                className={`px-2 py-1 rounded-lg mr-1 ${activeSortBy === 'views' ? 'bg-[#941D23]' : ''}`}
                onPress={() => {
                  fetchDataWithSortBy('views');
                  setActiveSortBy('views');
                }}
              >
                <Text
                  className={`font-medium ${activeSortBy === 'views' ? 'text-white' : 'text-[#941D23]'}`}
                >
                  Lượt xem
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`px-2 py-1 rounded-lg mr-1 ${activeSortBy === 'likes' ? 'bg-[#941D23]' : ''}`}
                onPress={() => {
                  fetchDataWithSortBy('likes');
                  setActiveSortBy('likes');
                }}
              >
                <Text
                  className={`font-medium ${activeSortBy === 'likes' ? 'text-white' : 'text-[#941D23]'}`}
                >
                  Lượt thích
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`px-2 py-1 rounded-lg ${activeSortBy === 'favorites' ? 'bg-[#941D23]' : ''}`}
                onPress={() => {
                  fetchDataWithSortBy('favorites');
                  setActiveSortBy('favorites');
                }}
              >
                <Text
                  className={`font-medium ${activeSortBy === 'favorites' ? 'text-white' : 'text-[#941D23]'}`}
                >
                  Yêu thích
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {dashboardData?.topDishes && dashboardData.topDishes.length > 0 ? (
            <>
              {dashboardData.topDishes.map((dish) => (
                <TouchableOpacity
                  key={dish.id}
                  onPress={() =>
                    navigation.dispatch(
                      CommonActions.navigate({
                        name: 'AdminFoodManagement',
                        params: {
                          screen: 'FoodDetailScreen',
                          params: { foodId: dish.id },
                        },
                      })
                    )
                  }
                  className="flex-row items-center mb-5 bg-white rounded-xl shadow p-3"
                >
                  <Image
                    source={{ uri: dish.image }}
                    className="w-20 h-20 rounded-xl mr-4"
                  />
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">
                      {dish.name}
                    </Text>
                    <View className="flex-row mt-2">
                      <View className="flex-row items-center mr-6">
                        <LikeSolid size={20} color="#007AFF" />
                        <Text className="text-gray-600 text-sm ml-1">
                          {dish.likes}
                        </Text>
                      </View>
                      <View className="flex-row items-center mr-6">
                        <Ionicons name="eye" size={20} color="#007AFF" />
                        <Text className="text-gray-600 text-sm ml-1">
                          {dish.views}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <HeartSolid size={20} color="#FF3B30" />
                        <Text className="text-gray-600 text-sm ml-1">
                          {dish.favorites}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <NoDataMessage message="Không có dữ liệu món ăn nổi bật" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

