import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddIngredientCategoryScreen } from '@screens/Admin/Category/AddIngredientCategoryScreen';
import { EditIngredientCategoryScreen } from '@screens/Admin/Category/EditIngredientCategoryScreen';
import { AdminIngredientCategoryManagementScreen } from '@screens/Admin/IngredientCategoryManagementScreen';

export type AdminIngredientCategoryStackParamList = {
  AdminIngredientCategoryManagementScreen: undefined;
  AddIngredientCategoryScreen: undefined;
  EditIngredientCategoryScreen: { ingredientCategoryId: string };
};
const Stack =
  createNativeStackNavigator<AdminIngredientCategoryStackParamList>();

export const AdminIngredientCategoryStack = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{ headerShown: false }}
      initialRouteName="AdminIngredientCategoryManagementScreen"
    >
      <Stack.Screen
        name="AdminIngredientCategoryManagementScreen"
        component={AdminIngredientCategoryManagementScreen}
      />

      <Stack.Screen
        name="AddIngredientCategoryScreen"
        component={AddIngredientCategoryScreen}
      />
      <Stack.Screen
        name="EditIngredientCategoryScreen"
        component={EditIngredientCategoryScreen}
      />
    </Stack.Navigator>
  );
};
