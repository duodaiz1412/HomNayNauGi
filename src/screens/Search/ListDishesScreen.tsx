import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const backgroundImage = require('../../assets/background.png');

const recipeData = [
  {
    id: '1',
    name: 'Mì trứng gà hầm bắc thảo',
    image: 'https://happyfood.vn/wp-content/uploads/2022/03/Picture1.png',
    author: 'Trần Tú',
    time: '20 Phút',
  },
  {
    id: '2',
    name: 'Bữa sáng kiểu Anh cùng rau củ',
    image: 'https://afamilycdn.com/k:thumb_w/600/E88MOq9iOdccccccccccccjjVmV53G/Image/2015/11/20151126_ANKT_BuaSang%20(1)-e44dd/bua-sang-hoan-hao.jpg',
    author: 'Tú Minh',
    time: '20 Phút',
  },
  {
    id: '3',
    name: 'Bánh mì ăn sáng sốt trứng muối',
    image: 'https://i.ytimg.com/vi/wK9W35MX1Xc/sddefault.jpg',
    author: 'Xuân Sơn',
    time: '15 Phút',
  },
  {
    id: '4',
    name: 'Súp tôm',
    image: 'https://daynauan.info.vn/wp-content/uploads/2020/08/sup-tom.jpg',
    author: 'Đại Minh',
    time: '30 Phút',
  },
];

const RecipeListScreen = () => {
      const navigation =
          useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground source={backgroundImage} resizeMode="cover" style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Back + Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#888" />
          </TouchableOpacity>
          <TextInput placeholder="Bữa sáng" style={styles.searchInput} />
        </View>

        {/* Filter Tags */}
        <View style={styles.tagsContainer}>
          {/* <TouchableOpacity style={styles.tagRed}>
            <Text style={styles.tagTextWhite}>Bộ lọc • 4</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.tagRed} onPress={() => navigation.navigate('FilterScreen')}>
            <Text style={styles.tagTextWhite}>Bộ lọc • </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tagRed}>
            <Text style={styles.tagTextWhite}>Ăn kiêng • 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tagWhite}>
            <Text style={styles.tagTextRed}>Nguyên liệu</Text>
          </TouchableOpacity>
        </View>

        {/* Recipe Grid */}
        <FlatList
          data={recipeData}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.author}>{item.author}</Text>
                  <View style={styles.time}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 70,
    backgroundColor: 'transparent',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
  },
  backButton: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tagRed: {
    backgroundColor: '#941D23',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagWhite: {
    backgroundColor: '#fff',
    borderColor: '#941D23',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagTextWhite: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tagTextRed: {
    color: '#941D23',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    color: '#666',
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default RecipeListScreen;
