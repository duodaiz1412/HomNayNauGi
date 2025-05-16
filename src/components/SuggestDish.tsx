import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { RecipeSearchResult } from '../types/recipe';

interface SuggestDishProps {
  results: RecipeSearchResult[];
  onSelectRecipe: (recipe: RecipeSearchResult) => void;
  onClose: () => void;
}

export const SuggestDish: React.FC<SuggestDishProps> = ({
  results,
  onSelectRecipe,
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Công thức đề xuất</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.recipeList}>
        {results.map((result) => (
          <TouchableOpacity
            key={result.recipe.id}
            style={styles.recipeCard}
            onPress={() => onSelectRecipe(result)}
          >
            <Image
              source={{ uri: result.recipe.imageUrl }}
              style={styles.recipeImage}
            />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>{result.recipe.name}</Text>
              <Text style={styles.authorName}>
                {result.recipe.account?.userProfile?.fullName ||
                  result.recipe.account?.name ||
                  'Ẩn danh'}
              </Text>
              <Text style={styles.matchText}>
                Phù hợp: {Math.round(result.matchPercentage * 100)}%
              </Text>
              <Text style={styles.matchedIngredients}>
                {result.matchedIngredients.length} nguyên liệu khớp
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    padding: 8,
  },
  recipeList: {
    flex: 1,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  authorName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  matchText: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 2,
  },
  matchedIngredients: {
    fontSize: 12,
    color: '#666',
  },
});
