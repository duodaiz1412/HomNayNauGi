import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import LoginScreen from '../screens/Login/LoginScreen';
import { RegisterScreen } from '../screens/Login/RegisterScreen';
import AboutScreen from '../screens/About/AboutScreen';
import RecipeDetailScreen from '../screens/Recipe/RecipeDetailScreen';
import { CookingGuide } from '../screens/Recipe/CookingGuide';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import AddIngredientScreen from '@screens/Recipe/AddIngredient';
import AddDishScreen from '../screens/AddDish/AddDishScreen';
import EditDishScreen from '../screens/AddDish/EditDishScreen';
import SearchByIngredientScreen from '../screens/Search/SearchByIngredientScreen';
import IngredientsScreen from '../screens/Search/IngredientsScreen';
import SearchByRecipeScreen from '../screens/Search/SearchByRecipeScreen';
import ListDishesScreen from '../screens/Search/ListDishesScreen';
import FilterScreen from '../screens/Search/FilterScreen';
import PersonalScreen from '../screens/Profile/PersonalScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import FavoritesScreen from '../screens/Profile/FavoritesScreen';
import HistoryScreen from '../screens/Profile/HistoryScreen';
import AchievementsScreen from '../screens/Profile/AchievementsScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import PrivacyPolicyScreen from '../screens/Profile/PrivacyPolicyScreen';
import SupportScreen from '../screens/Profile/SupportScreen';
import AboutUsScreen from '../screens/Profile/AboutUsScreen';
import { AdminDrawerNavigator } from './AdminDrawerNavigator';
import ScanIngredientScreen from '../screens/ScanIngredient/ScanIngredientScreen';

import { CategorySelectScreen } from '@screens/AddDish/CategorySelectScreen';
import { IngredientSelectScreen } from '@screens/AddDish/IngredientSelectScreen';
import { IngredientCategorySelectScreen } from '@screens/AddDish/IngredientCategorySelect';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Ingredient {
  id: string;
  name: string;
  imageUrl?: string;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  HomeScreen: undefined;
  About: undefined;
  RecipeDetail: { recipeId: string, isSuggested?: boolean };
  CookingGuide: { recipeId: string, isSuggested?: boolean };
  EditProfileScreen: undefined;
  AddIngredient: { isMultiSelect?: boolean, onAddSuccess?: () => void };
  AddDish: undefined;
  EditDishScreen: { recipeId: string };
  SearchByIngredientScreen: {
    ingredients?: {
      id: string;
      name: string;
      image: string;
    }[];
  };
  IngredientsScreen: { ingredients: Ingredient[] };
  SearchByRecipeScreen: undefined;
  ListDishesScreen: { mealId: number };
  FilterScreen: undefined;
  ProfileScreen: undefined;
  FavoritesScreen: undefined;
  HistoryScreen: undefined;
  AchievementsScreen: undefined;
  SettingsScreen: undefined;
  PrivacyPolicyScreen: undefined;
  SupportScreen: undefined;
  AboutUsScreen: undefined;
  AddDishScreen: undefined;
  CategorySelectScreen: undefined;
  IngredientSelectScreen: undefined;
  IngredientCategorySelectScreen: undefined;
  AdminDrawerNavigator: undefined;
  PersonalScreen: undefined;
  ScanIngredient: { imageUri: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  // useEffect(() => {
  //   checkFirstLaunch();
  // }, []);

  // const checkFirstLaunch = async () => {
  //   try {
  //     // Kiểm tra xem app đã được khởi chạy trước đó chưa
  //     const hasLaunched = await AsyncStorage.getItem('hasLaunched');

  //     if (hasLaunched === null) {
  //       // Lần đầu khởi chạy app, xóa tất cả dữ liệu
  //       console.log('First launch - clearing AsyncStorage');
  //       await AsyncStorage.clear();

  //       // Đánh dấu app đã được khởi chạy
  //       await AsyncStorage.setItem('hasLaunched', 'true');
  //     } else {
  //       console.log('App has been launched before');
  //     }
  //   } catch (error) {
  //     console.error('Error checking first launch:', error);
  //   }
  // };

  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
        initialRouteName="MainTabs"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
        <Stack.Screen name="CookingGuide" component={CookingGuide} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="PersonalScreen" component={PersonalScreen} />
        <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
        <Stack.Screen
          name="AchievementsScreen"
          component={AchievementsScreen}
        />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
        />
        <Stack.Screen name="AddDishScreen" component={AddDishScreen} />
        <Stack.Screen name="EditDishScreen" component={EditDishScreen} />
        <Stack.Screen
          name="CategorySelectScreen"
          component={CategorySelectScreen}
        />
        <Stack.Screen
          name="IngredientSelectScreen"
          component={IngredientSelectScreen}
        />
        <Stack.Screen
          name="IngredientCategorySelectScreen"
          component={IngredientCategorySelectScreen}
        />
        <Stack.Screen
          name="SearchByIngredientScreen"
          component={SearchByIngredientScreen}
        />
        <Stack.Screen name="SupportScreen" component={SupportScreen} />
        <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
        <Stack.Screen name="IngredientsScreen" component={IngredientsScreen} />
        <Stack.Screen
          name="SearchByRecipeScreen"
          component={SearchByRecipeScreen}
        />
        <Stack.Screen name="ListDishesScreen" component={ListDishesScreen} />
        <Stack.Screen name="FilterScreen" component={FilterScreen} />
        <Stack.Screen
          name="AddIngredient"
          component={AddIngredientScreen}
          options={{
            title: 'Thêm nguyên liệu',
          }}
        />
        <Stack.Screen name="ScanIngredient" component={ScanIngredientScreen} />
        <Stack.Screen
          name="AdminDrawerNavigator"
          component={AdminDrawerNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
