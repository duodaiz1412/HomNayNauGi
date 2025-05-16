import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

const FilterScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selected, setSelected] = useState({});

  const toggle = (category, option) => {
    setSelected((prev) => {
      const prevOptions = prev[category] || [];
      const exists = prevOptions.includes(option);
      return {
        ...prev,
        [category]: exists
          ? prevOptions.filter((item) => item !== option)
          : [...prevOptions, option],
      };
    });
  };

  const renderGroup = (title, category, options) => (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.optionContainer}>
        {options.map((opt) => {
          const isSelected = selected[category]?.includes(opt);
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => toggle(category, opt)}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // const handleApply = () => {
  //   navigation.navigate('RecipeListScreen', {
  //     selectedFilters: selected,
  //   });
  // };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bộ lọc</Text>
        <TouchableOpacity onPress={() => setSelected({})}>
          <Text style={styles.clearAll}>XÓA TẤT CẢ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {renderGroup('Chi phí nguyên liệu', 'cost', [
          'Dưới 50.000₫',
          'Dưới 100.000₫',
          'Dưới 200.000₫',
          'Dưới 300.000₫',
        ])}
        {renderGroup('Bữa trong ngày', 'meal', [
          'Bữa sáng',
          'Bữa phụ',
          'Bữa trưa',
          'Bữa xế',
          'Ăn vặt',
          'Bữa tối',
          'Tráng miệng',
        ])}
        {renderGroup('Loại món ăn', 'type', [
          'Bánh mì',
          'Đồ xào',
          'Rau củ quả',
          'Đồ chiên',
          'Bún, miến, phở',
          'Cơm rang',
          'Salad',
        ])}
        {renderGroup('Khẩu phần Calories', 'calories', [
          'Dưới 200 Cal',
          '200 - 400 Cal',
          '400 - 800 Cal',
        ])}
        {renderGroup('Chế độ ăn', '', [
          'Ăn kiêng',
          'Ăn chay',
          'Ít đường',
          'Ít đạm',
          'Keto',
        ])}
        {renderGroup('Dị ứng', '', [
          'Hải sản',
          'Tôm',
          'Đồ tanh',
          'Cá',
          'Sữa tươi',
          'Trứng',
        ])}
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ListDishesScreen')}
      >
        <Text style={styles.buttonText}>Xem kết quả</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingRight: 20,
    paddingLeft: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  clearAll: {
    fontSize: 14,
    color: '#f43f5e',
  },
  group: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  optionSelected: {
    backgroundColor: '#be123c',
  },
  optionText: {
    color: '#444',
  },
  optionTextSelected: {
    color: '#fff',
  },
  button: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f43f5e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FilterScreen;
