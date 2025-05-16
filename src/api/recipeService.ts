import { IngredientDTO, Recipe, RecipeIngredient, RecipeSearchResult, Unit } from '../types/recipe';

const MATCH_THRESHOLD = 0.8; // 80% match required
const QUANTITY_TOLERANCE = 0.2; // 20% quantity tolerance

export const searchRecipesByIngredients = async (
  ingredients: IngredientDTO[]
): Promise<RecipeSearchResult[]> => {
  try {
    // TODO: Replace with actual API call
    const response = await fetch('/api/recipes/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
      throw new Error('Failed to search recipes');
    }

    const recipes: Recipe[] = await response.json();
    return calculateRecipeMatches(recipes, ingredients);
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

const calculateRecipeMatches = (
  recipes: Recipe[],
  searchIngredients: IngredientDTO[]
): RecipeSearchResult[] => {
  const results: RecipeSearchResult[] = recipes.map(recipe => {
    const matchedIngredients: RecipeIngredient[] = [];
    let matchCount = 0;

    recipe.ingredients.forEach(recipeIngredient => {
      const searchIngredient = searchIngredients.find(
        si => si.id === recipeIngredient.ingredientId
      );

      if (searchIngredient) {
        const isUnitMatch = recipeIngredient.unitId === Number(searchIngredient.unit);
        const quantityDiff = Math.abs(
          recipeIngredient.quantity - searchIngredient.quantity
        );
        const isQuantityMatch =
          quantityDiff <= recipeIngredient.quantity * QUANTITY_TOLERANCE;

        if (isUnitMatch && isQuantityMatch) {
          matchCount++;
          matchedIngredients.push({ ...recipeIngredient, isMatched: true });
        } else {
          matchedIngredients.push({ ...recipeIngredient, isMatched: false });
        }
      } else {
        matchedIngredients.push({ ...recipeIngredient, isMatched: false });
      }
    });

    const matchPercentage = matchCount / recipe.ingredients.length;

    return {
      recipe: {
        ...recipe,
        ingredients: matchedIngredients,
      },
      matchPercentage,
      matchedIngredients: matchedIngredients.filter(i => i.isMatched),
    };
  });

  // Filter recipes that meet the threshold and sort by match percentage
  return results
    .filter(result => result.matchPercentage >= MATCH_THRESHOLD)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}; 