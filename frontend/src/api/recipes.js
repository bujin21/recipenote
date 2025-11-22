import api from './index';

export const getRecipes = async () => {
  const response = await api.get('/recipes');
  return response.data;
};

export const getRecipe = async (id) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

export const createRecipe = async (recipeData) => {
  const response = await api.post('/recipes', recipeData);
  return response.data;
};

export const updateRecipe = async (id, recipeData) => {
  const response = await api.put(`/recipes/${id}`, recipeData);
  return response.data;
};

export const deleteRecipe = async (id) => {
  const response = await api.delete(`/recipes/${id}`);
  return response.data;
};
// URL 파싱 함수 추가!
export const parseRecipeUrl = async (url) => {
  const response = await api.post('/recipes/parse-url', { url });
  return response.data;
};

