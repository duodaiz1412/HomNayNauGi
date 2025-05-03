import React from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';


import HomeIcon from '../icons/HomeIcon';
import RecipeIcon from '../icons/RecipeIcon';
import FavoriteIcon from '../icons/FavoriteIcon';
import ProfileIcon from '../icons/ProfileIcon';

const { width } = Dimensions.get('window');

// --- Màu sắc và kích thước ---
const ACTIVE_COLOR = '#B91C1C';
const INACTIVE_COLOR = '#6B7280';
const CAMERA_ICON_COLOR = '#4B5563';
const ACTIVE_ICON_COLOR = '#FFFFFF';
const ICON_SIZE_ACTIVE = 26;
const ICON_SIZE_INACTIVE = 22;
const ICON_SIZE_CAMERA = 26;
const TAB_BAR_HEIGHT = 60;
const ACTIVE_CIRCLE_SIZE = 44;
const ACTIVE_CIRCLE_TOP_OFFSET = -(ACTIVE_CIRCLE_SIZE / 2) + 5;
const NUMBER_OF_TABS = 4;
const TOTAL_ITEMS = NUMBER_OF_TABS + 1;
const CAMERA_BUTTON_INDEX = 2;
const TAB_BAR_FLOAT_BOTTOM = 15;

const TabBar = ({ state, descriptors, navigation }) => {
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  const renderNavIconComponent = (routeName, color, size) => {
    switch (routeName) {
      case 'Home': return <HomeIcon color={color} size={size} />;
      case 'Recipe': return <RecipeIcon color={color} size={size} />;
      case 'Favorite': return <FavoriteIcon color={color} size={size} />;
      case 'Profile': return <ProfileIcon color={color} size={size} />;
      default: return null;
    }
  };

  const handleCameraButtonPress = () => {
    Alert.alert("Nút Camera", "Mở Camera/Gallery...");
  };

  const itemsToRender = [...state.routes];
  itemsToRender.splice(CAMERA_BUTTON_INDEX, 0, { key: 'camera-button', name: 'CameraButton' });

  return (
    <View
      className="absolute left-0 right-0 items-center"
      style={{ bottom: safeAreaBottom + TAB_BAR_FLOAT_BOTTOM }}
    >
      <View
        className="flex-row bg-white h-[60px] w-[95%] self-center rounded-2xl shadow-lg shadow-black/10"
      >
        {itemsToRender.map((item, index) => {
          if (item.name === 'CameraButton') {
            return (
              <Pressable
                key={item.key}
                className="flex-1 items-center justify-center"
                onPress={handleCameraButtonPress}
              >
                <View className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center">
                  <Ionicons
                    name="camera-outline"
                    size={ICON_SIZE_CAMERA}
                    color={CAMERA_ICON_COLOR}
                  />
                </View>
              </Pressable>
            );
          }

          const route = item;
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const actualRouteIndex = state.routes.findIndex(r => r.key === route.key);
          const isFocused = state.index === actualRouteIndex;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true, params: route.params });
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center pt-2 h-full"
            >
              <View className="h-[30px] items-center justify-center">
                {!isFocused && renderNavIconComponent(route.name, INACTIVE_COLOR, ICON_SIZE_INACTIVE)}
              </View>
              {!isFocused && (
                <Text className="mt-1 text-[11px] text-gray-500 font-medium text-center">
                  {label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        if (!isFocused) return null;

        const label = descriptors[route.key].options.tabBarLabel ?? descriptors[route.key].options.title ?? route.name;
        const itemWidth = width / TOTAL_ITEMS;
        const displayIndex = itemsToRender.findIndex(item => item.key === route.key);
        const circleLeftOffset = displayIndex * itemWidth + (itemWidth - ACTIVE_CIRCLE_SIZE) / 2;

        return (
          <View
            key={`active-elements-${route.key}`}
            className="absolute items-center w-[44px] z-10"
            style={{ left: circleLeftOffset, top: ACTIVE_CIRCLE_TOP_OFFSET }}
            pointerEvents="none"
          >
            <View className="w-11 h-11 rounded-full bg-red-700 items-center justify-center shadow-md shadow-black/20">
              {renderNavIconComponent(route.name, ACTIVE_ICON_COLOR, ICON_SIZE_ACTIVE)}
            </View>
            <Text className="mt-1 text-[11px] text-red-700 font-semibold text-center">
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default TabBar;