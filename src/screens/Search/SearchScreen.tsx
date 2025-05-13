
// SearchScreen.tsx (có lọc theo bữa ăn / categoryId)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import api from 'src/api/api';
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';


// import { BASE_URL } from '@env';


interface Recipe {
  id: string;
  name: string;
  imageUrl: string | null;
  createdAt: string;
}

interface Ingredient {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface RecipeCategory {
  id: number;
  name: string;
  imageUrl: string | null;
}

const SearchScreen = () => {
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const [keyword, setKeyword] = useState<string>('');
const [recipes, setRecipes] = useState<Recipe[]>([]);
const [mealCategories, setMealCategories] = useState<RecipeCategory[]>([]);
const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
const backgroundImage = require('@assets/background.png');

const route = useRoute<RouteProp<RootStackParamList, 'SearchByIngredientScreen'>>();
const initialIngredients = route.params?.ingredients || [];
const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [ingredients, setIngredients] = useState<Ingredient[]>([]);
const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 16 * 2 - 16) / 2;



  useEffect(() => {
    if (initialIngredients.length > 0) {
      setSelectedIngredients(initialIngredients.map(i => i.id));
    }
  }, [initialIngredients]);

    useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await api.get(`/ingredients/suggested`, {params: {limit: 20, offset: 0}});
        setIngredients(res.data.data);
        console.log("ingredients");
        console.log(res.data.data);
      } catch (err) {
        console.error('Lỗi khi tải nguyên liệu:', err);
      }
    };

    fetchIngredients();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const params: any = {};
        if (keyword) params.query = keyword;
        if (selectedIngredients.length > 0) params.ingredientIds = selectedIngredients.join(',');
        if (selectedCategoryId) params.categoryId = selectedCategoryId;

        const res = await api.get(`/recipes/top-favorites`, { params });
        setRecipes(res.data);
        console.log(res.data);
      } catch (err) {
        console.error('Lỗi khi tải món ăn:', err);
        Alert.alert('Lỗi', 'Không thể tải dữ liệu món ăn');
      }
    };

    fetchRecipes();
  }, [keyword, selectedIngredients, selectedCategoryId]);

  useEffect(() => {
    const fetchMealCategories = async () => {
      try {
        const res = await api.get(`/recipe-categories`, {
          params: { type: 'meal' },
        });
        setMealCategories(res.data);
        console.log(res.data);
      } catch (err) {
        console.error('Lỗi khi tải danh mục bữa ăn:', err);
      }
    };

    fetchMealCategories();
  }, []);



  return (
    <ImageBackground
    source={backgroundImage}
    resizeMode="cover"
    style={{ flex: 1 }}
    >
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="flex-row items-center p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-red-800 mx-auto">
            Tìm kiếm
          </Text>
        </View>

        {/* Search Input */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 8 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: '#ccc' }}>
            <TextInput
              placeholder="Tìm kiếm"
              value={keyword}
              onChangeText={setKeyword}
              style={{ flex: 1, color: '#333' }}
            />
            <Ionicons name="search" size={20} color="#888" />
          </View>
          <TouchableOpacity
            style={{ marginLeft: 8, padding: 10, borderRadius: 8, backgroundColor: '#941D23' }}
          >
            <Ionicons name="scan-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Ingredients */}
        <View style={{ marginTop: 24, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#444' }}>Tìm theo nguyên liệu</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SearchByIngredientScreen')}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#d11c1c' }}>
                Xem thêm
            </Text>
        </TouchableOpacity>
          {/* <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#d11c1c' }}>Xem thêm</Text> */}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, paddingHorizontal: 16 }}>
          {ingredients?.map((item, index) => (
            <TouchableOpacity
              key={item.id}
            onPress={() => navigation.navigate('SearchByIngredientScreen')} >
            <View key={index} style={{ alignItems: 'center', marginRight: 16 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#ffe3e6', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: item.imageUrl }} style={{ width: 64, height: 64, borderRadius: 32 }} />
              </View>
              <Text style={{ marginTop: 6, fontSize: 13, color: '#333', fontWeight: '600' }}>{item.name}</Text>
            </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Popular Dishes */}
        <View
        style={{
            marginTop: 24,
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}
        >
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#444' }}>
            Món ăn phổ biến
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SearchByRecipeScreen')}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#d11c1c' }}>
                Xem thêm
            </Text>
        </TouchableOpacity>
        </View>

        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 12, paddingHorizontal: 16 }}
        >
        {recipes.map((recipe) => (
          <TouchableOpacity


            key={recipe.id}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId:parseInt(recipe.id) })}
            style={{
                width: 140,
                backgroundColor: '#fff',
                borderRadius: 24,
                marginRight: 16,
                // overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 3,
                alignItems: 'center'
            }}
            >
            <Image
                source={{ uri: recipe.imageUrl }}
                style={{
                width: '90%',
                height: 110,
                borderRadius: 20,
                marginTop: 8
                }}
                resizeMode="cover"
            />
            <View style={{ paddingVertical: 10, paddingHorizontal: 8 }}>
                <Text
                style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center',
                }}
                >
                {recipe.name}
                </Text>
            </View>
            </TouchableOpacity>
        ))}
        </ScrollView>
    <View style={{ marginTop: 24 }}>
      <View style={{ paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#444' }}>Tìm theo bữa</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ListDishesScreen')}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#d11c1c' }}>
            Xem thêm
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginTop: 16,
        }}
      >
        {mealCategories.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            onPress={() => navigation.navigate('ListDishesScreen')}

            style={styles.card}
          >
            {meal.imageUrl && (
              <Image source={{ uri: meal.imageUrl }} style={styles.image} resizeMode="cover" />
            )}
            <View style={styles.overlay} />
            <Text style={styles.text}>{meal.name}</Text>
          </TouchableOpacity>
        ))}
      </View>


    </View>



      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#941D23',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  scanButton: {
    marginLeft: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#941D23',
  },
  sectionHeader: {
    marginTop: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d11c1c',
  },
  horizontalList: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  ingredientAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  ingredientName: {
    marginTop: 6,
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  recipeCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  recipeImage: {
    width: '90%',
    height: 110,
    borderRadius: 20,
    marginTop: 8,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  mealContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  card: {
    width: (Dimensions.get('window').width - 48) / 2,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(209, 28, 28, 0.2)',
  },
  text: {
    position: 'absolute',
    top: 10,
    left: 12,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SearchScreen;
