import { View, Text, Image, TouchableOpacity, Alert,StatusBar } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

import { logout } from '../../api/api';

export const CustomDrawer = (props) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

const handleLogout = () => {
  Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
    {
      text: 'Hủy',
      style: 'cancel',
    },
    {
      text: 'Đăng xuất',
      onPress: async () => {
        try {
          await logout();
          console.log("Đăng xuất thành công");
          // Chuyển về màn hình login
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } catch (error) {
          console.error('Lỗi đăng xuất:', error);
          Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
        }
      },
      style: 'destructive',
    },
  ]);
};

  return (
    <SafeAreaView className="flex-1">
        <StatusBar barStyle="light-content" backgroundColor="#941D23" />
      {/* Header */}
      <View className="bg-[#941D23] pt-12 pb-5 px-5 mb-2.5">
        <View className="flex-row items-center">
          <Image
            source={{
              uri: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png',
            }}
            className="w-[60px] h-[60px] rounded-full border-2 border-white"
          />
          <View className="ml-4">
            <Text className="text-white text-lg font-bold">Quốc Anh</Text>
            <Text className="text-white/80 text-sm mt-0.5">Quản trị viên</Text>
          </View>
        </View>
      </View>

      {/* Drawer Content */}
      <DrawerContentScrollView {...props}>
        <View className="flex-1 pt-2.5">
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      <View className="p-5 border-t border-gray-100">
        <TouchableOpacity
          className="flex-row items-center ml-5 py-2.5 mb-16"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#941D23" />
          <Text className="text-[#941D23] text-[15px] ml-2 font-medium">
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
