import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import RecipeDetail from '../../components/RecipeDetail/RecipeDetail';
import { mockData } from '../../MockData/Data';

type RecipeDetailScreenRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

export default function RecipeDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RecipeDetailScreenRouteProp>();
  const { recipeId } = route.params;
  
  const recipe = mockData.recipes.find((r) => Number(r.id) === recipeId);

  if (!recipe) {
    return null;
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFavorite = (id: string | number) => {
    // Xử lý logic yêu thích ở đây
    console.log('Favorite recipe:', id);
  };

  const handleStartCooking = (id: string | number) => {
    navigation.navigate('CookingGuide', { recipeId: Number(id) });
  };

  return (
    <RecipeDetail
      recipe={recipe}
      onBack={handleBack}
      onFavorite={handleFavorite}
      onStartCooking={handleStartCooking}
    />
  );
} 