// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { mockData } from '../../MockData/Data';

// const IngredientsScreen = () => {
//   const navigation = useNavigation();
//   const allIngredients = mockData.recipes.flatMap(recipe => recipe.ingredients);
//   const [amounts, setAmounts] = useState<Record<string, string>>({});

//   const handleChangeAmount = (name: string, value: string) => {
//     setAmounts(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSearch = () => {
//     // TODO: Handle search logic using selected ingredients
//     console.log(amounts);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, padding: 16 }}>
//       {/* Header */}
//       <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#941D23" />
//         </TouchableOpacity>
//         <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#941D23', marginLeft: 12 }}>
//           Nguyên liệu
//         </Text>
//       </View>

//       {/* Selected Ingredients */}
//       <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
//         Các nguyên liệu ({allIngredients.length} nguyên liệu)
//       </Text>

//       <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
//         {allIngredients.map((item, index) => (
//           <View
//             key={`${item.name}-${index}`}
//             style={{
//               backgroundColor: '#fff',
//               borderRadius: 12,
//               flexDirection: 'row',
//               alignItems: 'center',
//               padding: 10,
//               marginBottom: 12,
//               shadowColor: '#000',
//               shadowOffset: { width: 0, height: 2 },
//               shadowOpacity: 0.1,
//               shadowRadius: 4,
//               elevation: 2,
//             }}
//           >
//             <Image
//               source={{ uri: item.image }}
//               style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
//             />
//             <Text style={{ flex: 1, fontWeight: '600', fontSize: 16 }}>{item.name}</Text>
//             <TextInput
//               placeholder="0"
//               value={amounts[item.name] || ''}
//               onChangeText={(text) => handleChangeAmount(item.name, text)}
//               style={{
//                 width: 80,
//                 borderWidth: 1,
//                 borderColor: '#ccc',
//                 borderRadius: 8,
//                 paddingHorizontal: 8,
//                 paddingVertical: 4,
//                 textAlign: 'center',
//               }}
//               keyboardType="numeric"
//             />
//           </View>
//         ))}
//       </ScrollView>

//       {/* Button */}
//       <TouchableOpacity
//         onPress={handleSearch}
//         style={{
//           position: 'absolute',
//           bottom: 16,
//           left: 16,
//           right: 16,
//           backgroundColor: '#941D23',
//           paddingVertical: 16,
//           borderRadius: 24,
//           alignItems: 'center',
//         }}
//       >
//         <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Tìm món ngay 🍲</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// export default IngredientsScreen;


import React from 'react';
import { View, Text, FlatList, Image, TextInput, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface Ingredient {
    name: string;
    image: string;
  }
const IngredientsScreen = () => {
  const route = useRoute();
  const { selectedIngredients } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Các nguyên liệu</Text>
      <Text style={styles.count}>{selectedIngredients?.length || 0} nguyên liệu</Text>

      <FlatList
        data={selectedIngredients || []}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.ingredientItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <TextInput
              placeholder="Khối lượng"
              style={styles.input}
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#941D23',
    marginBottom: 4,
  },
  count: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  ingredientItem: {
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
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    minWidth: 80,
  },
});

export default IngredientsScreen;
