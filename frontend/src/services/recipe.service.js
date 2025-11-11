import api from './api';

class RecipeService {
  // 레시피 목록 조회
  async getRecipes(limit = 20, lastKey = null) {
    try {
      const params = { limit };
      if (lastKey) {
        params.lastKey = lastKey;
      }
      
      const response = await api.get('/recipes', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: '레시피 목록을 가져올 수 없습니다' } };
    }
  }

  // 레시피 상세 조회
  async getRecipe(id) {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: '레시피를 가져올 수 없습니다' } };
    }
  }

  // 레시피 생성
  async createRecipe(recipeData) {
    try {
      const response = await api.post('/recipes', recipeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: '레시피 생성에 실패했습니다' } };
    }
  }

  // 레시피 수정
  async updateRecipe(id, recipeData) {
    try {
      const response = await api.put(`/recipes/${id}`, recipeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: '레시피 수정에 실패했습니다' } };
    }
  }

  // 레시피 삭제
  async deleteRecipe(id) {
    try {
      const response = await api.delete(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: '레시피 삭제에 실패했습니다' } };
    }
  }

  // 레시피 검색
  async searchRecipes(query) {
    try {
      const response = await api.get('/recipes/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, error: { message: '레시피 검색에 실패했습니다' } };
    }
  }
}

export default new RecipeService();