import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import './global.css';
import { FoodManagementProvider } from './src/context/FoodManagementContext';

export default function App() {
  return (
    <FoodManagementProvider>
      <AppNavigator />
    </FoodManagementProvider>
  );
}
