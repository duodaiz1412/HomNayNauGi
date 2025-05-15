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
  author: string,
  avataUrl: string,
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
    id: string;
    image: string;
    description: string;
  };
}

export const useHomeData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeData, setHomeData] = useState<HomeData>({
    categories: [],
    recipes: [],
    featuredByCategory: {},
    user: null,
    banner: {
      id: '',
      image: '',
      description: ''
    }
  });
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
      console.log("fetch categori")
      // Fetch categories
      const categoriesResponse = await api.get('/recipe-categories/random');
      const categories = categoriesResponse.data.data.map((cat: any, index: number) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.imageUrl,
        isActive: index === 0
      }));
      console.log("fetch popular recipes")
      // Fetch popular recipes
      const recipesResponse = await api.get('/recipes/popular');
      const recipes = recipesResponse.data.data.map((recipe: any) => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        image: recipe.imageUrl,
        author: recipe.account?.userProfile?.fullName || 'Không xác định',
        authorAvatar: recipe.account?.userProfile?.avatarUrl || '',
        time: `${recipe.preparationTimeMinutes} phút`,
        isFavorite: false
      }));

      // Fetch featured recipes by category
      console.log('Fetching featured recipes by category...');
      const featuredResponse = await api.get(`/recipes/category/${activeCategoryId}/top`);
      const featuredByCategory = {
        [activeCategoryId]: featuredResponse.data.data.map((recipe: any) => ({
          id: recipe.id,
          name: recipe.name,
          image: recipe.imageUrl,
          time: `${recipe.preparationTimeMinutes} phút`,
          avataUrl: recipe.account?.userProfile?.avatarUrl || '',
          author: recipe.account?.userProfile?.fullName || 'Không xác định',
          isFavorite: false
        }))
      };

      // Fetch banner

      console.log('Fetching banner...');
      const bannerResponse = await api.get('/recipes/banner');
      const banner = {
        id: bannerResponse.data.data?.id || '',
        image: bannerResponse.data.data?.imageUrl || '',
        description: bannerResponse.data.data?.description || ''
      };

      // Fetch user profile only if authenticated
      console.log('Fetching user profile...');
      let user = null;
      if (isAuth) {
        try {
          const userResponse = await api.get('/accounts/profile');
          const userData = userResponse.data.data;
          if (userData) {
            user = {
              name: userData.name || '',
              avatar: userData.avatarUrl || ''
            };
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
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

  // Handle category change
  const handleCategoryPress = async (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setHomeData(prev => ({
      ...prev,
      categories: prev.categories.map(category => ({
        ...category,
        isActive: category.id === categoryId
      }))
    }));

    // Fetch new featured recipes for the selected category
    try {
      const featuredResponse = await api.get(`/recipes/category/${categoryId}/top`);
      const newFeatured = featuredResponse.data.data.map((recipe: any) => ({
        id: recipe.id,
        name: recipe.name,
        image: recipe.imageUrl,
        time: `${recipe.preparationTimeMinutes} phút`,
        avataUrl: recipe.account?.userProfile?.avatarUrl || '',
        author: recipe.account?.userProfile?.fullName || 'Không xác định',
        isFavorite: false
      }));

      setHomeData(prev => ({
        ...prev,
        featuredByCategory: {
          ...prev.featuredByCategory,
          [categoryId]: newFeatured
        }
      }));
    } catch (error) {
      console.error('Error fetching featured recipes:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchHomeData();
  }, []);

  return {
    isLoading,
    error,
    homeData,
    activeCategoryId,
    handleCategoryPress,
    isAuthenticated
  };
};