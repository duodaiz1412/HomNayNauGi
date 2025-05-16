import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-gesture-handler';
import { Unit, IngredientDTO, RecipeSearchResult } from '../types/recipe';
import { searchRecipesByIngredients } from '../api/recipeService';
import { SuggestDish } from '../components/SuggestDish';

interface ScannedIngredient {
  id: string;
  name: string;
  quantity?: number;
  unit?: Unit;
}

export const ScanIngredientScreen: React.FC = () => {
  const [ingredients, setIngredients] = useState<ScannedIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchResults, setSearchResults] = useState<RecipeSearchResult[]>([]);

  const handleQuantityChange = (id: string, quantity: string) => {
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === id
          ? { ...ing, quantity: parseFloat(quantity) || undefined }
          : ing
      )
    );
  };

  const handleUnitChange = (id: string, unit: Unit) => {
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, unit } : ing))
    );
  };

  const handleSearch = async () => {
    const validIngredients = ingredients.filter(
      (ing) => ing.quantity !== undefined && ing.unit !== undefined
    );

    if (validIngredients.length === 0) {
      // TODO: Show error message
      return;
    }

    const searchIngredients: IngredientDTO[] = validIngredients.map((ing) => ({
      id: ing.id,
    }));

    setLoading(true);
    try {
      const results = await searchRecipesByIngredients(searchIngredients);
      setSearchResults(results);
      setShowModal(true);
    } catch (error) {
      console.error('Error searching recipes:', error);
      // TODO: Show error message
    } finally {
      setLoading(false);
    }
  };

  const renderIngredient = ({ item }: { item: ScannedIngredient }) => (
    <View style={styles.ingredientItem}>
      <Text style={styles.ingredientName}>{item.name}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          placeholder="Số lượng"
          value={item.quantity?.toString()}
          onChangeText={(value) => handleQuantityChange(item.id, value)}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={item.unit}
            onValueChange={(value) => handleUnitChange(item.id, value as Unit)}
            style={styles.unitPicker}
          >
            <Picker.Item label="Chọn đơn vị" value={undefined} />
            {Object.values(Unit).map((unit) => (
              <Picker.Item key={unit} label={unit} value={unit} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={ingredients}
        renderItem={renderIngredient}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />

      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearch}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.searchButtonText}>Tìm công thức</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <SuggestDish
            results={searchResults}
            onSelectRecipe={(recipe) => {
              // TODO: Navigate to recipe detail
              setShowModal(false);
            }}
            onClose={() => setShowModal(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  list: {
    flex: 1,
  },
  ingredientItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: 'white',
  },
  pickerContainer: {
    flex: 2,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  unitPicker: {
    height: 40,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
});
