import { useState, useEffect } from 'react';
import { useFoodManagement } from 'src/context/FoodManagementContext';
import { Recipe, RecipeStatus } from 'src/types';
import api from 'src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosResponse } from 'axios';

interface UseRecipeFormProps {
  recipeId?: string; // Nếu có, sẽ tải dữ liệu công thức hiện có
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
    createRecipeForUser,
    updateRecipeForUser,
    recipeForm,
    setCurrentRecipe,
  } = useFoodManagement();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tải dữ liệu công thức nếu đang chỉnh sửa
  useEffect(() => {
    const loadRecipe = async () => {
      if (!recipeId) {
        // Reset form khi không có recipeId (trường hợp Add)
        resetForm();
        setCurrentRecipe(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const role = await AsyncStorage.getItem('accountRole');
        let response;

        if (role === 'admin') {
          response = await api.get(`/admin/recipes/get-recipe/${recipeId}`);
        } else {
          response = await api.get(`/recipes/get-recipe/${recipeId}`);
        }

        const recipe = response.data;
        console.log('\nRECIPE GET', recipe);
        if (!recipe) {
          setError('Không tìm thấy công thức');
          return;
        }
        const preparedBasicInfo: Partial<Recipe> = {
          name: recipe.name,
          description: recipe.description,
          // Quan trọng: Chuyển đổi kiểu nếu cần (ví dụ: API trả về string cho number)
          protein:
            recipe.protein === null || recipe.protein === undefined
              ? null
              : parseFloat(recipe.protein as any),
          fat:
            recipe.fat === null || recipe.fat === undefined
              ? null
              : parseFloat(recipe.fat as any),
          calories:
            recipe.calories === null || recipe.calories === undefined
              ? null
              : parseInt(recipe.calories as any, 10),
          carbohydrates:
            recipe.carbohydrates === null || recipe.carbohydrates === undefined
              ? null
              : parseFloat(recipe.carbohydrates as any),
          imageUrl: recipe.imageUrl,
          preparationTimeMinutes:
            recipe.preparationTimeMinutes === null ||
            recipe.preparationTimeMinutes === undefined
              ? null
              : parseInt(recipe.preparationTimeMinutes as any, 10),
          videoUrl: recipe.videoUrl,
          status: recipe.status, // Giả sử recipe.status đã đúng kiểu RecipeStatus
        };
        updateBasicInfo(preparedBasicInfo);

        // Cập nhật danh mục
        if (recipe.categoryMappings) {
          updateCategories(
            recipe.categoryMappings.map((mapping) => mapping.recipeCategory)
          );
        }

        // Cập nhật nguyên liệu
        if (recipe.recipeIngredients) {
          updateIngredients(recipe.recipeIngredients);
        }

        // Cập nhật các bước
        if (recipe.cookingSteps) {
          updateSteps(recipe.cookingSteps);
        }

        // Lưu công thức hiện tại
        setCurrentRecipe(recipe);
      } catch (err) {
        setError('Không thể tải thông tin công thức');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [recipeId]);

  // Xử lý lưu form
  const handleSave = async (): Promise<Recipe | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { basicInfo, categories, ingredients, steps } = recipeForm;

      // --- VALIDATION CƠ BẢN (luôn thực hiện) ---
      if (!basicInfo.name || basicInfo.name.trim() === '') {
        setError('Tên món ăn là bắt buộc.');
        setIsLoading(false); // Quan trọng: reset loading
        return null;
      }
      if (!categories || categories.length === 0) {
        setError('Vui lòng chọn ít nhất một danh mục.'); // Áp dụng cho cả nháp
        setIsLoading(false);
        return null;
      }
      const hasInvalidIngredientForDraft = ingredients.some(
        (ing) =>
          !ing.ingredientId || // Chưa chọn nguyên liệu
          ing.quantity == null ||
          ing.quantity <= 0 || // Chưa nhập số lượng
          !ing.unitId // Chưa chọn đơn vị
      );
      if (hasInvalidIngredientForDraft) {
        setError('Mỗi nguyên liệu cần có tên, số lượng và đơn vị.');
        setIsLoading(false);
        return null;
      }
      if (!steps || steps.length === 0) {
        setError('Vui lòng thêm ít nhất một bước nấu ăn.'); // Áp dụng cho cả nháp
        setIsLoading(false);
        return null;
      }
      // Kiểm tra chi tiết hơn cho steps nếu cần (ví dụ: instruction)
      // Ví dụ:
      const hasEmptyStepInstructionForDraft = steps.some(
        (step) => !step.instruction || step.instruction.trim() === ''
      );
      if (hasEmptyStepInstructionForDraft) {
        setError('Vui lòng điền mô tả cho tất cả các bước nấu ăn.');
        setIsLoading(false);
        return null;
      }
      // --- VALIDATION CHI TIẾT KHI STATUS LÀ PUBLISHED ---
      if (basicInfo.status && basicInfo.status === RecipeStatus.PUBLIC) {
        if (!basicInfo.description || basicInfo.description.trim() === '') {
          setError('Mô tả món ăn là bắt buộc khi công khai.');
          setIsLoading(false);
          return null;
        }
        if (!categories || categories.length === 0) {
          setError('Vui lòng chọn ít nhất một danh mục khi công khai.');
          setIsLoading(false);
          return null;
        }

        // === KIỂM TRA ẢNH CHÍNH ===
        if (!basicInfo.imageUrl) {
          // basicInfo.imageUrl sẽ là URI từ ImagePicker
          setError('Hình ảnh món ăn là bắt buộc khi công khai.');
          setIsLoading(false);
          return null;
        }
        // Bạn có thể muốn kiểm tra sâu hơn, ví dụ: basicInfo.imageUrl phải là 'file://' nếu là tạo mới
        // hoặc phải là một URL http/https nếu là sửa và không thay đổi ảnh.
        // Hiện tại, chỉ cần có giá trị là đủ cho bước này.

        if (
          basicInfo.protein === null ||
          basicInfo.protein === undefined ||
          basicInfo.fat === null ||
          basicInfo.fat === undefined ||
          basicInfo.carbohydrates === null ||
          basicInfo.carbohydrates === undefined ||
          basicInfo.calories === null ||
          basicInfo.calories === undefined
        ) {
          setError(
            'Vui lòng điền đầy đủ thông tin dinh dưỡng (Protein, Fat, Carb, Calories) khi công khai.'
          );
          setIsLoading(false);
          return null;
        }
        if (!ingredients || ingredients.length === 0) {
          setError('Vui lòng thêm ít nhất một nguyên liệu khi công khai.');
          setIsLoading(false);
          return null;
        }
        const hasEmptyIngredientQuantity = ingredients.some(
          (ing) =>
            ing.quantity === null ||
            ing.quantity === undefined ||
            ing.quantity <= 0 ||
            !ing.unitId
        );
        if (hasEmptyIngredientQuantity) {
          setError(
            'Vui lòng điền đầy đủ số lượng và đơn vị cho tất cả nguyên liệu khi công khai.'
          );
          setIsLoading(false);
          return null;
        }
        if (!steps || steps.length < 3) {
          setError('Vui lòng thêm ít nhất 3 bước nấu ăn khi công khai.');
          setIsLoading(false);
          return null;
        }
        const hasEmptyStepInstruction = steps.some(
          (step) => !step.instruction || step.instruction.trim() === ''
        );
        if (hasEmptyStepInstruction) {
          setError(
            'Vui lòng điền đầy đủ mô tả cho tất cả các bước nấu ăn khi công khai.'
          );
          setIsLoading(false);
          return null;
        }

        // === KIỂM TRA ẢNH CHO CÁC BƯỚC (TÙY CHỌN, tùy theo yêu cầu của bạn) ===
        // Nếu bạn yêu cầu TẤT CẢ các bước phải có ảnh khi công khai:
        /*
        const allStepsHaveImages = steps.every(
          (step) => step.imageUrl && step.imageUrl.trim() !== ""
        );
        if (!allStepsHaveImages) {
          setError("Vui lòng cung cấp hình ảnh cho tất cả các bước nấu ăn khi công khai.");
          setIsLoading(false);
          return null;
        }
        */
        // Hoặc, nếu bạn chỉ yêu cầu ÍT NHẤT MỘT bước có ảnh, hoặc không yêu cầu ảnh step:
        // Thì không cần thêm kiểm tra này, hoặc điều chỉnh cho phù hợp.
        // Hiện tại, tôi sẽ không thêm kiểm tra bắt buộc ảnh cho từng step,
        // bạn có thể thêm nếu cần.
      }

      const savedRecipeData = await saveRecipe(); // Gọi hàm saveRecipe từ context
      setIsLoading(true);
      setError(null);
      return savedRecipeData; // Trả về công thức đã lưu (hoặc null nếu saveRecipe thất bại)
    } catch (err: any) {
      setError(err.message || 'Không thể lưu món ăn. Đã có lỗi xảy ra.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm tương tự handleSave nhưng gọi createRecipeForUser thay vì saveRecipe
  const handleSaveForUser = async (): Promise<Recipe | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { basicInfo, categories, ingredients, steps } = recipeForm;

      // Thực hiện validation tương tự như handleSave
      // (copy phần validation từ handleSave nếu cần thiết)

      // --- VALIDATION CƠ BẢN (luôn thực hiện) ---
      if (!basicInfo.name || basicInfo.name.trim() === '') {
        setError('Tên món ăn là bắt buộc.');
        setIsLoading(false); // Quan trọng: reset loading
        return null;
      }
      if (!categories || categories.length === 0) {
        setError('Vui lòng chọn ít nhất một danh mục.'); // Áp dụng cho cả nháp
        setIsLoading(false);
        return null;
      }
      const hasInvalidIngredientForDraft = ingredients.some(
        (ing) =>
          !ing.ingredientId || // Chưa chọn nguyên liệu
          ing.quantity == null ||
          ing.quantity <= 0 || // Chưa nhập số lượng
          !ing.unitId // Chưa chọn đơn vị
      );
      if (hasInvalidIngredientForDraft) {
        setError('Mỗi nguyên liệu cần có tên, số lượng và đơn vị.');
        setIsLoading(false);
        return null;
      }
      if (!steps || steps.length === 0) {
        setError('Vui lòng thêm ít nhất một bước nấu ăn.'); // Áp dụng cho cả nháp
        setIsLoading(false);
        return null;
      }
      // Kiểm tra chi tiết hơn cho steps nếu cần (ví dụ: instruction)
      // Ví dụ:
      const hasEmptyStepInstructionForDraft = steps.some(
        (step) => !step.instruction || step.instruction.trim() === ''
      );
      if (hasEmptyStepInstructionForDraft) {
        setError('Vui lòng điền mô tả cho tất cả các bước nấu ăn.');
        setIsLoading(false);
        return null;
      }
      // --- VALIDATION CHI TIẾT KHI STATUS LÀ PUBLISHED ---
      if (basicInfo.status === RecipeStatus.PUBLIC) {
        if (!basicInfo.description || basicInfo.description.trim() === '') {
          setError('Mô tả món ăn là bắt buộc khi công khai.');
          setIsLoading(false);
          return null;
        }
        if (!categories || categories.length === 0) {
          setError('Vui lòng chọn ít nhất một danh mục khi công khai.');
          setIsLoading(false);
          return null;
        }

        // === KIỂM TRA ẢNH CHÍNH ===
        if (!basicInfo.imageUrl) {
          // basicInfo.imageUrl sẽ là URI từ ImagePicker
          setError('Hình ảnh món ăn là bắt buộc khi công khai.');
          setIsLoading(false);
          return null;
        }
        // Bạn có thể muốn kiểm tra sâu hơn, ví dụ: basicInfo.imageUrl phải là 'file://' nếu là tạo mới
        // hoặc phải là một URL http/https nếu là sửa và không thay đổi ảnh.
        // Hiện tại, chỉ cần có giá trị là đủ cho bước này.

        if (
          basicInfo.protein === null ||
          basicInfo.protein === undefined ||
          basicInfo.fat === null ||
          basicInfo.fat === undefined ||
          basicInfo.carbohydrates === null ||
          basicInfo.carbohydrates === undefined ||
          basicInfo.calories === null ||
          basicInfo.calories === undefined
        ) {
          setError(
            'Vui lòng điền đầy đủ thông tin dinh dưỡng (Protein, Fat, Carb, Calories) khi công khai.'
          );
          setIsLoading(false);
          return null;
        }
        if (!ingredients || ingredients.length === 0) {
          setError('Vui lòng thêm ít nhất một nguyên liệu khi công khai.');
          setIsLoading(false);
          return null;
        }
        const hasEmptyIngredientQuantity = ingredients.some(
          (ing) =>
            ing.quantity === null ||
            ing.quantity === undefined ||
            ing.quantity <= 0 ||
            !ing.unitId
        );
        if (hasEmptyIngredientQuantity) {
          setError(
            'Vui lòng điền đầy đủ số lượng và đơn vị cho tất cả nguyên liệu khi công khai.'
          );
          setIsLoading(false);
          return null;
        }
        if (!steps || steps.length < 3) {
          setError('Vui lòng thêm ít nhất 3 bước nấu ăn khi công khai.');
          setIsLoading(false);
          return null;
        }
        const hasEmptyStepInstruction = steps.some(
          (step) => !step.instruction || step.instruction.trim() === ''
        );
        if (hasEmptyStepInstruction) {
          setError(
            'Vui lòng điền đầy đủ mô tả cho tất cả các bước nấu ăn khi công khai.'
          );
          setIsLoading(false);
          return null;
        }
      }
      // Chuẩn bị payload
      let recipeImageFileForUpload: any = null;
      if (basicInfo.imageUrl && basicInfo.imageUrl.startsWith('file://')) {
        recipeImageFileForUpload = {
          uri: basicInfo.imageUrl,
          name: `recipeImage_${Date.now()}.${basicInfo.imageUrl.split('.').pop() || 'jpg'}`,
          type: `image/${basicInfo.imageUrl.split('.').pop() || 'jpeg'}`,
        };
      }

      const stepImageFilesForUpload: any[] = [];
      steps.forEach((step) => {
        if (step.imageUrl && step.imageUrl.startsWith('file://')) {
          stepImageFilesForUpload.push({
            uri: step.imageUrl,
            name: `step_${step.id || Date.now()}_${step.stepOrder}.${step.imageUrl.split('.').pop() || 'jpg'}`,
            type: `image/${step.imageUrl.split('.').pop() || 'jpeg'}`,
          });
        }
      });

      const payload = {
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
        categoryIds: categories.map((cat) => cat.id),
        ingredients: ingredients.map((ing) => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unitId: ing.unitId,
        })),
        steps: steps.map((step) => ({
          stepOrder: step.stepOrder,
          instruction: step.instruction,
          imageUrl:
            step.imageUrl && !step.imageUrl.startsWith('file://')
              ? step.imageUrl
              : null,
          hasNewImageFile: !!(
            step.imageUrl && step.imageUrl.startsWith('file://')
          ),
        })),
        recipeImageFile: recipeImageFileForUpload,
        stepImageFiles: stepImageFilesForUpload,
      };

      // Gọi hàm createRecipeForUser từ context
      const savedRecipeData = await createRecipeForUser(payload);

      // Sau khi lưu thành công, reset form
      if (savedRecipeData) {
        resetForm();
      }

      return savedRecipeData;
    } catch (err: any) {
      setError(err.message || 'Không thể lưu món ăn. Đã có lỗi xảy ra.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm tương tự handleSaveForUser nhưng gọi updateRecipeForUser thay vì createRecipeForUser
  const handleUpdateForUser = async (): Promise<Recipe | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { basicInfo, categories, ingredients, steps } = recipeForm;

      // --- VALIDATION CƠ BẢN (luôn thực hiện) ---
      if (!basicInfo.name || basicInfo.name.trim() === '') {
        setError('Tên món ăn là bắt buộc.');
        setIsLoading(false); // Quan trọng: reset loading
        return null;
      }
      if (!categories || categories.length === 0) {
        setError('Vui lòng chọn ít nhất một danh mục.'); // Áp dụng cho cả nháp
        setIsLoading(false);
        return null;
      }
      const hasInvalidIngredientForDraft = ingredients.some(
        (ing) =>
          !ing.ingredientId || // Chưa chọn nguyên liệu
          ing.quantity == null ||
          ing.quantity <= 0 || // Chưa nhập số lượng
          !ing.unitId // Chưa chọn đơn vị
      );
      if (hasInvalidIngredientForDraft) {
        setError('Mỗi nguyên liệu cần có tên, số lượng và đơn vị.');
        setIsLoading(false);
        return null;
      }
      if (!steps || steps.length === 0) {
        setError('Vui lòng thêm ít nhất một bước nấu ăn.'); // Áp dụng cho cả nháp
        setIsLoading(false);
        return null;
      }
      // Kiểm tra chi tiết hơn cho steps nếu cần (ví dụ: instruction)
      // Ví dụ:
      const hasEmptyStepInstructionForDraft = steps.some(
        (step) => !step.instruction || step.instruction.trim() === ''
      );
      if (hasEmptyStepInstructionForDraft) {
        setError('Vui lòng điền mô tả cho tất cả các bước nấu ăn.');
        setIsLoading(false);
        return null;
      }
      // --- VALIDATION CHI TIẾT KHI STATUS LÀ PUBLISHED ---
      if (basicInfo.status === RecipeStatus.PUBLIC) {
        if (!basicInfo.description || basicInfo.description.trim() === '') {
          setError('Mô tả món ăn là bắt buộc khi công khai.');
          setIsLoading(false);
          return null;
        }
        if (!categories || categories.length === 0) {
          setError('Vui lòng chọn ít nhất một danh mục khi công khai.');
          setIsLoading(false);
          return null;
        }

        // === KIỂM TRA ẢNH CHÍNH ===
        if (!basicInfo.imageUrl) {
          // basicInfo.imageUrl sẽ là URI từ ImagePicker
          setError('Hình ảnh món ăn là bắt buộc khi công khai.');
          setIsLoading(false);
          return null;
        }
        // Bạn có thể muốn kiểm tra sâu hơn, ví dụ: basicInfo.imageUrl phải là 'file://' nếu là tạo mới
        // hoặc phải là một URL http/https nếu là sửa và không thay đổi ảnh.
        // Hiện tại, chỉ cần có giá trị là đủ cho bước này.

        if (
          basicInfo.protein === null ||
          basicInfo.protein === undefined ||
          basicInfo.fat === null ||
          basicInfo.fat === undefined ||
          basicInfo.carbohydrates === null ||
          basicInfo.carbohydrates === undefined ||
          basicInfo.calories === null ||
          basicInfo.calories === undefined
        ) {
          setError(
            'Vui lòng điền đầy đủ thông tin dinh dưỡng (Protein, Fat, Carb, Calories) khi công khai.'
          );
          setIsLoading(false);
          return null;
        }
        if (!ingredients || ingredients.length === 0) {
          setError('Vui lòng thêm ít nhất một nguyên liệu khi công khai.');
          setIsLoading(false);
          return null;
        }
        const hasEmptyIngredientQuantity = ingredients.some(
          (ing) =>
            ing.quantity === null ||
            ing.quantity === undefined ||
            ing.quantity <= 0 ||
            !ing.unitId
        );
        if (hasEmptyIngredientQuantity) {
          setError(
            'Vui lòng điền đầy đủ số lượng và đơn vị cho tất cả nguyên liệu khi công khai.'
          );
          setIsLoading(false);
          return null;
        }
        if (!steps || steps.length < 3) {
          setError('Vui lòng thêm ít nhất 3 bước nấu ăn khi công khai.');
          setIsLoading(false);
          return null;
        }
        const hasEmptyStepInstruction = steps.some(
          (step) => !step.instruction || step.instruction.trim() === ''
        );
        if (hasEmptyStepInstruction) {
          setError(
            'Vui lòng điền đầy đủ mô tả cho tất cả các bước nấu ăn khi công khai.'
          );
          setIsLoading(false);
          return null;
        }
      }

      // Chuẩn bị payload
      let recipeImageFileForUpload: any = null;
      if (basicInfo.imageUrl && basicInfo.imageUrl.startsWith('file://')) {
        recipeImageFileForUpload = {
          uri: basicInfo.imageUrl,
          name: `recipeImage_${Date.now()}.${basicInfo.imageUrl.split('.').pop() || 'jpg'}`,
          type: `image/${basicInfo.imageUrl.split('.').pop() || 'jpeg'}`,
        };
      }

      const stepImageFilesForUpload: any[] = [];
      steps.forEach((step) => {
        if (step.imageUrl && step.imageUrl.startsWith('file://')) {
          stepImageFilesForUpload.push({
            uri: step.imageUrl,
            name: `step_${step.id || Date.now()}_${step.stepOrder}.${step.imageUrl.split('.').pop() || 'jpg'}`,
            type: `image/${step.imageUrl.split('.').pop() || 'jpeg'}`,
          });
        }
      });

      const payload = {
        id: recipeId, // Quan trọng: cung cấp ID công thức để cập nhật
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
        categoryIds: categories.map((cat) => cat.id),
        ingredients: ingredients.map((ing) => ({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unitId: ing.unitId,
        })),
        steps: steps.map((step) => ({
          stepOrder: step.stepOrder,
          instruction: step.instruction,
          imageUrl:
            step.imageUrl && !step.imageUrl.startsWith('file://')
              ? step.imageUrl
              : null,
          hasNewImageFile: !!(
            step.imageUrl && step.imageUrl.startsWith('file://')
          ),
        })),
        recipeImageFile: recipeImageFileForUpload,
        stepImageFiles: stepImageFilesForUpload,
      };

      // Gọi hàm updateRecipeForUser từ context
      const updatedRecipeData = await updateRecipeForUser(payload);

      // Sau khi cập nhật thành công, reset form
      if (updatedRecipeData) {
        resetForm();
        setCurrentRecipe(null);
      }

      return updatedRecipeData;
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật món ăn. Đã có lỗi xảy ra.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xuất bản
  const handlePublic = async () => {
    try {
      // Đầu tiên lưu công thức
      const savedRecipe = await handleSave();
      if (!savedRecipe) return null;

      // Sau đó xuất bản
      updateBasicInfo({ status: RecipeStatus.PUBLIC });
      return await saveRecipe();
    } catch (err) {
      setError('Failed to public recipe');
      console.error(err);
      return null;
    }
  };

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
    handleSaveForUser,
    handleUpdateForUser, // Thêm hàm xử lý cập nhật cho người dùng
    createRecipeForUser,

    // Reference data
    availableCategories: recipeCategories,
    availableIngredients: ingredients,
    availableUnits: unitsOfMeasure,
  };
};
