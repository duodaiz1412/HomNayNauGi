import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockData } from '../../MockData/Data';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { IngredientCategory } from '../../types';
import api, { findRecipesByIngredients } from '../../api/api';
import debounce from 'lodash.debounce';
import Toast from 'react-native-toast-message';
import SuggestDish from '../../components/SuggestDish/index';

// ✅ ADDED
// import { useNavigation,  } from '@react-navigation/native';

interface Ingredient {
  id: string;
  name: string;
  imageUrl: string;
}

interface SelectedIngredient {
  id: string;
  name: string;
  imageUrl: string;
}

type SearchByIngredientRouteProp = RouteProp<
  RootStackParamList,
  'SearchByIngredientScreen'
>;

const SearchByIngredientScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<SearchByIngredientRouteProp>();
  const initialIngredients = route.params?.ingredients || [];
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredient[]
  >([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (initialIngredients.length > 0) {
      setSelectedIngredients(
        initialIngredients.map((i) => ({ name: i.name, id: i.id, imageUrl: i.imageUrl }))
      );
    }
  }, [initialIngredients]);

  useEffect(() => {
    fetchIngredients();
  }, []);

  useEffect(() => {
    fetchIngredientsSearch();
  }, []);

  const fetchIngredientsSearch = async () => {
    const query = search.trim();
    try {
      setLoading(true);
      const response = await api.get('/ingredients/search', {
        params: {
          query: query,
          offset: 0,
          limit: 20,
        },
      });
      let data = response.data.data || [];
      if (data.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'Không có kết quả phù hợp',
        });
      }

      setIngredients(data);
    } catch (error) {
      console.error('Lỗi khi tìm nguyên liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIngredients = async (query = '', offset = 0, limit = 10) => {
    try {
      setLoading(true);
      const response = await api.get('/ingredients');
      setIngredients(response.data);
      console.log('Danh sách nguyên liệu', response.data);
    } catch (error) {
      console.error('Error fetching ingredient:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách nguyên liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounced = debounce(() => {
      fetchIngredientsSearch();
    }, 300);
    debounced();
    return () => debounced.cancel();
  }, [search, selectedCategoryId]);

  const toggleIngredient = (ingredient: Ingredient) => {
    setSelectedIngredients((prev) =>
      prev.some((i) => i.id === ingredient.id)
        ? prev.filter((i) => i.id !== ingredient.id)
        : [...prev, { id: ingredient.id, name: ingredient.name, imageUrl: ingredient.imageUrl }]
    );
  };

  const handleDishPress = (id: string) => {
    setShowModal(false);
    navigation.navigate('RecipeDetail', { recipeId: id });
  };

  // const handleViewResults = async () => {
  //   if (!selectedIngredients || selectedIngredients.length === 0) {
  //     Alert.alert('Thông báo', 'Hãy chọn nguyên liệu abc');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const selectedDetail = selectedIngredients.map((ing) => ({
  //       id: ing.id,
  //     }));
  //     console.log('selectedDetail', selectedDetail);
  //     const response = await findRecipesByIngredients(selectedDetail);
  //     console.log('Kết quả tìm kiếm món ăn:', response);
  //     setSearchResults(response.data);
  //     setShowModal(true);
  //   } catch (error) {
  //     Alert.alert('Lỗi', 'Không thể tìm kiếm món ăn. Vui lòng thử lại.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleViewResults = () => {
    if (!selectedIngredients || selectedIngredients.length === 0) {
      Alert.alert('Thông báo', 'Hãy chọn nguyên liệu');
      return;
    }

    const selectedDetail = ingredients.filter((i) =>
      selectedIngredients.some((ing) => ing.id === i.id)
    );
    navigation.navigate('ScanIngredient', {
      selectedIngredients: selectedDetail,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff1ed' }}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-black-800 mx-auto">
            Tìm bằng nguyên liệu
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search bar */}

        <View style={styles.searchBar}>
          <TextInput
            placeholder="Tìm kiếm"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search" size={20} color="#888" />
        </View>

        {/* Selected Ingredients */}
        <Text
          style={{
            marginTop: 24,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#444',
          }}
        >
          Nguyên liệu đã chọn
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
          {selectedIngredients.map((ingredient) => {
            const item = ingredients.find((i) => i.id === ingredient.id);
            if (!item) return null;
            return (
              <View
                key={ingredient.id}
                style={{
                  alignItems: 'center',
                  marginRight: 12,
                  marginBottom: 12,
                }}
              >
                <TouchableOpacity
                  onPress={() => toggleIngredient(item)}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: '#ffe4e6',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 64, height: 64, borderRadius: 32 }}
                  />
                  <TouchableOpacity
                    onPress={() => toggleIngredient(item)}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: '#333',
                      borderRadius: 10,
                      width: 18,
                      height: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="close" size={12} color="#fff" />
                  </TouchableOpacity>
                </TouchableOpacity>
                <Text style={{ marginTop: 4, fontSize: 12 }}>
                  {ingredient.name}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Ingredient Grid */}
        <FlatList
          data={ingredients}
          numColumns={4}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ marginTop: 16, paddingBottom: 80 }}
          ListFooterComponent={
            loading ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#941D23" />
                <Text className="text-gray-500 mt-2">Đang tải...</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <View className="py-8 items-center">
                <Text className="text-gray-500">
                  Không tìm thấy nguyên liệu
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const isSelected = selectedIngredients.some(
              (i) => i.id === item.id
            );
            return (
              <TouchableOpacity
                onPress={() => toggleIngredient(item)}
                style={{ width: '25%', alignItems: 'center', marginBottom: 20 }}
              >
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: isSelected ? '#fbcfe8' : '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#ddd',
                  }}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 64, height: 64, borderRadius: 32 }}
                  />
                </View>
                <Text style={{ marginTop: 6, fontSize: 12, color: '#444' }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Button */}
        <TouchableOpacity
          onPress={handleViewResults}
          style={{
            position: 'absolute',
            bottom: 20,
            left: 16,
            right: 16,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#f43f5e',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            Xem kết quả
          </Text>
        </TouchableOpacity>
      </View>

      {/* <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView className="flex-1 bg-white mt-10 p-2">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-[#941D23]">
              Gợi ý món ăn
            </Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color="#941D23" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#941D23" />
              <Text className="text-lg text-[#941D23] mt-4">
                Đang tìm kiếm món ăn phù hợp...
              </Text>
            </View>
          ) : (
            <SuggestDish dishes={searchResults} onDishPress={handleDishPress} />
          )}
        </SafeAreaView>
      </Modal> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#941D23',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
});
export default SearchByIngredientScreen;
