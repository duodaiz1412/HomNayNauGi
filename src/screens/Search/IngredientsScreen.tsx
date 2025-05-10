import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/AppNavigator';
import { mockData } from '../../MockData/Data';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

const units = ['gram', 'kg', 'ml', 'lit', 'cái'];
const quantities = ['200 gram', '300 gram', '400 gram', '500 gram', '600 gram'];

const IngredientsScreen = () => {

  // const route = useRoute();
  // const { ingredients } = route.params || {};
  const route = useRoute<RouteProp<RootStackParamList, 'IngredientsScreen'>>();
const { ingredients } = route.params;
  const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [ingredientData, setIngredientData] = useState(
    // mockData.recipes[0].ingredients.map(item => ({ ...item, quantity: '' }))
    (ingredients || []).map(item => ({ ...item, quantity: '' }))
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleQuantitySelect = (index: number) => {
    setSelectedIndex(index);
    setShowDropdown(true);
  };

  const setQuantity = (value: string) => {
    if (selectedIndex === null) return;
    const newData = [...ingredientData];
    newData[selectedIndex].quantity = value;
    setIngredientData(newData);
    setShowDropdown(false);
  };

  const renderDropdown = () => (
    <Modal
      visible={showDropdown}
      transparent
      animationType="fade"
      onRequestClose={() => setShowDropdown(false)}>
      <Pressable
        style={styles.modalBackground}
        onPress={() => setShowDropdown(false)}>
        <View style={styles.dropdownWrapper}>
          {quantities.map((qty, index) => (
            <TouchableOpacity key={index} onPress={() => setQuantity(qty)}>
              <Text style={styles.dropdownItem}>{qty}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

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
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <TouchableOpacity
              onPress={() => handleQuantitySelect(index)}
              style={styles.quantityInput}
            >
              <Text>{item.quantity || 'Khối lượng'}</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Tìm món ngay 🍜</Text>
      </TouchableOpacity>

      {renderDropdown()}
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
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
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
