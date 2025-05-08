import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminIngredientManagementScreen } from '@screens/Admin/IngredientManagementScreen';
import { AddIngredientScreen } from '@screens/Admin/Ingredient/AddIngredientScreen';
import { EditIngredientScreen } from '@screens/Admin/Ingredient/EditIngredientScreen';

export type AdminIngredientStackParamList = {
  AdminIngredientManagementScreen: undefined;
  AddIngredientScreen: undefined;
  EditIngredientScreen: { ingredientId: string };
};
const Stack = createNativeStackNavigator<AdminIngredientStackParamList>();

export const AdminIngredientStack = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{ headerShown: false }}
      initialRouteName="AdminIngredientManagementScreen"
    >
      <Stack.Screen
        name="AdminIngredientManagementScreen"
        component={AdminIngredientManagementScreen}
      />

      <Stack.Screen
        name="AddIngredientScreen"
        component={AddIngredientScreen}
      />
      <Stack.Screen
        name="EditIngredientScreen"
        component={EditIngredientScreen}
      />
    </Stack.Navigator>
  );
};
