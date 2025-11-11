const Joi = require('joi');

// 회원가입 검증
const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(4)
    .max(20)
    .required()
    .messages({
      'string.alphanum': '아이디는 영문과 숫자만 사용 가능합니다',
      'string.min': '아이디는 최소 4자 이상이어야 합니다',
      'string.max': '아이디는 최대 20자까지 가능합니다',
      'any.required': '아이디는 필수입니다'
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/)
    .required()
    .messages({
      'string.min': '비밀번호는 최소 8자 이상이어야 합니다',
      'string.pattern.base': '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다',
      'any.required': '비밀번호는 필수입니다'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': '올바른 이메일 형식이 아닙니다',
      'any.required': '이메일은 필수입니다'
    }),
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': '이름은 최소 2자 이상이어야 합니다',
      'any.required': '이름은 필수입니다'
    })
});

// 로그인 검증
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// 레시피 생성 검증
const recipeSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500),
  ingredients: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      amount: Joi.string().required()
    })
  ).min(1).required(),
  steps: Joi.array().items(Joi.string()).min(1).required(),
  category: Joi.string().required(),
  difficulty: Joi.string().valid('쉬움', '보통', '어려움').required(),
  cookingTime: Joi.number().min(1).required(),
  servings: Joi.number().min(1),
  tags: Joi.array().items(Joi.string())
});

// 검증 미들웨어 생성 함수
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: errors
        }
      });
    }
    
    next();
  };
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateRecipe: validate(recipeSchema)
};