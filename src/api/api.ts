// api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const api = axios.create({
  baseURL:  "http://192.168.100.87:3001",
  // headers: {
  //   'Content-Type': 'application/json',
  // },
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

export default api;