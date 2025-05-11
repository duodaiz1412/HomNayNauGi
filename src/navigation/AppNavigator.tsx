import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import LoginScreen from '../screens/Login/LoginScreen';
import { RegisterScreen } from '../screens/Login/RegisterScreen';
import AboutScreen from '../screens/About/AboutScreen';
import RecipeDetailScreen from '../screens/Recipe/RecipeDetailScreen';
import CookingGuide from '../screens/Home/CookingGuide';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import AddIngredientScreen from '@screens/Recipe/AddIngredient';
import AddDishScreen from '../screens/AddDish';
import SearchByIngredientScreen from '../screens/Search/SearchByIngredientScreen';
import IngredientsScreen from '../screens/Search/IngredientsScreen';
import SearchByRecipeScreen from '../screens/Search/SearchByRecipeScreen';
import ListDishesScreen from '../screens/Search/ListDishesScreen';
import FilterScreen from '../screens/Search/FilterScreen';

interface Ingredient {
  name: string;
  image: string;
}
import ProfileScreen from '../screens/Profile/ProfileScreen';
import FavoritesScreen from '../screens/Profile/FavoritesScreen';
import NotificationsScreen from '../screens/Profile/NotificationsScreen';
import AchievementsScreen from '../screens/Profile/AchievementsScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import PrivacyPolicyScreen from '../screens/Profile/PrivacyPolicyScreen';
import SupportScreen from '../screens/Profile/SupportScreen';
import AboutUsScreen from '../screens/Profile/AboutUsScreen';
import { supabase } from '../utils/supabase';
import { AdminDrawerNavigator } from './AdminDrawerNavigator';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  HomeScreen: undefined;
  About: undefined;
  RecipeDetail: { recipeId: number };
  CookingGuide: { recipeId: number };
  EditProfileScreen: undefined;
  AddIngredient: { isMultiSelect: boolean };
  AddDish: undefined;
  SearchByIngredientScreen: {
    ingredients?: {
      id: string;
      name: string;
      image: string;
    }[];
  };
  IngredientsScreen: { ingredients: Ingredient[] };
  SearchByRecipeScreen: undefined;
  ListDishesScreen: undefined;
  FilterScreen: undefined;
  Profile: undefined;
  FavoritesScreen: undefined;
  HistoryScreen: undefined;
  NotificationsScreen: undefined;
  AchievementsScreen: undefined;
  SettingsScreen: undefined;
  PrivacyPolicyScreen: undefined;
  SupportScreen: undefined;
  AboutUsScreen: undefined;
  AddDishScreen: undefined;
  AdminDrawerNavigator: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) {
    return null;
  }

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
        <Stack.Screen name="AddIngredient" component={AddIngredientScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
        <Stack.Screen
          name="NotificationsScreen"
          component={NotificationsScreen}
        />
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
