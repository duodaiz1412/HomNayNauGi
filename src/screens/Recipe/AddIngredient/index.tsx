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
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
    },
    {
      id: '2',
      name: 'Thịt bò ta',
      image:
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
    },
    {
      id: '3',
      name: 'Bò tảng',
      image:
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
    },
    {
      id: '4',
      name: 'Gà nguyên con',
      image:
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
    },
    {
      id: '5',
      name: 'Ức gà',
      image:
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
    },
    {
      id: '6',
      name: 'Đùi gà',
      image:
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
    },
    {
      id: '7',
      name: 'Thịt lợn xay',
      image:
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
    },
    {
      id: '8',
      name: 'Tôm',
      image:
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
    },
    {
      id: '9',
      name: 'Đùi cừu',
      image:
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
    },
  ],
  'Rau củ': [
    {
      id: '10',
      name: 'Súp lơ',
      image:
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
    },
    {
      id: '11',
      name: 'Cà rốt',
      image:
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
    },
    {
      id: '12',
      name: 'Rau cải',
      image:
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
    },
  ],
  'Trái cây': [
    {
      id: '13',
      name: 'Táo',
      image:
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
    },
    {
      id: '14',
      name: 'Cam',
      image:
        'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2024/3/29/0779f948-50d5-448e-ac07-62c1daa22092/M%C3%B3n%20%C4%82n%20Ngon%20T%E1%BB%AB%20Th%E1%BB%8Bt%20Ba%20Ch%E1%BB%89.png',
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
              className="flex-1 m-2"
              style={{ maxWidth: '30%'}}
            >
              <View
                className={`rounded-xl overflow-hidden border ${selected.some((i) => i.id === item.id) ? 'border-red-800' : 'border-gray-300'}`}
              >
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-24"
                  resizeMode="cover"
                />
                <View className="absolute top-1 right-1 w-[18px] h-[18px] rounded-full bg-white items-center justify-center">
                  {selected.some((i) => i.id === item.id) && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
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
