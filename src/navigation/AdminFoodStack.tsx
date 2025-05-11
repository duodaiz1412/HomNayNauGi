import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminFoodManagementScreen } from '@screens/Admin/FoodManagementScreen';
import { AddFoodScreen } from '@screens/Admin/Food/AddFoodScreen';
import { EditFoodScreen } from '@screens/Admin/Food/EditFoodScreen';
import { FoodDetailScreen } from '@screens/Admin/Food/FoodDetailScreen';
import { CategorySelectScreen } from '@screens/Admin/Food/CategorySelectScreen';
import { IngredientSelectScreen } from '@screens/Admin/Food/IngredientSelectScreen';
import { FoodManagementProvider } from 'src/context/FoodManagementContext';
import { IngredientCategorySelectScreen } from '@screens/Admin/Food/IngredientCategorySelect';

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
    <FoodManagementProvider>
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
          component={CategorySelectScreen}
        />
        <Stack.Screen
          name="IngredientSelectScreen"
          component={IngredientSelectScreen}
        />
        <Stack.Screen name="IngredientCategorySelectScreen" component={IngredientCategorySelectScreen} />
      </Stack.Navigator>
    </FoodManagementProvider>
  );
};
