import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ScanIngredientRouteProp = RouteProp<RootStackParamList, 'ScanIngredient'>;

interface DetectedIngredient {
  id: string;
  name: string;
  confidence: number;
  image?: string;
}

const ScanIngredientScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ScanIngredientRouteProp>();
  const { imageUri } = route.params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<DetectedIngredient[]>([]);
  
  // Giả lập phát hiện nguyên liệu
  useEffect(() => {
    // Trong thực tế, đây là nơi bạn sẽ gọi API để phân tích hình ảnh
    const simulateDetection = setTimeout(() => {
      setIsLoading(false);
      // Dữ liệu mẫu
      setDetectedIngredients([
        { id: '1', name: 'Cà chua', confidence: 0.95, image: 'https://cdn.tgdd.vn/Files/2017/03/22/963765/cach-chon-ca-chua-ngon-khong-co-hoa-chat-202203291006142475.jpg' },
        { id: '2', name: 'Hành tây', confidence: 0.88, image: 'https://product.hstatic.net/200000423303/product/hanh_tay_trang_tui_1kg_9c45d76c0a024b73a9d76af08f6dc1f9_grande.jpg' },
        { id: '3', name: 'Tỏi', confidence: 0.75, image: 'https://cdn.tgdd.vn/Files/2021/07/10/1366545/cong-dung-va-tac-hai-cua-toi-khi-dung-qua-lieu-luong-202107100019097212.jpg' },
      ]);
    }, 2000);
    
    return () => clearTimeout(simulateDetection);
  }, []);
  
  const handleContinue = () => {
    if (detectedIngredients.length > 0) {
      // Chuyển đến màn hình SearchByIngredient với các nguyên liệu đã phát hiện
      navigation.navigate('SearchByIngredientScreen', {
        ingredients: detectedIngredients.map(item => ({
          id: item.id,
          name: item.name,
          image: item.image || ''
        }))
      });
    } else {
      Alert.alert('Thông báo', 'Không tìm thấy nguyên liệu nào. Vui lòng thử lại.');
    }
  };
  
  const handleRescan = () => {
    navigation.goBack(); // Quay lại để mở camera và chụp ảnh mới
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#941D23" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kết quả quét</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.capturedImage} />
          ) : (
            <View style={styles.noImageContainer}>
              <Ionicons name="image-outline" size={60} color="#ccc" />
              <Text style={styles.noImageText}>Không có hình ảnh</Text>
            </View>
          )}
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#941D23" />
            <Text style={styles.loadingText}>Đang phân tích nguyên liệu...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#941D23" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRescan}>
              <Text style={styles.retryButtonText}>Quét lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.resultsTitle}>Nguyên liệu đã phát hiện</Text>
            {detectedIngredients.length > 0 ? (
              <View style={styles.ingredientsList}>
                {detectedIngredients.map((ingredient) => (
                  <View key={ingredient.id} style={styles.ingredientItem}>
                    {ingredient.image ? (
                      <Image source={{ uri: ingredient.image }} style={styles.ingredientImage} />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Ionicons name="leaf-outline" size={24} color="#ccc" />
                      </View>
                    )}
                    <View style={styles.ingredientInfo}>
                      <Text style={styles.ingredientName}>{ingredient.name}</Text>
                      <Text style={styles.ingredientConfidence}>
                        Độ chính xác: {Math.round(ingredient.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noIngredientsContainer}>
                <Ionicons name="search-outline" size={60} color="#ccc" />
                <Text style={styles.noIngredientsText}>
                  Không tìm thấy nguyên liệu nào
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, styles.rescanButton]} 
          onPress={handleRescan}
        >
          <Text style={styles.rescanButtonText}>Quét lại</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.continueButton]}
          onPress={handleContinue}
          disabled={isLoading || detectedIngredients.length === 0}
        >
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#941D23',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    marginTop: 8,
    color: '#999',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#941D23',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  ingredientsList: {
    paddingHorizontal: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  ingredientImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ingredientConfidence: {
    fontSize: 14,
    color: '#666',
  },
  noIngredientsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noIngredientsText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  rescanButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  rescanButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#941D23',
    marginLeft: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ScanIngredientScreen; 