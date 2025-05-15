import type React from 'react';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  type Recipe,
  type RecipeCategory,
  type Ingredient,
  type IngredientCategory,
  type UnitOfMeasure,
  type CookingStep,
  type RecipeIngredient,
  RecipeStatus,
  ClientCreateRecipePayload,
} from '../types/index';
import api from 'src/api/api';
import { Alert } from 'react-native';
//
// interface ClientCreateRecipePayload {
//   name: string;
//   description?: string | null;
//   protein?: number | null;
//   fat?: number | null;
//   calories?: number | null;
//   carbohydrates?: number | null;
//   hasNewRecipeImageFile?: boolean;
//   // imageUrl sẽ do backend xử lý, client gửi file
//   preparationTimeMinutes?: number | null;
//   videoUrl?: string | null;
//   status: RecipeStatus;
//   categoryIds: number[]; // Backend mong đợi categoryIds
//   ingredients: Array<{
//     ingredientId: string;
//     quantity: number | null;
//     unitId: number | null;
//   }>;
//   steps: Array<{
//     stepOrder: number;
//     instruction: string;
//     imageUrl: string | null;
//     hasNewImageFile?: boolean;
//   }>;
//   // Giữ imageUrl nếu client đã có uri (chỉ để hiển thị)
//   // nhưng backend sẽ upload và tạo imageUrl mới

//   // Client sẽ gửi các files riêng
//   recipeImageFile?: File | null; // File cho ảnh chính của công thức
//   stepImageFiles?: (File | null)[]; // Mảng các file cho ảnh của từng bước
// }

// Định nghĩa kiểu dữ liệu cho context
interface FoodManagementContextType {
  // State
  recipes: Recipe[];
  recipeCategories: RecipeCategory[];
  ingredients: Ingredient[];
  ingredientCategories: IngredientCategory[];
  unitsOfMeasure: UnitOfMeasure[];
  ingredientCategoryFilters: IngredientCategory[];

  // Loading states
  isLoadingRecipes: boolean;
  isLoadingCategories: boolean;
  isLoadingIngredients: boolean;

  // Recipe CRUD
  getRecipe: (id: string) => Promise<Recipe | null>;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => Promise<Recipe>;
  deleteRecipe: (id: string) => Promise<boolean>;
  publicRecipe: (id: string) => Promise<Recipe>;
  createRecipeForUser: (payload: ClientCreateRecipePayload) => Promise<Recipe>;
  updateRecipeForUser: (payload: ClientCreateRecipePayload) => Promise<Recipe>;

  // Recipe Category CRUD
  getRecipeCategories: () => Promise<RecipeCategory[]>;
  createRecipeCategory: (
    category: Partial<RecipeCategory>
  ) => Promise<RecipeCategory>;
  updateRecipeCategory: (
    id: number,
    category: Partial<RecipeCategory>
  ) => Promise<RecipeCategory>;
  deleteRecipeCategory: (id: number) => Promise<boolean>;

  // Ingredient CRUD
  getIngredients: () => Promise<Ingredient[]>;
  createIngredient: (ingredient: Partial<Ingredient>) => Promise<Ingredient>;
  updateIngredient: (
    id: string,
    ingredient: Partial<Ingredient>
  ) => Promise<Ingredient>;
  deleteIngredient: (id: string) => Promise<boolean>;

  // Ingredient Category CRUD
  getIngredientCategories: () => Promise<IngredientCategory[]>;
  createIngredientCategory: (
    category: Partial<IngredientCategory>
  ) => Promise<IngredientCategory>;
  updateIngredientCategory: (
    id: number,
    category: Partial<IngredientCategory>
  ) => Promise<IngredientCategory>;
  deleteIngredientCategory: (id: number) => Promise<boolean>;
  updateIngredientCategoryFilters: (categories: IngredientCategory[]) => void;

  // Recipe Ingredients
  addIngredientToRecipe: (
    recipeId: string,
    ingredient: Partial<RecipeIngredient>
  ) => Promise<RecipeIngredient>;
  updateRecipeIngredient: (
    recipeId: string,
    ingredientId: string,
    data: Partial<RecipeIngredient>
  ) => Promise<RecipeIngredient>;
  removeIngredientFromRecipe: (
    recipeId: string,
    ingredientId: string
  ) => Promise<boolean>;

  // Cooking Steps
  addCookingStep: (step: Partial<CookingStep>) => Promise<CookingStep>;
  updateCookingStep: (
    id: number,
    step: Partial<CookingStep>
  ) => Promise<CookingStep>;
  deleteCookingStep: (id: number) => Promise<boolean>;
  reorderCookingSteps: (
    recipeId: string,
    stepIds: number[]
  ) => Promise<CookingStep[]>;

  // Units of Measure
  getUnitsOfMeasure: () => Promise<UnitOfMeasure[]>;

  // Form state for Add/Edit Recipe
  currentRecipe: Recipe | null;
  setCurrentRecipe: (recipe: Recipe | null) => void;

