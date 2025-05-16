import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'src/navigation/AppNavigator'; // Đảm bảo đường dẫn này chính xác
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from 'src/api/api'; // Đảm bảo đường dẫn này chính xác
import api from 'src/api/api'; // Đảm bảo đường dẫn này chính xác

const backgroundImage = require('@assets/background.png'); // Đảm bảo đường dẫn này chính xác

type Category = {
  id: number;
  name: string;
  icon?: string;
  isActive?: boolean;
};

type Recipe = {
  id: string;
  name: string;
  status: string;
  imageUrl: string | null;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  createdAt: Date;
  preparationTimeMinutes: number | null;
  description: string | null;
};

const PersonalScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedCategory, setSelectedCategory] = useState('0'); // '0' cho "Tất cả"
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null); // Khởi tạo là null để dễ kiểm tra
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [totalViewer, setTotalLikes] = useState(0);
  const [totalFavorites, setTotalFavorites] = useState(0);

  const fetchUserData = useCallback(async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setLoading(true);
    try {
      const response = await getUserProfile();
      //console.log('User Profile API Response:', JSON.stringify(response.data, null, 2)); // Ghi log phản hồi API
      if (response.data) {
        const { fullName, email, phoneNumber, avatarUrl, bio } = response.data;
        setUserData({
          name: fullName || 'Chưa cập nhật tên', // Fallback cho tên
          email: email || 'Chưa cập nhật email',
          phone: phoneNumber || '',
          avatar: avatarUrl || '', // avatarUrl rỗng sẽ dùng ảnh placeholder trong Image component
          bio: bio || '',
        });
      } else {
        // Nếu không có data, đặt giá trị mặc định/thông báo lỗi
        setUserData({
          name: 'Không tải được hồ sơ',
          email: 'N/A',
          phone: 'N/A',
          avatar: '',
          bio: 'Không thể tải thông tin người dùng.',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUserData({
        // Fallback khi có lỗi API
        name: 'Lỗi tải hồ sơ',
        email: 'N/A',
        phone: 'N/A',
        avatar: '',
        bio: 'Đã xảy ra lỗi khi tải thông tin.',
      });
    } finally {
      if (showLoadingIndicator) setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/recipe-categories/search');
      if (response.data && response.data.data) {
        const categoriesData = [
          { id: 0, name: 'Tất cả' }, // Danh mục "Tất cả"
          ...response.data.data,
        ];
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const fetchRecipes = useCallback(
    async (showLoadingIndicator = true) => {
      if (showLoadingIndicator) setLoading(true);
      try {
        const params: any = {
          limit: 20,
          offset: 0,
          status: 'public', // Hoặc trạng thái phù hợp cho công thức của người dùng
          query: '',
        };

        if (selectedCategory !== '0') {
          params.categoryId = Number(selectedCategory);
        }

        const response = await api.get('/recipes/me', { params });

        if (response.data && response.data.data) {
          const fetchedRecipes = response.data.data.map((recipe: any) => ({
            ...recipe,
            viewCount: Number(recipe.viewCount || 0),
            likeCount: Number(recipe.likeCount || 0),
            favoriteCount: Number(recipe.favoriteCount || 0),
            createdAt: new Date(recipe.createdAt), // Chuyển đổi thành Date nếu cần
          }));

          setRecipes(fetchedRecipes);
          // total từ API có thể là tổng số công thức theo filter, hoặc tổng của người dùng.
          // Nếu là tổng của người dùng, nó không nên thay đổi khi filter.
          // Giả sử total này là tổng theo filter hiện tại.
          setTotalRecipes(response.data.total || fetchedRecipes.length);

          // Tính tổng like và favorite từ các công thức đã fetch (có thể đã filter)
          // Nếu muốn tổng like/favorite của TẤT CẢ công thức, cần cách tính khác.
          const currentTotalLikes = fetchedRecipes.reduce(
            (sum: number, recipe: Recipe) => sum + recipe.likeCount,
            0
          );
          const currentTotalFavorites = fetchedRecipes.reduce(
            (sum: number, recipe: Recipe) => sum + recipe.favoriteCount,
            0
          );
          setTotalLikes(currentTotalLikes);
          setTotalFavorites(currentTotalFavorites);
        } else {
          setRecipes([]);
          setTotalRecipes(0);
          setTotalLikes(0);
          setTotalFavorites(0);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setRecipes([]);
        setTotalRecipes(0);
        setTotalLikes(0);
        setTotalFavorites(0);
      } finally {
        if (showLoadingIndicator) setLoading(false);
      }
    },
    [selectedCategory]
  );

  useEffect(() => {
    const checkLoginStatus = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          setIsLoggedIn(true);
          // Gọi song song và không cần setLoading riêng lẻ trong từng hàm
          await Promise.all([
            fetchUserData(false),
            fetchCategories(),
            fetchRecipes(false), // Fetch initial recipes (all or based on default selectedCategory)
          ]);
        } else {
          setIsLoggedIn(false);
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
        navigation.replace('Login');
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [fetchUserData, fetchCategories, fetchRecipes, navigation]);

  // useEffect để fetch lại recipes khi selectedCategory thay đổi (và đã login)
  useEffect(() => {
    if (isLoggedIn) {
      fetchRecipes();
    }
  }, [selectedCategory, isLoggedIn, fetchRecipes]); // fetchRecipes là dependency vì nó chứa selectedCategory

  // useEffect để refresh dữ liệu khi màn hình được focus (quay lại từ màn hình khác)
  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        // Chỉ fetch user data và recipes, categories thường ít thay đổi
        fetchUserData();
        fetchRecipes();
      }
    }, [isLoggedIn, fetchUserData, fetchRecipes])
  );

  const handleRecipePress = async (recipeId: string) => {
    try {
      //console.log('Navigate to RecipeDetail with id:', recipeId);
      navigation.navigate('RecipeDetail', { recipeId });
    } catch (error) {
      console.error('Error navigating:', error);
    }
  };

  const renderHeader = () => (
    <View className="items-center mt-2 mb-4">
      <View className="flex-row items-center justify-end w-full px-4 mb-4">
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          <Text className="text-2xl">☰</Text>
        </TouchableOpacity>
      </View>

      <View className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 mb-4">
        <Image
          source={
            userData?.avatar
              ? { uri: userData.avatar }
              : require('../../assets/images/avatar-placeholder.jpg')
          }
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <Text className="text-4xl font-bold text-[#88131B] mb-2">
        {userData?.name ||
          (loading && !userData ? 'Đang tải...' : 'Chưa cập nhật tên')}
      </Text>

      {userData?.bio ? (
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfileScreen')}
          className="mb-4"
        >
          <Text className="text-base text-gray-600 text-center px-6">
            {userData.bio}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text className="text-base text-gray-600 text-center px-6 mb-4">
          Xin chào, nếu bạn đang tìm kiếm những món ăn Việt thì xin chúc mừng,
          bạn tìm đến đúng nơi rồi đấy !!!
        </Text>
      )}

      <View className="flex-row justify-around w-full mb-6">
        <View className="items-center px-4">
          <Text className="text-xl font-bold text-black">{totalRecipes}</Text>
          <Text className="text-sm text-gray-600">Công thức</Text>
        </View>
        <View className="items-center px-4 border-l border-r border-gray-200">
          <Text className="text-xl font-bold text-black">{totalViewer}</Text>
          <Text className="text-sm text-gray-600">Lượt thích</Text>
        </View>
        <View className="items-center px-4">
          <Text className="text-xl font-bold text-black">{totalFavorites}</Text>
          <Text className="text-sm text-gray-600">Yêu thích</Text>
        </View>
      </View>

      {/* "Công thức của tôi" và nút "+" trên cùng một hàng */}
      <View className="flex-row justify-between items-center w-full px-4 mb-3">
        <Text className="text-2xl font-bold text-black">Công thức của tôi</Text>
        <TouchableOpacity
          className="bg-[#88131B] w-10 h-10 rounded-full items-center justify-center"
          onPress={() => navigation.navigate('AddDishScreen')}
        >
          <Text className="text-white text-xl">＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4" // Có thể thêm pl-4 hoặc pr-4 nếu muốn padding ở đầu/cuối ScrollView
        contentContainerStyle={{ paddingHorizontal: 16 }} // padding cho nội dung bên trong scrollview
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelectedCategory(cat.id.toString())}
            className={`flex-row items-center rounded-full px-4 py-2 mr-2 border ${selectedCategory === cat.id.toString() ? 'bg-[#88131B] border-[#88131B]' : 'border-[#88131B]'}`}
            style={{ minWidth: 100, justifyContent: 'center' }} // Đảm bảo text căn giữa nếu tên category ngắn
          >
            <Text
              className={`font-bold text-base ${selectedCategory === cat.id.toString() ? 'text-white' : 'text-[#88131B]'}`}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (loading && !recipes.length && !userData) {
    // Hiển thị loading indicator toàn màn hình ban đầu
    return (
      <ImageBackground
        source={backgroundImage}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        resizeMode="cover"
      >
        <ActivityIndicator size="large" color="#88131B" />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1">
        <FlatList
          data={recipes}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white rounded-xl w-[48%] mb-4 overflow-hidden shadow-md" // Thêm shadow
              onPress={() => handleRecipePress(item.id)}
            >
              <Image
                source={{
                  uri: item.imageUrl || 'https://via.placeholder.com/150',
                }} // Placeholder nếu không có ảnh
                className="h-28 w-full"
                resizeMode="cover"
              />
              <View className="p-2">
                <Text
                  className="text-sm font-bold text-black mb-1"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text className="text-xs text-gray-500">
                  ⏱{' '}
                  {item.preparationTimeMinutes
                    ? `${item.preparationTimeMinutes} phút`
                    : 'N/A'}
                </Text>
                <View className="flex-row justify-between mt-1">
                  <Text className="text-xs text-gray-500">
                    👁 {item.viewCount}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    👍{item.likeCount}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    ❤️ {item.favoriteCount}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading ? ( // Chỉ hiển thị "Chưa có công thức" nếu không đang loading
              <View className="items-center justify-center py-8 mt-4">
                <Text className="text-gray-500 text-lg">
                  Chưa có công thức nào
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  Hãy thử thêm công thức mới nhé!
                </Text>
              </View>
            ) : (
              // Nếu đang loading và recipes rỗng (sau header), có thể hiển thị một spinner nhỏ ở đây
              <View className="items-center justify-center py-8 mt-4">
                <ActivityIndicator size="small" color="#88131B" />
              </View>
            )
          }
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default PersonalScreen;
