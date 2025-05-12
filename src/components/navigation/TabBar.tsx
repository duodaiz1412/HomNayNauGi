import React, { useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Path } from 'react-native-svg';

import HomeIcon from '../icons/HomeIcon';
import RecipeIcon from '../icons/RecipeIcon';
import FavoriteIcon from '../icons/FavoriteIcon';
import ProfileIcon from '../icons/ProfileIcon';

const { width } = Dimensions.get('window');

// --- Màu sắc và kích thước ---
const ACTIVE_COLOR = '#941C22';
const INACTIVE_COLOR = '#6B7280';
const CAMERA_ICON_COLOR = '#4B5563';
const ACTIVE_ICON_COLOR = '#FFFFFF';
const ICON_SIZE_ACTIVE = 26;
const ICON_SIZE_INACTIVE = 22;
const ICON_SIZE_CAMERA = 26;
const TAB_BAR_HEIGHT = 20;
const ACTIVE_CIRCLE_SIZE = 44;
const ACTIVE_CIRCLE_TOP_OFFSET = -(ACTIVE_CIRCLE_SIZE / 2) + 5;
const NUMBER_OF_TABS = 4;
const TOTAL_ITEMS = NUMBER_OF_TABS + 1;
const CAMERA_BUTTON_INDEX = 2;
const TAB_BAR_FLOAT_BOTTOM = 10;
const TABBAR_HEIGHT = 60;

const TabBar = ({ state, descriptors, navigation }) => {
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  // Tạo Animated.Value cho từng tab
  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;

  const totalTabBarHeight =
    TAB_BAR_HEIGHT + safeAreaBottom + TAB_BAR_FLOAT_BOTTOM;

  const renderNavIconComponent = (routeName, color, size) => {
    switch (routeName) {
      case 'Home':
        return <HomeIcon color={color} size={size} />;
      case 'Recipe':
        return <RecipeIcon color={color} size={size} />;
      case 'Favorite':
        return <FavoriteIcon color={color} size={size} />;
      case 'Profile':
        return <ProfileIcon color={color} size={size} />;
      default:
        return null;
    }
  };

  const handleCameraButtonPress = () => {
    Alert.alert('Nút Thực phẩm', 'Mở danh mục thực phẩm...');
  };

  // Hàm chạy animation floating
  const triggerFloatAnimation = (index) => {
    Animated.sequence([
      Animated.timing(animatedValues[index], {
        toValue: -10, // Di chuyển lên trên
        duration: 150,
        useNativeDriver: true,
      }),

      Animated.timing(animatedValues[index], {
        toValue: 0, // Trở về vị trí ban đầu
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const itemsToRender = [...state.routes];
  itemsToRender.splice(CAMERA_BUTTON_INDEX, 0, {
    key: 'camera-button',
    name: 'CameraButton',
  });

  // Tính chiều rộng của SVG path
  const svgWidth = width * 0.95;
  const curveHeight = 30; // Giảm nhẹ độ lõm
  const itemWidth = svgWidth / TOTAL_ITEMS;
  const curveWidth = itemWidth * 1.5; // Giảm độ rộng của vùng lõm
  const curveCenterPosition = CAMERA_BUTTON_INDEX * itemWidth + itemWidth / 2;
  const curveStartPosition = curveCenterPosition - curveWidth / 2;
  const curveEndPosition = curveCenterPosition + curveWidth / 2;

  // Path cho SVG (đường đi của đường viền tabbar có phần lõm)
  const createPath = () => {
    const tabBarWidth = svgWidth;

    return `
      M 0,0
      H ${curveStartPosition}
      Q ${curveStartPosition + 20},0 ${curveStartPosition + 30},${curveHeight / 2}
      T ${curveCenterPosition},${curveHeight}
      T ${curveEndPosition - 30},${curveHeight / 2}
      Q ${curveEndPosition - 20},0 ${curveEndPosition},0
      H ${tabBarWidth}
      V ${TABBAR_HEIGHT}
      H 0
      Z
    `;
  };

  return (
    <>
      {/* Placeholder để tạo khoảng trống cho nội dung */}
      <View style={{ height: totalTabBarHeight }} />

      <View
        className="absolute left-0 right-0 items-center"
        style={{ bottom: safeAreaBottom + TAB_BAR_FLOAT_BOTTOM }}
      >
        <View
          className="w-[95%] h-[60px] self-center"
          style={{
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Svg
            width="100%"
            height={TABBAR_HEIGHT}
            style={{ position: 'absolute' }}
          >
            <Path d={createPath()} fill="white" />
          </Svg>

          {/* Container cho tất cả items */}
          <View className="flex-row h-[60px] w-full">
            {itemsToRender.map((item, index) => {
              if (item.name === 'CameraButton') {
                return (
                  <Pressable
                    key={item.key}
                    className="flex-1 items-center justify-center"
                    onPress={handleCameraButtonPress}
                  >
                    <View className="w-14 h-14 -mt-8 rounded-full bg-[#941C22] items-center justify-center shadow-lg shadow-black/30">
                      <Ionicons
                        name="fast-food-outline"
                        size={ICON_SIZE_CAMERA}
                        color="white"
                      />
                    </View>
                    <Text className="mt-1 text-[10px] text-[#941C22] font-medium">
                      Thực phẩm
                    </Text>
                  </Pressable>
                );
              }

              const route = item;
              const { options } = descriptors[route.key];
              const label = options.tabBarLabel ?? options.title ?? route.name;
              const actualRouteIndex = state.routes.findIndex(
                (r) => r.key === route.key
              );
              const isFocused = state.index === actualRouteIndex;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate({
                    name: route.name,
                    merge: true,
                    params: route.params,
                  });
                  triggerFloatAnimation(actualRouteIndex); // Kích hoạt animation khi nhấn
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
                  className="flex-1 items-center justify-center"
                >
                  <View className="h-[30px] items-center justify-center">
                    {renderNavIconComponent(
                      route.name,
                      isFocused ? ACTIVE_COLOR : INACTIVE_COLOR,
                      isFocused ? ICON_SIZE_ACTIVE : ICON_SIZE_INACTIVE
                    )}
                  </View>
                  <Text
                    className={`mt-1 text-[11px] ${
                      isFocused
                        ? 'text-red-700 font-semibold'
                        : 'text-gray-500 font-medium'
                    } text-center`}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </>
  );
};

export default TabBar;
