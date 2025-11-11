const { dynamoDB, TABLES } = require('../config/dynamodb.config');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class User {
  // 사용자 생성
  static async create({ username, password, email, name }) {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    const user = {
      PK: `USER#${userId}`,
      SK: `PROFILE`,
      GSI1PK: `USERNAME#${username}`,
      GSI1SK: `USER`,
      userId,
      username,
      password: hashedPassword,
      email,
      name,
      allergies: [],
      dietaryRestrictions: [],
      createdAt: now,
      updatedAt: now,
      type: 'USER'
    };

    const params = {
      TableName: TABLES.MAIN,
      Item: user,
      ConditionExpression: 'attribute_not_exists(PK)'
    };

    try {
      await dynamoDB.put(params).promise();
      
      // 비밀번호 제외하고 반환
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        throw new Error('User already exists');
      }
      throw error;
    }
  }

  // 사용자명으로 조회
  static async findByUsername(username) {
    const params = {
      TableName: TABLES.MAIN,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk AND GSI1SK = :gsi1sk',
      ExpressionAttributeValues: {
        ':gsi1pk': `USERNAME#${username}`,
        ':gsi1sk': 'USER'
      }
    };

    const result = await dynamoDB.query(params).promise();
    return result.Items[0] || null;
  }

  // ID로 조회
  static async findById(userId) {
    const params = {
      TableName: TABLES.MAIN,
      Key: {
        PK: `USER#${userId}`,
        SK: 'PROFILE'
      }
    };

    const result = await dynamoDB.get(params).promise();
    return result.Item || null;
  }

  // 비밀번호 검증
  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  // 프로필 업데이트
  static async updateProfile(userId, updates) {
    const now = new Date().toISOString();
    
    const params = {
      TableName: TABLES.MAIN,
      Key: {
        PK: `USER#${userId}`,
        SK: 'PROFILE'
      },
      UpdateExpression: 'SET #name = :name, allergies = :allergies, dietaryRestrictions = :dietaryRestrictions, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': updates.name,
        ':allergies': updates.allergies || [],
        ':dietaryRestrictions': updates.dietaryRestrictions || [],
        ':updatedAt': now
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
  }
}

module.exports = User;