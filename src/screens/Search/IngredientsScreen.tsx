
// export default IngredientsScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { findRecipesByIngredients, scanIngredient } from '../../api/api';
import SuggestDish from '../../components/SuggestDish/index';
import { SafeAreaView } from 'react-native-safe-area-context';



const IngredientsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'IngredientsScreen'>>();
  const { ingredients } = route.params;

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [ingredientData, setIngredientData] = useState(
    (ingredients || []).map((item) => ({ ...item }))
  );
  const [loading, setLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  // const [ingredients, setIngredients] = useState<DetectedIngredient[]>([]);
  const [showSuggestDish, setShowSuggestDish] = useState(false);
  const [suggestedDishes, setSuggestedDishes] = useState([]);
  const [isLoadingDishes, setIsLoadingDishes] = useState(false);

  const handleSubmit = () => {
    // console.log('Nguyên liệu để tìm món:', ingredientData);
    navigation.navigate('SearchByIngredientScreen', {
      ingredients: ingredientData,
    });
  };

  // const handleFindRecipe = async () => {
  //     if (ingredientData.length > 0) {
  //       setIsLoadingDishes(true);
  //       try {
  //         const searchIngredients = ingredientData.map(ing => ({
  //           id: ing.id
  //         }));
          
  //         const response = await findRecipesByIngredients(searchIngredients);
  //         console.log('Kết quả tìm kiếm món ăn:', response);
  //         setSuggestedDishes(response.data);
  //         setShowSuggestDish(true);
  //       } catch (error) {
  //         Alert.alert('Lỗi', 'Không thể tìm kiếm món ăn. Vui lòng thử lại.');
  //       } finally {
  //         setIsLoadingDishes(false);
  //       }
  //     } else {
  //       Alert.alert(
  //         'Thông báo',
  //         'Vui lòng có ít nhất một nguyên liệu để tìm kiếm'
  //       );
  //     }
  //   };
  
    // const handleDishPress = (id: string) => {
    //   setShowSuggestDish(false);
    //   navigation.navigate('RecipeDetail', { recipeId: id });
    // };
  
    // const handleEdit = () => {
    //   Alert.alert('Thông báo', 'Chức năng chỉnh sửa sẽ được phát triển sau');
    // };

  const handleFindRecipe = async () => {
      if (ingredientData.length > 0) {
        setIsLoadingDishes(true);
        try {
          const searchIngredients = ingredientData.map(ing => ({
            id: ing.id
          }));
          
          const response = await findRecipesByIngredients(searchIngredients);
          console.log('Kết quả tìm kiếm món ăn:', response);
          setSuggestedDishes(response.data);
          setShowSuggestDish(true);
        } catch (error) {
          Alert.alert('Lỗi', 'Không thể tìm kiếm món ăn. Vui lòng thử lại.');
        } finally {
          setIsLoadingDishes(false);
        }
      } else {
        Alert.alert(
          'Thông báo',
          'Vui lòng có ít nhất một nguyên liệu để tìm kiếm'
        );
      }
    };
  
    const handleDishPress = (id: string) => {
      setShowSuggestDish(false);
      navigation.navigate('RecipeDetail', { recipeId: id });
    };
  
    // const handleEdit = () => {
    //   Alert.alert('Thông báo', 'Chức năng chỉnh sửa sẽ được phát triển sau');
    // };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#941D23" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nguyên liệu</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleSubmit}>
            <Ionicons name="create-outline" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit}>
            <Ionicons
              name="add-circle-outline"
              size={22}
              color="#333"
              style={{ marginLeft: 12 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtitle}>Các nguyên liệu</Text>
      <Text style={styles.count}>{ingredientData.length} nguyên liệu</Text>

      <FlatList
        data={ingredientData}
        keyExtractor={(item) => item.id?.toString() || item.name}
        ListFooterComponent={
          loading ? (
            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#941D23" />
              <Text style={{ color: '#666', marginTop: 8 }}>Đang tải...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{ paddingVertical: 32, alignItems: 'center' }}>
              <Text style={{ color: '#999' }}>Không tìm thấy nguyên liệu</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <TouchableOpacity style={styles.button} onPress={handleFindRecipe}>
        <Text style={styles.buttonText}>Tìm món ngay 🍜</Text>
      </TouchableOpacity>

      {/* <Modal
        visible={showSuggestDish}
        animationType="slide"
        onRequestClose={() => setShowSuggestDish(false)}
      >
        <SafeAreaView className="flex-1 bg-white mt-10 p-2">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-[#941D23]">Gợi ý món ăn</Text>
            <TouchableOpacity onPress={() => setShowSuggestDish(false)}>
              <Ionicons name="close" size={24} color="#941D23" />
            </TouchableOpacity>
          </View>

          {isLoadingDishes ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#941D23" />
              <Text className="text-lg text-[#941D23] mt-4">
                Đang tìm kiếm món ăn phù hợp...
              </Text>
            </View>
          ) : (
            <SuggestDish
              dishes={suggestedDishes}
              onDishPress={handleDishPress}
            />
          )}
        </SafeAreaView>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#941D23',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  count: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  quantityInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    minWidth: 80,
    marginRight: 12,
  },
  button: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#941D23',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IngredientsScreen;
