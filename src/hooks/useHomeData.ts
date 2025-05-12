import { useState, useEffect } from 'react';
import api from 'src/api/api';

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
  isFavorite: boolean;
}

interface HomeData {
  categories: Category[];
  recipes: Recipe[];
  featuredByCategory: Record<string, FeaturedItem[]>;
  user: {
    name: string;
    avatar: string;
  };
  banner: {
    image: string;
  };
}

export const useHomeData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState('1');

  // Fetch all necessary data
  const fetchHomeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch categories
      const categoriesResponse = await api.get('/categories');
      const categories = categoriesResponse.data.data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.iconUrl,
        isActive: cat.id === '1'
      }));

      // Fetch recipes
      const recipesResponse = await api.get('/recipes');
      const recipes = recipesResponse.data.data.map((recipe: any) => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        image: recipe.imageUrl,
        author: recipe.account?.name || 'Unknown',
        authorAvatar: recipe.account?.avatarUrl,
        time: `${recipe.cookingTime} phút`,
        isFavorite: false
      }));

      // Fetch featured recipes by category
      const featuredResponse = await api.get('/recipes/featured');
      const featuredByCategory = featuredResponse.data.data.reduce((acc: any, recipe: any) => {
        const categoryId = recipe.categoryMappings?.[0]?.recipeCategoryId || '1';
        if (!acc[categoryId]) {
          acc[categoryId] = [];
        }
        acc[categoryId].push({
          id: recipe.id,
          name: recipe.name,
          image: recipe.imageUrl,
          time: `${recipe.cookingTime} phút`,
          isFavorite: false
        });
        return acc;
      }, {});

      // Fetch user profile
      const userResponse = await api.get('/accounts/profile');
      const user = {
        name: userResponse.data.data.name,
        avatar: userResponse.data.data.avatarUrl
      };

      // Fetch banner
      const bannerResponse = await api.get('/banners/active');
      const banner = {
        image: bannerResponse.data.data.imageUrl
      };

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

  // Toggle favorite status
  const toggleFavorite = (itemId: string, type: 'recipe' | 'featured') => {
    if (!homeData) return;

    if (type === 'recipe') {
      setHomeData(prev => ({
        ...prev!,
        recipes: prev!.recipes.map(item =>
          item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
        )
      }));
    } else {
      setHomeData(prev => ({
        ...prev!,
        featuredByCategory: {
          ...prev!.featuredByCategory,
          [activeCategoryId]: prev!.featuredByCategory[activeCategoryId].map(item =>
            item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
          )
        }
      }));
    }
  };

  // Handle category change
  const handleCategoryPress = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setHomeData(prev => ({
      ...prev!,
      categories: prev!.categories.map(category => ({
        ...category,
        isActive: category.id === categoryId
      }))
    }));
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return {
    isLoading,
    error,
    homeData,
    activeCategoryId,
    toggleFavorite,
    handleCategoryPress,
    refreshData: fetchHomeData
  };
}; 