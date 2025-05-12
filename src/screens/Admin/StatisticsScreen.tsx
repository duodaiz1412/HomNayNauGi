import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminHeader } from '@components/AdminHeader/AdminHeader';

const screenWidth = Dimensions.get('window').width;

export const StatisticsScreen = () => {
  const navigation = useNavigation();
  const [timeRange, setTimeRange] = useState('week');

  // Mock data for charts
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

  const likesData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        data: [10, 25, 15, 45, 70, 30, 40],
        color: () => '#FF3B30',
        strokeWidth: 2,
      },
    ],
  };

  // Chuyển đổi categoryData thành định dạng phù hợp với PieChart
  const categoryData = [
    { name: 'Phở', population: 0.3, color: '#941D23', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Bánh mì', population: 0.2, color: '#FF3B30', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Cơm', population: 0.15, color: '#FF9500', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Bún', population: 0.1, color: '#FFCC00', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Gỏi cuốn', population: 0.15, color: '#34C759', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Khác', population: 0.1, color: '#5AC8FA', legendFontColor: '#7F7F7F', legendFontSize: 12 },
  ];

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
    {
      id: '4',
      name: 'Gỏi Cuốn',
      image: 'https://cdn.pixabay.com/photo/2016/03/27/22/16/spring-roll-1284442_1280.jpg',
      likes: 543,
      views: 1876,
    },
    {
      id: '5',
      name: 'Cơm Tấm Sườn Nướng',
      image: 'https://cdn.pixabay.com/photo/2016/03/27/22/16/rice-1284444_1280.jpg',
      likes: 765,
      views: 2345,
    },
  ];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(148, 29, 35, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#941D23',
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <AdminHeader title="Thống kê" />

      {/* Time Range Selector */}
      <View className="flex-row bg-white p-2 mx-4 mt-4 rounded-lg shadow-sm">
        <TouchableOpacity
          className={`flex-1 py-2 rounded-lg ${timeRange === 'week' ? 'bg-[#941D23]' : ''}`}
          onPress={() => setTimeRange('week')}
        >
          <Text
            className={`text-center font-medium ${timeRange === 'week' ? 'text-white' : 'text-gray-700'}`}
          >
            Tuần
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 rounded-lg ${timeRange === 'month' ? 'bg-[#941D23]' : ''}`}
          onPress={() => setTimeRange('month')}
        >
          <Text
            className={`text-center font-medium ${timeRange === 'month' ? 'text-white' : 'text-gray-700'}`}
          >
            Tháng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 rounded-lg ${timeRange === 'year' ? 'bg-[#941D23]' : ''}`}
          onPress={() => setTimeRange('year')}
        >
          <Text
            className={`text-center font-medium ${timeRange === 'year' ? 'text-white' : 'text-gray-700'}`}
          >
            Năm
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-2">
        {/* Views Chart */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold mb-2">Lượt xem</Text>
          <LineChart
            data={viewsData}
            width={screenWidth - 50}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Likes Chart */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold mb-2">Lượt thích</Text>
          <LineChart
            data={likesData}
            width={screenWidth - 50}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Category Distribution */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold mb-2">Phân bố danh mục</Text>
          <PieChart
            data={categoryData}
            width={screenWidth - 50}
            height={220}
            chartConfig={chartConfig}
            accessor="population" // Sử dụng population thay vì data
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Top Dishes */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <Text className="text-lg font-bold mb-4">Món ăn nổi bật</Text>
          {topDishes.map((dish, index) => (
            <View key={dish.id} className="flex-row items-center mb-4">
              <Text className="font-bold text-lg mr-3 text-gray-500">
                {index + 1}
              </Text>
              <Image
                source={{ uri: dish.image }}
                className="w-16 h-16 rounded-lg mr-3"
              />
              <View className="flex-1">
                <Text className="font-bold">{dish.name}</Text>
                <View className="flex-row mt-1">
                  <View className="flex-row items-center mr-4">
                    <Ionicons name="heart" size={14} color="#FF3B30" />
                    <Text className="text-gray-500 text-xs ml-1">
                      {dish.likes}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="eye" size={14} color="#007AFF" />
                    <Text className="text-gray-500 text-xs ml-1">
                      {dish.views}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};