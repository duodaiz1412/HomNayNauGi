import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import api from 'src/api/api';

const backgroundImage = require('@assets/background.png');

interface Recipe {
  id: string;
  name: string;
  description: string;
  time: string;
  image: string;
  author: string;
  authorAvatar: string;
}

const FavoritesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load account ID from AsyncStorage
  useEffect(() => {
    const getAccountId = async () => {
      try {
        const id = await AsyncStorage.getItem('accountId');
        if (!id) return console.warn('Không tìm thấy accountId');
        setAccountId(id);
        fetchFavorites(id);
      } catch (err) {
        console.error('Lỗi đọc AsyncStorage:', err);
      }
    };
    getAccountId();
  }, []);

  // Fetch favorites from API
  const fetchFavorites = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/favorite-recipes`, {
        params: { page: 1, limit: 10 }, // Thêm phân trang nếu cần
      });
      const data = res.data.data.map((item: any) => ({
        id: item.recipe.id,
        name: item.recipe.name,
        description: item.recipe.description,
        time: item.recipe.prep_time, // Sửa lại cho đúng với trường 'time'
        image: item.recipe.image_url, // Thay đổi tên trường theo API
        author: item.recipe.author,
        authorAvatar: item.recipe.authorAvatar, // Thêm thông tin tác giả nếu có
      }));
      console.log(JSON.stringify(data, null, 2))

      setFavorites(data);
    } catch (err) {
      console.error('Lỗi tải danh sách yêu thích:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove favorite
  const handleRemoveFavorite = async (recipeId: string) => {
    if (!accountId) return;
    try {
      await axios.delete(`/favorite-recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${accountId}` },
      });
      setFavorites(prev => prev.filter(r => r.id !== recipeId));
    } catch (err) {
      console.error('Lỗi khi bỏ yêu thích:', err);
      Alert.alert('Lỗi', 'Không thể bỏ yêu thích.');
    }
  };

  const filteredFavorites = favorites.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 24 }}>⬅️</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginLeft: 16 }}>
              Yêu thích
            </Text>
          </View>

          {/* Search */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}>
              <Text style={{ fontSize: 24, marginRight: 8 }}>🔍</Text>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Tìm món ăn yêu thích..."
                style={{ flex: 1, fontSize: 16 }}
              />
            </View>
          </View>

          {/* Loading */}
          {loading && (
            <View style={{ alignItems: 'center', marginVertical: 16 }}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}

          {/* List of Favorite Recipes */}
          <View style={{ paddingHorizontal: 16 }}>
            {filteredFavorites.map(recipe => (
              <TouchableOpacity
                key={recipe.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 8,
                  marginBottom: 16,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: parseInt(recipe.id) })}
              >
                <Image
                  source={{ uri: recipe.image }}
                  style={{ width: '100%', height: 200 }}
                  resizeMode="cover"
                />
                <View style={{ padding: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', flex: 1, marginRight: 8 }}>
                      {recipe.name}
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveFavorite(recipe.id)}>
                      <Text style={{ fontSize: 24 }}>❤️</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{ marginBottom: 8 }} numberOfLines={2}>
                    {recipe.description}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>⏱️ {recipe.time}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        source={{ uri: recipe.authorAvatar }}
                        style={{ width: 24, height: 24, borderRadius: 12, marginRight: 8 }}
                      />
                      <Text>{recipe.author}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default FavoritesScreen;
