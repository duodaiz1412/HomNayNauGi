import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EditFoodScreen } from '@screens/Admin/Food/EditFoodScreen';
import { AddUserScreen } from '@screens/Admin/User/AddUserScreen';
import { EditUserScreen } from '@screens/Admin/User/EditUserScreen';
import { UserDetailScreen } from '@screens/Admin/User/UserDetailScreen';
import { UserManagementScreen } from '@screens/Admin/UserManagementScreen';


export type AdminUserStackParamList = {
  AdminUserManagementScreen: undefined;
  AddUserScreen : undefined;
  EditUserScreen: { userId: string };
  UserDetailScreen: { userId: string };
}
const Stack = createNativeStackNavigator<AdminUserStackParamList>();

export const AdminUserStack = () => {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{ headerShown: false }}
      initialRouteName="AdminUserManagementScreen"
    >
      <Stack.Screen
        name="AdminUserManagementScreen"
        component={UserManagementScreen}
      />
      <Stack.Screen
        name="AddUserScreen"
        component={AddUserScreen}
      />
      <Stack.Screen
        name="EditUserScreen"
        component={EditUserScreen}
      />
      <Stack.Screen
        name="UserDetailScreen"
        component={UserDetailScreen}
      />            
    </Stack.Navigator>
  );
};
