import api from './index';

// AI 레시피 생성
export const generateAIRecipe = async (data) => {
  const response = await api.post('/ai/generate-recipe', data);
  return response.data;
};