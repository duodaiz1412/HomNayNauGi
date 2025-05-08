import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { mockData } from '../../MockData/Data';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RecipeListScreen = () => {
  const recipes = mockData.recipes;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#ccc" />
        <TextInput
          placeholder="Bữa sáng"
          style={styles.searchInput}
        />
      </View>

      {/* Filter Tags */}
      <View style={styles.tagsContainer}>
        <TouchableOpacity style={styles.tagRed}>
          <Text style={styles.tagTextWhite}>Bộ lọc • 4</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tagRed}>
          <Text style={styles.tagTextWhite}>Ăn kiêng • 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tagWhite}>
          <Text style={styles.tagTextRed}>Nguyên liệu</Text>
        </TouchableOpacity>
      </View>

      {/* Recipe Grid */}
      <FlatList
        data={recipes}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.author}>{item.author}</Text>
                <View style={styles.time}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fdfaf7',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tagRed: {
    backgroundColor: '#941D23',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagWhite: {
    backgroundColor: '#fff',
    borderColor: '#941D23',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagTextWhite: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tagTextRed: {
    color: '#941D23',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    width: '48%',
  },
  image: {
    width: '100%',
    height: 110,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    color: '#666',
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default RecipeListScreen;
