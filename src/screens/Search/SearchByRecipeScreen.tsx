// RecipeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ImageBackground } from 'react-native';

const recipeList = [
  {
    id: '1',
    name: 'Công thức Phở bò chuẩn vị Hà Nội',
    image: 'https://cdn.pixabay.com/photo/2023/05/27/12/39/noodle-soup-8021418_1280.png',
    author: 'Nguyễn Giang',
    authorAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Công thức Phở gà truyền thống',
    image: 'https://www.huongnghiepaau.com/wp-content/uploads/2017/08/cach-nau-pho-ga-ngon.jpg',
    author: 'Minh Huyền',
    authorAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: '3',
    name: 'Công thức Phở Xào',
    image: 'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg',
    author: 'Minh Ngọc',
    authorAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: '4',
    name: 'Công thức Phở Gà trộn',
    image: 'https://i-giadinh.vnecdn.net/2021/09/11/nh4-1631343189-6272-1631343329.jpg',
    author: 'Trung Kiên',
    authorAvatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
];

const categories = [
  {
    name: 'Phở',
    icon: 'https://cdn.pixabay.com/photo/2023/05/27/12/39/noodle-soup-8021418_1280.png',
  },
  {
    name: 'Bánh mì',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/B%C3%A1nh_m%C3%AC_th%E1%BB%8Bt_n%C6%B0%E1%BB%9Bng.png',
  },
  {
    name: 'Cơm rang',
    icon: 'https://cdn.pixabay.com/photo/2017/09/16/19/21/salad-2756467_1280.jpg',
  },
  {
    name: 'Nộm',
    icon: 'https://www.btaskee.com/wp-content/uploads/2023/05/goi-ngo-sen-tom-thit.jpg',
  },
  {
    name: 'Gỏi cuốn',
    icon: 'https://heyyofoods.com/wp-content/uploads/2024/03/3-4.jpg',
  },
  {
    name: 'Nem',
    icon: 'https://daotaobeptruong.vn/wp-content/uploads/2020/01/nem-ran-ha-noi.jpg',
  },
  {
    name: 'Món chay',
    icon: 'https://thuanchay.vn/wp-content/uploads/2024/10/60-cong-thuc-nau-cac-mon-chay-14.webp',
  },
  {
    name: 'Khác',
    icon: 'https://cdn.pixabay.com/photo/2017/01/07/14/56/ginger-1960613_1280.jpg',
  },
];

const RecipeScreen = () => {
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const [search, setSearch] = useState('');
const [selectedCategory, setSelectedCategory] = useState('Phở');
const filtered = recipeList.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) && r.name.includes(selectedCategory));

 const background = require('../../assets/background.png');

  return (
    <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-red-800 mx-auto">
                Công thức
            </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchBar}>
          <TextInput
            placeholder="Tìm kiếm"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search" size={20} color="#888" />
        </View>

        <View style={styles.categoryWrap}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryItem, selectedCategory === cat.name && styles.categoryItemActive]}
              onPress={() => setSelectedCategory(cat.name)}
            >
              <Image source={{ uri: cat.icon }} style={styles.categoryIcon} />
              <Text style={[styles.categoryText, selectedCategory === cat.name && styles.categoryTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.recipeCard}>
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{item.name}</Text>
                <View style={styles.authorRow}>
                  <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
                  <Text style={styles.authorName}>{item.author}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', paddingHorizontal: 16, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  title: { flex: 1, textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: '#941D23' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 44
  },
  searchInput: { flex: 1, height: 40 },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
//   categoryItem: {
//     backgroundColor: '#f4f4f4',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,

//   },
  categoryItemActive: {
    backgroundColor: '#941D23',
  },
  categoryText: {
    fontSize: 14,
    color: '#444',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
//   recipeCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     borderRadius: 16,
//     padding: 12,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,

//   },
//   recipeImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 10,
//     marginRight: 12,
//   },
  // 🔽 Trong phần styles
categoryItem: {
  backgroundColor: '#f4f4f4',
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 20,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2, // ✅ SHADOW ADDED
},

recipeCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
  borderRadius: 16,
  padding: 16,              // ✅ PADDING INCREASED
  marginBottom: 15,
  minHeight: 130,           // ✅ HEIGHT INCREASED
  shadowColor: '#000',
  shadowOpacity: 0.4,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,             // ✅ SHADOW ADDED
},

recipeImage: {
  width: 110,                // ✅ SIZE INCREASED
  height: 100,
  borderRadius: 10,
  marginRight: 12,
},

  recipeInfo: { flex: 1 },
  recipeName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  authorAvatar: { width: 18, height: 18, borderRadius: 9, marginRight: 8 },
  authorName: { fontSize: 13, color: '#666' },
});

export default RecipeScreen;
