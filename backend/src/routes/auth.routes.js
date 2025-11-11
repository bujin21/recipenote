const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateRegister, validateLogin } = require('../middleware/validation.middleware');

// 회원가입
router.post('/register', validateRegister, AuthController.register);

// 로그인
router.post('/login', validateLogin, AuthController.login);

// 현재 사용자 조회 (인증 필요)
router.get('/me', authMiddleware, AuthController.me);

module.exports = router;