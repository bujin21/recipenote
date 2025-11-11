const { dynamoDB, TABLES } = require('../config/dynamodb.config');
const { v4: uuidv4 } = require('uuid');

class Recipe {
  // 레시피 생성
  static async create(userId, recipeData) {
    const recipeId = uuidv4();
    const now = new Date().toISOString();

    const recipe = {
      PK: `USER#${userId}`,
      SK: `RECIPE#${recipeId}`,
      GSI1PK: `RECIPE#${recipeId}`,
      GSI1SK: `USER#${userId}`,
      recipeId,
      userId,
      ...recipeData,
      createdAt: now,
      updatedAt: now,
      type: 'RECIPE'
    };

    const params = {
      TableName: TABLES.MAIN,
      Item: recipe
    };

    await dynamoDB.put(params).promise();
    return recipe;
  }

  // 사용자의 모든 레시피 조회
  static async findByUserId(userId, limit = 20, lastKey = null) {
    const params = {
      TableName: TABLES.MAIN,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': 'RECIPE#'
      },
      Limit: limit,
      ScanIndexForward: false // 최신순 정렬
    };

    if (lastKey) {
      params.ExclusiveStartKey = lastKey;
    }

    const result = await dynamoDB.query(params).promise();
    
    return {
      recipes: result.Items,
      lastKey: result.LastEvaluatedKey,
      hasMore: !!result.LastEvaluatedKey
    };
  }

  // 레시피 ID로 조회
  static async findById(recipeId) {
    const params = {
      TableName: TABLES.MAIN,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      ExpressionAttributeValues: {
        ':gsi1pk': `RECIPE#${recipeId}`
      }
    };

    const result = await dynamoDB.query(params).promise();
    return result.Items[0] || null;
  }

  // 레시피 업데이트
  static async update(userId, recipeId, updates) {
    const now = new Date().toISOString();

    // 업데이트 표현식 생성
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {
      ':updatedAt': now
    };

    Object.keys(updates).forEach((key) => {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = updates[key];
    });

    updateExpressions.push('updatedAt = :updatedAt');

    const params = {
      TableName: TABLES.MAIN,
      Key: {
        PK: `USER#${userId}`,
        SK: `RECIPE#${recipeId}`
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
  }

  // 레시피 삭제
  static async delete(userId, recipeId) {
    const params = {
      TableName: TABLES.MAIN,
      Key: {
        PK: `USER#${userId}`,
        SK: `RECIPE#${recipeId}`
      }
    };

    await dynamoDB.delete(params).promise();
    return { success: true };
  }

  // 검색 (간단한 스캔 - 프로덕션에서는 ElasticSearch 사용 권장)
  static async search(userId, query) {
    const params = {
      TableName: TABLES.MAIN,
      FilterExpression: 'PK = :pk AND begins_with(SK, :sk) AND contains(title, :query)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':sk': 'RECIPE#',
        ':query': query
      }
    };

    const result = await dynamoDB.scan(params).promise();
    return result.Items;
  }
}

module.exports = Recipe;