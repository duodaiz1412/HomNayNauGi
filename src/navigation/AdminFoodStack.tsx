import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminFoodManagementScreen } from '@screens/Admin/FoodManagementScreen';
import { AddFoodScreen } from '@screens/Admin/Food/AddFoodScreen';
import { EditFoodScreen } from '@screens/Admin/Food/EditFoodScreen';
import { FoodDetailScreen } from '@screens/Admin/Food/FoodDetailScreen';
import { CategorySelectAdminScreen } from '@screens/Admin/Food/CategorySelectAdminScreen';
import { IngredientSelectAdminScreen } from '@screens/Admin/Food/IngredientSelectAdminScreen';
import { FoodManagementProvider } from 'src/context/FoodManagementContext';
import { IngredientCategorySelectAdminScreen } from '@screens/Admin/Food/IngredientCategorySelectAdminScreen';

export type AdminFoodStackParamList = {
  AdminFoodManagementScreen: undefined;
  AddFoodScreen: { selectedCategories?: any[]; selectedIngredients?: any[] };
  EditFoodScreen: { foodId: string };
  FoodDetailScreen: { foodId: string };
  CategorySelectScreen: { initialSelectedCategories?: any[] }
  IngredientSelectScreen: { selectedCategories?: any[] }
  IngredientCategorySelectScreen: { selectedCategories?: any[] }
};
const Stack = createNativeStackNavigator<AdminFoodStackParamList>();

export const AdminFoodStack = () => {
  return (
    // <FoodManagementProvider>
      <Stack.Navigator
        id={undefined}
        screenOptions={{ headerShown: false }}
        initialRouteName="AdminFoodManagementScreen"
      >
        <Stack.Screen
          name="AdminFoodManagementScreen"
          component={AdminFoodManagementScreen}
        />
        <Stack.Screen name="AddFoodScreen" component={AddFoodScreen} />
        <Stack.Screen name="EditFoodScreen" component={EditFoodScreen} />
        <Stack.Screen name="FoodDetailScreen" component={FoodDetailScreen} />
        <Stack.Screen
          name="CategorySelectScreen"
          component={CategorySelectAdminScreen}
        />
        <Stack.Screen
          name="IngredientSelectScreen"
          component={IngredientSelectAdminScreen}
        />
        <Stack.Screen name="IngredientCategorySelectScreen" component={IngredientCategorySelectAdminScreen} />
      </Stack.Navigator>
    // </FoodManagementProvider> 
  );
};
