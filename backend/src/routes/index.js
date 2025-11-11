const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const recipeRoutes = require('./recipe.routes');

// API v1 라우트
router.use('/auth', authRoutes);
router.use('/recipes', recipeRoutes);

module.exports = router;