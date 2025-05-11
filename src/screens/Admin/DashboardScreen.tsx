import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import từ react-native-safe-area-context
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { LineChart } from 'react-native-chart-kit';
import { AdminDrawerParamList } from '@navigation/AdminDrawerNavigator';
import { useNavigation } from '@react-navigation/native';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';
export const AdminDashboardScreen = () => {
  const { width } = useWindowDimensions();
  const chartWidth = width - 32;
  const navigation = useNavigation<DrawerNavigationProp<AdminDrawerParamList>>();

  const viewsData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
        color: () => '#941D23',
        strokeWidth: 2,
      },
    ],
  };

  const topDishes = [
    {
      id: '1',
      name: 'Phở Hà Nội',
      image: 'https://cdn.pixabay.com/photo/2023/05/27/12/39/noodle-soup-8021418_1280.png',
      likes: 1245,
      views: 5678,
    },
    {
      id: '2',
      name: 'Bánh Mì Pate',
      image: 'https://cdn.pixabay.com/photo/2018/06/10/20/30/bread-3467243_1280.jpg',
      likes: 987,
      views: 3456,
    },
    {
      id: '3',
      name: 'Bún Bò Huế',
      image: 'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg',
      likes: 876,
      views: 2987,
    },
  ];

  const recentActivities = [
    { id: '1', action: 'Thêm món', item: 'Cơm Tấm Sườn Nướng', time: '10 phút trước', user: 'Admin' },
    { id: '2', action: 'Cập nhật', item: 'Phở Bò Tái', time: '1 giờ trước', user: 'Admin' },
    { id: '3', action: 'Xóa', item: 'Bánh Cuốn', time: '3 giờ trước', user: 'Admin' },
    { id: '4', action: 'Duyệt bài', item: 'Bún Đậu Mắm Tôm', time: '5 giờ trước', user: 'Admin' },
  ];

  return (
    <SafeAreaView  className='flex-1'>
      {/* Header */}
      <AdminHeader title="Tổng quan" />

      {/* Content */}
      <ScrollView className="flex-1 px-4">
        {/* Stats Overview */}
        <View className="flex-row flex-wrap justify-between mt-4">
          <View className="bg-white rounded-xl p-4 shadow-sm mb-4" style={{ width: '48%' }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500">Tổng Món Ăn</Text>
              <View className="bg-red-100 rounded-full p-2">
                <Ionicons name="restaurant" size={20} color="#941D23" />
              </View>
            </View>
            <Text className="text-2xl font-bold mt-2">125</Text>
            <Text className="text-green-500 text-xs mt-1">+12% so với tháng trước</Text>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm mb-4" style={{ width: '48%' }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500">Người Dùng</Text>
              <View className="bg-red-100 rounded-full p-2">
                <Ionicons name="people" size={20} color="#941D23" />
              </View>
            </View>
            <Text className="text-2xl font-bold mt-2">1,458</Text>
            <Text className="text-green-500 text-xs mt-1">+8% so với tháng trước</Text>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm mb-4" style={{ width: '48%' }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500">Lượt Xem</Text>
              <View className="bg-red-100 rounded-full p-2">
                <Ionicons name="eye" size={20} color="#941D23" />
              </View>
            </View>
            <Text className="text-2xl font-bold mt-2">24,589</Text>
            <Text className="text-green-500 text-xs mt-1">+15% so với tháng trước</Text>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm mb-4" style={{ width: '48%' }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-500">Lượt Thích</Text>
              <View className="bg-red-100 rounded-full p-2">
                <Ionicons name="heart" size={20} color="#941D23" />
              </View>
            </View>
            <Text className="text-2xl font-bold mt-2">8,756</Text>
            <Text className="text-green-500 text-xs mt-1">+10% so với tháng trước</Text>
          </View>
        </View>

        {/* Chart */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold mb-2">Lượt xem trong tuần</Text>
          <LineChart
            data={viewsData}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(148, 29, 35, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '6', strokeWidth: '2', stroke: '#941D23' },
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>

        {/* Top Dishes */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold mb-4">Món ăn nổi bật</Text>
          {topDishes.map((dish) => (
            <View key={dish.id} className="flex-row items-center mb-4">
              <Image source={{ uri: dish.image }} className="w-16 h-16 rounded-lg mr-3" />
              <View className="flex-1">
                <Text className="font-bold">{dish.name}</Text>
                <View className="flex-row mt-1">
                  <View className="flex-row items-center mr-4">
                    <Ionicons name="heart" size={14} color="#FF3B30" />
                    <Text className="text-gray-500 text-xs ml-1">{dish.likes}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="eye" size={14} color="#007AFF" />
                    <Text className="text-gray-500 text-xs ml-1">{dish.views}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                <Ionicons name="ellipsis-vertical" size={16} color="#454442" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity className="flex-row items-center justify-center mt-2">
            <Text className="text-[#941D23] font-medium">Xem tất cả</Text>
            <Ionicons name="chevron-forward" size={16} color="#941D23" />
          </TouchableOpacity>
        </View>

        {/* Recent Activities */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold mb-4">Hoạt động gần đây</Text>
          {recentActivities.map((activity) => (
            <View key={activity.id} className="flex-row items-center mb-3 pb-3 border-b border-gray-100">
              <View className="bg-red-100 rounded-full p-2 mr-3">
                <Ionicons
                  name={
                    activity.action === 'Thêm món'
                      ? 'add-circle'
                      : activity.action === 'Cập nhật'
                      ? 'refresh-circle'
                      : activity.action === 'Xóa'
                      ? 'trash'
                      : 'checkmark-circle'
                  }
                  size={20}
                  color="#941D23"
                />
              </View>
              <View className="flex-1">
                <Text className="font-medium">
                  {activity.action}: {activity.item}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {activity.time} bởi {activity.user}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};