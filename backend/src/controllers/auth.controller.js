const User = require('../models/User.model');
const { generateToken } = require('../utils/jwt');

class AuthController {
  // 회원가입
  static async register(req, res) {
    try {
      const { username, password, email, name } = req.body;

      // 중복 확인
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: '이미 존재하는 아이디입니다'
          }
        });
      }

      // 사용자 생성
      const user = await User.create({ username, password, email, name });

      // JWT 토큰 생성
      const token = generateToken({
        userId: user.userId,
        username: user.username
      });

      res.status(201).json({
        success: true,
        data: {
          user,
          token
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'REGISTER_FAILED',
          message: '회원가입 중 오류가 발생했습니다'
        }
      });
    }
  }

  // 로그인
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // 사용자 조회
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: '아이디 또는 비밀번호가 올바르지 않습니다'
          }
        });
      }

      // 비밀번호 검증
      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: '아이디 또는 비밀번호가 올바르지 않습니다'
          }
        });
      }

      // JWT 토큰 생성
      const token = generateToken({
        userId: user.userId,
        username: user.username
      });

      // 비밀번호 제외하고 반환
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: {
          user: userWithoutPassword,
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: '로그인 중 오류가 발생했습니다'
        }
      });
    }
  }

  // 현재 사용자 조회
  static async me(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: '사용자를 찾을 수 없습니다'
          }
        });
      }

      // 비밀번호 제외하고 반환
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_USER_FAILED',
          message: '사용자 정보 조회 중 오류가 발생했습니다'
        }
      });
    }
  }
}

module.exports = AuthController;