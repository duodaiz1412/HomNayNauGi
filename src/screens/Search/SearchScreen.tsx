import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '@utils/supabase';
import { ImageBackground } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockData } from '../../MockData/Data';// Đường dẫn tùy chỉnh theo dự án
import { RouteProp, useRoute } from '@react-navigation/native';


interface Recipe {
  id: string;
  name: string;
  description: string;
  time: string;
  image: string;
  author: string;
  authorAvatar: string;
  isFavorite: boolean;
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  ingredients: {
    name: string;
    amount: string;
  }[];
  steps: {
    step: number;
    description: string;
  }[];
}



const SearchScreen = () => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [keyword, setKeyword] = useState<string>('');
  const backgroundImage = require('@assets/background.png');
  const mealImage = require('@assets/meal.png')

        // ✅ ADDED inside SearchByIngredientsScreen
  // const route = useRoute<IngredientRouteProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'SearchByIngredientScreen'>>();
  const initialIngredients = route.params?.ingredients || [];
  
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  
      useEffect(() => {
      if (initialIngredients.length > 0) {
        setSelectedIngredients(initialIngredients.map(i => i.name));
      }
    }, [initialIngredients]);

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
        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, paddingHorizontal: 16 }}>
          {mockData.recipes[0].ingredients.map((item, index) => (
            <TouchableOpacity
            onPress={() => navigation.navigate('SearchByIngredientScreen')} >
            <View key={index} style={{ alignItems: 'center', marginRight: 16 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#ffe3e6', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: item.image }} style={{ width: 64, height: 64, borderRadius: 32 }} />
              </View>
              <Text style={{ marginTop: 6, fontSize: 13, color: '#333', fontWeight: '600' }}>{item.name}</Text>
            </View>
            </TouchableOpacity>
          ))}
        </ScrollView> */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, paddingHorizontal: 16 }}>
            {mockData.recipes[0].ingredients.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate('SearchByIngredientScreen', {
                  ingredients: [{ name: item.name, image: item.image }]
                })}
              >
                <View style={{ alignItems: 'center', marginRight: 16 }}>
                  <View style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: '#ffe3e6',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Image source={{ uri: item.image }} style={{ width: 64, height: 64, borderRadius: 32 }} />
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
        {mockData.recipes.slice(0, 3).map((recipe) => (
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
                source={{ uri: recipe.image }}
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


        {/* Meals by time */}
        <View style={{ marginTop: 24, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#444' }}>Tìm theo bữa</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ListDishesScreen')}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#d11c1c' }}>
                Xem thêm
            </Text>
        </TouchableOpacity>
        </View>
        <View style={{ marginTop: 16, paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {['Bữa sáng', 'Bữa phụ', 'Bữa trưa', 'Ăn vặt', 'Bữa tối', 'Tráng miệng', 'Bữa xế'].map((meal, index) => (
            <TouchableOpacity
              key={meal}
              onPress={() => navigation.navigate('ListDishesScreen')}
              style={{
                width: '48%',
                backgroundColor: index % 2 === 0 ? '#fce5e6' : '#fff0f1',
                borderRadius: 16,
                paddingVertical: 30,
                marginBottom: 16,
                alignItems: 'center',
                
              }}
            >

              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>{meal}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
};

export default SearchScreen;
