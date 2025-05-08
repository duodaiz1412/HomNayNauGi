import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockData } from '../../MockData/Data';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Alert } from 'react-native';

interface Ingredient {
  name: string;
  image: string;
}

const SearchByIngredientsScreen = () => {
  const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  // Trích xuất danh sách nguyên liệu duy nhất
  const allIngredients: Ingredient[] = Array.from(
    new Map(
      mockData.recipes
        .flatMap((recipe) => recipe.ingredients)
        .map((i) => [i.name, i])
    ).values()
  );

  const toggleIngredient = (name: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(name)
        ? prev.filter((i) => i !== name)
        : [...prev, name]
    );
  };

  const handleViewResults = () => {
    if (!selectedIngredients || selectedIngredients.length === 0) {
      Alert.alert('Thông báo', 'Hãy chọn nguyên liệu');
      return;
    }

    const selectedDetail = allIngredients.filter(i => selectedIngredients.includes(i.name));
    navigation.navigate('IngredientsScreen', { ingredients: selectedDetail });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff1ed' }}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>

          <Text className="text-3xl font-bold text-black-800 mx-auto">
            Tìm bằng nguyên liệu
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 999,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: '#ddd'
        }}>
          <Ionicons name="arrow-back" size={20} color="#ccc" />
          <TextInput
            placeholder="Chọn nguyên liệu"
            style={{ flex: 1, marginLeft: 10 }}
          />
        </View>

        {/* Selected Ingredients */}
        <Text style={{ marginTop: 24, fontSize: 16, fontWeight: 'bold', color: '#444' }}>
          Nguyên liệu đã chọn
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
          {selectedIngredients.map((name) => {
            const item = allIngredients.find((i) => i.name === name);
            if (!item) return null;
            return (
              <View key={name} style={{ alignItems: 'center', marginRight: 12, marginBottom: 12 }}>
                <TouchableOpacity
                  onPress={() => toggleIngredient(name)}
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
                    source={{ uri: item.image }}
                    style={{ width: 64, height: 64, borderRadius: 32 }}
                  />
                  <TouchableOpacity
                    onPress={() => toggleIngredient(name)}
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
                <Text style={{ marginTop: 4, fontSize: 12 }}>{name}</Text>
              </View>
            );
          })}
        </View>

        {/* Ingredient Grid */}
        <FlatList
          data={allIngredients}
          numColumns={4}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ marginTop: 16, paddingBottom: 80 }}
          renderItem={({ item }) => {
            const isSelected = selectedIngredients.includes(item.name);
            return (
              <TouchableOpacity
                onPress={() => toggleIngredient(item.name)}
                style={{ width: '25%', alignItems: 'center', marginBottom: 20 }}
              >
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: isSelected ? '#fbcfe8' : '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#ddd',
                }}>
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 64, height: 64, borderRadius: 32 }}
                  />
                </View>
                <Text style={{ marginTop: 6, fontSize: 12, color: '#444' }}>{item.name}</Text>
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
          }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Xem kết quả</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SearchByIngredientsScreen;
