import { useState, useEffect } from 'react';
import api from 'src/api/api';

interface TopDish {
  id: string;
  name: string;
  image: string;
  likes: number;
  views: number;
  favorites: number;
}

interface RecentActivity {
  id: string;
  action: 'Thêm món' | 'Cập nhật' | 'Xóa' | 'Duyệt bài';
  item: string;
  time: string;
  user: string;
}

interface ViewsChartData {
  labels: string[];
  datasets: {
    data: number[];
    color: (opacity?: number) => string;
    strokeWidth: number;
  }[];
}

interface OverviewStats {
  totalRecipes: number;
  totalUsers: number;
  totalViews: number;
  totalLikes: number;
}

interface AdminDashboardData {
  overviewStats: OverviewStats | null;
  viewsData: ViewsChartData | null;
  topDishes: TopDish[] | null;
}

export const useStatisticData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);

  // Fetch overview statistics
  const fetchOverviewStats = async (): Promise<OverviewStats | null> => {
    try {
      const response = await api.get('/admin/statistics/overview');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching overview stats:', error);
      if (error.response && error.response.status === 404) {
        console.log('API not found: /admin/statistics/overview');
      }
      return null;
    }
  };

  // Fetch views data for chart
  const fetchViewsData = async (timeRange = 'week'): Promise<ViewsChartData | null> => {
    try {
      const response = await api.get(`/admin/statistics/timeline?type=views&range=${timeRange}`);
      
      // Format the data for LineChart
      const labels = response.data.data.map((item: any) => item.label);
      const values = response.data.data.map((item: any) => item.value);
      
      return {
        labels,
        datasets: [
          {
            data: values,
            color: () => '#941D23',
            strokeWidth: 2,
          },
        ],
      };
    } catch (error: any) {
      // console.error('Error fetching views data:', error);
      if (error.response && error.response.status === 404) {
        console.log('API not found: /admin/statistics/timeline');
      }
      return null;
    }
  };

  // Fetch top dishes
  const fetchTopDishes = async (limit = 5, sortBy = 'views'): Promise<TopDish[] | null> => {
    try {
      const response = await api.get(`/admin/statistics/top-recipes?limit=${limit}&sortBy=${sortBy}`);
      
      return response.data.data.map((dish: any) => ({
        id: dish.id,
        name: dish.name,
        image: dish.imageUrl,
        likes: dish.likeCount,
        views: dish.viewCount,
        favorites: dish.favoriteCount,
      }));
    } catch (error: any) {
      // console.error('Error fetching top dishes:', error);
      if (error.response && error.response.status === 404) {
        console.log('API not found: /admin/statistics/top-recipes');
      }
      return null;
    }
  };


  // Fetch all admin dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch each type of data independently so one failure doesn't break everything
      const overviewStats = await fetchOverviewStats();
      const viewsData = await fetchViewsData();
      const topDishes = await fetchTopDishes();

      setDashboardData({
        overviewStats,
        viewsData,
        topDishes,
      });
    } catch (err) {
      console.error('Error in dashboard data fetching flow:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data with specific time range
  const fetchDataWithTimeRange = async (timeRange: 'week' | 'month' | 'year') => {
    setIsLoading(true);
    
    try {
      const viewsData = await fetchViewsData(timeRange);
      
      setDashboardData(prev => {
        if (!prev) return {
          overviewStats: null,
          viewsData,
          topDishes: null,
          recentActivities: null
        };
        return {
          ...prev,
          viewsData,
        };
      });
    } catch (err) {
      console.error('Error fetching data with time range:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch top dishes with specific sort criteria
  const fetchDataWithSortBy = async (sortBy: 'views' | 'likes' | 'favorites') => {
    setIsLoading(true);
    
    try {
      const topDishes = await fetchTopDishes(5, sortBy);
      
      setDashboardData(prev => {
        if (!prev) return {
          overviewStats: null,
          viewsData: null,
          topDishes,
          recentActivities: null
        };
        return {
          ...prev,
          topDishes,
        };
      });
    } catch (err) {
      console.error('Error fetching data with sort criteria:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data initially
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    isLoading,
    error,
    dashboardData,
    refreshData: fetchDashboardData,
    fetchDataWithTimeRange,
    fetchDataWithSortBy,
  };
}; 