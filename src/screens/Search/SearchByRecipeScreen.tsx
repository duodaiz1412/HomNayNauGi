
// import React, { useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   Dimensions
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/AppNavigator';
// import { ImageBackground } from 'react-native';
// import { mockData } from '../../MockData/Data';
// import api from 'src/api/api';
// import debounce from 'lodash.debounce';
// import Toast from 'react-native-toast-message';





// interface Recipe {
//   id: string;
//   name: string;
//   description: string;
//   time: string;
//   image: string;
//   author: string;
//   authorAvatar: string;
//   isFavorite: boolean;
//   nutrition: {
//     calories: string;
//     protein: string;
//     carbs: string;
//     fat: string;
//   };
//   ingredients: {
//     name: string;
//     amount: string;
//     image?: string;
//   }[];
//   steps: {
//     step: number;
//     description: string;
//     video?: string;
//   }[];
// }

// interface FeaturedRecipe {
//   id: string;
//   name: string;
//   image: string;
//   time: string;
//   isFavorite: boolean;
// }

// interface FeaturedByCategory {
//   [key: number]: FeaturedRecipe[];
// }

// const RecipeScreen = () => {
//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const [selectedCategory, setSelectedCategory] = useState('Phở');
//   // const [FeaturedByCategory, setFeaturedByCategory] = useState<FeaturedByCategory>(mockData.featuredByCategory);

//   const background = require('../../assets/background.png');

//   // const selectedCategoryIndex = mockData.categories.find(cat => cat.name === selectedCategory)?.id;
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState('');
//   const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
//   const [results, setResults] = useState([]);
//   const [search, setSearch] = useState('');
//   const [recipes, setRecipes] = useState([]);

//   const fetchRecipes = async (kw: string) => {
//   const [search, setSearch] = useState('');
//   const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
//   const [recipes, setRecipes] = useState([]);

//   const fetchRecipes = async (keyword: string) => {
//   const query = keyword.trim();

//   if (!query && selectedCategoryId === null) {
//     setRecipes([]);
//     return;
//   }

//   try {
//     const res = await api.get('/recipes/searchName', {
//       params: {
//         query,
//         status: 'public',
//         offset: 0,
//         limit: 20,
//       },
//     });

//     const data = res.data.data || [];

//     if (data.length === 0) {
//       Toast.show({
//         type: 'info',
//         text1: 'Không có kết quả phù hợp',
//       });
//     }

//     // Nếu có category được chọn thì lọc kết quả theo category ID
//     const filtered =
//       selectedCategoryId != null
//         ? data.filter((r) =>
//             r.categoryMappings?.some(
//               (m) => m.recipeCategory?.id === selectedCategoryId,
//             ),
//           )
//         : data;

//     setRecipes(filtered);
//     } catch (error) {
//       console.error('Lỗi tìm kiếm:', error?.response?.data || error.message);
//     }
//   };







// //     try {
// //       const cleanKw = kw?.trim();
// //       if (!cleanKw) {
// //         setRecipes([]);
// //         return;
// //       }

// //       const res = await api.get('/recipes/searchName', {
// //         params: {
// //           query: cleanKw,
// //           status: 'public',
// //           offset: 0,
// //           limit: 20,
// //         },
// //       });

// //       setRecipes(res.data.data || []);
// //       console.log(res.data.data);
// //     } catch (error) {
// //       console.error('Lỗi tìm kiếm:', error);
// //     }
// //   };

// //   // Debounce search input
// //   useEffect(() => {
// //     const debounced = debounce(() => {
// //       fetchRecipes(search);
// //     }, 300);

// //     debounced();

// //     return () => debounced.cancel();
// //   }, [search]);

  
// //   const fetchCategories = async () => {
// //   try {
// //     setLoading(true);
// //     const response = await api.get('/recipe-categories/search', {
// //       params: {
// //         query: '',
// //         offset: 0,
// //         limit: 20,
// //       },
// //     });
// //     const categoriesData = response.data.data || [];

