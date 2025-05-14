// Định nghĩa các kiểu dữ liệu dựa trên cấu trúc cơ sở dữ liệu

// Enum cho trạng thái tài khoản
export enum AccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING_VERIFICATION = "pending_verification",
  BANNED = "banned",
}

// Enum cho trạng thái công thức
export enum RecipeStatus {
  PUBLIC = "public",
  PRIVATE = "private",
  PENDING_APPROVAL = "pending_approval",
  REJECTED = "rejected",
  DRAFT = "draft",
}

// Interface cho vai trò
export interface Role {
  id: number
  name: string
}

// Interface cho tài khoản
export interface Account {
  id: string // UUID
  username: string
  name: string
  email: string
  status: AccountStatus
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  avatar: string | null
  userProfile: UserProfile | null
}

// Interface cho hồ sơ người dùng
export interface UserProfile {
  id: number
  accountId: string
  email: string
  phoneNumber: string | null
  displayName?: string
  avatarUrl: string | null
  fullName: string | null
  address: string | null
  createdAt: string
  updatedAt: string
}

// Interface cho vai trò của tài khoản
export interface AccountRole {
  id: number
  accountId: string
  roleId: number
  assignedAt: string
  isActive: boolean
}

// Interface cho danh mục công thức
export interface RecipeCategory {
  id: number
  name: string
  imageUrl: string | null
}

// Interface cho danh mục nguyên liệu
export interface IngredientCategory {
  id: number
  name: string
  imageUrl: string | null
}

// Interface cho nguyên liệu
export interface Ingredient {
  id: string // UUID
  name: string
  imageUrl: string | null
  categories?: IngredientCategory[] // Quan hệ nhiều-nhiều
}

// Interface cho đơn vị đo lường
export interface UnitOfMeasure {
  id: number
  unitName: string
  symbol: string | null
}

// Interface cho ánh xạ danh mục công thức
export interface RecipeCategoryMapping {
  recipeId: string
  recipeCategoryId: number
  recipeCategory: RecipeCategory
  createdAt: string
  updatedAt: string
}

// Interface cho nguyên liệu trong công thức
export interface RecipeIngredient {
  recipeId: string
  ingredientId: string
  quantity: number | null
  unitId: number | null
  ingredient: Ingredient
  unit: UnitOfMeasure | null
}

// Interface cho bước nấu ăn
export interface CookingStep {
  id: number
  recipeId: string
  stepOrder: number
  instruction: string
  imageUrl: string | null
}

// Interface cho công thức
export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    isMatched: boolean;
  }[];
}

// Interface cho chi tiết công thức (dùng cho màn hình chi tiết)
export interface RecipeDetailTypes extends Recipe {
  isFavorite: boolean;
  isLiked: boolean;
  totalViews: number;
  totalLikes: number;
  totalFavorites: number;
  preparationTimeMinutes: number;
  protein: number;
  fat: number;
  calories: number;
  carbohydrates: number;
  account?: {
    name: string;
    userProfile?: {
      avatarUrl?: string;
      displayName?: string;
      fullName?: string;
    };
  };
  recipeIngredients?: {
    ingredient: {
      id: string;
      name: string;
      imageUrl: string;
    };
    quantity: number;
    unit?: {
      unitName: string;
    };
  }[];
  cookingSteps?: {
    id: number;
    stepOrder: number;
    instruction: string;
    imageUrl?: string;
  }[];
}

// Interface cho lượt thích công thức
export interface RecipeLike {
  accountId: string
  recipeId: string
  likedAt: string
}

// Interface cho công thức yêu thích
export interface FavoriteRecipe {
  accountId: string
  recipeId: string
  savedAt: string
}

// Interface cho lịch sử xem
export interface ViewHistory {
  id: number
  accountId: string | null
  recipeId: string
  viewedAt: string
}

// Enum cho unit
export enum Unit {
  GRAM = 1,
  KILOGRAM = 2,
  MILLILIT = 3,
  LIT = 4,
  CAI = 5,
  THIA_CA_PHE = 6,
  THIA_CANH = 7
}


// Interface cho nguyên liệu trong tủ bếp
export interface AccountPantryItem {
  accountId: string
  ingredientId: string
  addedAt: string
}

export interface ClientCreateRecipePayload {
  id?: string; // Optional id for update operation
  name: string;
  description?: string;
  protein?: number;
  fat?: number;
  calories?: number;
  carbohydrates?: number;
  preparationTimeMinutes?: number;
  videoUrl?: string;
  hasNewRecipeImageFile?: boolean;
  status: RecipeStatus;
  categoryIds: number[];
  ingredients: {
    ingredientId: string;
    quantity?: number;
    unitId?: number;
  }[];
  steps: {
    stepOrder: number;
    instruction: string;
    imageUrl?: string | null;
    hasNewImageFile?: boolean;
  }[];
  recipeImageFile?: any;
  stepImageFiles?: any[];
}

// Interface cho dữ liệu trả về từ API tìm công thức
export interface RecipeResponse {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  preparationTimeMinutes: number;
  account: {
    username: string;
    userProfile: {
      fullName?: string;
      avatarUrl?: string;
    };
  };
  ingredients: {
    id: string;
    name: string;
    quantity: string;
    unit: string;
    isMatched: boolean;
  }[];
}

export interface FindRecipesResponse {
  data: Recipe[];
  total: number;
}

// Interface cho ingredient search
export interface IngredientSearch {
  id: string;
}
