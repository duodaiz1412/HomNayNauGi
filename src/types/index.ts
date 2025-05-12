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
  PRIVATE = 'private',
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
  status: AccountStatus
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

// Interface cho hồ sơ người dùng
export interface UserProfile {
  id: number
  accountId: string
  email: string
  phoneNumber: string | null
  displayName: string | null
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

// Interface cho nguyên liệu trong công thức
export interface RecipeIngredient {
  recipeId: string
  ingredientId: string
  quantity: number | null
  unitId: number | null

  // Thông tin bổ sung (không có trong DB)
  ingredient?: Ingredient
  unit?: UnitOfMeasure
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
  id: string // UUID
  accountId: string | null
  name: string
  description: string | null
  protein: number | null
  fat: number | null
  calories: number | null
  carbohydrates: number | null
  imageUrl: string | null
  preparationTimeMinutes: number | null
  videoUrl: string | null
  status: RecipeStatus
  createdAt: string
  updatedAt: string

  // Các quan hệ (không có trong DB)
  categories?: RecipeCategory[]
  ingredients?: RecipeIngredient[]
  steps?: CookingStep[]
  likeCount?: number
  isLiked?: boolean
  isFavorite?: boolean
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
