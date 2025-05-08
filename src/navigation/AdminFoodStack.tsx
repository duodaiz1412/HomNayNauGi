
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminFoodManagementScreen } from '@screens/Admin/FoodManagementScreen';
import { AddFoodScreen } from '@screens/Admin/Food/AddFoodScreen';
import { EditFoodScreen } from '@screens/Admin/Food/EditFoodScreen';
import { FoodDetailScreen } from '@screens/Admin/Food/FoodDetailScreen';

export type AdminFoodStackParamList = {
    AdminFoodManagementScreen: undefined; 
    AddFoodScreen: undefined;
    EditFoodScreen: { foodId: string };
    FoodDetailScreen: { foodId: string };
  };
const Stack = createNativeStackNavigator<AdminFoodStackParamList>();

export const AdminFoodStack = () => {
  return (
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
    </Stack.Navigator>
  );
};
