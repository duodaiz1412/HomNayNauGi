// components/DrawerHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { AdminDrawerParamList } from '@navigation/AdminDrawerNavigator'; // Adjust the import path as needed
type AdminrHeaderProps = {
    title: string;
  };
export const AdminHeader: React.FC<AdminrHeaderProps> = ({ title }) => {
  const navigation = useNavigation<DrawerNavigationProp<AdminDrawerParamList>>();

  return (
    
      <View className="px-4 py-4 bg-[#941D23]">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.openDrawer()} className="mr-3">
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
            <View>
              <Text className="text-white text-lg font-bold">{title}</Text>
            </View>
          </View>
          <View className="flex-row">
            <TouchableOpacity className="bg-white/20 rounded-full p-2 mr-3">
              <Ionicons name="notifications-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
  
  );
};
