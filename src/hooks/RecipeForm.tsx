
import { useState, useEffect } from "react"
import { useFoodManagement } from "src/context/FoodManagementContext"
import { RecipeStatus } from "src/types"

interface UseRecipeFormProps {
  recipeId?: string // Nếu có, sẽ tải dữ liệu công thức hiện có
}

export const useRecipeForm = ({ recipeId }: UseRecipeFormProps = {}) => {
  const {
    getRecipe,
    recipeCategories,
    ingredients,
    unitsOfMeasure,
    updateBasicInfo,
    updateCategories,
    updateIngredients,
    updateSteps,
    resetForm,
    saveRecipe,
    recipeForm,
    setCurrentRecipe,
  } = useFoodManagement()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Tải dữ liệu công thức nếu đang chỉnh sửa
  useEffect(() => {
    const loadRecipe = async () => {
      if (!recipeId) {
        resetForm()
        setCurrentRecipe(null)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const recipe = await getRecipe(recipeId)
        if (!recipe) {
          setError("Recipe not found")
          return
        }

        // Cập nhật form với dữ liệu công thức
        updateBasicInfo({
          name: recipe.name,
          description: recipe.description,
          protein: recipe.protein,
          fat: recipe.fat,
          calories: recipe.calories,
          carbohydrates: recipe.carbohydrates,
          imageUrl: recipe.imageUrl,
          preparationTimeMinutes: recipe.preparationTimeMinutes,
          videoUrl: recipe.videoUrl,
          status: recipe.status,
        })

        // Cập nhật danh mục
        if (recipe.categories) {
          updateCategories(recipe.categories)
        }

        // Cập nhật nguyên liệu
        if (recipe.ingredients) {
          updateIngredients(recipe.ingredients)
        }

        // Cập nhật các bước
        if (recipe.steps) {
          updateSteps(recipe.steps)
        }

        // Lưu công thức hiện tại
        setCurrentRecipe(recipe)
      } catch (err) {
        setError("Failed to load recipe")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipe()
  }, [recipeId])

  // Xử lý lưu form
  const handleSave = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Validate form
      if (!recipeForm.basicInfo.name) {
        setError("Recipe name is required")
        return null
      }

      // Lưu công thức
      const savedRecipe = await saveRecipe()
      return savedRecipe
    } catch (err) {
      setError("Failed to save recipe")
      console.error(err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Xử lý xuất bản
  const handlePublic = async () => {
    try {
      // Đầu tiên lưu công thức
      const savedRecipe = await handleSave()
      if (!savedRecipe) return null

      // Sau đó xuất bản
      updateBasicInfo({ status: RecipeStatus.PUBLIC })
      return await saveRecipe()
    } catch (err) {
      setError("Failed to public recipe")
      console.error(err)
      return null
    }
  }

  return {
    form: recipeForm,
    isLoading,
    error,
    isEditing: !!recipeId,

    // Form actions
    updateBasicInfo,
    updateCategories,
    updateIngredients,
    updateSteps,
    resetForm,

    // Save actions
    handleSave,
    handlePublic,

    // Reference data
    availableCategories: recipeCategories,
    availableIngredients: ingredients,
    availableUnits: unitsOfMeasure,
  }
}
