// api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const BASE_URL = 'http://192.168.1.57:3001';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: {
    'Accept': 'application/json',
  }
});

// Interceptor cho request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Lấy refresh token từ AsyncStorage
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Gọi API refresh token
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        console.log("REFRESH TOKEN HET HAN NE      ");
        // Lưu access token mới vào AsyncStorage
        await AsyncStorage.setItem('accessToken', accessToken);

        // Cập nhật header của request gốc với token mới
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Thử lại request gốc với token mới
        return axios(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token cũng hết hạn, xóa tokens và throw error
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Hàm xử lý logout
export const logout = async () => {
  try {
    // Gọi API logout để blacklist token
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // Xóa tokens khỏi AsyncStorage
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
  }
};

// Hàm scan nguyên liệu từ ảnh
export const scanIngredient = async (imageUri: string) => {
  try {
    console.log('Bắt đầu scan ảnh với URI:', imageUri);
    
    // Nén ảnh trước khi upload
    const compressedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 1024 } }], // Giảm kích thước xuống 1024px width
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Nén 70%
    );
    
    console.log('Ảnh sau khi nén:', compressedImage.uri);
    
    const formData = new FormData();
    
    // Tạo file object từ URI của ảnh đã nén
    const filename = compressedImage.uri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('file', {
      uri: Platform.OS === 'android' ? compressedImage.uri : compressedImage.uri.replace('file://', ''),
      name: filename,
      type: type
    } as any);
    
    console.log('FormData đã được tạo:', formData);
    
    const response = await api.post('/api/extract-ingredients', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
      transformRequest: (data, headers) => {
        return formData;
      },
    });
    
    console.log('Response từ API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Chi tiết lỗi scan ingredient:', error.response?.data || error.message);
    throw error;
  }
};

export default api;