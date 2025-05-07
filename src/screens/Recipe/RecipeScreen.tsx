import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import IngredientCard from '@components/IngredientCard';
import MyIngredient from '@components/MyIngredient';
import SuggestDish from '@components/SuggestDish';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

export default function RecipeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'dishes'>(
    'ingredients'
  );

  const backgroundImage = require('@assets/background.png');

  const ingredientGroups = [
    {
      title: 'Thịt & Hải sản',
      data: [
        {
          id: '1',
          name: 'Ba chỉ',
          imageUrl:
            'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
        },
        {
          id: '2',
          name: 'Bò tảng',
          imageUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqw5mwCiyuZR-PUxQPiwxfGlKKX_rBG-XXfg&s',
        },
        {
          id: '3',
          name: 'Thịt gà',
          imageUrl:
            'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/thit_ga_bao_nhieu_calo_cach_an_thit_ga_tot_cho_suc_khoe1_75f5508b2f.jpg',
        },
        {
          id: '4',
          name: 'Tôm sú',
          imageUrl:
            'https://product.hstatic.net/1000182631/product/resize_anh-5273-8_90c0dbcc949944738551635fe608e950_master.png',
        },
        {
          id: '5',
          name: 'Cá hồi',
          imageUrl:
            'https://www.nongsanantoanthanhhoa.vn/image/800/800/nq11vgcWjh8SwjgLT9emPHawLa9BTGuz3H56cQy4.png',
        },
      ],
    },
    {
      title: 'Trứng & sữa',
      data: [
        {
          id: '6',
          name: 'Phô mai',
          imageUrl: 'https://img.dominos.vn/2155_3.png',
          backgroundColor: 'bg-yellow-100',
        },
        {
          id: '7',
          name: 'Bơ',
          imageUrl:
            'https://www.thekitchn.com/wp-content/uploads/2020/09/butter-1.jpg',
          backgroundColor: 'bg-yellow-100',
        },
        {
          id: '8',
          name: 'Trứng',
          imageUrl:
            'https://www.thespruceeats.com/thmb/3Z6L0y7kW7X0z7Z0z3Z0z3Z0z3Z0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/egg-1.jpg',
          backgroundColor: 'bg-yellow-100',
        },
        {
          id: '9',
          name: 'Sữa tươi',
          imageUrl:
            'https://www.dairy.com.au/wp-content/uploads/2020/09/milk-1.jpg',
          backgroundColor: 'bg-yellow-100',
        },
      ],
    },
    {
      title: 'Rau củ quả',
      data: [
        {
          id: '10',
          name: 'Cà chua',
          imageUrl:
            'https://www.thekitchn.com/wp-content/uploads/2020/09/tomato-1.jpg',
          backgroundColor: 'bg-green-50',
        },
        {
          id: '11',
          name: 'Hành tây',
          imageUrl:
            'https://www.thespruceeats.com/thmb/3Z6L0y7kW7X0z7Z0z3Z0z3Z0z3Z0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/onion-1.jpg',
          backgroundColor: 'bg-green-50',
        },
        {
          id: '12',
          name: 'Ớt chuông',
          imageUrl:
            'https://www.thekitchn.com/wp-content/uploads/2020/09/bell-pepper-1.jpg',
          backgroundColor: 'bg-green-50',
        },
        {
          id: '13',
          name: 'Rau mùi',
          imageUrl:
            'https://www.thespruceeats.com/thmb/3Z6L0y7kW7X0z7Z0z3Z0z3Z0z3Z0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cilantro-1.jpg',
          backgroundColor: 'bg-green-50',
        },
      ],
    },
    {
      title: 'Gia vị',
      data: [
        {
          id: '14',
          name: 'Nước mắm',
          imageUrl: 'https://i.imgur.com/ErkosXl.jpg',
          backgroundColor: 'bg-amber-50',
        },
        {
          id: '15',
          name: 'Hạt nêm',
          imageUrl: 'https://i.imgur.com/ZmUVi1e.jpg',
          backgroundColor: 'bg-amber-50',
        },
        {
          id: '16',
          name: 'Tiêu',
          imageUrl: 'https://i.imgur.com/Ly6YBL1.jpg',
          backgroundColor: 'bg-amber-50',
        },
      ],
    },
  ];

  const suggestedDishes = [
    {
      id: '1',
      name: 'Phở Hà Nội',
      description:
        'Phở Hà Nội là một trong những món ăn truyền thống nổi tiếng nhất của ẩm thực Việt Nam, đặc biệt là ở miền Bắc. Món ăn này không chỉ đơn thuần là một bát nước dùng với bánh phở và thịt, mà còn là sự kết tinh của nghệ thuật nấu ăn tinh tế, kỹ lưỡng và đầy tinh thần quê hương.',
      time: '60 Phút',
      image:
        'https://cdn.pixabay.com/photo/2023/05/27/12/39/noodle-soup-8021418_1280.png',
      author: 'Quốc Anh',
      authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isFavorite: false,
      nutrition: {
        carbs: '120 gr',
        protein: '200 gr',
        calories: '500 Calo',
        fat: '50 gr',
      },
      ingredients: [
        {
          name: 'Phở',
          amount: '200 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/10/04/20/04/soup-1715309_1280.jpg',
        },
        {
          name: 'Thịt bò',
          amount: '150 gr',
          image:
            'https://cdn.pixabay.com/photo/2023/01/14/14/06/burger-7718310_1280.jpg',
        },
        {
          name: 'Xương bò',
          amount: '500 gr',
          image:
            'https://cdn.pixabay.com/photo/2022/01/19/17/56/t-bone-steak-6950611_1280.jpg',
        },
        {
          name: 'Hành tím',
          amount: '50 gr',
          image:
            'https://cdn.pixabay.com/photo/2011/03/24/10/46/red-shallots-5773_1280.jpg',
        },
        {
          name: 'Gừng',
          amount: '30 gr',
          image:
            'https://cdn.pixabay.com/photo/2017/01/07/14/56/ginger-1960613_1280.jpg',
        },
      ],
      steps: [
        {
          step: 1,
          description:
            'Đổ nước sạch vào nồi lớn, cho xương bò, hành và gừng đã nướng vào. Đun sôi và sau đó giảm lửa nhỏ, hầm trong khoảng 6-8 giờ để nước dùng ngọt và trong. Lưu ý vớt bọt thường xuyên để nước dùng trong hơn.',
          video:
            'https://cdn.pixabay.com/photo/2015/04/23/22/00/cooking-736678_1280.jpg',
        },
        {
          step: 2,
          description:
            'Cho các loại gia vị (hoa hồi, thảo quả, quế, hạt ngò, bạch đậu khấu, đinh hương, hạt tiêu đen) vào túi vải hoặc lưới lọc và thả vào nồi nước dùng. Nấu thêm khoảng 1-2 giờ.',
          video:
            'https://cdn.pixabay.com/photo/2015/04/23/22/00/spices-736679_1280.jpg',
        },
        {
          step: 3,
          description:
            'Sau khi nước dùng đậm đà, nêm nếm lại cho vừa ăn, vớt ra các gia vị, thêm nước mắm, muối, và đường phèn.',
          video:
            'https://cdn.pixabay.com/photo/2015/04/23/22/00/kitchen-736680_1280.jpg',
        },
        {
          step: 4,
          description:
            'Nêm nếm lại cho vừa ăn. Chuẩn bị phở, thịt bò, rau thơm và thưởng thức.',
          video:
            'https://cdn.pixabay.com/photo/2017/01/31/09/30/raspberry-2023404_1280.jpg',
        },
      ],
    },
    {
      id: '2',
      name: 'Bánh Mì Pate',
      description: 'Công thức Bánh mì pate',
      time: '30 Phút',
      image:
        'https://cdn.pixabay.com/photo/2018/06/10/20/30/bread-3467243_1280.jpg',
      author: 'Bảo Ngọc',
      authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      isFavorite: true,
      nutrition: {
        carbs: '80 gr',
        protein: '100 gr',
        calories: '400 Calo',
        fat: '40 gr',
      },
      ingredients: [
        {
          name: 'Bánh mì',
          amount: '1 ổ',
          image:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/bread-1284438_1280.jpg',
        },
        {
          name: 'Pate',
          amount: '50 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/pate-1239190_1280.jpg',
        },
        {
          name: 'Thịt nguội',
          amount: '100 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/ham-1239191_1280.jpg',
        },
        {
          name: 'Dưa leo',
          amount: '50 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/cucumber-1239192_1280.jpg',
        },
        {
          name: 'Rau mùi',
          amount: '20 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/cilantro-1239193_1280.jpg',
        },
      ],
      steps: [
        {
          step: 1,
          description: 'Cắt đôi ổ bánh mì, phết pate lên một mặt bánh.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/sandwich-1284439_1280.jpg',
        },
        {
          step: 2,
          description: 'Xếp thịt nguội, dưa leo và rau mùi vào bánh mì.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/sandwich-1284440_1280.jpg',
        },
        {
          step: 3,
          description:
            'Thêm một chút muối, tiêu và nước mắm nếu thích. Đóng bánh lại và thưởng thức.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/sandwich-1284441_1280.jpg',
        },
      ],
    },
    {
      id: '3',
      name: 'Bún Bò Huế',
      description: 'Công thức Bún Bò Huế đậm đà hương vị miền Trung',
      time: '90 Phút',
      image:
        'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg',
      author: 'Minh Tuấn',
      authorAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      isFavorite: false,
      nutrition: {
        carbs: '100 gr',
        protein: '180 gr',
        calories: '600 Calo',
        fat: '60 gr',
      },
      ingredients: [
        {
          name: 'Bún',
          amount: '200 gr',
          image:
            'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg',
        },
        {
          name: 'Thịt bò',
          amount: '150 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/beef-1239189_1280.jpg',
        },
        {
          name: 'Xương heo',
          amount: '500 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/bones-1239188_1280.jpg',
        },
        {
          name: 'Sả',
          amount: '50 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/08/11/08/04/lemongrass-1585000_1280.jpg',
        },
        {
          name: 'Mắm ruốc',
          amount: '20 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/fermented-fish-1239194_1280.jpg',
        },
      ],
      steps: [
        {
          step: 1,
          description:
            'Hầm xương heo với sả và mắm ruốc trong 4-6 giờ để lấy nước dùng. Vớt bọt thường xuyên để nước trong.',
          video:
            'https://cdn.pixabay.com/photo/2015/04/23/22/00/cooking-736678_1280.jpg',
        },
        {
          step: 2,
          description:
            'Thêm các gia vị như ớt, tỏi, hành và dầu điều để tạo màu và mùi thơm cho nước dùng.',
          video:
            'https://cdn.pixabay.com/photo/2015/04/23/22/00/spices-736679_1280.jpg',
        },
        {
          step: 3,
          description:
            'Chuẩn bị bún, thịt bò, rau thơm, giá đỗ và thưởng thức cùng nước dùng nóng.',
          video:
            'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg',
        },
      ],
    },
    {
      id: '4',
      name: 'Gỏi Cuốn',
      description: 'Công thức Gỏi Cuốn tươi mát, dễ làm',
      time: '20 Phút',
      image:
        'https://cdn.pixabay.com/photo/2016/03/27/22/16/spring-roll-1284442_1280.jpg',
      author: 'Thu Hà',
      authorAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      isFavorite: false,
      nutrition: {
        carbs: '50 gr',
        protein: '80 gr',
        calories: '300 Calo',
        fat: '20 gr',
      },
      ingredients: [
        {
          name: 'Bánh tráng',
          amount: '10 cái',
          image:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/rice-paper-1284443_1280.jpg',
        },
        {
          name: 'Tôm',
          amount: '100 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/shrimp-1239195_1280.jpg',
        },
        {
          name: 'Thịt heo',
          amount: '100 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/pork-1239196_1280.jpg',
        },
        {
          name: 'Rau xà lách',
          amount: '50 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/lettuce-1239197_1280.jpg',
        },
        {
          name: 'Hẹ',
          amount: '20 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/chives-1239198_1280.jpg',
        },
      ],
      steps: [
        {
          step: 1,
          description: 'Luộc tôm và thịt heo, sau đó thái lát mỏng.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/boiling-1239199_1280.jpg',
        },
        {
          step: 2,
          description:
            'Nhúng bánh tráng vào nước ấm, trải lên mặt phẳng, xếp rau xà lách, tôm, thịt, hẹ và cuộn chặt.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/spring-roll-1284442_1280.jpg',
        },
        {
          step: 3,
          description:
            'Pha nước chấm với tỏi, ớt, đường, nước mắm và chanh. Thưởng thức gỏi cuốn với nước chấm.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/dipping-sauce-1239200_1280.jpg',
        },
      ],
    },
    {
      id: '5',
      name: 'Cơm Tấm Sườn Nướng',
      description: 'Công thức Cơm Tấm Sườn Nướng đặc trưng Sài Gòn',
      time: '45 Phút',
      image:
        'https://cdn.pixabay.com/photo/2016/03/27/22/16/rice-1284444_1280.jpg',
      author: 'Hoàng Long',
      authorAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      isFavorite: true,
      nutrition: {
        carbs: '150 gr',
        protein: '120 gr',
        calories: '700 Calo',
        fat: '50 gr',
      },
      ingredients: [
        {
          name: 'Cơm tấm',
          amount: '200 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/rice-1284444_1280.jpg',
        },
        {
          name: 'Sườn heo',
          amount: '150 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/pork-ribs-1239201_1280.jpg',
        },
        {
          name: 'Nước mắm',
          amount: '30 ml',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/fish-sauce-1239202_1280.jpg',
        },
        {
          name: 'Tỏi',
          amount: '20 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/08/11/08/04/garlic-1585001_1280.jpg',
        },
        {
          name: 'Mật ong',
          amount: '20 gr',
          image:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/honey-1239203_1280.jpg',
        },
      ],
      steps: [
        {
          step: 1,
          description:
            'Ướp sườn heo với nước mắm, tỏi, mật ong, đường và ớt trong 2 giờ.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/marinating-1239204_1280.jpg',
        },
        {
          step: 2,
          description:
            'Nướng sườn trên than hoa hoặc lò nướng ở 200°C trong 20 phút cho đến khi vàng đều.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/05/19/02/grilling-1239205_1280.jpg',
        },
        {
          step: 3,
          description:
            'Dọn cơm tấm ra dĩa, đặt sườn nướng lên, thêm nước mắm và dưa chua. Thưởng thức nóng.',
          video:
            'https://cdn.pixabay.com/photo/2016/03/27/22/16/rice-1284444_1280.jpg',
        },
      ],
    },
  ];

  const handleDeleteIngredient = (id: string) => {
    console.log('Xóa nguyên liệu:', id);
  };

  const handleIngredientPress = (id: string) => {
    console.log('Chọn nguyên liệu:', id);
  };

  const handleDeleteAll = () => {
    console.log('Xóa tất cả nguyên liệu');
  };

  const handleAddIngredient = () => {
    console.log('Thêm nguyên liệu mới');
  };

  const handleDishPress = (id: string) => {
    navigation.navigate('RecipeDetail', {
      recipeId: Number(id.replace('d', '')),
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={backgroundImage}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View className="flex-row items-center p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-red-800 mx-auto">
            Thực phẩm
          </Text>
        </View>

        <View className="flex-row px-6 mb-4">
          <TouchableOpacity
            className={`flex-1 pb-2 ${activeTab === 'ingredients' ? 'border-b-2 border-red-800' : ''}`}
            onPress={() => setActiveTab('ingredients')}
          >
            <View className="flex-row items-center justify-center">
              <Text
                className={`font-medium ${activeTab === 'ingredients' ? 'text-red-800' : 'text-gray-500'}`}
              >
                Nguyên liệu của tôi
              </Text>
              <View className="bg-black rounded-full ml-1 w-5 h-5 flex items-center justify-center">
                <Text className="text-white text-xs">
                  {ingredientGroups.reduce(
                    (acc, group) => acc + group.data.length,
                    0
                  )}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 pb-2 ${activeTab === 'dishes' ? 'border-b-2 border-red-800' : ''}`}
            onPress={() => setActiveTab('dishes')}
          >
            <View className="flex-row items-center justify-center">
              <Text
                className={`font-medium ${activeTab === 'dishes' ? 'text-red-800' : 'text-gray-500'}`}
              >
                Gợi ý món ăn
              </Text>
              <View className="bg-black rounded-full ml-1 w-5 h-5 flex items-center justify-center">
                <Text className="text-white text-xs">
                  {suggestedDishes.length}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {activeTab === 'ingredients' ? (
          <ScrollView className="flex flex-col gap-3 px-4">
            <MyIngredient
              ingredients={ingredientGroups}
              onDeleteIngredient={handleDeleteIngredient}
              onIngredientPress={handleIngredientPress}
              onDeleteAll={handleDeleteAll}
            />
          </ScrollView>
        ) : (
          <View className="flex-1 px-4">
            <SuggestDish
              dishes={suggestedDishes}
              onDishPress={handleDishPress}
            />
          </View>
        )}

        {/* Floating Action Button */}
        {activeTab === 'ingredients' && (
          <TouchableOpacity
            onPress={handleAddIngredient}
            className="absolute bottom-6 right-6 bg-red-800 w-14 h-14 rounded-full items-center justify-center shadow-lg"
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}
