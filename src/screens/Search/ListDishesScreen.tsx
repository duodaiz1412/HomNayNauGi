import React, { useState, useEffect } from 'react';

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
import { mockData } from '../../MockData/Data';
import api from 'src/api/api';
import debounce from 'lodash.debounce';
import Toast from 'react-native-toast-message';


const backgroundImage = require('../../assets/background.png');

const RecipeListScreen = () => {
  const navigation =
          useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    
  
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/recipes');
      const recipesData = response.data || [];
      console.log(recipesData);
      setRecipes(recipesData);
    } catch (error) {
      // console.error('Lỗi khi lấy danh mục:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipesSearch = async () => {
    const query = search.trim();
    try {
      setLoading(true);
      const response = await api.get('/recipes/searchName', {
        params: {
          query: query,
          offset: 0,
          limit: 20,
        },
      });
      let data = response.data.data || [];
      console.log('-----------------------------------------------');
      console.log(data);
      console.log('-----------------------------------------------');
      console.log(selectedCategoryId);

      if (data.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'Không có kết quả phù hợp',
        });
      }

      setRecipes(data);
      } catch (error) {
        // console.error('Lỗi khi lấy danh mục:', error);
      } finally {
        setLoading(false);
      }
    };
      useEffect(() => {
        const debounced = debounce(() => {
          fetchRecipesSearch(search);
        }, 300);
        debounced();
        return () => debounced.cancel();
      }, [search, selectedCategoryId]);

  return (
    <ImageBackground source={backgroundImage} resizeMode="cover" style={{ flex: 1 }}>
      <View style={styles.container}>

        <View style={styles.searchBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#888" />
          </TouchableOpacity>

          <TextInput
            placeholder="Tìm kiếm"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search" size={20} color="#888" />
        </View>

        {/* Filter Tags
        <View style={styles.tagsContainer}>
          <TouchableOpacity style={styles.tagRed} onPress={() => navigation.navigate('FilterScreen')}>
            <Text style={styles.tagTextWhite}>Bộ lọc • </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tagRed}>
            <Text style={styles.tagTextWhite}>Ăn kiêng • 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tagWhite}>
            <Text style={styles.tagTextRed}>Nguyên liệu</Text>
          </TouchableOpacity>
        </View> */}

        {/* Recipe Grid */}
        <FlatList
          data={recipes}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          // columnWrapperStyle={{ justifyContent: 'space-between' }}

          columnWrapperStyle={recipes.length > 0 ? { justifyContent: 'space-between' } : undefined}
          ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Không có kết quả phù hợp</Text>
            </View>
          ) : null
        }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.author}>{item.account.username}</Text>
                  <View style={styles.time}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text style={styles.timeText}>{item.preparationTimeMinutes} phút</Text>
                  </View>
                </View>
              </View>
              
             </TouchableOpacity>
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
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  emptyContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 40,
  paddingHorizontal: 20,
},

emptyText: {
  marginTop: 10,
  fontSize: 18,
  color: '#666',
  textAlign: 'center',
  fontWeight: '500',
},
});

export default RecipeListScreen;