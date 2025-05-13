// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Modal,
//   Pressable,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { RootStackParamList } from '../../navigation/AppNavigator';
// import { mockData } from '../../MockData/Data';
// import { RouteProp, useRoute } from '@react-navigation/native';
// import { RootStackParamList } from '../../navigation/AppNavigator';

// const units = ['gram', 'kg', 'ml', 'lit', 'cái'];
// const quantities = ['200 gram', '300 gram', '400 gram', '500 gram', '600 gram'];

// const IngredientsScreen = () => {

//   // const route = useRoute();
//   // const { ingredients } = route.params || {};
//   const route = useRoute<RouteProp<RootStackParamList, 'IngredientsScreen'>>();
// const { ingredients } = route.params;
//   const navigation =
//         useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const [ingredientData, setIngredientData] = useState(
//     // mockData.recipes[0].ingredients.map(item => ({ ...item, quantity: '' }))
//     (ingredients || []).map(item => ({ ...item, quantity: '' }))
//   );
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const handleQuantitySelect = (index: number) => {
//     setSelectedIndex(index);
//     setShowDropdown(true);
//   };

//   const setQuantity = (value: string) => {
//     if (selectedIndex === null) return;
//     const newData = [...ingredientData];
//     newData[selectedIndex].quantity = value;
//     setIngredientData(newData);
//     setShowDropdown(false);
//   };

//   const renderDropdown = () => (
//     <Modal
//       visible={showDropdown}
//       transparent
//       animationType="fade"
//       onRequestClose={() => setShowDropdown(false)}>
//       <Pressable
//         style={styles.modalBackground}
//         onPress={() => setShowDropdown(false)}>
//         <View style={styles.dropdownWrapper}>
//           {quantities.map((qty, index) => (
//             <TouchableOpacity key={index} onPress={() => setQuantity(qty)}>
//               <Text style={styles.dropdownItem}>{qty}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </Pressable>
//     </Modal>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#941D23" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Nguyên liệu</Text>
//         <View style={styles.headerIcons}>
//           <TouchableOpacity onPress={() => navigation.navigate('SearchByIngredientScreen', { ingredients: ingredientData })}>
//             <Ionicons name="create-outline" size={22} color="#333" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.navigate('SearchByIngredientScreen', { ingredients: ingredientData })}>
//             <Ionicons name="add-circle-outline" size={22} color="#333" style={{ marginLeft: 12 }} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <Text style={styles.subtitle}>Các nguyên liệu</Text>
//       <Text style={styles.count}>{ingredientData.length} nguyên liệu</Text>

//       <FlatList
//         data={ingredientData}
//         keyExtractor={(item) => item.name}
//         renderItem={({ item, index }) => (
//           <View style={styles.itemContainer}>
//             <Image source={{ uri: item.image }} style={styles.image} />
//             <Text style={styles.name}>{item.name}</Text>
//             <TouchableOpacity
//               onPress={() => handleQuantitySelect(index)}
//               style={styles.quantityInput}
//             >
//               <Text>{item.quantity || 'Khối lượng'}</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//         contentContainerStyle={{ paddingBottom: 120 }}
//       />

//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>Tìm món ngay 🍜</Text>
//       </TouchableOpacity>

//       {renderDropdown()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingTop: 60,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#941D23',
//   },
//   headerIcons: {
//     flexDirection: 'row',
//   },
//   subtitle: {
//     marginTop: 16,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   count: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 16,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },
//   image: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   name: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//   },
//   quantityInput: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     minWidth: 80,
//     alignItems: 'center',
//   },
//   button: {
//     position: 'absolute',
//     bottom: 24,
//     left: 16,
//     right: 16,
//     backgroundColor: '#941D23',
//     height: 48,
//     borderRadius: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   dropdownWrapper: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 16,
//     width: 200,
//   },
//   dropdownItem: {
//     paddingVertical: 8,
//     fontSize: 16,
//     color: '#333',
//   },
// });

// export default IngredientsScreen;
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   TextInput,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { mockData } from '../../MockData/Data';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/AppNavigator';
// import { RouteProp, useRoute } from '@react-navigation/native';

// import { useMemo } from 'react';

// interface Ingredient {
//   name: string;
//   image: string;
// }

// type IngredientRouteProp = RouteProp<RootStackParamList, 'SearchByIngredientScreen'>;

// const SearchByIngredientsScreen = () => {
//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const route = useRoute<IngredientRouteProp>();

//   const initialIngredients = route.params?.ingredients || [];

//   const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

//   useEffect(() => {
//     if (initialIngredients.length > 0) {
//       setSelectedIngredients(initialIngredients.map(i => i.name));
//     }
//   }, [initialIngredients]);

//   // // Danh sách tất cả nguyên liệu (không trùng)
//   // const allIngredients: Ingredient[] = Array.from(
//   //   new Map(
//   //     mockData.recipes
//   //       .flatMap((recipe) => recipe.ingredients)
//   //       .map((i) => [i.name, i])
//   //   ).values()
//   // );

//   // // Danh sách nguyên liệu chưa chọn
//   // const availableIngredients = allIngredients.filter(
//   //   (item) => !selectedIngredients.includes(item.name)
//   // );


//   const allIngredients: Ingredient[] = Array.from(
//     new Map(
//       mockData.recipes
//         .flatMap((recipe) => recipe.ingredients)
//         .map((i) => [i.name, i])
//     ).values()
//   );

//   const availableIngredients: Ingredient[] = allIngredients.filter(
//     (i) => !selectedIngredients.includes(i.name)
//   );
//   const toggleIngredient = (name: string) => {
//     setSelectedIngredients((prev) =>
//       prev.includes(name)
//         ? prev.filter((i) => i !== name)
//         : [...prev, name]
//     );
//   };

//   const handleViewResults = () => {
//     if (selectedIngredients.length === 0) {
//       Alert.alert('Thông báo', 'Hãy chọn nguyên liệu');
//       return;
//     }

//     const selectedDetail = allIngredients.filter(i => selectedIngredients.includes(i.name));
//     navigation.navigate('IngredientsScreen', { ingredients: selectedDetail });
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#fff1ed' }}>
//       <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
//         {/* Header */}
//         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="close" size={24} color="#333" />
//           </TouchableOpacity>
//           <Text className="text-3xl font-bold text-black-800 mx-auto">Tìm bằng nguyên liệu</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         {/* Search bar */}
//         <View style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           backgroundColor: '#fff',
//           borderRadius: 999,
//           paddingHorizontal: 16,
//           paddingVertical: 8,
//           borderWidth: 1,
//           borderColor: '#ddd'
//         }}>
//           <Ionicons name="arrow-back" size={20} color="#ccc" />
//           <TextInput
//             placeholder="Chọn nguyên liệu"
//             style={{ flex: 1, marginLeft: 10 }}
//           />
//         </View>

//         {/* Selected Ingredients */}
//         <Text style={{ marginTop: 24, fontSize: 16, fontWeight: 'bold', color: '#444' }}>
//           Nguyên liệu đã chọn
//         </Text>
//         <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
//           {selectedIngredients.map((name) => {
//             const item = allIngredients.find((i) => i.name === name);
//             if (!item) return null;
//             return (
//               <View key={name} style={{ alignItems: 'center', marginRight: 12, marginBottom: 12 }}>
//                 <TouchableOpacity
//                   onPress={() => toggleIngredient(name)}
//                   style={{
//                     width: 40,
//                     height: 40,
//                     borderRadius: 32,
//                     backgroundColor: '#ffe4e6',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     position: 'relative',
//                   }}
//                 >
//                   <Image
//                     source={{ uri: item.image }}
//                     style={{ width: 64, height: 64, borderRadius: 32 }}
//                   />
//                   <TouchableOpacity
//                     onPress={() => toggleIngredient(name)}
//                     style={{
//                       position: 'absolute',
//                       top: 4,
//                       right: 4,
//                       backgroundColor: '#333',
//                       borderRadius: 10,
//                       width: 18,
//                       height: 18,
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                     }}
//                   >
//                     <Ionicons name="close" size={12} color="#fff" />
//                   </TouchableOpacity>
//                 </TouchableOpacity>
//                 <Text style={{ marginTop: 4, fontSize: 12 }}>{name}</Text>
//               </View>
//             );
//           })}
//         </View>

