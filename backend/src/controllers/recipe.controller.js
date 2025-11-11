const Recipe = require('../models/Recipe.model');

class RecipeController {
  // 레시피 생성
  static async create(req, res) {
    try {
      const userId = req.user.userId;
      const recipeData = req.body;

      const recipe = await Recipe.create(userId, recipeData);

      res.status(201).json({
        success: true,
        data: recipe
      });
    } catch (error) {
      console.error('Create recipe error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_RECIPE_FAILED',
          message: '레시피 생성 중 오류가 발생했습니다'
        }
      });
    }
  }

  // 레시피 목록 조회
  static async getAll(req, res) {
    try {
      const userId = req.user.userId;
      const { limit = 20, lastKey } = req.query;

      const result = await Recipe.findByUserId(userId, parseInt(limit), lastKey);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get recipes error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_RECIPES_FAILED',
          message: '레시피 조회 중 오류가 발생했습니다'
        }
      });
    }
  }

  // 레시피 상세 조회
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const recipe = await Recipe.findById(id);

      if (!recipe) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RECIPE_NOT_FOUND',
            message: '레시피를 찾을 수 없습니다'
          }
        });
      }

      // 본인의 레시피인지 확인
      if (recipe.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: '접근 권한이 없습니다'
          }
        });
      }

      res.json({
        success: true,
        data: recipe
      });
    } catch (error) {
      console.error('Get recipe error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_RECIPE_FAILED',
          message: '레시피 조회 중 오류가 발생했습니다'
        }
      });
    }
  }

  // 레시피 수정
  static async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const updates = req.body;

      // 레시피 존재 및 권한 확인
      const existingRecipe = await Recipe.findById(id);
      if (!existingRecipe) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RECIPE_NOT_FOUND',
            message: '레시피를 찾을 수 없습니다'
          }
        });
      }

      if (existingRecipe.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: '접근 권한이 없습니다'
          }
        });
      }

      // 업데이트
      const recipe = await Recipe.update(userId, id, updates);

      res.json({
        success: true,
        data: recipe
      });
    } catch (error) {
      console.error('Update recipe error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_RECIPE_FAILED',
          message: '레시피 수정 중 오류가 발생했습니다'
        }
      });
    }
  }

  // 레시피 삭제
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      // 레시피 존재 및 권한 확인
      const existingRecipe = await Recipe.findById(id);
      if (!existingRecipe) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RECIPE_NOT_FOUND',
            message: '레시피를 찾을 수 없습니다'
          }
        });
      }

      if (existingRecipe.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: '접근 권한이 없습니다'
          }
        });
      }

      // 삭제
      await Recipe.delete(userId, id);

      res.json({
        success: true,
        data: {
          message: '레시피가 삭제되었습니다'
        }
      });
    } catch (error) {
      console.error('Delete recipe error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_RECIPE_FAILED',
          message: '레시피 삭제 중 오류가 발생했습니다'
        }
      });
    }
  }

  // 레시피 검색
  static async search(req, res) {
    try {
      const userId = req.user.userId;
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_QUERY',
            message: '검색어를 입력해주세요'
          }
        });
      }

      const recipes = await Recipe.search(userId, q);

      res.json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Search recipes error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'SEARCH_RECIPES_FAILED',
          message: '레시피 검색 중 오류가 발생했습니다'
        }
      });
    }
  }
}

module.exports = RecipeController;