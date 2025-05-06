export interface Dish {
  id: string;
  name: string;
  imageUrl: string;
  ingredients: string[];
  time: string;
}

export interface Ingredient {
  id: string;
  name: string;
  imageUrl: string;
  backgroundColor?: string;
}
