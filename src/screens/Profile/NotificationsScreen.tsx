import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import api, { getUserProfile } from 'src/api/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'src/navigation/AppNavigator';

// Giao diện đầy đủ cho Recipe dựa trên JSON mẫu
interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface ViewHistoryItem {
  id: number;
  recipe: Recipe;
  viewedAt: string;
}

type NotificationsNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'NotificationsScreen'
>;

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<NotificationsNavProp>();
  const [viewHistory, setViewHistory] = useState<ViewHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);

  // Lấy thông tin user để có accountId
  useEffect(() => {
    getUserProfile()
      .then((res) => {
        if (res.data && res.data.id) {
          setAccountId(res.data.id);
        } else {
          setError('Không lấy được thông tin tài khoản.');
        }
      })
      .catch(() => setError('Lỗi khi tải hồ sơ người dùng'));
  }, []);

  // Fetch lịch sử sau khi có accountId
  useEffect(() => {
    if (!accountId) return;

    setLoading(true);
    setError(null);

    api
      .get(`/view-history/account/${accountId}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setViewHistory(response.data);
        } else {
          setViewHistory([]);
          setError('Định dạng dữ liệu không hợp lệ.');
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải lịch sử xem:', err);
        setError('Không thể tải lịch sử xem.');
      })
      .finally(() => setLoading(false));
  }, [accountId]);

  const handlePressItem = (recipeId: string) => {
    navigation.navigate('RecipeDetail', { recipeId });
  };

  if (loading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (viewHistory.length === 0) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.emptyText}>
          Bạn chưa xem công thức nào gần đây.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContentContainer}
      data={viewHistory}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => handlePressItem(item.recipe.id)}
        >
          <Image
            source={{
              uri: item.recipe.imageUrl || 'https://via.placeholder.com/80',
            }}
            style={styles.itemImage}
          />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>{item.recipe.name}</Text>
            <Text numberOfLines={2} style={styles.itemDescription}>
              {item.recipe.description}
            </Text>
            <Text style={styles.itemViewedAt}>
              Đã xem lúc: {new Date(item.viewedAt).toLocaleString('vi-VN')}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
  emptyText: { fontSize: 16, color: '#555' },
  listContentContainer: { paddingVertical: 16, paddingHorizontal: 12 },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 12,
  },
  itemImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  itemTextContainer: { flex: 1, justifyContent: 'center' },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  itemViewedAt: { fontSize: 12, color: '#777' },
});

export default NotificationsScreen;