  // Temporary form data for recipe creation/editing
  recipeForm: {
    basicInfo: Partial<Recipe>;
    categories: RecipeCategory[];
    ingredients: RecipeIngredient[];
    steps: CookingStep[];
  };

  // Form actions
  updateBasicInfo: (info: Partial<Recipe>) => void;
  updateCategories: (categories: RecipeCategory[]) => void;
  updateIngredients: (ingredients: RecipeIngredient[]) => void;
  updateSteps: (steps: CookingStep[]) => void;
  resetForm: () => void;
  saveRecipe: () => Promise<Recipe>;
}

// Tạo context
const FoodManagementContext = createContext<
  FoodManagementContextType | undefined
>(undefined);

// Giá trị mặc định cho form
const defaultRecipeForm = {
  basicInfo: {
    name: '',
    description: '',
    protein: null,
    fat: null,
    calories: null,
    carbohydrates: null,
    imageUrl: null,
    preparationTimeMinutes: null,
    videoUrl: null,
    status: RecipeStatus.DRAFT,
  },
  categories: [],
  ingredients: [],
  steps: [],
};

// Provider component
export const FoodManagementProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // State
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeCategories, setRecipeCategories] = useState<RecipeCategory[]>(
    []
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientCategories, setIngredientCategories] = useState<
    IngredientCategory[]
  >([]);
  const [unitsOfMeasure, setUnitsOfMeasure] = useState<UnitOfMeasure[]>([]);
  const [ingredientCategoryFilters, setIngredientCategoryFilters] = useState<
    IngredientCategory[]
  >([]);
  // Loading states
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);

  // Current recipe for editing
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);

  // Form state
  const [recipeForm, setRecipeForm] = useState({
    basicInfo: { ...defaultRecipeForm.basicInfo },
    categories: [] as RecipeCategory[],
    ingredients: [] as RecipeIngredient[],
    steps: [] as CookingStep[],
  });

  // Fetch initial data
  useEffect(() => {
    getRecipeCategories();
    getIngredientCategories();
    getUnitsOfMeasure();
  }, []);

  // Recipe CRUD operations
  const getRecipe = async (id: string): Promise<Recipe | null> => {
    try {
      // Giả lập API call
      const recipe = recipes.find((r) => r.id === id) || null;
      return recipe;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return null;
    }
  };
  const createRecipeWithDetails = async (payload: ClientCreateRecipePayload): Promise<Recipe> => {
    try {
      setIsLoadingRecipes(true);
      const formData = new FormData();

      // 1. Append các trường thông thường
      formData.append('name', payload.name);
      formData.append('description', payload.description || '');
      formData.append('status', payload.status);
      
      // Only append hasNewRecipeImageFile if it's true
      if (payload.hasNewRecipeImageFile) {
        formData.append('hasNewRecipeImageFile', 'true');
      }

      if (payload.categoryIds && payload.categoryIds.length > 0) {
        payload.categoryIds.forEach((id) => {
          formData.append('categoryIds[]', id.toString());
        });
      }

      if (payload.ingredients && payload.ingredients.length > 0) {
        payload.ingredients.forEach((ing, index) => {
          formData.append(`ingredients[${index}][ingredientId]`, ing.ingredientId);
          if (ing.quantity !== null && ing.quantity !== undefined) {
            formData.append(`ingredients[${index}][quantity]`, ing.quantity.toString());
          }
          if (ing.unitId !== null && ing.unitId !== undefined) {
            formData.append(`ingredients[${index}][unitId]`, ing.unitId.toString());
          }
        });
      }

      if (payload.steps && payload.steps.length > 0) {
        payload.steps.forEach((step, index) => {
          formData.append(`steps[${index}][stepOrder]`, step.stepOrder.toString());
          formData.append(`steps[${index}][instruction]`, step.instruction);
          if (step.imageUrl !== null && step.imageUrl !== undefined) {
            formData.append(`steps[${index}][imageUrl]`, step.imageUrl);
          }
          // Only append hasNewImageFile if it's true
          if (step.hasNewImageFile) {
            formData.append(`steps[${index}][hasNewImageFile]`, 'true');
          }
        });
      }

      // Append nutrition info only if they are not null/undefined
      if (payload.protein !== null && payload.protein !== undefined) {
        formData.append('protein', payload.protein.toString());
      }
      if (payload.fat !== null && payload.fat !== undefined) {
        formData.append('fat', payload.fat.toString());
      }
      if (payload.calories !== null && payload.calories !== undefined) {
        formData.append('calories', payload.calories.toString());
      }
      if (payload.carbohydrates !== null && payload.carbohydrates !== undefined) {
        formData.append('carbohydrates', payload.carbohydrates.toString());
      }
      if (payload.preparationTimeMinutes !== null && payload.preparationTimeMinutes !== undefined) {
        formData.append('preparationTimeMinutes', payload.preparationTimeMinutes.toString());
      }
      if (payload.videoUrl) {
        formData.append('videoUrl', payload.videoUrl);
      }

      // Append image files if they exist
      if (payload.recipeImageFile) {
        formData.append('images', payload.recipeImageFile as any);
      }

      if (payload.stepImageFiles && payload.stepImageFiles.length > 0) {
        payload.stepImageFiles.forEach((file) => {
          if (file) {
            formData.append('images', file as any);
          }
        });
      }

      console.log("FORMDATA SEND", formData);
      const response = await api.post('/admin/recipes/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newRecipe = response.data.data as Recipe;
      setRecipes((prev) => [newRecipe, ...prev]);
      return newRecipe;
    } catch (error: any) {
      console.error('Error creating recipe in context:', error.response?.data || error.message, error.config);
      const apiError = error.response?.data;
      if (apiError && apiError.message) {
        if (Array.isArray(apiError.message)) {
          throw new Error(apiError.message.join(', '));
        }
        throw new Error(apiError.message);
      }
      throw new Error('Không thể tạo công thức từ context');
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  const updateRecipe = async (
    id: string,
    recipe: Partial<Recipe>
  ): Promise<Recipe> => {
    try {
      // Giả lập API call
      const index = recipes.findIndex((r) => r.id === id);
      if (index === -1) throw new Error('Recipe not found');

      const updatedRecipe = {
        ...recipes[index],
        ...recipe,
        updatedAt: new Date().toISOString(),
      };

      const newRecipes = [...recipes];
      newRecipes[index] = updatedRecipe;
      setRecipes(newRecipes);

      return updatedRecipe;
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  };

  const deleteRecipe = async (id: string): Promise<boolean> => {
    try {
      // Giả lập API call
      setRecipes(recipes.filter((r) => r.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return false;
    }
  };

  const publicRecipe = async (id: string): Promise<Recipe> => {
    return updateRecipe(id, { status: RecipeStatus.PUBLIC });
  };

  // Recipe Category CRUD
  const getRecipeCategories = async (): Promise<RecipeCategory[]> => {
    try {
      setIsLoadingCategories(true);
      // Giả lập API call
      // Trong thực tế, bạn sẽ gọi API thực sự ở đây
      const mockCategories: RecipeCategory[] = [
        { id: 1, name: 'Phở', imageUrl: null },
        { id: 2, name: 'Bánh mì', imageUrl: null },
        { id: 3, name: 'Cơm', imageUrl: null },
        { id: 4, name: 'Bún', imageUrl: null },
        { id: 5, name: 'Gỏi cuốn', imageUrl: null },
      ];

      setRecipeCategories(mockCategories);
      return mockCategories;
    } catch (error) {
      console.error('Error fetching recipe categories:', error);
      return [];
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const createRecipeCategory = async (
    category: Partial<RecipeCategory>
  ): Promise<RecipeCategory> => {
    try {
      // Giả lập API call
      const newCategory: RecipeCategory = {
        id: recipeCategories.length + 1, // Giả lập auto-increment
        name: category.name || 'Untitled Category',
        imageUrl: category.imageUrl || null,
      };

      setRecipeCategories([...recipeCategories, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Error creating recipe category:', error);
      throw error;
    }
  };

  const updateRecipeCategory = async (
    id: number,
    category: Partial<RecipeCategory>
  ): Promise<RecipeCategory> => {
    try {
      // Giả lập API call
      const index = recipeCategories.findIndex((c) => c.id === id);
      if (index === -1) throw new Error('Category not found');

      const updatedCategory = {
        ...recipeCategories[index],
        ...category,
      };

      const newCategories = [...recipeCategories];
      newCategories[index] = updatedCategory;
      setRecipeCategories(newCategories);

      return updatedCategory;
    } catch (error) {
      console.error('Error updating recipe category:', error);
      throw error;
    }
  };

  const deleteRecipeCategory = async (id: number): Promise<boolean> => {
    try {
      // Giả lập API call
      setRecipeCategories(recipeCategories.filter((c) => c.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting recipe category:', error);
      return false;
    }
  };

  // Ingredient CRUD
  const getIngredients = async (): Promise<Ingredient[]> => {
    try {
      setIsLoadingIngredients(true);
      // Giả lập API call
      // Trong thực tế, bạn sẽ gọi API thực sự ở đây
      const mockIngredients: Ingredient[] = [
        { id: 'ing-1', name: 'Thịt heo', imageUrl: null },
        { id: 'ing-2', name: 'Thịt bò', imageUrl: null },
        { id: 'ing-3', name: 'Thịt gà', imageUrl: null },
        { id: 'ing-4', name: 'Cà rốt', imageUrl: null },
        { id: 'ing-5', name: 'Khoai tây', imageUrl: null },
      ];

      setIngredients(mockIngredients);
      return mockIngredients;
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      return [];
    } finally {
      setIsLoadingIngredients(false);
    }
  };

  const createIngredient = async (
    ingredient: Partial<Ingredient>
  ): Promise<Ingredient> => {
    try {
      // Giả lập API call
      const newIngredient: Ingredient = {
        id: `ing-${Date.now()}`, // Giả lập UUID
        name: ingredient.name || 'Untitled Ingredient',
        imageUrl: ingredient.imageUrl || null,
      };

      setIngredients([...ingredients, newIngredient]);
      return newIngredient;
    } catch (error) {
      console.error('Error creating ingredient:', error);
      throw error;
    }
  };

  const updateIngredient = async (
    id: string,
    ingredient: Partial<Ingredient>
  ): Promise<Ingredient> => {
    try {
      // Giả lập API call
      const index = ingredients.findIndex((i) => i.id === id);
      if (index === -1) throw new Error('Ingredient not found');

      const updatedIngredient = {
        ...ingredients[index],
        ...ingredient,
      };

      const newIngredients = [...ingredients];
      newIngredients[index] = updatedIngredient;
      setIngredients(newIngredients);

      return updatedIngredient;
    } catch (error) {
      console.error('Error updating ingredient:', error);
      throw error;
    }
  };

  const deleteIngredient = async (id: string): Promise<boolean> => {
    try {
      // Giả lập API call
      setIngredients(ingredients.filter((i) => i.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      return false;
    }
  };

  // Ingredient Category CRUD
  const getIngredientCategories = async (): Promise<IngredientCategory[]> => {
    try {
      // Giả lập API call
      const mockCategories: IngredientCategory[] = [
        { id: 1, name: 'Thịt', imageUrl: null },
        { id: 2, name: 'Rau củ', imageUrl: null },
        { id: 3, name: 'Gia vị', imageUrl: null },
        { id: 4, name: 'Hải sản', imageUrl: null },
        { id: 5, name: 'Trái cây', imageUrl: null },
      ];

      setIngredientCategories(mockCategories);
      return mockCategories;
    } catch (error) {
      console.error('Error fetching ingredient categories:', error);
      return [];
    }
  };

  const createIngredientCategory = async (
    category: Partial<IngredientCategory>
  ): Promise<IngredientCategory> => {
    try {
      // Giả lập API call
      const newCategory: IngredientCategory = {
        id: ingredientCategories.length + 1, // Giả lập auto-increment
        name: category.name || 'Untitled Category',
        imageUrl: category.imageUrl || null,
      };

      setIngredientCategories([...ingredientCategories, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Error creating ingredient category:', error);
      throw error;
    }
  };

  const updateIngredientCategory = async (
    id: number,
    category: Partial<IngredientCategory>
  ): Promise<IngredientCategory> => {
    try {
      // Giả lập API call
      const index = ingredientCategories.findIndex((c) => c.id === id);
      if (index === -1) throw new Error('Category not found');

      const updatedCategory = {
        ...ingredientCategories[index],
        ...category,
      };

      const newCategories = [...ingredientCategories];
      newCategories[index] = updatedCategory;
      setIngredientCategories(newCategories);

      return updatedCategory;
    } catch (error) {
      console.error('Error updating ingredient category:', error);
      throw error;
    }
  };

  const deleteIngredientCategory = async (id: number): Promise<boolean> => {
    try {
      // Giả lập API call
      setIngredientCategories(ingredientCategories.filter((c) => c.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting ingredient category:', error);
      return false;
    }
  };
  const updateIngredientCategoryFilters = (
    categories: IngredientCategory[]
  ) => {
    setIngredientCategoryFilters(categories);
  };
  // Recipe Ingredients
  const addIngredientToRecipe = async (
    recipeId: string,
    ingredient: Partial<RecipeIngredient>
  ): Promise<RecipeIngredient> => {
    try {
      // Giả lập API call
      const newIngredient: RecipeIngredient = {
        recipeId,
        ingredientId: ingredient.ingredientId || '',
        quantity: ingredient.quantity || null,
        unitId: ingredient.unitId || null,
        ingredient: { id: ingredient.ingredientId || '', name: '', imageUrl: null },
        unit: null
      };

      // Trong thực tế, bạn sẽ cập nhật dữ liệu thông qua API
      return newIngredient;
    } catch (error) {
      console.error('Error adding ingredient to recipe:', error);
      throw error;
    }
  };

  const updateRecipeIngredient = async (
    recipeId: string,
    ingredientId: string,
    data: Partial<RecipeIngredient>
  ): Promise<RecipeIngredient> => {
    try {
      // Giả lập API call
      const updatedIngredient: RecipeIngredient = {
        recipeId,
        ingredientId,
        quantity: data.quantity !== undefined ? data.quantity : null,
        unitId: data.unitId !== undefined ? data.unitId : null,
        ingredient: { id: ingredientId, name: '', imageUrl: null },
        unit: null
      };

      // Trong thực tế, bạn sẽ cập nhật dữ liệu thông qua API
      return updatedIngredient;
    } catch (error) {
      console.error('Error updating recipe ingredient:', error);
      throw error;
    }
  };

  const removeIngredientFromRecipe = async (
    recipeId: string,
    ingredientId: string
  ): Promise<boolean> => {
    try {
      // Giả lập API call
      // Trong thực tế, bạn sẽ gọi API để xóa
      return true;
    } catch (error) {
      console.error('Error removing ingredient from recipe:', error);
      return false;
    }
  };

  // Cooking Steps
  const addCookingStep = async (
    step: Partial<CookingStep>
  ): Promise<CookingStep> => {
    try {
      // Giả lập API call
      const newStep: CookingStep = {
        id: Date.now(), // Giả lập auto-increment
        recipeId: step.recipeId || '',
        stepOrder: step.stepOrder || 1,
        instruction: step.instruction || '',
        imageUrl: step.imageUrl || null,
      };

      // Trong thực tế, bạn sẽ cập nhật dữ liệu thông qua API
      return newStep;
    } catch (error) {
      console.error('Error adding cooking step:', error);
      throw error;
    }
  };

  const updateCookingStep = async (
    id: number,
    step: Partial<CookingStep>
  ): Promise<CookingStep> => {
    try {
      // Giả lập API call
      // Trong thực tế, bạn sẽ gọi API để cập nhật
      const updatedStep: CookingStep = {
        id,
        recipeId: step.recipeId || '',
        stepOrder: step.stepOrder || 1,
        instruction: step.instruction || '',
        imageUrl: step.imageUrl || null,
      };

      return updatedStep;
    } catch (error) {
      console.error('Error updating cooking step:', error);
      throw error;
    }
  };

  const deleteCookingStep = async (id: number): Promise<boolean> => {
    try {
      // Giả lập API call
      // Trong thực tế, bạn sẽ gọi API để xóa
      return true;
    } catch (error) {
      console.error('Error deleting cooking step:', error);
      return false;
    }
  };

  const reorderCookingSteps = async (
    recipeId: string,
    stepIds: number[]
  ): Promise<CookingStep[]> => {
    try {
      // Giả lập API call
      // Trong thực tế, bạn sẽ gọi API để sắp xếp lại
      return [];
    } catch (error) {
      console.error('Error reordering cooking steps:', error);
      throw error;
    }
  };

  // Units of Measure
  const getUnitsOfMeasure = async (): Promise<UnitOfMeasure[]> => {
    try {
      // Giả lập API call
      const mockUnits: UnitOfMeasure[] = [
      ];

      setUnitsOfMeasure(mockUnits);
      return mockUnits;
    } catch (error) {
      console.error('Error fetching units of measure:', error);
      return [];
    }
  };

  // Form actions
const updateBasicInfo = (info: Partial<Recipe>) => {
  setRecipeForm(prevForm => ({ // prevForm ở đây LUÔN là giá trị state mới nhất
    ...prevForm, // Lấy toàn bộ giá trị hiện tại của form
    basicInfo: {
      ...prevForm.basicInfo, // Lấy giá trị basicInfo hiện tại
      ...info, // Áp dụng thay đổi mới cho basicInfo
    },
  }));
};

const updateCategories = (categories: RecipeCategory[]) => {
  setRecipeForm(prevForm => ({
    ...prevForm,
    categories, // Ghi đè categories
  }));
};
const updateIngredients = (ingredients: RecipeIngredient[]) => {
  setRecipeForm(prevForm => ({
    ...prevForm,
    ingredients, // Ghi đè ingredients
  }));
};

const updateSteps = (steps: CookingStep[]) => {
  setRecipeForm(prevForm => ({
    ...prevForm,
    steps, // Ghi đè steps
  }));
};

  const resetForm = () => {
    setRecipeForm({
      basicInfo: { ...defaultRecipeForm.basicInfo },
      categories: [],
      ingredients: [],
      steps: [],
    });
  };

  const updateRecipeWithDetails = async (payload: ClientCreateRecipePayload): Promise<Recipe> => {
    try {
      setIsLoadingRecipes(true);
      const formData = new FormData();

      // 1. Append các trường thông thường
      formData.append('id', payload.id || '');
      formData.append('name', payload.name);
      formData.append('description', payload.description || '');
      formData.append('status', payload.status);
      
      // Only append hasNewRecipeImageFile if it's true
      if (payload.hasNewRecipeImageFile) {
        formData.append('hasNewRecipeImageFile', 'true');
      }

      if (payload.categoryIds && payload.categoryIds.length > 0) {
        payload.categoryIds.forEach((id) => {
          formData.append('categoryIds[]', id.toString());
        });
      }

      if (payload.ingredients && payload.ingredients.length > 0) {
        payload.ingredients.forEach((ing, index) => {
          formData.append(`ingredients[${index}][ingredientId]`, ing.ingredientId);
          if (ing.quantity !== null && ing.quantity !== undefined) {
            formData.append(`ingredients[${index}][quantity]`, ing.quantity.toString());
          }
          if (ing.unitId !== null && ing.unitId !== undefined) {
            formData.append(`ingredients[${index}][unitId]`, ing.unitId.toString());
          }
        });
      }

      if (payload.steps && payload.steps.length > 0) {
        payload.steps.forEach((step, index) => {
          formData.append(`steps[${index}][stepOrder]`, step.stepOrder.toString());
          formData.append(`steps[${index}][instruction]`, step.instruction);
          if (step.imageUrl !== null && step.imageUrl !== undefined) {
            formData.append(`steps[${index}][imageUrl]`, step.imageUrl);
          }
          // Only append hasNewImageFile if it's true
          if (step.hasNewImageFile) {
            formData.append(`steps[${index}][hasNewImageFile]`, 'true');
          }
        });
      }

      // Append nutrition info only if they are not null/undefined
      if (payload.protein !== null && payload.protein !== undefined) {
        formData.append('protein', payload.protein.toString());
      }
      if (payload.fat !== null && payload.fat !== undefined) {
        formData.append('fat', payload.fat.toString());
      }
      if (payload.calories !== null && payload.calories !== undefined) {
        formData.append('calories', payload.calories.toString());
      }
      if (payload.carbohydrates !== null && payload.carbohydrates !== undefined) {
        formData.append('carbohydrates', payload.carbohydrates.toString());
      }
      if (payload.preparationTimeMinutes !== null && payload.preparationTimeMinutes !== undefined) {
        formData.append('preparationTimeMinutes', payload.preparationTimeMinutes.toString());
      }
      if (payload.videoUrl) {
        formData.append('videoUrl', payload.videoUrl);
      }

      // Append image files if they exist
      if (payload.recipeImageFile) {
        formData.append('images', payload.recipeImageFile as any);
      }

      if (payload.stepImageFiles && payload.stepImageFiles.length > 0) {
        payload.stepImageFiles.forEach((file) => {
          if (file) {
            formData.append('images', file as any);
          }
        });
      }

      console.log("FORMDATA SEND", JSON.stringify(formData,null,2));
      const response = await api.put('/admin/recipes/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedRecipe = response.data.data as Recipe;
      setRecipes((prev) => prev.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      ));
      return updatedRecipe;
    } catch (error: any) {
      console.error('Error updating recipe in context:', error.response?.data || error.message, error.config);
      const apiError = error.response?.data;
      if (apiError && apiError.message) {
        if (Array.isArray(apiError.message)) {
          throw new Error(apiError.message.join(', '));
        }
        throw new Error(apiError.message);
      }
      throw new Error('Không thể cập nhật công thức từ context');
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  // Hàm saveRecipe trong context sẽ gọi createRecipeWithDetails với payload được chuẩn bị:
  const saveRecipe = async (): Promise<Recipe | null> => {
    try {
      setIsLoadingRecipes(true);
      const basicInfo = recipeForm.basicInfo;
      const categoriesFromForm = recipeForm.categories;
      const ingredientsFromForm = recipeForm.ingredients;
      const stepsFromForm = recipeForm.steps;

      let recipeImageFileForUpload: any = null;
      if (basicInfo.imageUrl && basicInfo.imageUrl.startsWith('file://')) {
        recipeImageFileForUpload = {
          uri: basicInfo.imageUrl,
          name: `recipeImage_${Date.now()}.${basicInfo.imageUrl.split('.').pop() || 'jpg'}`,
          type: `image/${basicInfo.imageUrl.split('.').pop() || 'jpeg'}`,
        };
      }

      const stepImageFilesForUpload: any[] = [];
      stepsFromForm.forEach((step) => {
        if (step.imageUrl && step.imageUrl.startsWith('file://')) {
          stepImageFilesForUpload.push({
            uri: step.imageUrl,
            name: `step_${step.id || Date.now()}_${step.stepOrder}.${step.imageUrl.split('.').pop() || 'jpg'}`,
            type: `image/${step.imageUrl.split('.').pop() || 'jpeg'}`,
          });
        }
      });

      const payloadForBackend: ClientCreateRecipePayload = {
        name: basicInfo.name || '',
        description: basicInfo.description,
        protein: basicInfo.protein,
        fat: basicInfo.fat,
        calories: basicInfo.calories,
        carbohydrates: basicInfo.carbohydrates,
        preparationTimeMinutes: basicInfo.preparationTimeMinutes,
        videoUrl: basicInfo.videoUrl,
        hasNewRecipeImageFile: !!recipeImageFileForUpload,
        status: basicInfo.status || RecipeStatus.DRAFT,
        categoryIds: categoriesFromForm.map((cat) => cat.id),
        ingredients: ingredientsFromForm.map((ing) => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unitId: ing.unitId,
        })),
        steps: stepsFromForm.map((step) => ({
          stepOrder: step.stepOrder,
          instruction: step.instruction,
          imageUrl: step.imageUrl && !step.imageUrl.startsWith('file://') ? step.imageUrl : null,
          hasNewImageFile: !!(step.imageUrl && step.imageUrl.startsWith('file://')),
        })),
        recipeImageFile: recipeImageFileForUpload,
        stepImageFiles: stepImageFilesForUpload,
      };

      let savedRecipe: Recipe;
      if (currentRecipe && currentRecipe.id) {
        payloadForBackend.id = currentRecipe.id;
        savedRecipe = await updateRecipeWithDetails(payloadForBackend);
      } else {
        savedRecipe = await createRecipeWithDetails(payloadForBackend);
      }

      resetForm();
      return savedRecipe;
    } catch (error) {
      console.error('Error in saveRecipe (context):', error);
      throw error;
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  // Thêm hàm mới createRecipeForUser để phân biệt với admin
  const createRecipeForUser = async (payload: ClientCreateRecipePayload): Promise<Recipe> => {
    try {
      setIsLoadingRecipes(true);
      const formData = new FormData();

      // 1. Append các trường thông thường
      formData.append('name', payload.name);
      formData.append('description', payload.description || '');
      formData.append('status', payload.status);
      
      // Only append hasNewRecipeImageFile if it's true
      if (payload.hasNewRecipeImageFile) {
        formData.append('hasNewRecipeImageFile', 'true');
      }

      if (payload.categoryIds && payload.categoryIds.length > 0) {
        payload.categoryIds.forEach((id) => {
          formData.append('categoryIds[]', id.toString());
        });
      }

      if (payload.ingredients && payload.ingredients.length > 0) {
        payload.ingredients.forEach((ing, index) => {
          formData.append(`ingredients[${index}][ingredientId]`, ing.ingredientId);
          if (ing.quantity !== null && ing.quantity !== undefined) {
            formData.append(`ingredients[${index}][quantity]`, ing.quantity.toString());
          }
          if (ing.unitId !== null && ing.unitId !== undefined) {
            formData.append(`ingredients[${index}][unitId]`, ing.unitId.toString());
          }
        });
      }

      if (payload.steps && payload.steps.length > 0) {
        payload.steps.forEach((step, index) => {
          formData.append(`steps[${index}][stepOrder]`, step.stepOrder.toString());
          formData.append(`steps[${index}][instruction]`, step.instruction);
          if (step.imageUrl !== null && step.imageUrl !== undefined) {
            formData.append(`steps[${index}][imageUrl]`, step.imageUrl);
          }
          // Only append hasNewImageFile if it's true
          if (step.hasNewImageFile) {
            formData.append(`steps[${index}][hasNewImageFile]`, 'true');
          }
        });
      }

      // Append nutrition info only if they are not null/undefined
      if (payload.protein !== null && payload.protein !== undefined) {
        formData.append('protein', payload.protein.toString());
      }
      if (payload.fat !== null && payload.fat !== undefined) {
        formData.append('fat', payload.fat.toString());
      }
      if (payload.calories !== null && payload.calories !== undefined) {
        formData.append('calories', payload.calories.toString());
      }
      if (payload.carbohydrates !== null && payload.carbohydrates !== undefined) {
        formData.append('carbohydrates', payload.carbohydrates.toString());
      }
      if (payload.preparationTimeMinutes !== null && payload.preparationTimeMinutes !== undefined) {
        formData.append('preparationTimeMinutes', payload.preparationTimeMinutes.toString());
      }
      if (payload.videoUrl) {
        formData.append('videoUrl', payload.videoUrl);
      }

      // Append image files if they exist
      if (payload.recipeImageFile) {
        formData.append('images', payload.recipeImageFile as any);
      }

      if (payload.stepImageFiles && payload.stepImageFiles.length > 0) {
        payload.stepImageFiles.forEach((file) => {
          if (file) {
            formData.append('images', file as any);
          }
        });
      }

      console.log("FORMDATA SEND FOR USER", formData);
      // Gọi API endpoint dành cho user thường
      const response = await api.post('/recipes/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newRecipe = response.data.data as Recipe;
      setRecipes((prev) => [newRecipe, ...prev]);
      return newRecipe;
    } catch (error: any) {
      console.error('Error creating recipe as user:', error.response?.data || error.message, error.config);
      const apiError = error.response?.data;
      if (apiError && apiError.message) {
        if (Array.isArray(apiError.message)) {
          throw new Error(apiError.message.join(', '));
        }
        throw new Error(apiError.message);
      }
      throw new Error('Không thể tạo công thức từ context (user)');
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  // Thêm hàm updateRecipeForUser tương tự như updateRecipeWithDetails nhưng dành cho user thường
  const updateRecipeForUser = async (payload: ClientCreateRecipePayload): Promise<Recipe> => {
    try {
      setIsLoadingRecipes(true);
      const formData = new FormData();

      // Đảm bảo có ID
      if (!payload.id) {
        throw new Error('ID công thức là bắt buộc cho việc cập nhật');
      }
      
      // 1. Append các trường thông thường
      formData.append('id', payload.id);
      formData.append('name', payload.name);
      formData.append('description', payload.description || '');
      formData.append('status', payload.status);
      
      // Only append hasNewRecipeImageFile if it's true
      if (payload.hasNewRecipeImageFile) {
        formData.append('hasNewRecipeImageFile', 'true');
      }

      if (payload.categoryIds && payload.categoryIds.length > 0) {
        payload.categoryIds.forEach((id) => {
          formData.append('categoryIds[]', id.toString());
        });
      }

      if (payload.ingredients && payload.ingredients.length > 0) {
        payload.ingredients.forEach((ing, index) => {
          formData.append(`ingredients[${index}][ingredientId]`, ing.ingredientId);
          if (ing.quantity !== null && ing.quantity !== undefined) {
            formData.append(`ingredients[${index}][quantity]`, ing.quantity.toString());
          }
          if (ing.unitId !== null && ing.unitId !== undefined) {
            formData.append(`ingredients[${index}][unitId]`, ing.unitId.toString());
          }
        });
      }

      if (payload.steps && payload.steps.length > 0) {
        payload.steps.forEach((step, index) => {
          formData.append(`steps[${index}][stepOrder]`, step.stepOrder.toString());
          formData.append(`steps[${index}][instruction]`, step.instruction);
          if (step.imageUrl !== null && step.imageUrl !== undefined) {
            formData.append(`steps[${index}][imageUrl]`, step.imageUrl);
          }
          // Only append hasNewImageFile if it's true
          if (step.hasNewImageFile) {
            formData.append(`steps[${index}][hasNewImageFile]`, 'true');
          }
        });
      }

      // Append nutrition info only if they are not null/undefined
      if (payload.protein !== null && payload.protein !== undefined) {
        formData.append('protein', payload.protein.toString());
      }
      if (payload.fat !== null && payload.fat !== undefined) {
        formData.append('fat', payload.fat.toString());
      }
      if (payload.calories !== null && payload.calories !== undefined) {
        formData.append('calories', payload.calories.toString());
      }
      if (payload.carbohydrates !== null && payload.carbohydrates !== undefined) {
        formData.append('carbohydrates', payload.carbohydrates.toString());
      }
      if (payload.preparationTimeMinutes !== null && payload.preparationTimeMinutes !== undefined) {
        formData.append('preparationTimeMinutes', payload.preparationTimeMinutes.toString());
      }
      if (payload.videoUrl) {
        formData.append('videoUrl', payload.videoUrl);
      }

      // Append image files if they exist
      if (payload.recipeImageFile) {
        formData.append('images', payload.recipeImageFile as any);
      }

      if (payload.stepImageFiles && payload.stepImageFiles.length > 0) {
        payload.stepImageFiles.forEach((file) => {
          if (file) {
            formData.append('images', file as any);
          }
        });
      }

      console.log("FORMDATA SEND FOR USER UPDATE", formData);
      // Gọi API endpoint dành cho user thường
      const response = await api.put('/recipes/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedRecipe = response.data.data as Recipe;
      setRecipes((prev) => prev.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      ));
      return updatedRecipe;
    } catch (error: any) {
      console.error('Error updating recipe as user:', error.response?.data || error.message, error.config);
      const apiError = error.response?.data;
      if (apiError && apiError.message) {
        if (Array.isArray(apiError.message)) {
          throw new Error(apiError.message.join(', '));
        }
        throw new Error(apiError.message);
      }
      throw new Error('Không thể cập nhật công thức từ context (user)');
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  // Giá trị context
  const value = {
    // State
    recipes,
    recipeCategories,
    ingredients,
    ingredientCategories,
    unitsOfMeasure,
    ingredientCategoryFilters,

    // Loading states
    isLoadingRecipes,
    isLoadingCategories,
    isLoadingIngredients,

    // Recipe CRUD
    getRecipe,
    updateRecipe,
    deleteRecipe,
    publicRecipe,
    createRecipeForUser,
    updateRecipeForUser,

    // Recipe Category CRUD
    getRecipeCategories,
    createRecipeCategory,
    updateRecipeCategory,
    deleteRecipeCategory,

    // Ingredient CRUD
    getIngredients,
    createIngredient,
    updateIngredient,
    deleteIngredient,

    // Ingredient Category CRUD
    getIngredientCategories,
    createIngredientCategory,
    updateIngredientCategory,
    deleteIngredientCategory,
    updateIngredientCategoryFilters,

    // Recipe Ingredients
    addIngredientToRecipe,
    updateRecipeIngredient,
    removeIngredientFromRecipe,

    // Cooking Steps
    addCookingStep,
    updateCookingStep,
    deleteCookingStep,
    reorderCookingSteps,

    // Units of Measure
    getUnitsOfMeasure,

    // Form state
    currentRecipe,
    setCurrentRecipe,

    // Recipe form
    recipeForm,

    // Form actions
    updateBasicInfo,
    updateCategories,
    updateIngredients,
    updateSteps,
    resetForm,
    saveRecipe,
  };

  return (
    <FoodManagementContext.Provider value={value}>
      {children}
    </FoodManagementContext.Provider>
  );
};

// Hook để sử dụng context
export const useFoodManagement = () => {
  const context = useContext(FoodManagementContext);
  if (context === undefined) {
    throw new Error(
      'useFoodManagement must be used within a FoodManagementProvider'
    );
  }
  return context;
};