//         {/* Ingredient Grid */}
//         <FlatList
//           data={availableIngredients}
//           numColumns={4}
//           keyExtractor={(item) => item.name}
//           contentContainerStyle={{ marginTop: 16, paddingBottom: 80 }}
//           renderItem={({ item }) => {
//             return (
//               <TouchableOpacity
//                 onPress={() => toggleIngredient(item.name)}
//                 style={{ width: '25%', alignItems: 'center', marginBottom: 20 }}
//               >
//                 <View style={{
//                   width: 64,
//                   height: 64,
//                   borderRadius: 32,
//                   backgroundColor: '#fff',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   borderWidth: 1,
//                   borderColor: '#ddd',
//                 }}>
//                   <Image
//                     source={{ uri: item.image }}
//                     style={{ width: 64, height: 64, borderRadius: 32 }}
//                   />
//                 </View>
//                 <Text style={{ marginTop: 6, fontSize: 12, color: '#444' }}>{item.name}</Text>
//               </TouchableOpacity>
//             );
//           }}
//         />

//         {/* Button */}
//         <TouchableOpacity
//           onPress={handleViewResults}
//           style={{
//             position: 'absolute',
//             bottom: 20,
//             left: 16,
//             right: 16,
//             height: 48,
//             borderRadius: 24,
//             backgroundColor: '#f43f5e',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//           <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Xem kết quả</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default SearchByIngredientsScreen;
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Pressable, Alert, ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/AppNavigator';
import { mockData } from '../../MockData/Data';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import api from "../../api/api";
import {Picker} from "@react-native-picker/picker";

