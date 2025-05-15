// api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { IngredientSearch } from '../types';
export const BASE_URL = 'http://192.168.12.102:3001';

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
      console.log('Interceptor: 401 error detected, attempting token refresh');
      originalRequest._retry = true;

      try {
        // Lấy refresh token từ AsyncStorage
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.log('Interceptor: No refresh token available');
          throw new Error('No refresh token available');
        }

        console.log('Interceptor: Calling refresh token API');
        // Gọi API refresh token
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        console.log("Interceptor: Successfully refreshed token");
        // Lưu access token mới vào AsyncStorage
        await AsyncStorage.setItem('accessToken', accessToken);
        globalThis.isLoggedIn = true;
        // Cập nhật header của request gốc với token mới
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Thử lại request gốc với token mới
        return axios(originalRequest);
      } catch (refreshError) {
        console.log('Interceptor: Refresh token failed', refreshError);
        // Nếu refresh token cũng hết hạn, xóa tokens và throw error
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        globalThis.isLoggedIn = false;
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
    globalThis.isLoggedIn = false;
  }
};

// Hàm tìm công thức theo danh sách nguyên liệu
export const findRecipesByIngredients = async (ingredients: IngredientSearch[]) => {
  try {
    console.log('Tìm công thức với nguyên liệu:', ingredients);
    
    const response = await api.post('/recipe-ingredients/find-recipes', {
      ingredients
    });
    
    console.log('Kết quả tìm công thức:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tìm công thức:', error.response?.data || error.message);
    throw error;
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

// Hàm tìm kiếm danh mục nguyên liệu với phân trang
export const getIngredientCategories = async (
  offset: number = 0,
  limit: number = 10,
  query?: string
) => {
  try {
    console.log('Tìm kiếm danh mục nguyên liệu:', { offset, limit, query });
    
    const response = await api.get('/ingredient-categories/search', {
      params: {
        offset,
        limit,
        query
      }
    });
    
    console.log('Kết quả tìm kiếm danh mục:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm danh mục:', error.response?.data || error.message);
    throw error;
  }
};

// Thêm nguyên liệu vào pantry
export const addToPantry = async (ingredientIds: string[]) => {
  try {
    console.log('Thêm nguyên liệu vào pantry:', ingredientIds);
    
    const response = await api.post('/pantry/add', {
      ingredientIds
    });
    
    console.log('Kết quả thêm vào pantry:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm vào pantry:', error.response?.data || error.message);
    throw error;
  }
};

// Hàm lấy thông tin người dùng hiện tại
export const getUserProfile = async () => {
  try {
    const response = await api.get('/user-profiles/me');
    //console.log('Thông tin người dùng:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error.response?.data || error.message);
    throw error;
  }
};


export default api;