// //     setCategories(categoriesData);

// //     if (categoriesData.length > 0) {
// //       // ✅ chọn category đầu tiên làm mặc định
// //       setSelectedCategory(categoriesData[0].name);
// //       setSelectedCategoryId(categoriesData[0].id);
// //     }
// //   } catch (error) {
// //     console.error('Lỗi khi lấy danh mục:', error);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// //   useEffect(() => {
// //     if (selectedCategoryId !== null) {
// //       fetchRecipesByCategory(selectedCategoryId);
// //     }
// //   }, [selectedCategoryId]);

// //   useEffect(() => {
// //     fetchCategories();
// //   }, []);

//   // const fetchRecipesByCategory = async (id: number) => {
//   //   const res = await api.get(`/recipe-categories/seach/${id}`);
//   //   setRecipes(res.data.data.recipes || []);
//   //   console.log(res.data.data);
//   // };

//   // const filteredRecipes = recipes.filter(r =>
//   //   r.name.toLowerCase().includes(searchText.toLowerCase())
//   // );

//     const fetchRecipesByCategory = async (id: number) => {
//     const res = await api.get(`/recipe-category-mappings/search-recipes?categoryId=${id}`);
//     setRecipes(res.data.data);
//   };

//   const filteredRecipes = recipes.filter(r =>
//     r.name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   return (
//     <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color="black" />
//           </TouchableOpacity>
//           <Text className="text-3xl font-bold text-red-800 mx-auto">Công thức</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         <View style={styles.searchBar}>
//           <TextInput
//             placeholder="Tìm kiếm"
//             style={styles.searchInput}
//             value={search}
//             onChangeText={setSearch}
//           />
//           <Ionicons name="search" size={20} color="#888" />
//         </View>

//         <View style={styles.categoryWrap}>
//           {categories.map((cat, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[styles.categoryItem, selectedCategory === cat.name && styles.categoryItemActive]}
//               onPress={() => {
//                 setSelectedCategory(cat.name);
//                 setSelectedCategoryId(cat.id); 
//               }}
//             >
//               <Image source={{ uri: cat.imageUrl }} style={styles.categoryIcon} />
//               <Text style={[styles.categoryText, selectedCategory === cat.name && styles.categoryTextActive]}>
//                 {cat.name}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <FlatList
//           data={recipes}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
            
//             <TouchableOpacity style={styles.recipeCard} 
//             key = {item.id}
//             onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}>
//               <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
//               <View style={styles.recipeInfo}>
//                 <Text style={styles.recipeDescription}>{item.name}</Text>
//                 <View style={styles.authorRow}>
//                 <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
//                 <Text style={styles.authorName}>{item.author}</Text>
//               </View>
//               {/* <Text style={styles.authorName}>{item.time}</Text> */}
//               </View>
//               <Ionicons name="chevron-forward" size={20} color="#888" />
//             </TouchableOpacity>
//                     )}
//           contentContainerStyle={{ paddingBottom: 80 }}
//         />

//       </View>
//     </ImageBackground>
//   );
// };}
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'transparent', paddingHorizontal: 16, paddingTop: 60 },
//   header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
//   title: { flex: 1, textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: '#941D23' },
//   // searchBar: {
//   //   flexDirection: 'row',
//   //   alignItems: 'center',
//   //   backgroundColor: '#f2f2f2',
//   //   borderRadius: 20,
//   //   paddingHorizontal: 16,
//   //   marginBottom: 20,
//   //   height: 44,
//   // },

