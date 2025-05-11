
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
import { mockData } from '../../MockData/Data';

interface Recipe {
  id: string;
  name: string;
  description: string;
  time: string;
  image: string;
  author: string;
  authorAvatar: string;
  isFavorite: boolean;
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  ingredients: {
    name: string;
    amount: string;
    image?: string;
  }[];
  steps: {
    step: number;
    description: string;
    video?: string;
  }[];
}

interface FeaturedRecipe {
  id: string;
  name: string;
  image: string;
  time: string;
  isFavorite: boolean;
}

interface FeaturedByCategory {
  [key: number]: FeaturedRecipe[];
}

const RecipeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Phở');
  const [Recipes, setRecipes] = useState<Recipe[]>(mockData.recipes);
  const [FeaturedByCategory, setFeaturedByCategory] = useState<FeaturedByCategory>(mockData.featuredByCategory);

  const background = require('../../assets/background.png');

  const selectedCategoryIndex = mockData.categories.find(cat => cat.name === selectedCategory)?.id;

  const filtered = selectedCategoryIndex
    ? mockData.recipes.filter(r =>
        r.name.toLowerCase().includes(selectedCategory.toLowerCase())
      ).map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        image: r.image,
        time: r.time,
        isFavorite: r.isFavorite,
        author: r.author,
        authorAvatar: r.authorAvatar,
      }))
    : [];

  return (
    <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-red-800 mx-auto">Công thức</Text>
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
          {mockData.categories.map((cat, index) => (
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
            
            <TouchableOpacity style={styles.recipeCard} 
            key = {item.id}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: parseInt(item.id) })}>
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeDescription}>{item.description}</Text>
                <View style={styles.authorRow}>
                <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
                <Text style={styles.authorName}>{item.author}</Text>
              </View>
              {/* <Text style={styles.authorName}>{item.time}</Text> */}
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
  // searchBar: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#f2f2f2',
  //   borderRadius: 20,
  //   paddingHorizontal: 16,
  //   marginBottom: 20,
  //   height: 44,
  // },

    searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: { flex: 1, height: 40 },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
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
    elevation: 2,
  },
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
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    minHeight: 130,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  recipeImage: {
    width: 110,
    height: 100,
    borderRadius: 10,
    marginRight: 12,
  },
  recipeInfo: { flex: 1 },
  recipeDescription: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  authorAvatar: { width: 18, height: 18, borderRadius: 9, marginRight: 8 },
  authorName: { fontSize: 13, color: '#666' },
});


export default RecipeScreen;


