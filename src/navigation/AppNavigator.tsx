import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AboutScreen from '../screens/About/AboutScreen';
import {LoginScreen} from '../screens/Login/LoginScreen';
import { RegisterScreen } from '../screens/Login/RegisterScreen';
export type RootStackParamList = {
  About: undefined;
  Login:undefined;
  Register:undefined;
  // Thêm các màn hình khác ở đây
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="Login"
        // screenOptions={{
        //   headerStyle: {
        //     backgroundColor: '#FF6B6B',
        //   },
        //   headerTintColor: '#fff',
        //   headerTitleStyle: {
        //     fontWeight: 'bold',
        //   },
        // }}
      >
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
          name="About" 
          component={AboutScreen}
          options={{
            title: 'Giới thiệu',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 