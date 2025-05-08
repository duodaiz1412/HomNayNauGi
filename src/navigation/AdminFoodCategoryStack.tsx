
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminFoodCategoryManagementScreen } from '@screens/Admin/FoodCategoryManagementScreen';
import { AddFoodCategoryScreen } from '@screens/Admin/Category/AddFoodCategoryScreen';
import { EditFoodCategoryScreen } from '@screens/Admin/Category/EditFoodCategoryScreen';


export type AdminFoodCategoryStackParamList = {
  AdminFoodCategoryManagementScreen: undefined; 
  AddFoodCategoryScreen:undefined;
  EditFoodCategoryScreen: {categoryId:string};
};
const Stack = createNativeStackNavigator<AdminFoodCategoryStackParamList>();

export const AdminFoodCategoryStack = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{ headerShown: false }}
      initialRouteName="AdminFoodCategoryManagementScreen"
    >
      <Stack.Screen
        name="AdminFoodCategoryManagementScreen"
        component={AdminFoodCategoryManagementScreen}
      />
      <Stack.Screen
        name="AddFoodCategoryScreen"
        component={AddFoodCategoryScreen}
      />
            <Stack.Screen
        name="EditFoodCategoryScreen"
        component={EditFoodCategoryScreen}
      />
    </Stack.Navigator>
  );
};
