import { useState, useEffect } from 'react';
import api from 'src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Category {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  author: string;
  authorAvatar?: string;
  time: string;
  isFavorite: boolean;
}

interface FeaturedItem {
  id: string;
  name: string;
  image: string;
  time: string;
  author:string,
  avataUrl:string,
  isFavorite: boolean;
}

interface HomeData {
  categories: Category[];
  recipes: Recipe[];
  featuredByCategory: Record<string, FeaturedItem[]>;
  user: {
    name: string;
    avatar: string;
  } | null;
  banner: {
    id:string;
    image: string;
     description: string;
  };
}

export const useHomeData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState('1');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
      return !!token;
    } catch (error) {
      console.error('Error checking auth:', error);
      return false;
    }
  };

  // Fetch all necessary data
  const fetchHomeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const isAuth = await checkAuth();

      // Fetch categories
      const categoriesResponse = await api.get('/recipe-categories/random');
      const categoriesData = categoriesResponse.data.data || [];
      const categories = categoriesData.map((cat: any, index: number) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.imageUrl,
        isActive: index === 0 // ✅ phần tử đầu tiên active
      }));

      // Fetch popular recipes
      const recipesResponse = await api.get('/recipes/popular');
      const recipesData = recipesResponse.data.data || [];
      const recipes = recipesData.map((recipe: any) => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        image: recipe.imageUrl,
        author: recipe.account?.userProfile?.fullName || 'Ẩn danh',
        authorAvatar: recipe.account?.userProfile?.avatarUrl,
        time: `${recipe.preparationTimeMinutes || 0} phút`,
        // isFavorite: isAuth ? (recipe.isFavorite || false) : false
      }));

      // Set default activeCategoryId if categories exist
      if (categories.length > 0 && !activeCategoryId) {
        setActiveCategoryId(categories[0].id);
      }

      const categoryIdToFetch = categories.length > 0 ? categories[0].id : activeCategoryId;

      // Fetch featured recipes by category
      const featuredResponse = await api.get(`/recipes/category/${categoryIdToFetch}/top`);
      const featuredData = featuredResponse.data.data || [];
      const featuredByCategory = {
        [categoryIdToFetch]: featuredData.map((recipe: any) => ({
          id: recipe.id,
          name: recipe.name,
          image: recipe.imageUrl,
          time: `${recipe.preparationTimeMinutes || 0} phút`,
          avataUrl: recipe.account?.userProfile?.avatarUrl,
          author: recipe.account?.userProfile?.fullName || 'Ẩn danh',
          // isFavorite: isAuth ? (recipe.isFavorite || false) : false
        }))
      };

      // Fetch banner
      let banner = {
        id: '',
        image: 'https://via.placeholder.com/150',
        description: 'Khám phá các món ăn hấp dẫn'
      };
      
      try {
        const bannerResponse = await api.get('/recipes/banner');
        if (bannerResponse.data && bannerResponse.data.data) {
          banner = {
            id: bannerResponse.data.data.id,
            image: bannerResponse.data.data.imageUrl,
            description: bannerResponse.data.data.description
          };
        }
      } catch (bannerError: any) {
        // Xử lý lỗi 404 một cách "im lặng" - không log lỗi ra console
        if (bannerError.response && bannerError.response.status !== 404) {
          console.error('Error fetching banner:', bannerError);
        }
        // Sử dụng banner mặc định đã khai báo ở trên
      }

      // Fetch user profile only if authenticated
      let user = null;
      if (isAuth) {
        try {
          const userResponse = await api.get('/accounts/profile');
          if (userResponse.data && userResponse.data.data) {
            user = {
              name: userResponse.data.data.name || 'Người dùng',
              avatar: userResponse.data.data.avatarUrl || 'https://ui-avatars.com/api/?name=User'
            };
          }
        } catch (error: any) {
          // Xử lý lỗi 404 một cách "im lặng" - không log lỗi ra console
          if (error.response && error.response.status !== 404) {
            console.error('Error fetching user profile:', error);
          }
        }
      }

      setHomeData({
        categories,
        recipes,
        featuredByCategory,
        user,
        banner
      });
    } catch (err) {
      console.error('Error fetching home data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // // Toggle favorite status
  // const toggleFavorite = async (itemId: string, type: 'recipe' | 'featured') => {
  //   if (!homeData || !isAuthenticated) {
  //     // Nếu chưa đăng nhập, chuyển hướng đến trang login
  //     return false;
  //   }

  //   try {
  //     const response = await api.post('/favorite-recipes/toggle', {
  //       recipeId: itemId
  //     });

  //     const isFavorite = response.data.isFavorite;

  //     if (type === 'recipe') {
  //       setHomeData(prev => ({
  //         ...prev!,
  //         recipes: prev!.recipes.map(item =>
  //           item.id === itemId ? { ...item, isFavorite } : item
  //         )
  //       }));
  //     } else {
  //       setHomeData(prev => ({
  //         ...prev!,
  //         featuredByCategory: {
  //           ...prev!.featuredByCategory,
  //           [activeCategoryId]: prev!.featuredByCategory[activeCategoryId].map(item =>
  //             item.id === itemId ? { ...item, isFavorite } : item
  //           )
  //         }
  //       }));
  //     }
  //     return true;
  //   } catch (error) {
  //     console.error('Error toggling favorite:', error);
  //     return false;
  //   }
  // };

  // Handle category change
  const handleCategoryPress = async (categoryId: string) => {
    if (!categoryId || !homeData) return;

    setActiveCategoryId(categoryId);
    setHomeData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.map(category => ({
          ...category,
          isActive: category.id === categoryId
        }))
      };
    });

    // Fetch new featured recipes for the selected category
    try {
      const featuredResponse = await api.get(`/recipes/category/${categoryId}/top`);
      const featuredData = featuredResponse.data.data || [];
      setHomeData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          featuredByCategory: {
            ...prev.featuredByCategory,
            [categoryId]: featuredData.map((recipe: any) => ({
              id: recipe.id,
              name: recipe.name,
              image: recipe.imageUrl,
              time: `${recipe.preparationTimeMinutes || recipe.cookingTime || 0} phút`,
              avataUrl: recipe.account?.userProfile?.avatarUrl,
              author: recipe.account?.userProfile?.fullName || 'Ẩn danh',
              // isFavorite: isAuthenticated ? (recipe.isFavorite || false) : false
            }))
          }
        };
      });
    } catch (error) {
      console.error('Error fetching featured recipes:', error);
      // Thêm mảng rỗng cho categoryId
      setHomeData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          featuredByCategory: {
            ...prev.featuredByCategory,
            [categoryId]: []
          }
        };
      });
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return {
    isLoading,
    error,
    homeData,
    activeCategoryId,
    // toggleFavorite,
    handleCategoryPress,
    refreshData: fetchHomeData,
    isAuthenticated
  };
};