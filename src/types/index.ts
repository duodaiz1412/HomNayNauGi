export interface Dish {
  id: string;
  name: string;
  description: string;
  time: string;
  image: string;
  author: string;
  authorAvatar: string;
  isFavorite: boolean;
  nutrition: {
    carbs: string;
    protein: string;
    calories: string;
    fat: string;
  };
  ingredients: Array<{
    name: string;
    amount: string;
    image: string;
  }>;
  steps: Array<{
    step: number;
    description: string;
    video: string;
  }>;
}

export interface Ingredient {
  id: string;
  name: string;
  imageUrl: string;
  backgroundColor?: string;
}


