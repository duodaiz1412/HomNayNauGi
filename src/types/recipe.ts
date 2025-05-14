export enum Unit {
  GRAM = 'gr',
  KILOGRAM = 'kg',
  MILLILIT = 'ml',
  LIT = 'l',
  CAI = 'cái',
  THIA_CA_PHE = 'thìa cà phê',
  THIA_CANH = 'thìa canh'
}

export interface IngredientDTO {
  id: string;
  quantity: number;
  unit: Unit;
}

export interface RecipeIngredient {
  recipeId: string;
  ingredientId: string;
  quantity: number;
  unitId: number; // 1-7 tương ứng với các đơn vị trong enum Unit
  isMatched?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  instructions: string;
  ingredients: RecipeIngredient[];
}

export interface RecipeSearchResult {
  recipe: {
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
    account?: {
      name: string;
      userProfile?: {
        avatarUrl?: string;
        displayName?: string;
        fullName?: string;
      };
    };
  };
  matchPercentage: number;
  matchedIngredients: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    isMatched: boolean;
  }[];
} 