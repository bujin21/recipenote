function AllergyWarning({ detectedAllergens, onClose, onContinue }) {
  if (!detectedAllergens || detectedAllergens.length === 0) return null;

  return (
    <div className="allergy-warning-overlay">
      <div className="allergy-warning-modal">
        <div className="warning-icon">⚠️</div>
        <h2 className="warning-title">알레르기 경고</h2>
        <p className="warning-message">
          아래 알레르기 성분이 포함된 재료가 감지되었습니다.
        </p>

        <div className="allergen-list">
          {detectedAllergens.map((item, index) => {
            const allergen = item.allergen || item.name || String(item);
            const ingredient =
              item.ingredient ||
              item.matchedIngredient ||
              item.source ||
              '';

            return (
              <div key={index} className="allergen-item">
                <div className="allergen-icon">🚫</div>
                <div className="allergen-info">
                  <div className="allergen-name">{allergen}</div>
                  {ingredient && (
                    <div className="allergen-ingredient">
                      관련 재료: {ingredient}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="warning-note">
          알레르기 재료에 민감하다면 레시피를 수정하거나
          다른 레시피를 선택하는 것을 권장합니다.
        </div>

        <div className="warning-buttons">
          <button type="button" className="btn-cancel" onClick={onClose}>
            취소
          </button>
          <button type="button" className="btn-continue" onClick={onContinue}>
            계속 진행
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllergyWarning;
