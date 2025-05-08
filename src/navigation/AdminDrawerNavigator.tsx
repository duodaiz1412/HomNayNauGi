import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dimensions,StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminDashboardScreen } from '@screens/Admin/DashboardScreen';
import { CustomDrawer } from '@components/navigation/CustomDrawer';
import { AdminFoodStack } from './AdminFoodStack';
import { AdminFoodCategoryStack } from './AdminFoodCategoryStack';
import { AdminIngredientCategoryStack } from './AdminIngredientCategoryStack';
import { AdminUserStack } from './AdminUserStack';
import { AdminPostManagementScreen } from '@screens/Admin/PostManagementScreen';
import { StatisticsScreen } from '@screens/Admin/StatisticsScreen';
import { AdminIngredientStack } from './AdminIngredientStack';

const screenWidth = Dimensions.get('window').width;
export type AdminDrawerParamList = {
  AdminDashboard: undefined;
  AdminFoodManagement: undefined;
  AdminIngredientManagement:undefined;
  AdminFoodCategoryManagement:undefined;
  AdminIngredientCategoryManagement:undefined;
  AdminUserManagement: undefined;
  AdminPostManagement:undefined;
  AdminStatistics:undefined;
};
const Drawer = createDrawerNavigator<AdminDrawerParamList>();
export const AdminDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      id={undefined}
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: screenWidth * 0.75,
          backgroundColor: '#fff',
        },
        drawerActiveTintColor: '#941D23',
        drawerInactiveTintColor: '#454442',
        drawerLabelStyle: {
          marginLeft: 5,
          fontWeight: '500',
          fontSize: 16,
        },
        drawerHideStatusBarOnOpen:true,
      }}
      
      initialRouteName="AdminDashboard"
    >
      <Drawer.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          title: 'Tổng quan',
          drawerIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AdminFoodManagement"
        component={AdminFoodStack}
        options={{
          title: 'Quản lý món ăn',
          drawerIcon: ({ color }) => (
            <Ionicons name="restaurant-outline" size={22} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen
        name="AdminIngredientManagement"
        component={AdminIngredientStack}
        options={{
          title: 'Quản lý Nguyên liệu',
          drawerIcon: ({ color }) => (
            <Ionicons name="leaf-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AdminFoodCategoryManagement"
        component={AdminFoodCategoryStack}
        options={{
          title: "Danh mục món ăn",
          drawerIcon: ({ color }) => <Ionicons name="list-outline" size={22} color={color} />,
        }}
      />      
      <Drawer.Screen
        name="AdminIngredientCategoryManagement"
        component={AdminIngredientCategoryStack}
        options={{
          title: "Danh mục nguyên liệu",
          drawerIcon: ({ color }) => <Ionicons name="list-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="AdminUserManagement"
        component={AdminUserStack}
        options={{
          title: "Quản lý người dùng",
          drawerIcon: ({ color }) => <Ionicons name="people-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="AdminPostManagement"
        component={AdminPostManagementScreen}
        options={{
          title: "Quản lý bài đăng",
          drawerIcon: ({ color }) => <Ionicons name="document-text-outline" size={22} color={color} />,
        }}
      />

      <Drawer.Screen
        name="AdminStatistics"
        component={StatisticsScreen}
        options={{
          title: "Thống kê",
          drawerIcon: ({ color }) => <Ionicons name="bar-chart-outline" size={22} color={color} />,
        }}
      />

    </Drawer.Navigator>
  );
};
