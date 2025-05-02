import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import HomeIcon from '../icons/HomeIcon';
import RecipeIcon from '../icons/RecipeIcon';
import FavoriteIcon from '../icons/FavoriteIcon';
import ProfileIcon from '../icons/ProfileIcon';

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View className="flex-row h-16 bg-white border-t border-gray-200">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const color = isFocused ? '#B91C1C' : '#9CA3AF';

        const renderIcon = () => {
          switch (route.name) {
            case 'Home':
              return <HomeIcon color={color} />;
            case 'Recipe':
              return <RecipeIcon color={color} />;
            case 'Favorite':
              return <FavoriteIcon color={color} />;
            case 'Profile':
              return <ProfileIcon color={color} />;
            default:
              return null;
          }
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            className="flex-1 items-center justify-center"
          >
            {renderIcon()}
            <Text
              className={`text-xs mt-1 ${
                isFocused ? 'text-red-700 font-medium' : 'text-gray-500'
              }`}
            >
              {label as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
