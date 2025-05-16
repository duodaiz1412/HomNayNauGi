import IngredientCard from '@components/IngredientCard';
import {
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Dimensions,
} from 'react-native';

const numColumns = 4;
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 40) / numColumns; // 40 = padding (8px) * 5 gaps

interface Ingredient {
  id: string;
  name: string;
  image_url: string;
}

interface IngredientGroup {
  name: string;
  ingredients: Ingredient[];
}

interface MyIngredientProps {
  ingredients: IngredientGroup[];
  onDeleteIngredient: (id: string) => void;
  onIngredientPress: (id: string) => void;
  onDeleteAll: () => void;
}

export default function MyIngredient({
  ingredients,
  onDeleteIngredient,
  onIngredientPress,
  onDeleteAll,
}: MyIngredientProps) {
  return (
    <View className="flex flex-col gap-3">
      <View className="flex-row justify-between items-center px-2">
        <Text className="text-3xl text-[#454442] font-medium">Kho của tôi</Text>
        <TouchableOpacity onPress={onDeleteAll}>
          <Text className="text-red-800 underline italic">Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      {ingredients.map((group, index) => (
        <View key={index} className="p-3">
          <Text className="font-medium mb-2">
            {group.name} · {group.ingredients.length}
          </Text>
          <FlatList
            data={group.ingredients}
            renderItem={({ item }) => (
              <View
                style={{ width: cardWidth, paddingRight: 8, marginBottom: 8 }}
              >
                <IngredientCard
                  name={item.name}
                  imageUrl={item.image_url}
                  backgroundColor="#f3f4f6"
                  onDelete={() => onDeleteIngredient(item.id)}
                  onPress={() => onIngredientPress(item.id)}
                  cardWidth={cardWidth - 8} // Subtract padding
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            horizontal={false}
            scrollEnabled={false}
            contentContainerStyle={{ paddingLeft: 0 }}
          />
        </View>
      ))}
    </View>
  );
}
