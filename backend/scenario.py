from typing import Dict, List, TypedDict, Optional

class Button(TypedDict):
  text: str # 버튼에 표시될 텍스트
  nextQuestion: str # 버튼 클릭시 이동할 다음 질문

class ScenarioResponse(TypedDict):
  text: str # 시나리오 응답 텍스트
  buttons: Optional[List[Button]] # 선택적으로 표시될 버튼들

class ScenarioCategory(TypedDict):
  title: str # 카테고리 제목
  scenarios: Dict[str, ScenarioResponse] # 해당 카테고리의 시나리오

# 카테고리별 시나리오 관리
SCENARIO_DATA: Dict[str, ScenarioCategory] = {
  "청약_기본?": {
    "title": "청약 기본 정보",
    "scenarios": {
      "청약이란?": {
        "text": "주택청약은 새로 공급되는 주택의 분양 기회를 제공하는 제도입니다. 국가 또는 민간 건설사가 건설한 주택을 대상으로 하며, 청약통장 가입과 일정한 자격 요건을 충족한 자가 신청할 수 있습니다. 분양 주택은 크게 국민주택과 민영주택으로 구분되며, 각 유형별로 공급 대상 및 자격 요건에 차이가 있습니다.\n청약 신청 시에는 일반공급, 우선공급, 특별공급으로 구분하여 진행됩니다. 각 공급 유형별로 분양 대상자 선정 기준 및 우선 순위가 다르게 적용되므로, 청약 신청자는 본인에게 유리한 공급 유형을 신중하게 선택해야 합니다.",
        "buttons": [
          {"text": "특별공급", "nextQuestion": "특별공급이란?"},
          {"text": "일반공급", "nextQuestion": "일반공급이란?"}
        ]
      }
    }
  }
}
 
def get_scenario_response(question: str) -> Optional[ScenarioResponse]:
    """
    질문에 해당하는 시나리오 응답을 반환합니다.
    없는 경우 None을 반환하여 RAG 시스템이 처리하도록 합니다.
    """
    for category in SCENARIO_DATA.values():
        if question in category["scenarios"]:
            return category["scenarios"][question]
    return None
