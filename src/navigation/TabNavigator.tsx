import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import RecipeScreen from '../screens/Recipe/RecipeScreen';
import FavoriteScreen from '../screens/Favorite/FavoriteScreen';
import PersonalScreen from '../screens/Profile/PersonalScreen';
import SearchScreen from '@screens/Search/SearchScreen';

import TabBar from '../components/navigation/TabBar';

// Định nghĩa TabParamList cho Tab Navigator
export type TabParamList = {
  Home: undefined;
  Recipe: undefined;
  Favorite: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      id={undefined}
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 0 },
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Trang chủ',
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={SearchScreen}
        options={{
          title: 'Món ngon',
        }}
      />
      <Tab.Screen
        name="Recipe"
        component={RecipeScreen}
        options={{
          title: 'Thực phẩm',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={PersonalScreen}
        options={{
          title: 'Tôi',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
