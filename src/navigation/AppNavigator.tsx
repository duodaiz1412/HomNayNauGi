import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import { LoginScreen } from '../screens/Login/LoginScreen';
import { RegisterScreen } from '../screens/Login/RegisterScreen';
import AboutScreen from '@screens/About/AboutScreen';

import RecipeDetail from '../screens/Home/RecipeDetail';
import CookingGuide from '../screens/Home/CookingGuide';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  About: undefined;
  RecipeDetail: { recipeId: number };
  CookingGuide: { recipeId: number };
  EditProfileScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} initialRouteName="MainTabs">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{
            title: 'Giới thiệu',
          }}
        />
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetail}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CookingGuide"
          component={CookingGuide}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
