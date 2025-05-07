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

export default function MyIngredient({
  ingredients,
  onDeleteIngredient,
  onIngredientPress,
  onDeleteAll,
}) {
  return (
    <View className="flex flex-col gap-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-3xl text-[#454442] font-medium">Kho của tôi</Text>
        <TouchableOpacity onPress={onDeleteAll}>
          <Text className="text-red-800 underline">Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      {ingredients.map((group, index) => (
        <View key={index} className="p-3">
          <Text className="font-medium mb-2">
            {group.title} · {group.data.length}
          </Text>
          <FlatList
            data={group.data}
            renderItem={({ item }) => (
              <View
                style={{ width: cardWidth, paddingRight: 8, marginBottom: 8 }}
              >
                <IngredientCard
                  name={item.name}
                  imageUrl={item.imageUrl}
                  backgroundColor={item.backgroundColor}
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