const IngredientsScreen = () => {

  // const route = useRoute();
  // const { ingredients } = route.params || {};
  const route = useRoute<RouteProp<RootStackParamList, 'IngredientsScreen'>>();
const { ingredients } = route.params;
  const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [ingredientData, setIngredientData] = useState(
    (ingredients || []).map(item => ({ ...item, quantity: '', unit: '' }))
  );
  const [unitOfMeasures, setUnitOfMeasures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const response = await api.get('/units');
      setUnitOfMeasures(response.data);
      console.log('Danh sách units', response.data);
    } catch (error) {
      console.error('Error fetching units:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách units');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    console.log(ingredientData)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#941D23" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nguyên liệu</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('SearchByIngredientScreen', { ingredients: ingredientData })}>
            <Ionicons name="create-outline" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SearchByIngredientScreen', { ingredients: ingredientData })}>
            <Ionicons name="add-circle-outline" size={22} color="#333" style={{ marginLeft: 12 }} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtitle}>Các nguyên liệu</Text>
      <Text style={styles.count}>{ingredientData.length} nguyên liệu</Text>

      <FlatList
        data={ingredientData}
        keyExtractor={(item) => item.name}
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
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <TextInput
              className="text-lg py-2 px-2"
              style={{width: 80}}
              keyboardType={'numeric'}
              placeholder="Số lượng"
              onChangeText={(value) => {
                const editedIngredients = [...ingredients];
                const editIngredient = editedIngredients.find(x => x.id === item.id);
                editIngredient.quantity = value;
                setIngredientData(editedIngredients)
              }}
            />

            <Picker
              style={{width: 120}}
              selectedValue={ingredientData.find(x => x.id === item.id)?.unit || ''}
              onValueChange={(value, index) => {
                const editedIngredients = [...ingredients];
                const editIngredient = editedIngredients.find(x => x.id === item.id);
                editIngredient.unit = value
                setIngredientData(editedIngredients);
              }}
            >
              {unitOfMeasures.map((item => (
                <Picker.Item label={item.unitName} value={item.id} key={item.id} />
              )))}
            </Picker>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Tìm món ngay 🍜</Text>
      </TouchableOpacity>
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
    width: 100,
  },
  quantityInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    minWidth: 80,
    alignItems: 'center',
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdownWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: 200,
  },
  dropdownItem: {
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
});

export default IngredientsScreen;