//     searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f2f2f2',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     marginBottom: 20,
//     height: 44,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.15,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   searchInput: { flex: 1, height: 40 },
//   categoryWrap: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginBottom: 20,
//   },
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
//   categoryItemActive: {
//     backgroundColor: '#941D23',
//   },
//   categoryText: {
//     fontSize: 14,
//     color: '#444',
//   },
//   categoryTextActive: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   categoryIcon: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//   },
//   recipeCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 15,
//     minHeight: 130,
//     shadowColor: '#000',
//     shadowOpacity: 0.4,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 1,
//   },
//   recipeImage: {
//     width: 110,
//     height: 100,
//     borderRadius: 10,
//     marginRight: 12,
//   },
//   recipeInfo: { flex: 1 },
//   recipeDescription: { fontSize: 18, fontWeight: 'bold', color: '#333' },
//   authorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
//   authorAvatar: { width: 18, height: 18, borderRadius: 9, marginRight: 8 },
//   authorName: { fontSize: 13, color: '#666' },
// });


// export default RecipeScreen;


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import api from 'src/api/api';
import debounce from 'lodash.debounce';
import Toast from 'react-native-toast-message';

const background = require('../../assets/background.png');

const RecipeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedCategory, setSelectedCategory] = useState('Phở');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [recipes, setRecipes] = useState([]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/recipe-categories/search', {
        params: {
          query: '',
          offset: 0,
          limit: 20,
        },
      });
      const categoriesData = response.data.data || [];
      setCategories(categoriesData);

      // if (categoriesData.length > 0) {
      //   setSelectedCategory(categoriesData[0].name);
      //   setSelectedCategoryId(categoriesData[0].id);
      // }
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
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
      // if (selectedCategoryId) {
      //   data = data.filter((r) =>
      //     r.categoryMappings?.some(
      //       (m) => m.recipeCategory?.id === selectedCategoryId
      //     )
      //   );
      // }

      if (data.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'Không có kết quả phù hợp',
        });
      }

      setRecipes(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchRecipes = async (keyword: string) => {
  //   const query = keyword.trim();
  //   if (!query && selectedCategoryId === null) {
  //     setRecipes([]);
  //     return;
  //   }
  //   try {
  //     const res = await api.get('/recipes/searchName', {
  //       params: {
  //         query: 'Phở bò',
  //         status: 'public',
  //         offset: 0,
  //         limit: 20,
  //       },
  //     });

  //     let data = res.data.data || [];

  //     if (selectedCategoryId) {
  //       data = data.filter((r) =>
  //         r.categoryMappings?.some(
  //           (m) => m.recipeCategory?.id === selectedCategoryId
  //         )
  //       );
  //     }

  //     if (data.length === 0) {
  //       Toast.show({
  //         type: 'info',
  //         text1: 'Không có kết quả phù hợp',
  //       });
  //     }

  //     setRecipes(data);
  //   } catch (error) {
  //     console.error('Lỗi tìm kiếm:', error?.response?.data || error.message);
  //   }
  // };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const debounced = debounce(() => {
      fetchRecipes(search);
    }, 300);
    debounced();
    return () => debounced.cancel();
  }, [search, selectedCategoryId]);

  return (
    <ImageBackground source={background} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Công thức</Text>
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
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryItem, selectedCategory === cat.name && styles.categoryItemActive]}
              onPress={() => {
                setSelectedCategory(cat.name);
                setSelectedCategoryId(cat.id);
                setSearch(cat.name);
              }}
            >
              <Image source={{ uri: cat.imageUrl }} style={styles.categoryIcon} />
              <Text style={[styles.categoryText, selectedCategory === cat.name && styles.categoryTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeCard}
              onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeDescription}>{item.name}</Text>
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

        <Toast />
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
  categoryItemActive: { backgroundColor: '#941D23' },
  categoryText: { fontSize: 14, color: '#444' },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },
  categoryIcon: { width: 20, height: 20, borderRadius: 10 },
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
  recipeImage: { width: 110, height: 100, borderRadius: 10, marginRight: 12 },
  recipeInfo: { flex: 1 },
  recipeDescription: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  authorAvatar: { width: 18, height: 18, borderRadius: 9, marginRight: 8 },
  authorName: { fontSize: 13, color: '#666' },
});

export default RecipeScreen;
