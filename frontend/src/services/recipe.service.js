import api from './api';

const RecipeService = {
  async getRecipes() {
    try {
      const response = await api.get('/recipes');
      return response.data;
    } catch (error) {
      console.error('Get recipes error:', error);
      throw error.response?.data || error;
    }
  },

  async getRecipe(id) {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get recipe error:', error);
      throw error.response?.data || error;
    }
  },

  async createRecipe(recipeData) {
    try {
      const response = await api.post('/recipes', recipeData);
      return response.data;
    } catch (error) {
      console.error('Create recipe error:', error);
      throw error.response?.data || error;
    }
  },

  async updateRecipe(id, recipeData) {
    try {
      const response = await api.put(`/recipes/${id}`, recipeData);
      return response.data;
    } catch (error) {
      console.error('Update recipe error:', error);
      throw error.response?.data || error;
    }
  },

  async deleteRecipe(id) {
    try {
      const response = await api.delete(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete recipe error:', error);
      throw error.response?.data || error;
    }
  },

  async searchRecipes(query) {
    try {
      const response = await api.get(`/recipes?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search recipes error:', error);
      throw error.response?.data || error;
    }
  }
};

export default RecipeService;
