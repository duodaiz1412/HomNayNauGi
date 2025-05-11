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
} from '../types/index';

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
  createRecipe: (recipe: Partial<Recipe>) => Promise<Recipe>;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => Promise<Recipe>;
  deleteRecipe: (id: string) => Promise<boolean>;
  publicRecipe: (id: string) => Promise<Recipe>;

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

  const createRecipe = async (recipe: Partial<Recipe>): Promise<Recipe> => {
    try {
      // Giả lập API call
      const newRecipe: Recipe = {
        id: `recipe-${Date.now()}`, // Giả lập UUID
        accountId: 'current-user-id', // Giả lập user ID
        name: recipe.name || 'Untitled Recipe',
        description: recipe.description || null,
        protein: recipe.protein || null,
        fat: recipe.fat || null,
        calories: recipe.calories || null,
        carbohydrates: recipe.carbohydrates || null,
        imageUrl: recipe.imageUrl || null,
        preparationTimeMinutes: recipe.preparationTimeMinutes || null,
        videoUrl: recipe.videoUrl || null,
        status: recipe.status || RecipeStatus.DRAFT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setRecipes([...recipes, newRecipe]);
      return newRecipe;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
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
        { id: 1, unitName: 'Gram', symbol: 'g' },
        { id: 2, unitName: 'Milliliter', symbol: 'ml' },
        { id: 3, unitName: 'Piece', symbol: 'pcs' },
        { id: 4, unitName: 'Tablespoon', symbol: 'tbsp' },
        { id: 5, unitName: 'Teaspoon', symbol: 'tsp' },
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
    setRecipeForm({
      ...recipeForm,
      basicInfo: {
        ...recipeForm.basicInfo,
        ...info,
      },
    });
  };

  const updateCategories = (categories: RecipeCategory[]) => {
    setRecipeForm({
      ...recipeForm,
      categories,
    });
  };

  const updateIngredients = (ingredients: RecipeIngredient[]) => {
    setRecipeForm({
      ...recipeForm,
      ingredients,
    });
  };

  const updateSteps = (steps: CookingStep[]) => {
    setRecipeForm({
      ...recipeForm,
      steps,
    });
  };

  const resetForm = () => {
    setRecipeForm({
      basicInfo: { ...defaultRecipeForm.basicInfo },
      categories: [],
      ingredients: [],
      steps: [],
    });
  };

  const saveRecipe = async (): Promise<Recipe> => {
    try {
      // Tạo hoặc cập nhật công thức
      let recipe: Recipe;

      if (currentRecipe) {
        // Cập nhật công thức hiện có
        recipe = await updateRecipe(currentRecipe.id, recipeForm.basicInfo);
      } else {
        // Tạo công thức mới
        recipe = await createRecipe(recipeForm.basicInfo);
      }

      // Cập nhật danh mục
      // Trong thực tế, bạn sẽ gọi API để cập nhật danh mục

      // Cập nhật nguyên liệu
      // Trong thực tế, bạn sẽ gọi API để cập nhật nguyên liệu

      // Cập nhật các bước nấu ăn
      // Trong thực tế, bạn sẽ gọi API để cập nhật các bước

      return recipe;
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw error;
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
    createRecipe,
    updateRecipe,
    deleteRecipe,
    publicRecipe,

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
