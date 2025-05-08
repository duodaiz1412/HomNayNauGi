import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FilterScreen = () => {
  const [selected, setSelected] = useState<{ [key: string]: string }>({});

  const toggleOption = (category: string, option: string) => {
    setSelected((prev) => ({
      ...prev,
      [category]: prev[category] === option ? '' : option,
    }));
  };

  const renderGroup = (title: string, category: string, options: string[]) => (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.optionContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => toggleOption(category, option)}
            style={[
              styles.option,
              selected[category] === option && styles.optionSelected,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selected[category] === option && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bộ lọc</Text>
        <TouchableOpacity>
          <Text style={styles.clearAll}>XÓA TẤT CẢ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {renderGroup('Thời gian', 'time', ['Dưới 15 phút', 'Dưới 30 phút', 'Dưới 60 phút'])}
        {renderGroup('Chi phí nguyên liệu', 'cost', ['Dưới 50.000₫', 'Dưới 100.000₫', 'Dưới 200.000₫', 'Dưới 300.000₫'])}
        {renderGroup('Bữa trong ngày', 'meal', ['Bữa sáng', 'Bữa phụ', 'Bữa trưa', 'Bữa xế', 'Ăn vặt', 'Bữa tối', 'Tráng miệng'])}
        {renderGroup('Loại món ăn', 'type', ['Bánh mì', 'Đồ xào', 'Rau củ quả', 'Đồ chiên', 'Bún, miến, phở', 'Cơm rang', 'Salad'])}
        {renderGroup('Khẩu phần Calories', 'calories', ['Dưới 200 Cal', '200 - 400 Cal', '400 - 800 Cal'])}
      </ScrollView>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Xem kết quả</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
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
    marginRight: 8,
    marginBottom: 8,
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
    backgroundColor: '#f97316',
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
