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

export default function RecipeScreen() {
  const navigation = useNavigation();
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
      id: 'd1',
      name: 'Thịt kho trứng',
      imageUrl: 'https://i.imgur.com/GGVpFGQ.jpg',
      ingredients: ['Thịt ba chỉ', 'Trứng', 'Nước dừa', 'Nước mắm'],
      time: '45 phút',
    },
    {
      id: 'd2',
      name: 'Bò xào bơ tỏi',
      imageUrl: 'https://i.imgur.com/8eWR2k1.jpg',
      ingredients: ['Thịt bò', 'Bơ', 'Tỏi', 'Dầu hào'],
      time: '20 phút',
    },
    {
      id: 'd3',
      name: 'Cá hồi nướng chanh',
      imageUrl: 'https://i.imgur.com/P7Qcowk.jpg',
      ingredients: ['Cá hồi', 'Chanh', 'Bơ', 'Tiêu', 'Rau mùi'],
      time: '30 phút',
    },
    {
      id: 'd4',
      name: 'Canh cà chua trứng',
      imageUrl: 'https://i.imgur.com/V13L8r8.jpg',
      ingredients: ['Cà chua', 'Trứng', 'Hành lá', 'Hạt nêm'],
      time: '15 phút',
    },
    {
      id: 'd5',
      name: 'Gà xào xả ớt',
      imageUrl: 'https://i.imgur.com/kVCl9z8.jpg',
      ingredients: ['Thịt gà', 'Sả', 'Ớt', 'Hành tím', 'Nước mắm'],
      time: '25 phút',
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
    console.log('Chọn món ăn:', id);
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
              onAddIngredient={handleAddIngredient}
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
      </ImageBackground>
    </SafeAreaView>
  );
}
