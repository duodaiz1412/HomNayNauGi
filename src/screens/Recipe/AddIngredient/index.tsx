import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
// Danh sách nguyên liệu mẫu
const INGREDIENTS = {
  'Thịt & Hải sản': [
    {
      id: '1',
      name: 'Ba chỉ',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/bacon-1239192_1280.jpg',
    },
    {
      id: '2',
      name: 'Thịt bò ta',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/beef-1239189_1280.jpg',
    },
    {
      id: '3',
      name: 'Bò tảng',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/beef-1239189_1280.jpg',
    },
    {
      id: '4',
      name: 'Gà nguyên con',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/chicken-1239193_1280.jpg',
    },
    {
      id: '5',
      name: 'Ức gà',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/chicken-1239193_1280.jpg',
    },
    {
      id: '6',
      name: 'Đùi gà',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/chicken-1239193_1280.jpg',
    },
    {
      id: '7',
      name: 'Thịt lợn xay',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/minced-meat-1239194_1280.jpg',
    },
    {
      id: '8',
      name: 'Tôm',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/shrimp-1239195_1280.jpg',
    },
    {
      id: '9',
      name: 'Đùi cừu',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/lamb-1239196_1280.jpg',
    },
  ],
  'Rau củ': [
    {
      id: '10',
      name: 'Súp lơ',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/cauliflower-1239197_1280.jpg',
    },
    {
      id: '11',
      name: 'Cà rốt',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/carrot-1239198_1280.jpg',
    },
    {
      id: '12',
      name: 'Rau cải',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/lettuce-1239199_1280.jpg',
    },
  ],
  'Trái cây': [
    {
      id: '13',
      name: 'Táo',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/apple-1239190_1280.jpg',
    },
    {
      id: '14',
      name: 'Cam',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/orange-1239191_1280.jpg',
    },
    {
      id: '15',
      name: 'Nho',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/grapes-1239192_1280.jpg',
    },
  ],
  'Nước & Trái cây': [
    {
      id: '16',
      name: 'Nước cam',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/orange-1239191_1280.jpg',
    },
    {
      id: '17',
      name: 'Nước táo',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/apple-1239190_1280.jpg',
    },
  ],
  'A Trái cây': [
    {
      id: '1',
      name: 'Ba chỉ',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/bacon-1239192_1280.jpg',
    },
    {
      id: '2',
      name: 'Thịt bò ta',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/beef-1239189_1280.jpg',
    },
    {
      id: '3',
      name: 'Bò tảng',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/beef-1239189_1280.jpg',
    },
    {
      id: '4',
      name: 'Gà nguyên con',
      image:
        'https://cdn.pixabay.com/photo/2016/03/05/19/02/chicken-1239193_1280.jpg',
    },
  ],
  // ... Thêm các loại khác nếu muốn
};
const TABS = Object.keys(INGREDIENTS);

const AddIngredientScreen = ({ navigation, route }) => {
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const isMultiSelect = route.params?.isMultiSelect ?? false;

  const filtered = INGREDIENTS[selectedTab].filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (item) => {
    if (isMultiSelect) {
      // Chế độ chọn nhiều (Recipe screen)
      if (selected.some((i) => i.id === item.id)) {
        setSelected(selected.filter((i) => i.id !== item.id));
      } else {
        setSelected([...selected, item]);
      }
    } else {
      // Chế độ chọn một (Add Dish screen)
      if (selected.some((i) => i.id === item.id)) {
        setSelected([]);
      } else {
        setSelected([item]);
      }
    }
  };

  const handleAddIngredient = () => {
    if (selected.length > 0) {
      route.params?.onSelect?.(selected[0]);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-red-800 mx-auto">
          Thêm thực phẩm
        </Text>
      </View>
      <View className="p-4 ">
        {/* Thanh tìm kiếm */}
        <View className="flex-row items-center bg-gray-100 h-14 rounded-xl px-3 mb-4">
          <Ionicons name="search" size={24} color="#888" />
          <TextInput
            className="flex-1 py-2 px-2 bg-transparent text-lg"
            placeholder="Tìm kiếm nguyên liệu"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        {/* Slider loại nguyên liệu */}
        <FlatList
          data={TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item: tab }) => (
            <TouchableOpacity
              onPress={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-full mr-2 ${selectedTab === tab ? 'bg-red-700' : 'bg-gray-200'}`}
            >
              <Text
                className={selectedTab === tab ? 'text-white' : 'text-gray-700'}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{
            paddingRight: 16,
            maxHeight: 40,
            marginBottom: 30,
          }}
        />

        <FlatList
          data={filtered}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => toggleSelect(item)}
              className="flex-1 m-1"
              style={{ maxWidth: '32%' }}
            >
              <View
                className={`rounded-xl overflow-hidden border ${selected.some((i) => i.id === item.id) ? 'border-red-800' : 'border-transparent'}`}
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-20"
                  resizeMode="cover"
                />
                <View className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white items-center justify-center">
                  {selected.some((i) => i.id === item.id) && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#B91C1C"
                    />
                  )}
                </View>
                <Text className="text-center py-2 text-xs font-medium text-gray-700">
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />

        {/* Nút xác nhận */}
      </View>
      <View className="absolute bottom-5 left-0 right-0 px-7">
        <TouchableOpacity
          onPress={handleAddIngredient}
          className="bg-red-900 rounded-full py-4 items-center w-3/5 self-center"
        >
          <Text className="text-white font-bold text-lg">Thêm nguyên liệu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddIngredientScreen;
