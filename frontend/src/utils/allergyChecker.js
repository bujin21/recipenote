/**
 * 알레르기 체크 유틸리티
 * 
 * 재료 목록과 사용자 알레르기 정보를 비교하여
 * 일치하는 알레르기 재료를 찾습니다.
 */

// 알레르기 관련 키워드 매핑
// 사용자가 "땅콩"을 선택했을 때, 재료에서 찾을 키워드들
const ALLERGY_KEYWORDS = {
  '땅콩': ['땅콩', '피넛', 'peanut', '땅콩버터', '땅콩소스', '땅콩가루'],
  '갑각류': ['새우', '게', '랍스터', '크랩', '바닷가재', '가재', '꽃게', '킹크랩', '대게', '홍게', '새우젓', 'shrimp', 'crab', 'lobster'],
  '견과류': ['아몬드', '호두', '캐슈넛', '피스타치오', '마카다미아', '잣', '헤이즐넛', '브라질넛', '피칸', 'almond', 'walnut', 'cashew', 'nut'],
  '유제품': ['우유', '치즈', '버터', '크림', '요거트', '요구르트', '밀크', '생크림', '휘핑크림', '파마산', '모짜렐라', '체다', 'milk', 'cheese', 'cream', 'butter', 'dairy'],
  '계란': ['계란', '달걀', '에그', '난황', '난백', '마요네즈', 'egg', '메추리알'],
  '밀': ['밀가루', '밀', '소맥분', '빵가루', '파스타', '스파게티', '국수', '라면', '우동', '소면', '중력분', '강력분', '박력분', 'wheat', 'flour', 'bread', 'pasta', 'noodle'],
  '대두': ['두부', '콩', '된장', '간장', '콩나물', '두유', '소이', 'soy', 'tofu', '청국장', '쌈장', '고추장'],
  '생선': ['생선', '멸치', '고등어', '참치', '연어', '광어', '우럭', '조기', '갈치', '삼치', '꽁치', 'fish', 'salmon', 'tuna', '어묵', '피시'],
  '조개류': ['조개', '홍합', '굴', '전복', '바지락', '모시조개', '가리비', '관자', 'clam', 'oyster', 'mussel', 'scallop', '오징어', '문어', '낙지'],
  '참깨': ['참깨', '깨', '참기름', '들깨', '들기름', 'sesame', '깨소금'],
  '메밀': ['메밀', '소바', '막국수', 'buckwheat'],
  '복숭아': ['복숭아', 'peach', '피치'],
  '토마토': ['토마토', '토마토소스', '케첩', '파스타소스', 'tomato', 'ketchup'],
  '돼지고기': ['돼지', '삼겹살', '목살', '앞다리', '뒷다리', '족발', '보쌈', '돈까스', '베이컨', '햄', 'pork', 'bacon', 'ham'],
  '소고기': ['소고기', '쇠고기', '한우', '갈비', '불고기', '등심', '안심', '차돌', 'beef', 'steak'],
  '닭고기': ['닭', '치킨', '닭가슴살', '닭다리', '닭날개', 'chicken'],
  '아황산류': ['와인', '건포도', '말린과일', '드라이프루트']
};

/**
 * 재료 목록에서 알레르기 재료를 찾습니다.
 * 
 * @param {string[]} ingredients - 레시피 재료 목록
 * @param {string[]} userAllergies - 사용자의 알레르기 목록
 * @returns {Array<{allergen: string, matchedIngredient: string}>} - 발견된 알레르기 정보
 */
export function checkAllergens(ingredients, userAllergies) {
  if (!ingredients || !userAllergies || userAllergies.length === 0) {
    return [];
  }

  const detectedAllergens = [];

  for (const allergen of userAllergies) {
    const keywords = ALLERGY_KEYWORDS[allergen] || [allergen.toLowerCase()];
    
    for (const ingredient of ingredients) {
      const ingredientLower = ingredient.toLowerCase();
      
      for (const keyword of keywords) {
        if (ingredientLower.includes(keyword.toLowerCase())) {
          // 이미 같은 알레르기가 추가되어 있지 않은 경우에만 추가
          const alreadyDetected = detectedAllergens.find(
            d => d.allergen === allergen && d.matchedIngredient === ingredient
          );
          
          if (!alreadyDetected) {
            detectedAllergens.push({
              allergen: allergen,
              matchedIngredient: ingredient,
              keyword: keyword
            });
          }
          break; // 해당 재료에서 이미 찾았으면 다음 재료로
        }
      }
    }
  }

  return detectedAllergens;
}

/**
 * 텍스트에서 알레르기 재료를 찾습니다.
 * (재료가 배열이 아닌 텍스트인 경우)
 * 
 * @param {string} text - 검색할 텍스트 (레시피 설명, 재료 텍스트 등)
 * @param {string[]} userAllergies - 사용자의 알레르기 목록
 * @returns {Array<{allergen: string, keyword: string}>} - 발견된 알레르기 정보
 */
export function checkAllergenInText(text, userAllergies) {
  if (!text || !userAllergies || userAllergies.length === 0) {
    return [];
  }

  const textLower = text.toLowerCase();
  const detectedAllergens = [];

  for (const allergen of userAllergies) {
    const keywords = ALLERGY_KEYWORDS[allergen] || [allergen.toLowerCase()];
    
    for (const keyword of keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        const alreadyDetected = detectedAllergens.find(d => d.allergen === allergen);
        
        if (!alreadyDetected) {
          detectedAllergens.push({
            allergen: allergen,
            keyword: keyword
          });
        }
        break;
      }
    }
  }

  return detectedAllergens;
}

/**
 * 모든 알레르기 키워드 목록을 반환합니다.
 * (디버깅 또는 UI 표시용)
 */
export function getAllergyKeywords() {
  return ALLERGY_KEYWORDS;
}

export default {
  checkAllergens,
  checkAllergenInText,
  getAllergyKeywords
};