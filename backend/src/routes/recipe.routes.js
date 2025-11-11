const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/recipe.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateRecipe } = require('../middleware/validation.middleware');

// 모든 레시피 라우트는 인증 필요
router.use(authMiddleware);

// 레시피 목록 조회
router.get('/', RecipeController.getAll);

// 레시피 검색
router.get('/search', RecipeController.search);

// 레시피 상세 조회
router.get('/:id', RecipeController.getById);

// 레시피 생성
router.post('/', validateRecipe, RecipeController.create);

// 레시피 수정
router.put('/:id', RecipeController.update);

// 레시피 삭제
router.delete('/:id', RecipeController.delete);

module.exports = router;